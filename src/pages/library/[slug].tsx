// src/pages/library/[slug].tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Github,
  Download,
  Star,
  Sun,
  Moon,
  FileText,
  Gauge,
  Home,
  Play,
  Pause,
  RotateCcw,
  Mic,
} from "lucide-react";
import { getBookBySlug } from "@/data/libraryData";

type Theme = "light" | "dark" | "sepia";

const LibraryBookPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const book = getBookBySlug(slug || "");

  // Load preferences from localStorage
  const loadPreference = <T,>(key: string, defaultValue: T): T => {
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        return JSON.parse(stored) as T;
      } catch {
        return defaultValue;
      }
    }
    return defaultValue;
  };

  // State with localStorage defaults
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isNarratorOn, setIsNarratorOn] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [narratorSpeed, setNarratorSpeed] = useState(() => loadPreference<number>("narratorSpeed", 1.0));
  const [theme, setTheme] = useState<Theme>(() => loadPreference<Theme>("readerTheme", "light"));
  const [fontSize, setFontSize] = useState(() => loadPreference<number>("readerFontSize", 16));
  const [copied, setCopied] = useState(false);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [showVoiceMenu, setShowVoiceMenu] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [cleanedContent, setCleanedContent] = useState<string>("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showBookmarkNotice, setShowBookmarkNotice] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [narratorCharIndex, setNarratorCharIndex] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const scrollPositionRef = useRef(0);
  const narratorCancelledRef = useRef(false);
  const hideControlsTimerRef = useRef<NodeJS.Timeout | null>(null);
  const currentReadingPosRef = useRef<HTMLSpanElement | null>(null);

  // Mobile TTS initialization - Check IMMEDIATELY to prevent race condition
  const [isMobile, setIsMobile] = useState(() => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  });
  const [ttsInitialized, setTtsInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState('');

  // If book not found
  if (!book) {
    return (
      <main className="min-h-screen bg-[#e9eef5] flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Book Not Found</h1>
          <Link
            to="/library"
            className="text-sm text-slate-600 hover:text-slate-900 underline"
          >
            ← Return to Library
          </Link>
        </div>
      </main>
    );
  }

  // Fetch markdown content from GitHub
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(book.downloadUrl);
        const text = await response.text();
        setContent(text);
      } catch (error) {
        console.error("Failed to load book content:", error);
        setContent("# Error Loading Content\n\nFailed to load the book. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [book.downloadUrl]);

  // Detect mobile device and Firefox (to prevent crashes)
  useEffect(() => {
    const checkMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
    const isFirefox = /Firefox/i.test(navigator.userAgent);

    setIsMobile(checkMobile);
    console.log(`📱 Mobile: ${checkMobile}, Firefox: ${isFirefox}`);

    // Mark TTS as initialized on desktop only
    // Firefox mobile has broken Speech API - disable it completely
    if (!checkMobile && !isFirefox) {
      setTtsInitialized(true);
    } else if (checkMobile && isFirefox) {
      console.log(`⚠️ Firefox mobile detected - ALL narrator features disabled`);
      setTtsInitialized(false);
      setIsMobile(true); // Force mobile mode to hide narrator UI
    }
  }, []);

  // Load available voices (desktop only - mobile uses manual initialization)
  useEffect(() => {
    if (isMobile) {
      console.log("📱 Mobile detected - waiting for manual TTS initialization");
      return; // Don't auto-load on mobile
    }

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      console.log(`🎤 Voice loading: Found ${voices.length} voices`);
      setAvailableVoices(voices);

      // Load saved voice preference or use default
      const savedVoiceName = localStorage.getItem("preferredVoice");
      if (savedVoiceName) {
        const savedVoice = voices.find(v => v.name === savedVoiceName);
        if (savedVoice) {
          setSelectedVoice(savedVoice);
          console.log(`🎤 Restored saved voice: ${savedVoice.name}`);
        }
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0]);
        console.log(`🎤 Using default voice: ${voices[0].name}`);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Desktop retry after delay
    setTimeout(() => {
      if (window.speechSynthesis.getVoices().length === 0) {
        console.log("🎤 Retrying voice load (desktop delay)...");
        loadVoices();
      }
    }, 500);
  }, [isMobile]);

  // Clean content when it changes
  useEffect(() => {
    if (content) {
      const cleaned = content
        .replace(/#{1,6}\s/g, "") // Remove markdown headers
        .replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
        .replace(/\*(.+?)\*/g, "$1") // Remove italic
        .replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links
        .replace(/`(.+?)`/g, "$1"); // Remove code blocks
      setCleanedContent(cleaned);
    }
  }, [content]);

  // Cleanup narrator on unmount
  useEffect(() => {
    // Skip all Speech API cleanup on mobile
    if (isMobile) return;

    return () => {
      console.log(`🔄 Unmounting "${book.title}" - canceling any active narration`);
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        narratorCancelledRef.current = true; // Mark as cancelled, not completed
        window.speechSynthesis.cancel();
      }
      // Note: We do NOT clear localStorage here - positions should persist
    };
  }, [book, isMobile]);

  // Restore scroll position and narrator position for this book
  useEffect(() => {
    if (!isLoading && book && content) {
      const savedScrollPos = loadPreference<number>(`bookmark-${book.slug}`, 0);

      console.log(`📖 Loading "${book.title}" (slug: ${book.slug})`);
      console.log(`   Saved scroll position: ${savedScrollPos}`);

      // Only restore narrator position on desktop (not mobile)
      if (!isMobile) {
        const savedNarratorPos = loadPreference<number>(`narrator-${book.slug}`, 0);
        console.log(`   Saved narrator position: ${savedNarratorPos}`);
        console.log(`   All localStorage keys:`, Object.keys(localStorage).filter(k => k.startsWith('bookmark-') || k.startsWith('narrator-')));

        // Restore narrator position to state (shows Resume button)
        if (savedNarratorPos > 0) {
          setNarratorCharIndex(savedNarratorPos);
          console.log(`🎤 Restored narrator position to state: ${savedNarratorPos}`);
        }
      }

      // Restore scroll position (works on both mobile and desktop)
      if (savedScrollPos > 0) {
        // Wait for content to render, then scroll
        setTimeout(() => {
          // Always use window for restoration (same as scroll tracking fallback)
          console.log(`🔄 Attempting to restore scroll to position ${savedScrollPos}`);
          window.scrollTo({ top: savedScrollPos, behavior: 'auto' });
          setShowBookmarkNotice(true);
          console.log(`✅ Restored scroll to position ${savedScrollPos}`);

          // Hide notice after 3 seconds
          setTimeout(() => setShowBookmarkNotice(false), 3000);
        }, 500);
      }
    }
  }, [isLoading, book, content, isMobile]);

  // Save scroll position on scroll (debounced)
  useEffect(() => {
    if (!book) {
      console.log("⚠️ Book not found, scroll tracking disabled");
      return;
    }

    console.log(`✅ Scroll tracking initialized for: "${book.title}"`);

    // Find the actual scrollable element (might not be window)
    const findScrollableParent = (): Element | Window => {
      // Check if window scrolls
      if (document.documentElement.scrollHeight > window.innerHeight) {
        console.log("📍 Using window for scroll tracking");
        return window;
      }

      // Find scrollable container
      let element: Element | null = document.querySelector('article');
      while (element && element !== document.body) {
        const parent = element.parentElement;
        if (parent && parent.scrollHeight > parent.clientHeight) {
          console.log("📍 Found scrollable container:", parent.tagName, parent.className);
          return parent;
        }
        element = parent;
      }

      console.log("📍 Using window as fallback");
      return window;
    };

    const scrollContainer = findScrollableParent();
    let saveTimeout: NodeJS.Timeout;

    const getScrollPosition = (): number => {
      if (scrollContainer === window) {
        return window.scrollY || window.pageYOffset;
      } else {
        return (scrollContainer as Element).scrollTop;
      }
    };

    const handleScroll = () => {
      const position = getScrollPosition();
      console.log(`📜 Scroll detected at position: ${position}`);
      setScrollPosition(position);
      scrollPositionRef.current = position;

      if (saveTimeout) clearTimeout(saveTimeout);

      saveTimeout = setTimeout(() => {
        localStorage.setItem(`bookmark-${book.slug}`, JSON.stringify(position));
        console.log(`💾 Saved bookmark for "${book.title}" at position: ${position}`);
      }, 1000);
    };

    scrollContainer.addEventListener('scroll', handleScroll as EventListener, { passive: true });
    console.log("✅ Scroll event listener attached to", scrollContainer === window ? 'window' : scrollContainer);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll as EventListener);
      if (saveTimeout) clearTimeout(saveTimeout);

      // Get actual current position (check both methods)
      const scrollY = window.scrollY || window.pageYOffset;
      const currentPosition = getScrollPosition();
      console.log(`🔄 Cleanup: window.scrollY=${scrollY}, getScrollPosition()=${currentPosition}, scrollPositionRef=${scrollPositionRef.current}`);

      // Use the maximum of all available positions
      const finalPosition = Math.max(scrollY, currentPosition, scrollPositionRef.current);

      // Always save current position on unmount (unless at top)
      if (finalPosition > 0 && book) {
        localStorage.setItem(`bookmark-${book.slug}`, JSON.stringify(finalPosition));
        console.log(`💾 Saved final bookmark for "${book.title}" at position: ${finalPosition} (on unmount)`);
      } else {
        console.log(`⏭️ Skipped saving (all positions are 0)`);
      }
    };
  }, [book]);

  // Auto-hide controls after 4 seconds of inactivity (like a video player)
  useEffect(() => {
    const startHideTimer = () => {
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
      hideControlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 4000); // Hide after 4 seconds
    };

    const showControlsHandler = () => {
      setShowControls(true);
      startHideTimer();
    };

    // Show controls on any user interaction
    const events = ['mousedown', 'mousemove', 'touchstart', 'touchmove', 'click', 'keydown'];
    events.forEach(event => {
      document.addEventListener(event, showControlsHandler);
    });

    // Start initial timer
    startHideTimer();

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, showControlsHandler);
      });
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    };
  }, []);

  // Keep controls visible when menus are open
  useEffect(() => {
    if (showSourceMenu || showVoiceMenu || showSpeedMenu) {
      setShowControls(true);
      if (hideControlsTimerRef.current) {
        clearTimeout(hideControlsTimerRef.current);
      }
    }
  }, [showSourceMenu, showVoiceMenu, showSpeedMenu]);

  // Auto-scroll to keep current reading position centered on screen
  // ONLY when narrator is actively playing (not when restoring from memory)
  useEffect(() => {
    // Skip on mobile (no narrator on mobile)
    if (isMobile) return;

    if (currentReadingPosRef.current && narratorCharIndex > 0 && isNarratorOn && !isPaused) {
      currentReadingPosRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [narratorCharIndex, isNarratorOn, isPaused, isMobile]);

  // Theme styles
  const themeStyles = {
    light: { bg: "#e9eef5", text: "#1e293b", shadow: "rgba(163,177,198,0.6)" },
    dark: { bg: "#1a1a1a", text: "#e0e0e0", shadow: "rgba(0,0,0,0.8)" },
    sepia: { bg: "#f4ecd8", text: "#5c4b37", shadow: "rgba(92,75,55,0.3)" },
  };

  const currentTheme = themeStyles[theme];

  // Mobile TTS initialization function
  const initializeMobileTTS = async () => {
    console.log("📱 Initializing mobile TTS...");
    setIsInitializing(true);
    setInitError('');

    try {
      // Cancel any existing speech
      window.speechSynthesis.cancel();

      // Force reload voices with retry mechanism
      const loadVoicesWithRetry = (): Promise<SpeechSynthesisVoice[]> => {
        return new Promise((resolve) => {
          let attempts = 0;
          const maxAttempts = 15; // Try for 3 seconds

          const checkVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            console.log(`📱 Attempt ${attempts + 1}: Found ${voices.length} voices`);

            if (voices.length > 0) {
              console.log(`✅ Voices loaded successfully!`);
              resolve(voices);
            } else if (attempts >= maxAttempts) {
              console.log(`❌ Voice loading timeout after ${maxAttempts} attempts`);
              resolve(voices); // Return empty array to trigger error
            } else {
              attempts++;
              setTimeout(checkVoices, 200);
            }
          };

          // Set up voice changed listener
          window.speechSynthesis.onvoiceschanged = checkVoices;

          // Start checking immediately
          checkVoices();
        });
      };

      const voices = await loadVoicesWithRetry();

      if (voices.length === 0) {
        throw new Error('No voices available on this device. Your browser may not support text-to-speech.');
      }

      // Log all available voices for debugging
      console.log("📋 All available voices:");
      voices.forEach((voice, i) => {
        console.log(`  ${i + 1}. ${voice.name} (${voice.lang}) ${voice.default ? '[DEFAULT]' : ''}`);
      });

      // Try to find English voices
      const englishVoices = voices.filter(v =>
        v.lang.startsWith('en-') || v.lang === 'en'
      );

      console.log(`🔍 Found ${englishVoices.length} English voices out of ${voices.length} total`);

      if (englishVoices.length === 0) {
        throw new Error(
          `No English voices found. Your device has ${voices.length} voices but they're all in other languages (${voices.map(v => v.lang).join(', ')}). ` +
          `Please install Google Text-to-Speech from Play Store and download English voice data.`
        );
      }

      // Use English voices only
      const voicesToUse = englishVoices;

      // Test TTS with a very quiet utterance
      const testUtterance = new SpeechSynthesisUtterance('Ready');
      testUtterance.volume = 0.01; // Very quiet
      testUtterance.rate = 2.0; // Very fast

      await new Promise<void>((resolve, reject) => {
        testUtterance.onend = () => {
          console.log("✅ TTS test successful");
          resolve();
        };
        testUtterance.onerror = (error) => {
          console.error("❌ TTS test failed:", error);
          reject(error);
        };

        window.speechSynthesis.speak(testUtterance);

        // Timeout after 2 seconds
        setTimeout(() => {
          window.speechSynthesis.cancel();
          resolve(); // Continue anyway
        }, 2000);
      });

      // Success! Set up voices (English only)
      setAvailableVoices(voicesToUse);

      // Load saved voice or use first English voice
      const savedVoiceName = localStorage.getItem("preferredVoice");
      const savedVoice = savedVoiceName ? voicesToUse.find(v => v.name === savedVoiceName) : null;
      const voiceToUse = savedVoice || voicesToUse[0];

      setSelectedVoice(voiceToUse);
      setTtsInitialized(true);

      console.log(`✅ Mobile TTS initialized with voice: ${voiceToUse.name} (${voiceToUse.lang})`);

    } catch (error: any) {
      console.error("❌ Mobile TTS initialization failed:", error);
      setInitError(error.message || 'Failed to initialize. Please check your browser settings and try again.');
    } finally {
      setIsInitializing(false);
    }
  };

  // Narrator functions (Web Speech API with pause/resume and word tracking)
  const startNarrator = (resumeFromChar: number = 0) => {
    console.log("🎙️ startNarrator called with position:", resumeFromChar);

    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (!cleanedContent) {
      console.log("❌ No cleaned content available");
      return;
    }

    // Mobile fix: Force reload voices if not loaded (common mobile issue)
    if (availableVoices.length === 0) {
      console.log("📱 Mobile voice loading fix: Reloading voices...");
      const voices = window.speechSynthesis.getVoices();
      console.log(`📱 Found ${voices.length} voices`);
      setAvailableVoices(voices);
      if (voices.length > 0) {
        setSelectedVoice(voices[0]);
        console.log(`📱 Selected default voice: ${voices[0].name}`);
      } else {
        alert("No voices available. Please enable narrator first.");
        return;
      }
    }

    // Check for selected voice
    if (!selectedVoice) {
      console.log("❌ No voice selected");
      alert("No voice selected. Please enable narrator first.");
      return;
    }

    console.log(`✅ Using voice: ${selectedVoice.name}`);

    // Always cancel any existing speech first
    window.speechSynthesis.cancel();

    // Small delay to ensure cancel completes
    setTimeout(() => {
      continueNarrator(resumeFromChar);
    }, 100);
  };

  const continueNarrator = (resumeFromChar: number = 0) => {
    console.log("📖 continueNarrator starting from char:", resumeFromChar);

    // If resuming from a saved position, use substring
    const textToSpeak = resumeFromChar > 0 ? cleanedContent.substring(resumeFromChar) : cleanedContent;

    if (!textToSpeak || textToSpeak.length === 0) {
      console.log("❌ No text to speak");
      alert("No text to read. Please try again.");
      return;
    }

    console.log(`📝 Text length: ${textToSpeak.length} characters`);

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = narratorSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
      console.log(`🎤 Voice set to: ${selectedVoice.name}`);
    } else {
      console.log("⚠️ No voice set, using default");
    }

    // Track word boundaries for highlighting
    utterance.onboundary = (event) => {
      if (event.name === "word") {
        const actualCharIndex = resumeFromChar + event.charIndex;
        setNarratorCharIndex(actualCharIndex);

        // Save narrator position periodically
        localStorage.setItem(`narrator-${book.slug}`, JSON.stringify(actualCharIndex));
      }
    };

    utterance.onend = () => {
      console.log(`✅ Narration onend triggered for "${book.title}"`);

      // Only handle state if narration completed naturally (not cancelled)
      if (!narratorCancelledRef.current) {
        // Natural completion - clean up everything
        console.log(`✅ Natural completion - clearing all state and position`);
        setIsNarratorOn(false);
        setIsPaused(false);
        setCurrentUtterance(null);
        setNarratorCharIndex(0);
        localStorage.removeItem(`narrator-${book.slug}`);
      } else {
        // Cancelled by user action (stop/restart/navigation)
        // The calling function already handled state - just reset the flag
        console.log(`⏸️ Cancelled - caller already handled state, resetting flag only`);
        narratorCancelledRef.current = false;
      }
    };

    utterance.onstart = () => {
      console.log("✅ Speech started successfully!");
    };

    utterance.onerror = (event) => {
      console.error("❌ Speech synthesis error:", event);
      console.error("Error type:", event.error);

      // Show user-friendly error
      let errorMsg = "Speech failed: ";
      if (event.error === 'not-allowed') {
        errorMsg += "Permission denied. Please allow speech in your browser settings.";
      } else if (event.error === 'network') {
        errorMsg += "Network error. Please check your connection.";
      } else {
        errorMsg += event.error || "Unknown error";
      }

      alert(errorMsg);

      setIsNarratorOn(false);
      setIsPaused(false);
      setCurrentUtterance(null);
      setNarratorCharIndex(0);
    };

    console.log("🚀 Calling speechSynthesis.speak()...");

    setCurrentUtterance(utterance);
    setIsNarratorOn(true);
    setIsPaused(false);

    try {
      window.speechSynthesis.speak(utterance);
      console.log("✅ speak() called successfully");

      // Check if it actually started (mobile sometimes queues silently)
      setTimeout(() => {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          console.log("⚠️ Speech didn't start - trying again with user interaction");
          // On some mobile browsers, need immediate user interaction
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        } else {
          console.log(`✅ Speech state - speaking: ${window.speechSynthesis.speaking}, pending: ${window.speechSynthesis.pending}`);
        }
      }, 500);
    } catch (error) {
      console.error("❌ Exception calling speak():", error);
      alert("Failed to start speech: " + error);
    }
  };

  const pauseNarrator = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeNarrator = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopNarrator = () => {
    // Save current position before stopping
    if (narratorCharIndex > 0) {
      localStorage.setItem(`narrator-${book.slug}`, JSON.stringify(narratorCharIndex));
      console.log(`💾 Saved narrator position on Stop: ${narratorCharIndex}`);
    }

    narratorCancelledRef.current = true; // Mark as cancelled (user stopped it)
    window.speechSynthesis.cancel();
    setIsNarratorOn(false);
    setIsPaused(false);
    setCurrentUtterance(null);
  };

  const restartNarrator = () => {
    // Clear saved position and return to initial Play button state
    localStorage.removeItem(`narrator-${book.slug}`);
    console.log(`🔄 Reset: cleared all memory, returning to Play button`);

    // Cancel any active narration
    narratorCancelledRef.current = true;
    window.speechSynthesis.cancel();

    // Reset to initial state (Play button will show)
    setIsNarratorOn(false);
    setIsPaused(false);
    setNarratorCharIndex(0);
    setCurrentUtterance(null);

    // Reset flag after state is set
    setTimeout(() => {
      narratorCancelledRef.current = false;
    }, 100);
  };

  const changeNarratorSpeed = (speed: number) => {
    setNarratorSpeed(speed);
    localStorage.setItem("narratorSpeed", JSON.stringify(speed));
    setShowSpeedMenu(false);

    // User needs to restart manually to apply new speed
    // This prevents the buggy behavior of auto-restarting
  };

  const changeVoice = (voice: SpeechSynthesisVoice) => {
    setSelectedVoice(voice);
    localStorage.setItem("preferredVoice", voice.name);
    setShowVoiceMenu(false);
  };

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("readerTheme", JSON.stringify(newTheme));
  };

  const changeFontSize = (size: number) => {
    setFontSize(size);
    localStorage.setItem("readerFontSize", JSON.stringify(size));
  };

  // Copy functionality
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle click to set narrator position (like Word's Read Aloud)
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't interfere if user is actively dragging to select text
    if (window.getSelection()?.toString().length ?? 0 > 0) {
      return;
    }

    // Don't interfere if narrator is actively speaking
    if (isNarratorOn && !isPaused) {
      return;
    }

    try {
      // Get click position
      const range = document.caretRangeFromPoint?.(e.clientX, e.clientY) ||
                    document.caretPositionFromPoint?.(e.clientX, e.clientY);

      if (!range) return;

      // Walk through text nodes to calculate character position
      const contentDiv = e.currentTarget;
      const walker = document.createTreeWalker(
        contentDiv,
        NodeFilter.SHOW_TEXT,
        null
      );

      let charCount = 0;
      let node: Node | null;
      const clickedNode = 'startContainer' in range ? range.startContainer : range.offsetNode;
      const clickedOffset = 'startOffset' in range ? range.startOffset : range.offset;

      while ((node = walker.nextNode())) {
        if (node === clickedNode) {
          charCount += clickedOffset;
          break;
        } else if (node.textContent) {
          charCount += node.textContent.length;
        }
      }

      // Map to cleaned content position (approximate)
      // cleanedContent is shorter because it removes markdown syntax
      const ratio = cleanedContent.length / contentDiv.textContent!.length;
      const cleanedPosition = Math.floor(charCount * ratio);

      // Set narrator position (this will cause immediate highlighting)
      if (cleanedPosition >= 0 && cleanedPosition < cleanedContent.length) {
        console.log(`📍 Click-to-position: char ${charCount} → cleaned ${cleanedPosition}`);
        setNarratorCharIndex(cleanedPosition);

        // Save this as the new starting position
        localStorage.setItem(`narrator-${book.slug}`, JSON.stringify(cleanedPosition));
      }
    } catch (error) {
      console.error('Error calculating click position:', error);
    }
  };

  // Render content with markdown support and stable highlighting
  const renderContent = () => {
    if (!content) {
      return null;
    }

    // ALWAYS render markdown on mobile (no narrator highlighting)
    // OR when narrator is OFF or no position saved on desktop
    if (isMobile || (!isNarratorOn && !isPaused && narratorCharIndex === 0)) {
      return (
        <div
          className="prose prose-slate prose-lg max-w-none dark:prose-invert cursor-text"
          onClick={isMobile ? undefined : handleContentClick}
          title={isMobile ? undefined : "Click anywhere to set narrator start position"}
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => <h1 className="text-4xl font-bold mt-8 mb-4" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-3xl font-bold mt-6 mb-3" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-2xl font-bold mt-5 mb-2" {...props} />,
              p: ({node, ...props}) => <p className="mb-4" {...props} />,
              a: ({node, ...props}) => <a className="text-blue-600 hover:underline" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4" {...props} />,
              code: ({node, inline, ...props}: any) =>
                inline
                  ? <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded" {...props} />
                  : <code className="block bg-slate-100 dark:bg-slate-800 p-4 rounded my-4" {...props} />,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      );
    }

    // When narrator has a position (active, paused, or saved) - use STABLE plain text highlighting
    // (Prevents layout shift that occurs with split markdown rendering)
    const readUpTo = Math.min(narratorCharIndex, cleanedContent.length);
    const alreadyRead = cleanedContent.substring(0, readUpTo);
    const notYetRead = cleanedContent.substring(readUpTo);

    return (
      <div
        className="font-serif cursor-text"
        style={{ whiteSpace: 'pre-wrap' }}
        onClick={handleContentClick}
        title="Click anywhere to change narrator position"
      >
        {/* Already read/highlighted portion */}
        <span
          style={{
            backgroundColor: theme === 'dark' ? '#ffd70044' : '#ffeb3b66',
            transition: 'background-color 0.3s ease',
          }}
        >
          {alreadyRead}
        </span>

        {/* Current reading position marker - for auto-scroll */}
        <span
          ref={currentReadingPosRef}
          style={{
            position: 'relative',
            display: 'inline-block',
            width: '2px',
            height: '1.2em',
            backgroundColor: theme === 'dark' ? '#ffd700' : '#4ade80',
            marginLeft: '1px',
            marginRight: '1px',
            verticalAlign: 'middle',
          }}
        />

        {/* Not yet read portion - normal */}
        {notYetRead}
      </div>
    );
  };

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{ background: currentTheme.bg, color: currentTheme.text }}
    >
      {/* CONTROL BAR - MOBILE: Simple static back button | DESKTOP: Full controls with auto-hide */}

      {/* MOBILE VERSION - Simple static bar */}
      {isMobile && (
        <div
          className="sticky top-0 z-50 border-b"
          style={{
            background: currentTheme.bg,
            borderColor: currentTheme.shadow,
          }}
        >
          <div className="max-w-4xl mx-auto px-4 py-2">
            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: currentTheme.bg,
                  boxShadow: `2px 2px 4px ${currentTheme.shadow}, -2px -2px 4px rgba(255,255,255,0.5)`,
                }}
              >
                <Home className="w-3 h-3" />
              </Link>
              <Link
                to="/library"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: currentTheme.bg,
                  boxShadow: `2px 2px 4px ${currentTheme.shadow}, -2px -2px 4px rgba(255,255,255,0.5)`,
                }}
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Library</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* DESKTOP VERSION - Full controls with auto-hide (unchanged) */}
      {!isMobile && (
        <>
          {!showControls && (
            <div
              className="fixed top-0 left-0 right-0 z-40 text-center py-2 text-xs opacity-50 animate-pulse"
              style={{ background: currentTheme.bg }}
            >
              Tap screen to show controls
            </div>
          )}

          <div
            className={`sticky z-50 border-b transition-all duration-500 ease-in-out ${
              showControls ? 'top-0 opacity-100' : '-top-full opacity-0'
            }`}
            style={{
              background: currentTheme.bg,
              borderColor: currentTheme.shadow,
            }}
          >
            <div className="max-w-4xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                {/* Navigation Buttons */}
                <div className="flex items-center gap-3">
                  <Link
                    to="/"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: currentTheme.bg,
                      boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                    }}
                  >
                    <Home className="w-4 h-4" />
                    <span className="hidden md:inline">Home</span>
                  </Link>
                  <Link
                    to="/library"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: currentTheme.bg,
                      boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                    }}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Library</span>
                  </Link>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3 flex-wrap">
              {/* Mobile TTS Initialization Button - DISABLED */}
              {false && isMobile && !ttsInitialized && (
                <div className="flex flex-col gap-2">
                  <button
                    onClick={initializeMobileTTS}
                    disabled={isInitializing}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: currentTheme.bg,
                      boxShadow: isInitializing
                        ? `inset 3px 3px 6px ${currentTheme.shadow}, inset -3px -3px 6px rgba(255,255,255,0.5)`
                        : `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                      opacity: isInitializing ? 0.7 : 1,
                    }}
                  >
                    <Mic className="w-4 h-4" style={{ color: isInitializing ? '#ffd700' : undefined }} />
                    <span>{isInitializing ? 'Initializing...' : 'Enable Narrator'}</span>
                  </button>
                  {initError && (
                    <div className="text-xs text-red-600 max-w-xs px-2">
                      {initError}
                      <button
                        onClick={initializeMobileTTS}
                        className="ml-2 underline"
                      >
                        Retry
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Narrator Controls - Only show when TTS is initialized (or not mobile) */}
              {/* Play button - only when not playing and no memory */}
              {(!isMobile || ttsInitialized) && !isNarratorOn && narratorCharIndex === 0 && (
                <button
                  onClick={() => startNarrator(0)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: currentTheme.bg,
                    boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                  }}
                >
                  <Play className="w-4 h-4" />
                  <span>Play</span>
                </button>
              )}

              {/* Resume button - when stopped with memory OR when paused */}
              {(!isMobile || ttsInitialized) && !isNarratorOn && narratorCharIndex > 0 && (
                <button
                  onClick={() => startNarrator(narratorCharIndex)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: currentTheme.bg,
                    boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                  }}
                >
                  <Play className="w-4 h-4" style={{ color: "#22c55e" }} />
                  <span>Resume</span>
                </button>
              )}

              {isPaused && (
                <button
                  onClick={resumeNarrator}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: currentTheme.bg,
                    boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                  }}
                >
                  <Play className="w-4 h-4" style={{ color: "#22c55e" }} />
                  <span>Resume</span>
                </button>
              )}

              {/* Pause button - only when playing and not paused */}
              {isNarratorOn && !isPaused && (
                <button
                  onClick={pauseNarrator}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: currentTheme.bg,
                    boxShadow: `inset 3px 3px 6px ${currentTheme.shadow}, inset -3px -3px 6px rgba(255,255,255,0.5)`,
                  }}
                >
                  <Pause className="w-4 h-4" style={{ color: "#ffd700" }} />
                  <span>Pause</span>
                </button>
              )}

              {/* Stop button - only when narrator is on (playing or paused) */}
              {isNarratorOn && (
                <button
                  onClick={stopNarrator}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: currentTheme.bg,
                    boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                  }}
                >
                  <VolumeX className="w-4 h-4" />
                  <span>Stop</span>
                </button>
              )}

              {/* Reset button - when playing, paused, or stopped with memory */}
              {(isNarratorOn || (!isNarratorOn && narratorCharIndex > 0)) && (
                <button
                  onClick={restartNarrator}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: currentTheme.bg,
                    boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                  }}
                >
                  <RotateCcw className="w-4 h-4" />
                  <span className="hidden md:inline">Reset</span>
                </button>
              )}

              {/* Voice Selector - Only show when TTS is ready */}
              {(!isMobile || ttsInitialized) && availableVoices.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowVoiceMenu(!showVoiceMenu)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                    style={{
                      background: currentTheme.bg,
                      boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                    }}
                  >
                    <Mic className="w-4 h-4" />
                    <span className="hidden md:inline">Voice ▼</span>
                    <span className="md:hidden">▼</span>
                  </button>

                  {showVoiceMenu && (
                    <div
                      className="fixed md:absolute right-2 md:right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] max-h-64 overflow-y-auto rounded-xl z-50"
                      style={{
                        background: currentTheme.bg,
                        boxShadow: `6px 6px 12px ${currentTheme.shadow}, -6px -6px 12px rgba(255,255,255,0.5)`,
                        top: showVoiceMenu ? 'auto' : undefined,
                      }}
                    >
                      {availableVoices.map((voice, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            changeVoice(voice);
                            setShowVoiceMenu(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs hover:opacity-70 transition-opacity ${
                            selectedVoice?.name === voice.name ? "font-bold" : ""
                          }`}
                          style={{
                            background: selectedVoice?.name === voice.name ? currentTheme.shadow : "transparent",
                          }}
                        >
                          {voice.name} ({voice.lang})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Speed Control Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: currentTheme.bg,
                    boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                  }}
                >
                  <Gauge className="w-4 h-4" />
                  <span>{narratorSpeed}x ▼</span>
                </button>

                {showSpeedMenu && (
                  <div
                    className="fixed md:absolute right-2 md:right-0 mt-2 w-32 rounded-xl overflow-hidden z-50"
                    style={{
                      background: currentTheme.bg,
                      boxShadow: `6px 6px 12px ${currentTheme.shadow}, -6px -6px 12px rgba(255,255,255,0.5)`,
                    }}
                  >
                    {[0.75, 1.0, 1.25, 1.5, 1.75, 2.0].map((speed) => (
                      <button
                        key={speed}
                        onClick={() => changeNarratorSpeed(speed)}
                        className={`w-full text-left px-4 py-2 text-sm hover:opacity-70 transition-opacity ${
                          narratorSpeed === speed ? "font-bold" : ""
                        }`}
                        style={{
                          background: narratorSpeed === speed ? currentTheme.shadow : "transparent",
                        }}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Theme Switcher */}
              <div className="flex items-center gap-2">
                {[
                  { key: "light", icon: Sun },
                  { key: "dark", icon: Moon },
                  { key: "sepia", icon: FileText },
                ].map(({ key, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => changeTheme(key as Theme)}
                    className="p-2 rounded-lg transition-all"
                    style={{
                      background: currentTheme.bg,
                      boxShadow:
                        theme === key
                          ? `inset 2px 2px 4px ${currentTheme.shadow}, inset -2px -2px 4px rgba(255,255,255,0.5)`
                          : `2px 2px 4px ${currentTheme.shadow}, -2px -2px 4px rgba(255,255,255,0.5)`,
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>

              {/* Font Size */}
              <div className="flex items-center gap-2">
                {[14, 16, 18, 20].map((size) => (
                  <button
                    key={size}
                    onClick={() => changeFontSize(size)}
                    className="px-2 py-1 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: currentTheme.bg,
                      boxShadow:
                        fontSize === size
                          ? `inset 2px 2px 4px ${currentTheme.shadow}, inset -2px -2px 4px rgba(255,255,255,0.5)`
                          : `2px 2px 4px ${currentTheme.shadow}, -2px -2px 4px rgba(255,255,255,0.5)`,
                    }}
                  >
                    A{size === 14 ? "-" : size === 20 ? "+" : ""}
                  </button>
                ))}
              </div>

              {/* Copy Button */}
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: currentTheme.bg,
                  boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" style={{ color: "#22c55e" }} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              {/* GitHub Source Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowSourceMenu(!showSourceMenu)}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                  style={{
                    background: currentTheme.bg,
                    boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                  }}
                >
                  <Github className="w-4 h-4" />
                  <span>Source ▼</span>
                </button>

                {showSourceMenu && (
                  <div
                    className="fixed md:absolute right-2 md:right-0 mt-2 w-56 rounded-xl overflow-hidden z-50"
                    style={{
                      background: currentTheme.bg,
                      boxShadow: `6px 6px 12px ${currentTheme.shadow}, -6px -6px 12px rgba(255,255,255,0.5)`,
                    }}
                  >
                    <a
                      href={book.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:opacity-70 transition-opacity"
                    >
                      <Github className="w-4 h-4" />
                      <span className="text-sm">View on GitHub</span>
                    </a>
                    <a
                      href={book.downloadUrl}
                      download
                      className="flex items-center gap-3 px-4 py-3 hover:opacity-70 transition-opacity"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download .md</span>
                    </a>
                    <a
                      href="https://github.com/mikeat7/discourse"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-3 hover:opacity-70 transition-opacity"
                    >
                      <Star className="w-4 h-4" />
                      <span className="text-sm">Star Repository</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      )}

      {/* CONTENT AREA */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Book Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-2">{book.title}</h1>
          <p className="text-xl italic opacity-80 mb-4">{book.subtitle}</p>
          <div className="flex items-center gap-4 text-sm opacity-70">
            <span>{book.author}</span>
            <span>•</span>
            <span>{book.readTime}</span>
            <span>•</span>
            <span>{book.category}</span>
          </div>
          <div
            className="mt-6 p-4 rounded-xl"
            style={{
              background: currentTheme.bg,
              boxShadow: `inset 4px 4px 8px ${currentTheme.shadow}, inset -4px -4px 8px rgba(255,255,255,0.3)`,
            }}
          >
            <p className="text-sm leading-relaxed">
              <strong>Key Insight:</strong> {book.mainMessage}
            </p>
          </div>
        </header>

        {/* Content */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-lg">Loading...</p>
          </div>
        ) : (
          <div
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
              color: currentTheme.text,
            }}
          >
            {renderContent()}
          </div>
        )}
      </article>

      {/* Bookmark Restoration Notice */}
      {showBookmarkNotice && (
        <div
          className="fixed bottom-8 right-8 px-6 py-4 rounded-xl z-50 shadow-lg animate-fade-in"
          style={{
            background: currentTheme.bg,
            boxShadow: `6px 6px 16px ${currentTheme.shadow}, -6px -6px 16px rgba(255,255,255,0.7)`,
            border: `2px solid ${currentTheme.shadow}`,
          }}
        >
          <p className="text-sm font-medium flex items-center gap-2">
            <Check className="w-4 h-4" style={{ color: "#22c55e" }} />
            <span>Continuing from where you left off</span>
          </p>
        </div>
      )}

      {/* Click outside to close menus */}
      {showSourceMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSourceMenu(false)}
        />
      )}
      {showVoiceMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowVoiceMenu(false)}
        />
      )}
      {showSpeedMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSpeedMenu(false)}
        />
      )}
    </main>
  );
};

export default LibraryBookPage;
