// src/pages/library/[slug].tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  const scrollPositionRef = useRef(0);
  const narratorCancelledRef = useRef(false);

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

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setAvailableVoices(voices);

      // Load saved voice preference or use default
      const savedVoiceName = localStorage.getItem("preferredVoice");
      if (savedVoiceName) {
        const savedVoice = voices.find(v => v.name === savedVoiceName);
        if (savedVoice) setSelectedVoice(savedVoice);
      } else if (voices.length > 0) {
        setSelectedVoice(voices[0]);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

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
    return () => {
      console.log(`🔄 Unmounting "${book.title}" - canceling any active narration`);
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        narratorCancelledRef.current = true; // Mark as cancelled, not completed
        window.speechSynthesis.cancel();
      }
      // Note: We do NOT clear localStorage here - positions should persist
    };
  }, [book]);

  // Restore scroll position for this book
  useEffect(() => {
    if (!isLoading && book && content) {
      const savedScrollPos = loadPreference<number>(`bookmark-${book.slug}`, 0);
      const savedNarratorPos = loadPreference<number>(`narrator-${book.slug}`, 0);

      console.log(`📖 Loading "${book.title}" (slug: ${book.slug})`);
      console.log(`   Saved scroll position: ${savedScrollPos}`);
      console.log(`   Saved narrator position: ${savedNarratorPos}`);
      console.log(`   All localStorage keys:`, Object.keys(localStorage).filter(k => k.startsWith('bookmark-') || k.startsWith('narrator-')));

      if (savedScrollPos > 0) {
        // Wait for content to render, then scroll
        setTimeout(() => {
          // Find the scrollable container (same logic as scroll tracking)
          const articleParent = document.querySelector('article')?.parentElement;
          const scrollable = document.documentElement.scrollHeight > window.innerHeight
            ? window
            : (articleParent && articleParent.scrollHeight > (articleParent.clientHeight || 0))
              ? articleParent
              : null;

          if (scrollable) {
            if (scrollable === window) {
              window.scrollTo({ top: savedScrollPos, behavior: 'auto' });
            } else {
              (scrollable as Element).scrollTop = savedScrollPos;
            }
            setShowBookmarkNotice(true);
            console.log(`✅ Restored scroll to position ${savedScrollPos}`);

            // Hide notice after 3 seconds
            setTimeout(() => setShowBookmarkNotice(false), 3000);
          }
        }, 500);
      }
    }
  }, [isLoading, book, content]);

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

      const finalPosition = scrollPositionRef.current;
      const currentPosition = getScrollPosition();
      console.log(`🔄 Cleanup: scrollPositionRef=${finalPosition}, current=${currentPosition}`);

      if (finalPosition > 0 && book) {
        localStorage.setItem(`bookmark-${book.slug}`, JSON.stringify(finalPosition));
        console.log(`💾 Saved final bookmark for "${book.title}" at position: ${finalPosition} (on unmount)`);
      } else {
        console.log(`⏭️ Skipped saving (position is ${finalPosition})`);
      }
    };
  }, [book]);

  // Theme styles
  const themeStyles = {
    light: { bg: "#e9eef5", text: "#1e293b", shadow: "rgba(163,177,198,0.6)" },
    dark: { bg: "#1a1a1a", text: "#e0e0e0", shadow: "rgba(0,0,0,0.8)" },
    sepia: { bg: "#f4ecd8", text: "#5c4b37", shadow: "rgba(92,75,55,0.3)" },
  };

  const currentTheme = themeStyles[theme];

  // Narrator functions (Web Speech API with pause/resume and word tracking)
  const startNarrator = (resumeFromChar: number = 0) => {
    if (!("speechSynthesis" in window)) {
      alert("Text-to-speech is not supported in your browser.");
      return;
    }

    if (!cleanedContent) return;

    // Always cancel any existing speech first
    window.speechSynthesis.cancel();

    // If resuming from a saved position, use substring
    const textToSpeak = resumeFromChar > 0 ? cleanedContent.substring(resumeFromChar) : cleanedContent;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.rate = narratorSpeed;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
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

    utterance.onerror = (event) => {
      console.error("Speech synthesis error:", event);
      setIsNarratorOn(false);
      setIsPaused(false);
      setCurrentUtterance(null);
      setNarratorCharIndex(0);
    };

    setCurrentUtterance(utterance);
    setIsNarratorOn(true);
    setIsPaused(false);
    window.speechSynthesis.speak(utterance);
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

  // Render content with highlighting for currently narrated sentence
  const renderHighlightedContent = () => {
    if (!cleanedContent || narratorCharIndex === 0) {
      return content;
    }

    // Find the current sentence being narrated
    const beforeCurrent = cleanedContent.substring(0, narratorCharIndex);
    const afterCurrent = cleanedContent.substring(narratorCharIndex);

    // Find sentence boundaries (. ! ? followed by space or newline)
    const sentenceStart = Math.max(
      beforeCurrent.lastIndexOf('. ') + 2,
      beforeCurrent.lastIndexOf('! ') + 2,
      beforeCurrent.lastIndexOf('? ') + 2,
      beforeCurrent.lastIndexOf('\n\n') + 2,
      0
    );

    const sentenceEndMatch = afterCurrent.match(/[.!?]\s|\n\n/);
    const sentenceEnd = (sentenceEndMatch && sentenceEndMatch.index !== undefined)
      ? narratorCharIndex + sentenceEndMatch.index + 2
      : cleanedContent.length;

    // Get the original content parts
    const beforeSentence = content.substring(0, sentenceStart);
    const currentSentence = content.substring(sentenceStart, sentenceEnd);
    const afterSentence = content.substring(sentenceEnd);

    return (
      <>
        {beforeSentence}
        <span
          style={{
            backgroundColor: theme === 'dark' ? '#ffd70033' : '#ffd70044',
            padding: '2px 0',
            borderRadius: '2px',
            transition: 'background-color 0.3s ease',
          }}
        >
          {currentSentence}
        </span>
        {afterSentence}
      </>
    );
  };

  return (
    <main
      className="min-h-screen transition-colors duration-300"
      style={{ background: currentTheme.bg, color: currentTheme.text }}
    >
      {/* CONTROL BAR (Sticky) */}
      <div
        className="sticky top-0 z-50 border-b transition-colors duration-300"
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
              {/* Narrator Controls */}
              {/* Play button - only when not playing and no memory */}
              {!isNarratorOn && narratorCharIndex === 0 && (
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
              {!isNarratorOn && narratorCharIndex > 0 && (
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

              {/* Voice Selector */}
              {availableVoices.length > 0 && (
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
                      className="absolute right-0 mt-2 w-64 max-h-64 overflow-y-auto rounded-xl z-10"
                      style={{
                        background: currentTheme.bg,
                        boxShadow: `6px 6px 12px ${currentTheme.shadow}, -6px -6px 12px rgba(255,255,255,0.5)`,
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
                    className="absolute right-0 mt-2 w-32 rounded-xl overflow-hidden z-10"
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
                    className="absolute right-0 mt-2 w-56 rounded-xl overflow-hidden z-10"
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
            className="prose prose-slate max-w-none"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
              color: currentTheme.text,
            }}
          >
            <pre className="whitespace-pre-wrap font-serif">
              {isNarratorOn || isPaused ? renderHighlightedContent() : content}
            </pre>
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
