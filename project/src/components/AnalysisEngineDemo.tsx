import React, { useState } from 'react';
import { Plus, Trash2, RotateCcw, Settings, Database } from 'lucide-react';
import SimpleAnalysisEngine from './SimpleAnalysisEngine';

const AnalysisEngineDemo: React.FC = () => {
  const [dataItems, setDataItems] = useState<any[]>([
    'URGENT: Crisis threatens everything! Act now before it\'s too late!!!',
    'According to recent studies, this approach shows promising results.',
    'I definitely know this is absolutely the best solution ever created.',
    'This might be worth considering, though more research is needed.',
    { title: 'Sample Object', content: 'This is object data', type: 'structured' }
  ]);
  const [newItem, setNewItem] = useState('');
  const [useOriginalProcessor, setUseOriginalProcessor] = useState(false);
  const [inputType, setInputType] = useState<'text' | 'object'>('text');

  const addItem = () => {
    if (newItem.trim()) {
      let item: any;
      
      if (inputType === 'object') {
        try {
          item = JSON.parse(newItem);
        } catch {
          // If JSON parsing fails, treat as text
          item = newItem.trim();
        }
      } else {
        item = newItem.trim();
      }
      
      setDataItems([...dataItems, item]);
      setNewItem('');
    }
  };

  const removeItem = (index: number) => {
    setDataItems(dataItems.filter((_, i) => i !== index));
  };

  const resetToSamples = () => {
    setDataItems([
      'URGENT: Crisis threatens everything! Act now before it\'s too late!!!',
      'According to recent studies, this approach shows promising results.',
      'I definitely know this is absolutely the best solution ever created.',
      'This might be worth considering, though more research is needed.',
      'AMAZING OPPORTUNITY!!! Click here NOW for GUARANTEED results!',
      'The research suggests correlation, but causation remains unclear.',
      { title: 'Sample Object', content: 'This is object data', type: 'structured' },
      { url: 'https://example.com', credibility: 'low', bias: 'unknown' }
    ]);
  };

  const clearAll = () => {
    setDataItems([]);
  };

  const renderItem = (item: any, index: number) => {
    if (typeof item === 'string') {
      return (
        <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
          <span className="text-xs text-gray-500 mt-1 min-w-[20px]">{index + 1}.</span>
          <div className="flex-1">
            <div className="text-xs text-blue-600 mb-1">Text</div>
            <span className="text-sm">{item}</span>
          </div>
          <button
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
          <span className="text-xs text-gray-500 mt-1 min-w-[20px]">{index + 1}.</span>
          <div className="flex-1">
            <div className="text-xs text-purple-600 mb-1">Object</div>
            <pre className="text-xs text-gray-700 bg-white p-2 rounded border overflow-x-auto">
              {JSON.stringify(item, null, 2)}
            </pre>
          </div>
          <button
            onClick={() => removeItem(index)}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analysis Engine Demo</h1>
        <p className="text-gray-600">Test the simple analysis engine with your own data</p>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Processing Settings
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={useOriginalProcessor}
                onChange={(e) => setUseOriginalProcessor(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="font-medium text-gray-700">Use Original processData Function</span>
                <p className="text-sm text-gray-500">
                  {useOriginalProcessor 
                    ? 'Using your original filter: item && typeof item === "object"' 
                    : 'Using enhanced processing for all data types'
                  }
                </p>
              </div>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Input Type</label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value as 'text' | 'object')}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="object">JSON Object</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Input Section */}
      <div className="bg-white rounded-xl shadow-lg border p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <Database className="w-5 h-5 mr-2" />
          Data Input
        </h2>
        
        {/* Add new item */}
        <div className="space-y-3 mb-4">
          {inputType === 'text' ? (
            <input
              type="text"
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addItem()}
              placeholder="Enter text to analyze (e.g., news headline, social media post, claim)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <textarea
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder='Enter JSON object (e.g., {"title": "Sample", "content": "Object data", "type": "structured"})'
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          )}
          
          <div className="flex space-x-3">
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add {inputType === 'text' ? 'Text' : 'Object'}</span>
            </button>
          </div>
        </div>

        {/* Control buttons */}
        <div className="flex space-x-3 mb-4">
          <button
            onClick={resetToSamples}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset to Samples</span>
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </button>
        </div>

        {/* Current data items */}
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-700">
            Current Data ({dataItems.length} items):
          </h3>
          {dataItems.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
              No data items. Add some content above to begin analysis.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {dataItems.map((item, index) => renderItem(item, index))}
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      <SimpleAnalysisEngine 
        data={dataItems} 
        title="Live Analysis Results"
        useOriginalProcessor={useOriginalProcessor}
      />

      {/* Usage Guide */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border">
        <h3 className="text-lg font-bold text-gray-800 mb-3">How to Use</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Data Processing:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• <strong>Original:</strong> Filters objects only (your function)</li>
              <li>• <strong>Enhanced:</strong> Processes all data types</li>
              <li>• <strong>Text:</strong> Direct string analysis</li>
              <li>• <strong>Objects:</strong> JSON structure analysis</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Analysis Types:</h4>
            <ul className="space-y-1 text-gray-600">
              <li>• <strong>Fallacy:</strong> Manipulation techniques</li>
              <li>• <strong>Confidence:</strong> Certainty levels</li>
              <li>• <strong>Credibility:</strong> Source reliability</li>
              <li>• <strong>Bot:</strong> Automation indicators</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisEngineDemo;