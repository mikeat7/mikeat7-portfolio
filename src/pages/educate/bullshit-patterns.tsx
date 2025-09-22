// src/pages/educate/bullshit-patterns.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';
import manipulationPatterns from '@/data/manipulation-patterns-comprehensive.json';

type Pattern = {
  id: string;
  name: string;
  description: string;
  category?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  detection_confidence?: number;
  semantic_indicators?: string[];
  context_clues?: string[];
  psychological_mechanism?: string;
  examples?: string[];
};

const BullshitPatternViewer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const patterns: Pattern[] = (manipulationPatterns as unknown as Pattern[]) ?? [];

  const categories = ['all', ...Array.from(new Set(patterns.map(p => p.category).filter(Boolean)))] as string[];
  const severities = ['all', 'low', 'medium', 'high', 'critical'];

  const filteredPatterns = patterns.filter(pattern => {
    const matchesSearch =
      pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pattern.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || pattern.severity === selectedSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-700';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default: return 'bg-green-100 border-green-500 text-green-700';
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'emotional': return 'bg-red-50 text-red-800';
      case 'logical': return 'bg-blue-50 text-blue-800';
      case 'authority': return 'bg-purple-50 text-purple-800';
      case 'consensus': return 'bg-green-50 text-green-800';
      case 'framing': return 'bg-yellow-50 text-yellow-800';
      case 'distraction': return 'bg-gray-50 text-gray-800';
      default: return 'bg-gray-50 text-gray-800';
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
            Expert-identified semantic patterns used to bypass critical thinking and manipulate audiences.
            This comprehensive database was built through collaborative analysis by multiple AI systems.
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
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>

              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {severities.map(sev => (
                  <option key={sev} value={sev}>
                    {sev === 'all' ? 'All Severities' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">
            Showing {filteredPatterns.length} of {patterns.length} patterns
          </div>
        </div>

        {/* Pattern Grid */}
        <div className="grid gap-6">
          {filteredPatterns.map((pattern) => (
            <div
              key={pattern.id}
              className={`p-6 rounded-lg shadow-sm border-l-4 ${getSeverityColor(pattern.severity)} bg-white`}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {pattern.name}
                  </h2>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pattern.category)}`}>
                      {pattern.category ?? "uncategorized"}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(pattern.severity)}`}>
                      {pattern.severity ?? "low"}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                      {Math.round((pattern.detection_confidence ?? 0.75) * 100)}% confidence
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{pattern.description}</p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">Semantic Indicators:</h4>
                  <div className="flex flex-wrap gap-1">
                    {(pattern.semantic_indicators ?? []).map((indicator, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        "{indicator}"
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-gray-800 mb-2">Context Clues:</h4>
                  <div className="flex flex-wrap gap-1">
                    {(pattern.context_clues ?? []).map((clue, i) => (
                      <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                        {clue}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-sm text-gray-800 mb-2">Psychological Mechanism:</h4>
                <p className="text-sm text-gray-600 italic">{pattern.psychological_mechanism ?? "—"}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-800 mb-2">Examples:</h4>
                <div className="space-y-1">
                  {(pattern.examples ?? []).map((example, i) => (
                    <blockquote key={i} className="text-sm text-gray-600 border-l-2 border-gray-300 pl-3">
                      "{example}"
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPatterns.length === 0 && (
          <div className="text-center py-

