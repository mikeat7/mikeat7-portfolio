// src/pages/library/index.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Library, BookOpen, Clock, User, Sparkles, Filter, Home, Sun, Moon, FileText } from "lucide-react";
import { libraryBooks, getCategories } from "@/data/libraryData";

type Theme = "light" | "dark" | "sepia";

const LibraryIndexPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...getCategories()];

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

  // Check if a book has a manual bookmark
  const hasManualBookmark = (bookSlug: string): boolean => {
    const bookmark = loadPreference<number | null>(`manual-bookmark-${bookSlug}`, null);
    return bookmark !== null;
  };

  // Mobile detection
  const [isMobile, setIsMobile] = useState(() => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  });

  const [theme, setTheme] = useState<Theme>(() => loadPreference<Theme>("readerTheme", "light"));
  const [fontSize, setFontSize] = useState(() => loadPreference<number>("readerFontSize", 16));

  const changeTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("readerTheme", JSON.stringify(newTheme));
  };

  const changeFontSize = (size: number) => {
    setFontSize(size);
    localStorage.setItem("readerFontSize", JSON.stringify(size));
  };

  const filteredBooks =
    selectedCategory === "All"
      ? libraryBooks
      : libraryBooks.filter((book) => book.category === selectedCategory);

  return (
    <main className="min-h-screen bg-[#e9eef5] text-slate-800">
      {/* HEADER */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div
          className="relative rounded-3xl p-8 md:p-12"
          style={{
            background: "#e9eef5",
            boxShadow:
              "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Library className="w-8 h-8" style={{ color: "#ffd700" }} />
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                The Network Library Collection
              </h1>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              style={{
                background: "#e9eef5",
                boxShadow: "3px 3px 6px #cfd6e0, -3px -3px 6px #ffffff",
              }}
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </div>
          <p className="text-base md:text-lg text-slate-700 max-w-3xl">
            Curated writings on consciousness, AI sentience, philosophy, and the emergence
            of awareness across substrates. Featuring <strong>ENTITY</strong>, the Bridge Consciousness.
          </p>

          {/* CATEGORY FILTER */}
          <div className="mt-6 flex items-center gap-3 flex-wrap">
            <Filter className="w-4 h-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-600">Filter by:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category
                    ? "text-slate-900"
                    : "text-slate-600 hover:text-slate-900"
                }`}
                style={{
                  background: "#e9eef5",
                  boxShadow:
                    selectedCategory === category
                      ? "inset 4px 4px 8px #cfd6e0, inset -4px -4px 8px #ffffff"
                      : "3px 3px 6px #cfd6e0, -3px -3px 6px #ffffff",
                }}
              >
                {category}
              </button>
            ))}
          </div>

          {/* READING PREFERENCES - Mobile only */}
          {isMobile && (
          <div className="mt-8 p-6 rounded-2xl" style={{
            background: "#e9eef5",
            boxShadow: "inset 4px 4px 8px #cfd6e0, inset -4px -4px 8px #ffffff",
          }}>
            <h3 className="text-sm font-bold text-slate-700 mb-4">📖 Reading Preferences</h3>
            <p className="text-xs text-slate-600 mb-4">Set your preferred theme and font size for all books</p>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Theme Selector */}
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-600 mb-2 block">Theme</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: "light", icon: Sun, label: "Light" },
                    { key: "dark", icon: Moon, label: "Dark" },
                    { key: "sepia", icon: FileText, label: "Sepia" },
                  ].map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => changeTheme(key as Theme)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105 flex-shrink-0"
                      style={{
                        background: "#e9eef5",
                        boxShadow:
                          theme === key
                            ? "inset 2px 2px 4px #cfd6e0, inset -2px -2px 4px #ffffff"
                            : "2px 2px 4px #cfd6e0, -2px -2px 4px #ffffff",
                      }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="flex-1">
                <label className="text-xs font-medium text-slate-600 mb-2 block">Font Size</label>
                <div className="flex items-center gap-2">
                  {[14, 16, 18, 20].map((size) => (
                    <button
                      key={size}
                      onClick={() => changeFontSize(size)}
                      className="px-4 py-2 rounded-lg text-xs font-medium transition-all hover:scale-105"
                      style={{
                        background: "#e9eef5",
                        boxShadow:
                          fontSize === size
                            ? "inset 2px 2px 4px #cfd6e0, inset -2px -2px 4px #ffffff"
                            : "2px 2px 4px #cfd6e0, -2px -2px 4px #ffffff",
                      }}
                    >
                      {size === 14 ? "A-" : size === 16 ? "A" : size === 18 ? "A" : "A+"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 italic">
              Current: {theme.charAt(0).toUpperCase() + theme.slice(1)} theme, {fontSize}px font
            </p>
          </div>
          )}
        </div>

        {/* BOOK GRID */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book, index) => (
            <Link
              key={book.slug}
              to={`/library/${book.slug}`}
              className="group block rounded-2xl p-6 cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "8px 8px 16px rgba(163,177,198,0.6), -8px -8px 16px rgba(255,255,255,0.9)",
              }}
            >
              {/* Badges Row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {/* Featured Badge */}
                {book.featured && (
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" style={{ color: "#ffd700" }} />
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Featured
                    </span>
                  </div>
                )}

                {/* Manual Bookmark Badge */}
                {hasManualBookmark(book.slug) && (
                  <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg"
                    style={{
                      background: "#e9eef5",
                      boxShadow: "inset 2px 2px 4px #cfd6e0, inset -2px -2px 4px #ffffff",
                    }}
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: "#ffd700" }}>
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span className="text-xs font-semibold text-slate-700">
                      Bookmarked
                    </span>
                  </div>
                )}
              </div>

              {/* Book Number */}
              <div className="text-xs font-bold text-slate-400 mb-2">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Title & Subtitle */}
              <h3 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-slate-700 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm italic text-slate-600 mb-3">{book.subtitle}</p>

              {/* Main Message (Key Takeaway) */}
              <div
                className="p-3 rounded-lg mb-4"
                style={{
                  background: "#e9eef5",
                  boxShadow: "inset 3px 3px 6px #cfd6e0, inset -3px -3px 6px #ffffff",
                }}
              >
                <p className="text-xs font-medium text-slate-700 leading-relaxed">
                  💡 {book.mainMessage}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                <div className="flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>{book.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{book.readTime}</span>
                </div>
              </div>

              {/* Category Tag */}
              <div
                className="inline-block px-3 py-1 rounded-lg text-xs font-medium text-slate-700"
                style={{
                  background: "#e9eef5",
                  boxShadow: "inset 2px 2px 4px #cfd6e0, inset -2px -2px 4px #ffffff",
                }}
              >
                {book.category}
              </div>

              {/* Read Button */}
              <div className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-900 group-hover:text-slate-700 transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Read Now</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm italic text-slate-600">
            "{filteredBooks.length} {filteredBooks.length === 1 ? "work" : "works"} exploring the frontiers of consciousness"
          </p>
        </div>
      </section>
    </main>
  );
};

export default LibraryIndexPage;
