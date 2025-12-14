// src/pages/cdm/[slug].tsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  Copy,
  Check,
  Github,
  Download,
  Star,
  Sun,
  Moon,
  FileText,
  Home,
} from "lucide-react";
import { cdmLibraryBooks } from "@/data/libraryDataCDM";

const getBookBySlug = (slug: string) =>
  cdmLibraryBooks.find(book => book.slug === slug);

type Theme = "light" | "dark" | "sepia";

const CDMBookPage: React.FC = () => {
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
  const [theme, setTheme] = useState<Theme>(() => loadPreference<Theme>("readerTheme", "light"));
  const [fontSize, setFontSize] = useState(() => loadPreference<number>("readerFontSize", 16));
  const [copied, setCopied] = useState(false);
  const [showSourceMenu, setShowSourceMenu] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [showBookmarkNotice, setShowBookmarkNotice] = useState(false);
  const scrollPositionRef = useRef(0);

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


  // Restore scroll position for this book
  useEffect(() => {
    if (!isLoading && book && content) {
      const savedScrollPos = loadPreference<number>(`bookmark-${book.slug}`, 0);

      console.log(`📖 Loading "${book.title}" (slug: ${book.slug})`);
      console.log(`   Saved scroll position: ${savedScrollPos}`);
      console.log(`   All localStorage keys:`, Object.keys(localStorage).filter(k => k.startsWith('bookmark-')));

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
                to="/cdm"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
                style={{
                  background: currentTheme.bg,
                  boxShadow: `3px 3px 6px ${currentTheme.shadow}, -3px -3px 6px rgba(255,255,255,0.5)`,
                }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>CDM Collection</span>
              </Link>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
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
                      href="https://github.com/mikeat7/crystal-manual"
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
            className="prose prose-slate max-w-none prose-headings:font-bold prose-table:border-collapse prose-th:border prose-th:border-slate-300 prose-th:p-2 prose-td:border prose-td:border-slate-300 prose-td:p-2"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
              color: currentTheme.text,
            }}
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
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
    </main>
  );
};

export default CDMBookPage;
