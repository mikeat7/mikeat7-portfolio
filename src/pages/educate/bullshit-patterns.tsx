// src/pages/educate/bullshit-patterns.tsx
import React, { useMemo, useState } from "react";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
// If your JSON path differs, adjust the import:
import patternsData from "@/data/manipulation-patterns-comprehensive.json";

// Type the incoming JSON minimally/safely
type Pattern = {
  id: string;
  name: string;
  description: string;
  category?: string;
  severity?: "low" | "medium" | "high" | "critical";
  detection_confidence?: number;
  semantic_indicators?: string[];
  context_clues?: string[];
  psychological_mechanism?: string;
  examples?: string[];
};

const BullshitPatternViewer: React.FC = () => {
  const navigate = useNavigate();

  const patterns = (patternsData as Pattern[]).filter(Boolean);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSeverity, setSelectedSeverity] = useState("all");

  const categories = useMemo(() => {
    const set = new Set<string>();
    patterns.forEach((p) => set.add(p.category ?? "uncategorized"));
    return ["all", ...Array.from(set)];
  }, [patterns]);

  const severities = ["all", "low", "medium", "high", "critical"];

  const filtered = patterns.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      (p.category ?? "uncategorized") === selectedCategory;

    const matchesSeverity =
      selectedSeverity === "all" ||
      (p.severity ?? "medium") === selectedSeverity;

    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-100 border-red-500 text-red-700";
      case "high":
        return "bg-orange-100 border-orange-500 text-orange-700";
      case "medium":
        return "bg-yellow-100 border-yellow-500 text-yellow-700";
      case "low":
      default:
        return "bg-green-100 border-green-500 text-green-700";
    }
  };

  const getCategoryColor = (category?: string) => {
    switch ((category ?? "other").toLowerCase()) {
      case "emotional":
        return "bg-red-50 text-red-800";
      case "logical":
        return "bg-blue-50 text-blue-800";
      case "authority":
        return "bg-purple-50 text-purple-800";
      case "consensus":
        return "bg-green-50 text-green-800";
      case "framing":
        return "bg-yellow-50 text-yellow-800";
      case "distraction":
        return "bg-gray-50 text-gray-800";
      default:
        return "bg-gray-50 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Manipulation Pattern Taxonomy
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Expert-identified semantic patterns used to bypass critical thinking and manipulate
            audiences. Browse, filter, and then apply them in the Analyzer.
          </p>

          {/* Filters */}
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patterns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "all"
                      ? "All Categories"
                      : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {severities.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev === "all"
                      ? "All Severities"
                      : sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Showing {filtered.length} of {patterns.length} patterns
          </div>
        </div>

        {/* Pattern Grid */}
        <div className="grid gap-6">
          {filtered.map((pattern) => (
            <div
              key={pattern.id}
              className={`p-6 rounded-lg shadow-sm border-l-4 ${getSeverityColor(
                pattern.severity
              )} bg-white`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {pattern.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                        pattern.category
                      )}`}
                    >
                      {pattern.category ?? "Other"}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(
                        pattern.severity
                      )}`}
                    >
                      {pattern.severity ?? "medium"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                      {Math.round((pattern.detection_confidence ?? 0.7) * 100)}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{pattern.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    Semantic Indicators:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(pattern.semantic_indicators ?? []).map((indicator, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        “{indicator}”
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    Context Clues:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {(pattern.context_clues ?? []).map((clue, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                      >
                        {clue}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {pattern.psychological_mechanism && (
                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    Psychological Mechanism:
                  </h4>
                  <p className="text-sm text-gray-600 italic">
                    {pattern.psychological_mechanism}
                  </p>
                </div>
              )}

              {(pattern.examples ?? []).length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">
                    Examples:
                  </h4>
                  <div className="space-y-1">
                    {(pattern.examples ?? []).map((example, i) => (
                      <blockquote
                        key={i}
                        className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3"
                      >
                        “{example}”
                      </blockquote>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No patterns found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BullshitPatternViewer;
