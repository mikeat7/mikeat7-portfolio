// src/components/TestingSuite.tsx
import React, { useState } from 'react';
import { useVXContext } from '@/context/VXProvider';
import runReflexAnalysis from '@/lib/analysis/runReflexAnalysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { adaptiveLearning } from '@/lib/adaptive/AdaptiveLearningEngine';
import AdaptiveLearningDashboard from '@/components/AdaptiveLearningDashboard';

interface TestSlot {
  id: string;
  label: string;
  text: string;
  results?: any;
  isAnalyzing?: boolean;
}

const INITIAL_TEST_SLOTS: TestSlot[] = [
  {
    id: 'test-1',
    label: 'Test Statement #1',
    text: '',
  },
  {
    id: 'test-2', 
    label: 'Test Statement #2',
    text: '',
  },
  {
    id: 'test-3',
    label: 'Test Statement #3', 
    text: '',
  },
  {
    id: 'test-4',
    label: 'Test Statement #4',
    text: '',
  }
];

const TestingSuite: React.FC = () => {
  const { setReflexFrames } = useVXContext();
  const [testSlots, setTestSlots] = useState<TestSlot[]>(INITIAL_TEST_SLOTS);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [userFeedback, setUserFeedback] = useState<Record<string, string>>({});
  const [testMode, setTestMode] = useState<'normal' | 'learning-test'>('normal');
  const [learningTestResults, setLearningTestResults] = useState<any[]>([]);

  const runSingleTest = async (slotId: string) => {
    const slot = testSlots.find(s => s.id === slotId);
    if (!slot || !slot.text.trim()) return;

    // Update analyzing state
    setTestSlots(prev => prev.map(s => 
      s.id === slotId ? { ...s, isAnalyzing: true } : s
    ));

    try {
      const results = await runReflexAnalysis(slot.text);
      
      const analysis = {
        detectionCount: results.length,
        highConfidenceCount: results.filter(r => r.confidence >= 0.75).length,
        maxConfidence: results.length > 0 ? Math.max(...results.map(r => r.confidence)) : 0,
        hasClusterAlert: results.some(r => r.reflexId === 'cluster-alert'),
        results: results,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setTestSlots(prev => prev.map(s => 
        s.id === slotId ? { ...s, results: analysis, isAnalyzing: false } : s
      ));
    } catch (error) {
      console.error('Test analysis failed:', error);
      setTestSlots(prev => prev.map(s => 
        s.id === slotId ? { ...s, isAnalyzing: false } : s
      ));
    }
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    
    for (const slot of testSlots) {
      if (slot.text.trim()) {
        await runSingleTest(slot.id);
        // Small delay to see progress
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
    
    setIsRunningAll(false);
  };

  const updateSlotText = (slotId: string, text: string) => {
    setTestSlots(prev => prev.map(s => 
      s.id === slotId ? { ...s, text, results: undefined } : s
    ));
  };

  const getResultsSummary = (results: any) => {
    if (!results) return 'No analysis yet';
    
    const { detectionCount, highConfidenceCount, maxConfidence, hasClusterAlert } = results;
    
    if (detectionCount === 0) return '✅ Clean - No manipulation detected';
    if (hasClusterAlert) return '🚨 CLUSTER ALERT - Multiple high-confidence detections';
    if (highConfidenceCount >= 2) return '⚠️ HIGH RISK - Multiple strong detections';
    if (highConfidenceCount >= 1) return '⚠️ MODERATE RISK - Strong detection found';
    if (detectionCount > 0) return '⚠️ LOW RISK - Weak detections only';
    
    return 'Analysis complete';
  };

  const getResultsColor = (results: any) => {
    if (!results) return 'bg-gray-100 text-gray-600 border-gray-300';
    
    const { detectionCount, highConfidenceCount, hasClusterAlert } = results;
    
    if (detectionCount === 0) return 'bg-green-100 text-green-800 border-green-300';
    if (hasClusterAlert || highConfidenceCount >= 2) return 'bg-red-100 text-red-800 border-red-300';
    if (highConfidenceCount >= 1) return 'bg-orange-100 text-orange-800 border-orange-300';
    return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  };

  const logUserFeedback = (slotId: string, feedback: string) => {
    setUserFeedback(prev => ({ ...prev, [slotId]: feedback }));
    
    // SAFETY CHECK: Validate feedback before applying
    if (!isValidFeedback(feedback)) {
      console.warn(`🚨 Invalid feedback rejected: "${feedback}"`);
      return;
    }
    
    // Apply real-time learning to all detected patterns in this slot
    const slot = testSlots.find(s => s.id === slotId);
    if (slot?.results?.results) {
      const beforeAdjustments = slot.results.results.map((r: any) => ({
        reflexId: r.reflexId,
        originalConfidence: r.confidence
      }));
      
      slot.results.results.forEach((result: any) => {
        const adjustedConfidence = adaptiveLearning.adjustConfidence(
          result.reflexId,
          result.confidence,
          feedback,
          slot.text
        );
        
        // Update the result with new confidence
        result.confidence = adjustedConfidence;
      });
      
      // Log the learning event for testing
      const afterAdjustments = slot.results.results.map((r: any) => ({
        reflexId: r.reflexId,
        newConfidence: r.confidence
      }));
      
      setLearningTestResults(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString(),
        slotId,
        feedback,
        before: beforeAdjustments,
        after: afterAdjustments,
        text: slot.text.substring(0, 50) + '...'
      }]);
      
      // Trigger re-render to show updated confidence
      setTestSlots(prev => [...prev]);
      
      console.log(`🧠 Real-time learning applied for ${slotId}: "${feedback}"`);
    }
  };

  // SAFETY FUNCTION: Validate user feedback
  const isValidFeedback = (feedback: string): boolean => {
    const trimmed = feedback.trim().toLowerCase();
    
    // Reject empty or too short feedback
    if (trimmed.length < 3) return false;
    
    // Reject obvious spam/nonsense
    const spamPatterns = [
      /^(.)\1{4,}$/, // Repeated characters (aaaaa)
      /^[^a-z]*$/, // No letters at all
      /fuck|shit|damn/i, // Profanity (basic filter)
      /^(lol|haha|wtf|omg)$/i // Internet slang only
    ];
    
    if (spamPatterns.some(pattern => pattern.test(trimmed))) {
      return false;
    }
    
    // Must contain some meaningful words
    const meaningfulWords = ['wrong', 'correct', 'false', 'true', 'positive', 'negative', 
                            'missed', 'detected', 'should', 'shouldnt', 'agree', 'disagree',
                            'accurate', 'inaccurate', 'right', 'incorrect', 'good', 'bad'];
    
    const hasMeaningfulContent = meaningfulWords.some(word => 
      trimmed.includes(word)
    );
    
    return hasMeaningfulContent;
  };

  // TESTING FUNCTION: Run controlled learning tests
  const runLearningTest = async () => {
    setTestMode('learning-test');
    setLearningTestResults([]);
    
    // Test Case 1: False Positive Correction
    const testSlot1 = testSlots[0];
    if (testSlot1) {
      updateSlotText(testSlot1.id, "Further research is needed to understand climate impacts");
      await new Promise(resolve => setTimeout(resolve, 100));
      await runSingleTest(testSlot1.id);
      await new Promise(resolve => setTimeout(resolve, 100));
      logUserFeedback(testSlot1.id, "false positive - this is legitimate scientific language");
    }
    
    // Test Case 2: Missed Detection
    const testSlot2 = testSlots[1];
    if (testSlot2) {
      updateSlotText(testSlot2.id, "Everyone knows climate change is a hoax perpetrated by scientists");
      await new Promise(resolve => setTimeout(resolve, 100));
      await runSingleTest(testSlot2.id);
      await new Promise(resolve => setTimeout(resolve, 100));
      logUserFeedback(testSlot2.id, "missed detection - this should trigger conspiracy and consensus manipulation");
    }
    
    // Test Case 3: Correct Detection
    const testSlot3 = testSlots[2];
    if (testSlot3) {
      updateSlotText(testSlot3.id, "Act now before it's too late - this crisis demands immediate action");
      await new Promise(resolve => setTimeout(resolve, 100));
      await runSingleTest(testSlot3.id);
      await new Promise(resolve => setTimeout(resolve, 100));
      logUserFeedback(testSlot3.id, "correct detection - this is clearly manipulative urgency language");
    }
    
    console.log("🧪 Learning test sequence completed");
  };

  // SAFETY FUNCTION: Reset learning if needed
  const resetAllLearning = () => {
    if (confirm("Reset all adaptive learning? This will clear all user feedback adjustments.")) {
      // Clear localStorage
      localStorage.removeItem('vx-adaptive-learning');
      // Reset learning results
      setLearningTestResults([]);
      // Reload page to reset system
      window.location.reload();
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Interactive Language Testing Laboratory</h1>
        <p className="text-gray-600 mb-6">
          Experiment with different phrasings to see how language choices affect manipulation detection. 
          Perfect for learning to communicate clearly without triggering false alarms.
        </p>
        
        {/* LEARNING TEST CONTROLS */}
        <div className="bg-green-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-green-800 mb-2">🧪 Adaptive Learning Testing</h3>
          <div className="flex justify-center gap-4 mb-2">
            <Button 
              onClick={runLearningTest}
              disabled={testMode === 'learning-test'}
              variant="outline"
              size="sm"
            >
              {testMode === 'learning-test' ? 'Running Learning Test...' : 'Test Adaptive Learning'}
            </Button>
            <Button 
              onClick={resetAllLearning}
              variant="outline"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              Reset All Learning
            </Button>
          </div>
          <p className="text-sm text-green-700">
            Run controlled tests to verify the system learns from feedback safely and effectively.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">💡 Educational Examples to Try:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p><strong>Direct Claim:</strong> "Climate change is caused by human activities"</p>
            <p><strong>Authority Appeal:</strong> "Experts agree that climate change is caused by human activities"</p>
            <p><strong>Scientific Approach:</strong> "Studies suggest human activities contribute to climate change"</p>
            <p><strong>Methodology Language:</strong> "More research is needed to understand climate change causes"</p>
          </div>
        </div>
        
        <Button 
          onClick={runAllTests}
          disabled={isRunningAll || !testSlots.some(s => s.text.trim())}
          className="px-8 py-2 mb-6"
        >
          {isRunningAll ? 'Running All Tests...' : 'Run All Tests'}
        </Button>
      </div>

      {/* LEARNING TEST RESULTS */}
      {learningTestResults.length > 0 && (
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <h3 className="font-semibold text-green-800 mb-3">🧪 Learning Test Results</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {learningTestResults.map((result, i) => (
                <div key={i} className="text-xs bg-white p-2 rounded border">
                  <div className="font-medium">{result.timestamp} - {result.slotId}</div>
                  <div className="text-gray-600">Text: {result.text}</div>
                  <div className="text-blue-600">Feedback: "{result.feedback}"</div>
                  <div className="text-green-600">
                    Adjustments: {result.before.map((b: any, j: number) => {
                      const after = result.after[j];
                      const change = after.newConfidence - b.originalConfidence;
                      return `${b.reflexId}: ${b.originalConfidence.toFixed(2)} → ${after.newConfidence.toFixed(2)} (${change >= 0 ? '+' : ''}${change.toFixed(3)})`;
                    }).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {testSlots.map(slot => (
          <Card key={slot.id} className={`border-l-4 ${getResultsColor(slot.results)}`}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">{slot.label}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => runSingleTest(slot.id)}
                  disabled={!slot.text.trim() || slot.isAnalyzing}
                >
                  {slot.isAnalyzing ? 'Testing...' : 'Test'}
                </Button>
              </div>
              
              <Textarea
                value={slot.text}
                onChange={(e) => updateSlotText(slot.id, e.target.value)}
                placeholder="Paste your statement here to test for manipulation patterns..."
                className="mb-4 min-h-20"
              />
              
              {slot.results && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge className={getResultsColor(slot.results)}>
                      {getResultsSummary(slot.results)}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      Analyzed at {slot.results.timestamp}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    <strong>Detection Summary:</strong> {slot.results.detectionCount} total detections, 
                    {slot.results.highConfidenceCount} high-confidence, 
                    max confidence: {Math.round(slot.results.maxConfidence * 100)}%
                  </div>
                  
                  {slot.results.results.length > 0 && (
                    <div className="space-y-2">
                      <strong className="text-sm">Detected Patterns:</strong>
                      {slot.results.results.slice(0, 3).map((result: any, i: number) => (
                        <div key={i} className="text-xs bg-gray-50 p-2 rounded">
                          <strong>{result.reflexLabel}</strong> ({Math.round(result.confidence * 100)}%)
                          <br />
                          <span className="text-gray-600">{result.rationale?.split('\n')[0]}</span>
                        </div>
                      ))}
                      {slot.results.results.length > 3 && (
                        <div className="text-xs text-gray-500">
                          ...and {slot.results.results.length - 3} more detections
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Disagree with this analysis? Provide specific feedback:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g., 'false positive - this is legitimate science' or 'missed manipulation'"
                        className="flex-1 text-xs px-2 py-1 border rounded"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const feedback = e.currentTarget.value.trim();
                            if (feedback) {
                              logUserFeedback(slot.id, feedback);
                              e.currentTarget.value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs"
                        onClick={(e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input.value.trim()) {
                            const feedback = input.value.trim();
                            if (isValidFeedback(feedback)) {
                              logUserFeedback(slot.id, feedback);
                            }
                            input.value = '';
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500 mt-8">
        <p>💡 <strong>Pro Tip:</strong> Try the same claim with different phrasings to see how language choices affect detection.</p>
        <p>🎯 <strong>Goal:</strong> Learn to communicate clearly and persuasively without triggering manipulation alerts.</p>
        <p>🧠 <strong>Real-time Learning:</strong> Your feedback automatically improves the system's accuracy for future analyses.</p>
        <p>🛡️ <strong>Safety:</strong> Feedback is validated to prevent system degradation from inappropriate input.</p>
      </div>
      
      <AdaptiveLearningDashboard />
    </div>
  );
};

export default TestingSuite;