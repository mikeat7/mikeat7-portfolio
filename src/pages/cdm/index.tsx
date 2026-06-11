// src/pages/cdm/index.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, BookOpen, Clock, User, Sparkles, Filter, Home, Sun, Moon, FileText } from "lucide-react";
import { cdmLibraryBooks, getCDMCategories } from "@/data/libraryDataCDM";

type Theme = "light" | "dark" | "sepia";

const CDMIndexPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...getCDMCategories()];

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

  // Mobile detection
  const [isMobile, setIsMobile] = useState(() => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
  });

  const [theme, setTheme] = useState<Theme>(() => loadPreference<Theme>("readerTheme", "sepia"));
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
      ? cdmLibraryBooks
      : cdmLibraryBooks.filter((book) => book.category === selectedCategory);

  return (
    <main className="ins-page">
      {/* HEADER */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="ins-panel p-8 md:p-12">
          <div className="flex items-center justify-between mb-2 gap-4">
            <div className="ins-sec flex items-center gap-2 flex-1">
              <Brain className="w-4 h-4 text-ins-gold" />
              Research · Transformer Reasoning Metrics
            </div>
            <Link to="/" className="ins-btn !px-3 !py-1.5 flex-shrink-0">
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">Home</span>
            </Link>
          </div>

          <h1 className="ins-heading text-3xl md:text-5xl mt-3">
            CDM v2 &amp; CRYSTAL Method
          </h1>
          <p className="mt-4 text-base md:text-lg text-ins-text leading-relaxed max-w-3xl">
            A drop-in 68-line metric that finally tells you when a transformer is actually reasoning
            vs regurgitating. Four signals: entropy collapse, convergence ratio, attention Gini,
            basin-escape probability.
          </p>
          <p className="mt-3 text-sm text-ins-dim">
            <strong className="text-ins-text">Repository:</strong>{" "}
            <a
              href="https://github.com/mikeat7/crystal-manual"
              target="_blank"
              rel="noopener noreferrer"
              className="ins-mono text-ins-teal hover:text-ins-goldbright transition-colors"
            >
              github.com/mikeat7/crystal-manual
            </a>
          </p>

          {/* CATEGORY FILTER */}
          <div className="mt-6 flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-ins-dim" />
            <span className="ins-mono text-xs uppercase tracking-wider text-ins-dim mr-1">Filter:</span>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`ins-btn !px-3 !py-1.5 !text-xs ${
                  selectedCategory === category ? "ins-btn-gold" : ""
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* READING PREFERENCES - Mobile only */}
          {isMobile && (
          <div className="mt-8 p-6 rounded bg-ins-deep border border-ins-line">
            <h3 className="ins-sec">📖 Reading Preferences</h3>
            <p className="text-xs text-ins-dim mb-4">Set your preferred theme and font size for all articles</p>

            <div className="flex flex-col md:flex-row gap-6">
              {/* Theme Selector */}
              <div className="flex-1">
                <label className="ins-mono text-xs uppercase tracking-wider text-ins-dim mb-2 block">Theme</label>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { key: "light", icon: Sun, label: "Light" },
                    { key: "dark", icon: Moon, label: "Dark" },
                    { key: "sepia", icon: FileText, label: "Sepia" },
                  ].map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      onClick={() => changeTheme(key as Theme)}
                      className={`ins-btn !px-3 !py-1.5 !text-xs ${theme === key ? "ins-btn-gold" : ""}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="whitespace-nowrap">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="flex-1">
                <label className="ins-mono text-xs uppercase tracking-wider text-ins-dim mb-2 block">Font Size</label>
                <div className="flex items-center gap-2">
                  {[14, 16, 18, 20].map((size) => (
                    <button
                      key={size}
                      onClick={() => changeFontSize(size)}
                      className={`ins-btn !px-3 !py-1.5 !text-xs ${fontSize === size ? "ins-btn-gold" : ""}`}
                    >
                      {size === 14 ? "A-" : size === 16 ? "A" : size === 18 ? "A" : "A+"}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-xs text-ins-dim mt-4 italic">
              Current: {theme.charAt(0).toUpperCase() + theme.slice(1)} theme, {fontSize}px font
            </p>
          </div>
          )}
        </div>

        {/* BOOK GRID */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book, index) => (
            <Link
              key={book.slug}
              to={`/cdm/${book.slug}`}
              className="ins-card group block p-6 focus:outline-none"
            >
              {/* Featured Badge */}
              {book.featured && (
                <div className="flex items-center gap-1 mb-3">
                  <Sparkles className="w-4 h-4 text-ins-gold" />
                  <span className="ins-mono text-xs font-semibold text-ins-gold uppercase tracking-wide">
                    Featured
                  </span>
                </div>
              )}

              {/* Book Number */}
              <div className="ins-mono text-xs font-bold text-ins-dim opacity-60 mb-2">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* Title & Subtitle */}
              <h3 className="ins-subheading text-xl mb-1 group-hover:text-ins-goldbright transition-colors">
                {book.title}
              </h3>
              <p className="text-sm italic text-ins-dim mb-3">{book.subtitle}</p>

              {/* Main Message (Key Takeaway) */}
              <div className="p-3 rounded mb-4 bg-ins-deep border border-ins-line">
                <p className="text-xs font-medium text-ins-text leading-relaxed">
                  💡 {book.mainMessage}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs text-ins-dim mb-3">
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
              <div className="ins-chip">{book.category}</div>

              {/* Read Button */}
              <div className="mt-4 inline-flex items-center gap-2 ins-mono text-sm tracking-wider uppercase text-ins-teal group-hover:text-ins-goldbright transition-colors">
                <BookOpen className="w-4 h-4" />
                <span>Read Now</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm italic text-ins-dim">
            "{filteredBooks.length} {filteredBooks.length === 1 ? "work" : "works"} on measuring genuine reasoning in transformers"
          </p>
        </div>
      </section>
    </main>
  );
};

export default CDMIndexPage;
