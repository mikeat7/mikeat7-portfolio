// src/pages/educate/bullshit-patterns.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Search, Filter, Info } from 'lucide-react';
import manipulationPatterns from '@/data/manipulation-patterns-comprehensive.json';

const BullshitPatternViewer: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  const categories = ['all', ...new Set(manipulationPatterns.map(p => p.category))];
  const severities = ['all', 'low', 'medium', 'high', 'critical'];

  const filteredPatterns = manipulationPatterns.filter(pattern => {
    const matchesSearch =
      pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pattern.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || pattern.category === selectedCategory;
    const matchesSeverity = selectedSeverity === 'all' || pattern.severity === selectedSeverity;
    return matchesSearch && matchesCategory && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 border-red-500 text-red-700';
      case 'high': return 'bg-orange-100 border-orange-500 text-orange-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default: return 'bg-green-100 border-green-500 text-green-700';
    }
  };

  const getCategoryColor = (category: string) => {
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
    <div className="min-h-screen bg-[#e9eef5] py-8">
      <div className="max-w-6xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm text-slate-700 hover:text-slate-900 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>

        <div
          className="rounded-3xl p-8"
          style={{
            background: "#e9eef5",
            boxShadow:
              "9px 9px 18px rgba(163,177,198,0.6), -9px -9px 18px rgba(255,255,255,0.9)",
          }}
        >
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Manipulation Pattern Library</h1>
          <p className="text-slate-700 mb-6">
            Expert-identified patterns that bypass critical thinking. Filter to learn; then try them
            on real text in the <Link to="/analyze" className="underline">Analyzer</Link>.
          </p>

          {/* Info banner */}
          <div className="mb-6 p-4 rounded-2xl bg-[#e9eef5]"
               style={{ boxShadow: "inset 6px 6px 12px #cfd6e0, inset -6px -6px 12px #ffffff" }}>
            <div className="flex items-start gap-3 text-sm text-slate-700">
              <Info className="w-4 h-4 mt-0.5" />
              <div>
                <div className="font-medium">How to use this page</div>
                <ul className="list-disc ml-5">
                  <li>
                    Use <strong>Search patterns</strong> to filter this library by name or description.
                  </li>
                  <li>
                    Choose a <strong>Category</strong> and <strong>Severity</strong> to focus on specific traps.
                  </li>
                  <li>
                    Want to scan your own text or a link? Go to <Link to="/analyze" className="underline font-medium">Analyze</Link>.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white/50 p-6 rounded-xl shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patterns (name or description)…"
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
                {['all','low','medium','high','critical'].map(sev => (
                  <option key={sev} value={sev}>
                    {sev === 'all' ? 'All Severities' : sev.charAt(0).toUpperCase() + sev.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-sm text-slate-600 mb-4">
            Showing {filteredPatterns.length} of {manipulationPatterns.length} patterns
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
                    <h2 className="text-xl font-semibold text-slate-900 mb-2">
                      {pattern.name}
                    </h2>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(pattern.category)}`}>
                        {pattern.category}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(pattern.severity)}`}>
                        {pattern.severity}
                      </span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800">
                        {Math.round(pattern.detection_confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-slate-700 mb-4">{pattern.description}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Semantic Indicators:</h4>
                    <div className="flex flex-wrap gap-1">
                      {pattern.semantic_indicators.map((indicator: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          "{indicator}"
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-slate-800 mb-2">Context Clues:</h4>
                    <div className="flex flex-wrap gap-1">
                      {pattern.context_clues.map((clue: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {clue}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-sm text-slate-800 mb-2">Psychological Mechanism:</h4>
                  <p className="text-sm text-slate-600 italic">{pattern.psychological_mechanism}</p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm text-slate-800 mb-2">Examples:</h4>
                  <div className="space-y-1">
                    {pattern.examples.map((example: string, i: number) => (
                      <blockquote key={i} className="text-sm text-slate-600 border-l-2 border-gray-300 pl-3">
                        "{example}"
                      </blockquote>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPatterns.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No patterns found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BullshitPatternViewer;

