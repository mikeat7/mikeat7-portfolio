// src/pages/cdm/index.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Brain, BookOpen, Clock, User, Sparkles, Filter, Home } from "lucide-react";
import { cdmLibraryBooks, getCDMCategories } from "@/data/libraryDataCDM";

const CDMIndexPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = ["All", ...getCDMCategories()];

  const filteredBooks =
    selectedCategory === "All"
      ? cdmLibraryBooks
      : cdmLibraryBooks.filter((book) => book.category === selectedCategory);

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
              <Brain className="w-8 h-8" style={{ color: "#ffd700" }} />
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">
                CDM v2 & CRYSTAL Method
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
          <p className="text-base md:text-lg text-slate-700 max-w-3xl mb-4">
            A drop-in 68-line metric that finally tells you when a transformer is actually reasoning vs regurgitating.
            Four signals: entropy collapse, convergence ratio, attention Gini, basin-escape probability.
          </p>
          <p className="text-sm text-slate-600">
            <strong>Repository:</strong>{" "}
            <a
              href="https://github.com/mikeat7/crystal-manual"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-slate-900"
            >
              github.com/mikeat7/crystal-manual
            </a>
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
        </div>

        {/* BOOK GRID */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map((book, index) => (
            <Link
              key={book.slug}
              to={`/cdm/${book.slug}`}
              className="group block rounded-2xl p-6 cursor-pointer transition-transform hover:scale-[1.02] focus:outline-none"
              style={{
                background: "#e9eef5",
                boxShadow:
                  "8px 8px 16px rgba(163,177,198,0.6), -8px -8px 16px rgba(255,255,255,0.9)",
              }}
            >
              {/* Featured Badge */}
              {book.featured && (
                <div className="flex items-center gap-1 mb-3">
                  <Sparkles className="w-4 h-4" style={{ color: "#ffd700" }} />
                  <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Featured
                  </span>
                </div>
              )}

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
            "{filteredBooks.length} {filteredBooks.length === 1 ? "work" : "works"} on measuring genuine reasoning in transformers"
          </p>
        </div>
      </section>
    </main>
  );
};

export default CDMIndexPage;
