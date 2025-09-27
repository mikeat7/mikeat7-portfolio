import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/pages/educate/bullshit-patterns.tsx
import { useMemo, useState } from "react";
import { ArrowLeft, Search, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
// If your JSON path differs, adjust the import:
import patternsData from "@/data/manipulation-patterns-comprehensive.json";
const BullshitPatternViewer = () => {
    const navigate = useNavigate();
    const patterns = patternsData.filter(Boolean);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedSeverity, setSelectedSeverity] = useState("all");
    const categories = useMemo(() => {
        const set = new Set();
        patterns.forEach((p) => set.add(p.category ?? "uncategorized"));
        return ["all", ...Array.from(set)];
    }, [patterns]);
    const severities = ["all", "low", "medium", "high", "critical"];
    const filtered = patterns.filter((p) => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === "all" ||
            (p.category ?? "uncategorized") === selectedCategory;
        const matchesSeverity = selectedSeverity === "all" ||
            (p.severity ?? "medium") === selectedSeverity;
        return matchesSearch && matchesCategory && matchesSeverity;
    });
    const getSeverityColor = (severity) => {
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
    const getCategoryColor = (category) => {
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
    return (_jsx("div", { className: "min-h-screen bg-gray-50 py-8", children: _jsxs("div", { className: "max-w-6xl mx-auto px-4", children: [_jsxs("button", { onClick: () => navigate(-1), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back"] }), _jsxs("div", { className: "mb-8", children: [_jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Manipulation Pattern Taxonomy" }), _jsx("p", { className: "text-lg text-gray-600 mb-6", children: "Expert-identified semantic patterns used to bypass critical thinking and manipulate audiences. Browse, filter, and then apply them in the Analyzer." }), _jsx("div", { className: "bg-white p-6 rounded-lg shadow-sm mb-6", children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "relative", children: [_jsx(Search, { className: "w-5 h-5 absolute left-3 top-3 text-gray-400" }), _jsx("input", { type: "text", placeholder: "Search patterns...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" })] }), _jsx("select", { value: selectedCategory, onChange: (e) => setSelectedCategory(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400", children: categories.map((cat) => (_jsx("option", { value: cat, children: cat === "all"
                                                ? "All Categories"
                                                : cat.charAt(0).toUpperCase() + cat.slice(1) }, cat))) }), _jsx("select", { value: selectedSeverity, onChange: (e) => setSelectedSeverity(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400", children: severities.map((sev) => (_jsx("option", { value: sev, children: sev === "all"
                                                ? "All Severities"
                                                : sev.charAt(0).toUpperCase() + sev.slice(1) }, sev))) })] }) }), _jsxs("div", { className: "text-sm text-gray-600 mb-4", children: ["Showing ", filtered.length, " of ", patterns.length, " patterns"] })] }), _jsx("div", { className: "grid gap-6", children: filtered.map((pattern) => (_jsxs("div", { className: `p-6 rounded-lg shadow-sm border-l-4 ${getSeverityColor(pattern.severity)} bg-white`, children: [_jsx("div", { className: "flex items-start justify-between mb-4", children: _jsxs("div", { children: [_jsx("h2", { className: "text-xl font-semibold text-gray-900 mb-2", children: pattern.name }), _jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pattern.category)}`, children: pattern.category ?? "Other" }), _jsx("span", { className: `px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(pattern.severity)}`, children: pattern.severity ?? "medium" }), _jsxs("span", { className: "px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800", children: [Math.round((pattern.detection_confidence ?? 0.7) * 100), "% confidence"] })] })] }) }), _jsx("p", { className: "text-gray-700 mb-4", children: pattern.description }), _jsxs("div", { className: "grid md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-sm text-gray-800 mb-2", children: "Semantic Indicators:" }), _jsx("div", { className: "flex flex-wrap gap-1", children: (pattern.semantic_indicators ?? []).map((indicator, i) => (_jsxs("span", { className: "px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded", children: ["\u201C", indicator, "\u201D"] }, i))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-sm text-gray-800 mb-2", children: "Context Clues:" }), _jsx("div", { className: "flex flex-wrap gap-1", children: (pattern.context_clues ?? []).map((clue, i) => (_jsx("span", { className: "px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded", children: clue }, i))) })] })] }), pattern.psychological_mechanism && (_jsxs("div", { className: "mb-4", children: [_jsx("h4", { className: "font-semibold text-sm text-gray-800 mb-2", children: "Psychological Mechanism:" }), _jsx("p", { className: "text-sm text-gray-600 italic", children: pattern.psychological_mechanism })] })), (pattern.examples ?? []).length > 0 && (_jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-sm text-gray-800 mb-2", children: "Examples:" }), _jsx("div", { className: "space-y-1", children: (pattern.examples ?? []).map((example, i) => (_jsxs("blockquote", { className: "text-sm text-gray-600 border-l-2 border-gray-300 pl-3", children: ["\u201C", example, "\u201D"] }, i))) })] }))] }, pattern.id))) }), filtered.length === 0 && (_jsxs("div", { className: "text-center py-12", children: [_jsx(Filter, { className: "w-12 h-12 text-gray-400 mx-auto mb-4" }), _jsx("h3", { className: "text-lg font-semibold text-gray-600 mb-2", children: "No patterns found" }), _jsx("p", { className: "text-gray-500", children: "Try adjusting your search or filter criteria." })] }))] }) }));
};
export default BullshitPatternViewer;
