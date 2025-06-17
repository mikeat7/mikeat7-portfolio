import React, { useState } from 'react';
import { Shield, Brain, Target, Zap, Users, Trophy, BookOpen, AlertTriangle, Search } from 'lucide-react';
import AnalysisEngine from './components/AnalysisEngine';

const TruthSerumArchitecture = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analysisDemo, setAnalysisDemo] = useState(false);

  const architectureComponents = {
    overview: {
      title: "System Overview",
      icon: <Brain className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-4">Truth Serum + Clarity Armor Platform</h3>
            <p className="text-gray-700 mb-4">
              A dual-layer critical thinking enhancement platform that analyzes both incoming content for manipulation 
              and outgoing AI responses for honesty calibration.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded border-l-4 border-indigo-500">
                <h4 className="font-semibold text-indigo-700">Clarity Armor (Input Layer)</h4>
                <p className="text-sm text-gray-600">Detects 60+ rhetorical fallacies and manipulation techniques in user-provided content</p>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-700">Truth Serum (Output Layer)</h4>
                <p className="text-sm text-gray-600">Ensures AI responses include explicit confidence levels and uncertainty flags</p>
              </div>
              <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-700">Source Analysis (NEW)</h4>
                <p className="text-sm text-gray-600">Evaluates source credibility, bias, and factual reliability</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow border">
              <Target className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-semibold mb-2">Core Analysis Engine</h4>
              <p className="text-sm text-gray-600">Real-time content processing with fallacy detection and confidence calibration</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <Users className="w-8 h-8 text-purple-500 mb-3" />
              <h4 className="font-semibold mb-2">Educational Platform</h4>
              <p className="text-sm text-gray-600">Interactive training modules and bias awareness development</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow border">
              <Trophy className="w-8 h-8 text-yellow-500 mb-3" />
              <h4 className="font-semibold mb-2">Gamification Layer</h4>
              <p className="text-sm text-gray-600">Progress tracking, challenges, and critical thinking skill development</p>
            </div>
          </div>
        </div>
      )
    },

    analysis: {
      title: "Live Analysis",
      icon: <Search className="w-6 h-6" />,
      content: <AnalysisEngine />
    },
    
    frontend: {
      title: "Frontend Architecture",
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">React + TypeScript Frontend</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Core Components Structure:</h4>
            <div className="font-mono text-sm space-y-1 text-gray-700">
              <div>📁 src/</div>
              <div className="ml-4">📁 components/</div>
              <div className="ml-8">📄 AnalysisEngine.tsx - Main analysis interface</div>
              <div className="ml-8">📄 ClarityArmor.tsx - Fallacy detection display</div>
              <div className="ml-8">📄 TruthSerum.tsx - AI confidence calibration</div>
              <div className="ml-8">📄 SourceCredibility.tsx - Source analysis component</div>
              <div className="ml-8">📄 EducationHub.tsx - Training modules</div>
              <div className="ml-8">📄 VoiceInterface.tsx - Speech recognition</div>
              <div className="ml-4">📁 hooks/</div>
              <div className="ml-8">📄 useAnalysis.ts - Content analysis logic</div>
              <div className="ml-8">📄 useWebScraper.ts - URL content fetching</div>
              <div className="ml-8">📄 useProgress.ts - User progress tracking</div>
              <div className="ml-4">📁 services/</div>
              <div className="ml-8">📄 fallacyDetection.ts - Manipulation analysis</div>
              <div className="ml-8">📄 confidenceCalibration.ts - AI honesty scoring</div>
              <div className="ml-8">📄 sourceCredibility.ts - Source analysis service</div>
              <div className="ml-8">📄 contentFetcher.ts - Web scraping service</div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Key Features</h4>
              <ul className="text-sm space-y-1">
                <li>• Real-time content analysis</li>
                <li>• Voice command interface</li>
                <li>• Interactive fallacy highlighting</li>
                <li>• Source credibility scoring</li>
                <li>• Progress visualization</li>
                <li>• Mobile-responsive design</li>
                <li>• Dark/light mode support</li>
              </ul>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">UI/UX Principles</h4>
              <ul className="text-sm space-y-1">
                <li>• Educational over prescriptive</li>
                <li>• Confidence levels color-coded</li>
                <li>• Gradual complexity increase</li>
                <li>• Collaborative features</li>
                <li>• Accessibility first</li>
                <li>• Performance optimized</li>
              </ul>
            </div>
          </div>
        </div>
      )
    },

    backend: {
      title: "Backend Services",
      icon: <Zap className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Node.js + Express Backend</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-indigo-700">Clarity Armor Engine</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded">
                  <strong>Fallacy Detection API</strong>
                  <p className="text-gray-600">60+ pattern matchers for rhetorical manipulation</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <strong>Bias Analysis Service</strong>
                  <p className="text-gray-600">Source credibility and political lean detection</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <strong>Emotional Manipulation Scanner</strong>
                  <p className="text-gray-600">Fear appeals, false urgency, gaslighting detection</p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-yellow-700">Truth Serum Engine</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded">
                  <strong>Confidence Calibration API</strong>
                  <p className="text-gray-600">AI response certainty scoring and flagging</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <strong>Knowledge Classification</strong>
                  <p className="text-gray-600">Known/Speculated/Unknown content categorization</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <strong>Uncertainty Detection</strong>
                  <p className="text-gray-600">Overconfidence and hedging pattern analysis</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-700">Source Analysis Engine</h4>
              <div className="space-y-2 text-sm">
                <div className="bg-white p-2 rounded">
                  <strong>Credibility Scoring API</strong>
                  <p className="text-gray-600">Domain reputation and reliability assessment</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <strong>Bias Detection Service</strong>
                  <p className="text-gray-600">Political lean and editorial stance analysis</p>
                </div>
                <div className="bg-white p-2 rounded">
                  <strong>Factual Rating System</strong>
                  <p className="text-gray-600">Historical accuracy and fact-checking integration</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Additional Services</h4>
            <div className="grid md:grid-cols-4 gap-3 text-sm">
              <div className="bg-white p-3 rounded">
                <strong>Web Scraping Service</strong>
                <p className="text-gray-600">Fetch and parse content from URLs</p>
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Progress Tracking</strong>
                <p className="text-gray-600">User skill development analytics</p>
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Content Database</strong>
                <p className="text-gray-600">Training examples and quiz materials</p>
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Media Bias API</strong>
                <p className="text-gray-600">Third-party fact-checking integration</p>
              </div>
            </div>
          </div>
        </div>
      )
    },

    data: {
      title: "Data Flow",
      icon: <Shield className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Analysis Pipeline</h3>
          
          <div className="relative">
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="bg-blue-100 p-4 rounded-lg text-center flex-1">
                <h4 className="font-semibold">Input</h4>
                <p className="text-sm">Text/URL/Voice</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="bg-yellow-100 p-4 rounded-lg text-center flex-1">
                <h4 className="font-semibold">Content Fetch</h4>
                <p className="text-sm">Scrape/Parse</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="bg-indigo-100 p-4 rounded-lg text-center flex-1">
                <h4 className="font-semibold">Clarity Armor</h4>
                <p className="text-sm">Fallacy Detection</p>
              </div>
            </div>
            
            <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 mt-4">
              <div className="bg-yellow-100 p-4 rounded-lg text-center flex-1">
                <h4 className="font-semibold">Truth Serum</h4>
                <p className="text-sm">AI Analysis</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="bg-blue-100 p-4 rounded-lg text-center flex-1">
                <h4 className="font-semibold">Source Analysis</h4>
                <p className="text-sm">Credibility Check</p>
              </div>
              <div className="text-2xl">→</div>
              <div className="bg-purple-100 p-4 rounded-lg text-center flex-1">
                <h4 className="font-semibold">Education</h4>
                <p className="text-sm">Learning Prompts</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3">Data Storage (In-Memory)</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Session Data:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• User progress scores</li>
                  <li>• Analysis history</li>
                  <li>• Bias vulnerability profile</li>
                  <li>• Educational achievements</li>
                </ul>
              </div>
              <div>
                <strong>Analysis Cache:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Fetched content</li>
                  <li>• Fallacy detection results</li>
                  <li>• Confidence calibrations</li>
                  <li>• Source credibility scores</li>
                  <li>• Educational content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    },

    features: {
      title: "Feature Modules",
      icon: <BookOpen className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-bold">Core Features Implementation</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-blue-700">Analysis Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <div>
                    <strong>Real-time URL Analysis</strong>
                    <p className="text-gray-600">Fetch and analyze web content automatically</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <div>
                    <strong>Source Credibility Scoring</strong>
                    <p className="text-gray-600">Evaluate domain reputation and factual reliability</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <div>
                    <strong>Voice Command Interface</strong>
                    <p className="text-gray-600">"Find articles on X and analyze them"</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2"></span>
                  <div>
                    <strong>Batch Content Processing</strong>
                    <p className="text-gray-600">Analyze multiple sources simultaneously</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-3 text-yellow-700">Educational Features</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                  <div>
                    <strong>Daily Fallacy Challenges</strong>
                    <p className="text-gray-600">Progressive skill-building exercises</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                  <div>
                    <strong>Bias Vulnerability Profiling</strong>
                    <p className="text-gray-600">Personal manipulation susceptibility analysis</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                  <div>
                    <strong>Source Literacy Training</strong>
                    <p className="text-gray-600">Learn to evaluate credibility and bias</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2 mr-2"></span>
                  <div>
                    <strong>Collaborative Fact-Checking</strong>
                    <p className="text-gray-600">Group analysis and peer learning</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-yellow-700">Democracy Fitness Mode</h4>
            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <div className="bg-white p-3 rounded">
                <strong>Election Analysis</strong>
                <p className="text-gray-600">Campaign rhetoric vs. actual policy</p>
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Source Diversity Tracking</strong>
                <p className="text-gray-600">Political bias balance monitoring</p>
              </div>
              <div className="bg-white p-3 rounded">
                <strong>Debate Fact-Checking</strong>
                <p className="text-gray-600">Real-time political speech analysis</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-3 text-purple-700">Gamification System</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Progress Tracking:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Bullshit Detection Rank</li>
                  <li>• Weekly accuracy scores</li>
                  <li>• Skill improvement metrics</li>
                  <li>• Achievement badges</li>
                </ul>
              </div>
              <div>
                <strong>Social Features:</strong>
                <ul className="ml-4 mt-1 space-y-1">
                  <li>• Friend challenge system</li>
                  <li>• Community leaderboards</li>
                  <li>• Group analysis projects</li>
                  <li>• Expert validation events</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Truth Serum + Clarity Armor</h1>
          <p className="text-xl text-gray-600 mb-4">Technical Architecture for Critical Thinking Platform</p>
          <div className="inline-flex items-center bg-blue-100 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-blue-800">Built on Bolt.new • Now with Source Analysis</span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center mb-6 bg-white rounded-xl p-2 shadow-sm border">
          {Object.entries(architectureComponents).map(([key, component]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === key 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {component.icon}
              <span className="font-medium">{component.title}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-xl shadow-lg border p-8 mb-8">
          {architectureComponents[activeTab].content}
        </div>

        {/* Demo Analysis Button */}
        {activeTab !== 'analysis' && (
          <div className="text-center">
            <button
              onClick={() => setAnalysisDemo(!analysisDemo)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              {analysisDemo ? 'Hide Demo' : 'Show Analysis Demo'}
            </button>
            
            {analysisDemo && (
              <div className="mt-8 bg-white rounded-xl shadow-lg border p-8 text-left">
                <h3 className="text-2xl font-bold mb-6 text-center">Sample Analysis Output</h3>
                
                {/* Color Legend */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Color Legend</h4>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong className="text-indigo-700">🛡️ Clarity Armor (Fallacy Detection)</strong>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Critical Risk</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>Moderate Risk</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Low Risk</div>
                      </div>
                    </div>
                    <div>
                      <strong className="text-yellow-700">🎯 Truth Serum (Confidence)</strong>
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>Known Facts</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>Speculation</div>
                        <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>Unknown/Uncertain</div>
                      </div>
                    </div>
                    <div>
                      <strong className="text-blue-700">🔍 Source Analysis</strong>
                      <div className="mt-1 space-y-2">
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">Credibility Score:</div>
                          <div className="flex items-center"><span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>High Credibility (80%+)</div>
                          <div className="flex items-center"><span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>Mixed Credibility (50-79%)</div>
                          <div className="flex items-center"><span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>{"Low Credibility (<50%)"}</div>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-gray-600 mb-1">Political Bias:</div>
                          <div className="flex items-center"><span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>Bias Indicator (All Types)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="bg-indigo-50 p-6 rounded-xl border-l-4 border-indigo-500">
                    <h4 className="font-semibold text-indigo-700 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Clarity Armor Detected:
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-red-500 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>Appeal to Fear:</strong> "Crisis threatens everything"
                          <div className="text-xs text-red-600 mt-1">Critical Risk - Bypasses rational thinking</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>False Urgency:</strong> "Act now or lose forever"
                          <div className="text-xs text-yellow-600 mt-1">Moderate Risk - Creates artificial pressure</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>Cherry-Picking:</strong> Selective data presentation
                          <div className="text-xs text-green-600 mt-1">Low Risk - Missing context</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 p-6 rounded-xl border-l-4 border-yellow-500">
                    <h4 className="font-semibold text-yellow-700 mb-4 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2" />
                      Truth Serum Analysis:
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>Known:</strong> Policy positions from official sources
                          <div className="text-xs text-green-600 mt-1">High confidence - Verifiable facts</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>Speculating:</strong> Electoral predictions based on polls
                          <div className="text-xs text-yellow-600 mt-1">Medium confidence - Educated guesses</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-red-500 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>Unknown:</strong> How policies would actually be implemented
                          <div className="text-xs text-red-600 mt-1">Low confidence - Uncertain outcomes</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                    <h4 className="font-semibold text-blue-700 mb-4 flex items-center">
                      <Shield className="w-5 h-5 mr-2" />
                      Source Analysis:
                    </h4>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-yellow-400 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>Credibility:</strong> 72% (Mixed reliability)
                          <div className="text-xs text-yellow-600 mt-1">Moderate credibility - Cross-reference recommended</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-blue-500 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>Bias:</strong> Center-left editorial stance
                          <div className="text-xs text-blue-600 mt-1">Political lean detected - Consider multiple perspectives</div>
                        </div>
                      </li>
                      <li className="flex items-start">
                        <span className="w-3 h-3 bg-green-500 rounded-full mt-1 mr-3"></span>
                        <div>
                          <strong>Factual:</strong> Mostly factual reporting
                          <div className="text-xs text-green-600 mt-1">Good track record - Generally reliable</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 bg-blue-50 p-6 rounded-xl border-l-4 border-blue-500">
                  <h4 className="font-semibold text-blue-700 mb-3 flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Learning Opportunity:
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Notice how this article uses emotional manipulation to bypass critical thinking. 
                    Try asking: "What specific evidence supports these claims?" and "What alternative explanations exist?"
                    Always cross-reference with multiple sources and look for primary data.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TruthSerumArchitecture;