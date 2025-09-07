import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Codesandbox as Sandbox, CheckCircle, AlertTriangle, Lightbulb, Target } from 'lucide-react';

import { advancedAssessment } from '@/lib/assessment/AdvancedAssessmentEngine';

const EpistemicSandboxLesson: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentExercise, setCurrentExercise] = useState(0);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [assessmentResults, setAssessmentResults] = useState<Record<string, any>>({});
  const [isAssessing, setIsAssessing] = useState<Record<string, boolean>>({});

  const exercises = [
    {
      id: 'confidence-calibration',
      title: 'Confidence Calibration Exercise',
      description: 'Practice expressing appropriate levels of confidence in your knowledge.',
      prompt: 'You\'re asked: "What percentage of the Earth\'s surface is covered by water?" How would you respond with proper epistemic humility?',
      goodResponse: 'I believe it\'s around 70%, but I\'m not completely certain. I know it\'s the majority of the surface, and I recall learning it was roughly two-thirds to three-quarters, so 70% seems reasonable, but I could be off by several percentage points.',
      feedback: 'This response shows good calibration by expressing reasonable confidence while acknowledging uncertainty about precision.'
    },
    {
      id: 'source-evaluation',
      title: 'Source Evaluation Practice',
      description: 'Learn to critically evaluate information sources and claims.',
      prompt: 'Someone shares an article titled "Scientists Discover Miracle Cure for Aging" from a website called "HealthTruthNews.com". How do you evaluate this claim?',
      goodResponse: 'This raises several red flags: "miracle cure" is sensational language, the source isn\'t a recognized scientific publication, and extraordinary claims about aging would require extraordinary evidence from peer-reviewed research. I\'d want to see the original study, check if it\'s been replicated, and look for coverage in reputable scientific journals.',
      feedback: 'Excellent critical thinking! You identified sensational language, questioned the source, and outlined proper verification steps.'
    },
    {
      id: 'uncertainty-expression',
      title: 'Expressing Uncertainty Appropriately',
      description: 'Practice communicating what you don\'t know without appearing ignorant.',
      prompt: 'In a discussion about quantum physics, someone asks you to explain quantum entanglement. You have only basic knowledge. How do you respond?',
      goodResponse: 'I have a basic understanding that quantum entanglement involves particles that remain connected in some way even when separated, but I don\'t understand the mechanics well enough to explain it accurately. This is a complex topic that requires deep physics knowledge that I don\'t have. I\'d recommend consulting a physics textbook or expert for a proper explanation.',
      feedback: 'Perfect! You acknowledged your limitations while still sharing what you do know, and directed them to better sources.'
    },
    {
      id: 'bias-recognition',
      title: 'Recognizing Your Own Biases',
      description: 'Practice identifying when your own biases might be affecting your judgment.',
      prompt: 'You strongly support renewable energy. You see a study claiming solar panels are less efficient than reported. Your first instinct is to dismiss it. How do you handle this?',
      goodResponse: 'I notice my immediate reaction is to dismiss this because it conflicts with my views on renewable energy. This suggests my bias might be affecting my judgment. I should examine the study objectively: Who conducted it? What\'s their methodology? Is it peer-reviewed? Are there conflicts of interest? Even if I support renewable energy, I need to evaluate evidence fairly.',
      feedback: 'Excellent self-awareness! Recognizing your bias is the first step to overcoming it and evaluating evidence objectively.'
    },
    {
      id: 'nuanced-thinking',
      title: 'Embracing Nuance and Complexity',
      description: 'Practice avoiding oversimplification of complex issues.',
      prompt: 'Someone says "Social media is destroying society." How do you respond with nuanced thinking?',
      goodResponse: 'Social media has both positive and negative effects that vary by platform, usage patterns, and individual circumstances. It can facilitate connection and information sharing, but also spread misinformation and create addiction-like behaviors. The impact likely depends on how it\'s used, by whom, and in what context. Rather than being wholly good or bad, it\'s a complex tool with mixed consequences.',
      feedback: 'Great nuanced thinking! You avoided binary thinking and recognized the complexity of the issue while acknowledging multiple perspectives.'
    }
  ];

  const handleResponseSubmit = async (exerciseId: string, response: string) => {
    if (!response.trim()) return;
    
    setIsAssessing(prev => ({ ...prev, [exerciseId]: true }));
    setUserResponses(prev => ({ ...prev, [exerciseId]: response }));
    
    try {
      // Get the exercise scenario for context
      const exercise = exercises.find(ex => ex.id === exerciseId);
      const scenario = exercise ? exercise.prompt : '';
      
      // Run real epistemic humility assessment
      const result = await advancedAssessment.assessEpistemicHumility(response, scenario);
      setAssessmentResults(prev => ({ ...prev, [exerciseId]: result }));
      setShowFeedback(prev => ({ ...prev, [exerciseId]: true }));
    } catch (error) {
      console.error('Assessment failed:', error);
      // Fallback to showing expert analysis
      setShowFeedback(prev => ({ ...prev, [exerciseId]: true }));
    } finally {
      setIsAssessing(prev => ({ ...prev, [exerciseId]: false }));
    }
  };

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['epistemic-sandbox'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

  const currentEx = exercises[currentExercise];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={() => navigate('/educate')}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Education Hub
        </button>

       

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-4">
            <Sandbox className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Epistemic Sandbox
          </h1>
          <p className="text-lg text-gray-600">
            Safe environment to practice critical thinking skills without consequences
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Exercise Progress</span>
            <span>{currentExercise + 1} of {exercises.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentExercise + 1) / exercises.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Exercise Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              {currentEx.title}
            </h2>
          </div>

          <p className="text-gray-600 mb-6">{currentEx.description}</p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Scenario:</h3>
            <p className="text-blue-700">{currentEx.prompt}</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Your Response:
            </label>
            <textarea
              className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none"
              rows={6}
              placeholder="Take your time to craft a thoughtful response that demonstrates epistemic humility..."
              value={userResponses[currentEx.id] || ''}
              onChange={(e) => setUserResponses(prev => ({ ...prev, [currentEx.id]: e.target.value }))}
            />
          </div>

          <button
            onClick={() => handleResponseSubmit(currentEx.id, userResponses[currentEx.id] || '')}
            disabled={!userResponses[currentEx.id]?.trim()}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isAssessing[currentEx.id] ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              'Submit for AI Assessment'
            )}
          </button>

          {showFeedback[currentEx.id] && (
            <div className="mt-6 space-y-6">
              {/* AI Assessment Results */}
              {assessmentResults[currentEx.id] && (
                <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Target className="w-6 h-6 text-blue-600 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-blue-800 mb-3">
                        🤖 AI Assessment Results (Score: {Math.round(assessmentResults[currentEx.id].overallScore * 100)}%)
                      </h4>
                      
                      <div className="mb-4">
                        <p className="text-blue-700 mb-3">
                          <strong>Personalized Feedback:</strong> {assessmentResults[currentEx.id].personalizedFeedback}
                        </p>
                      </div>
                      
                      {assessmentResults[currentEx.id].strengths.length > 0 && (
                        <div className="mb-3">
                          <p className="text-green-700 text-sm">
                            <strong>✅ Strengths Identified:</strong> {assessmentResults[currentEx.id].strengths.join(', ')}
                          </p>
                        </div>
                      )}
                      
                      {assessmentResults[currentEx.id].improvements.length > 0 && (
                        <div className="mb-3">
                          <p className="text-orange-700 text-sm">
                            <strong>📈 Areas for Growth:</strong> {assessmentResults[currentEx.id].improvements.join(', ')}
                          </p>
                        </div>
                      )}
                      
                      {assessmentResults[currentEx.id].nextSteps.length > 0 && (
                        <div>
                          <p className="text-purple-700 text-sm">
                            <strong>🎯 Recommended Next Steps:</strong> {assessmentResults[currentEx.id].nextSteps.join(', ')}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Expert Example for Learning */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-6 h-6 text-green-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-green-800 mb-3">📚 Expert Example (For Learning):</h4>
                    <p className="text-green-700 mb-4 italic">"{currentEx.goodResponse}"</p>
                    <p className="text-green-600 text-sm">
                      <strong>Why this works:</strong> {currentEx.feedback}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mt-1" />
                  <div>
                    <h5 className="font-semibold text-yellow-800 mb-2">Reflection Questions:</h5>
                    <ul className="text-yellow-700 text-sm space-y-1">
                      <li>• How did your response compare to the example?</li>
                      <li>• What aspects of epistemic humility did you include or miss?</li>
                      <li>• How might you improve your response?</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentExercise(Math.max(0, currentExercise - 1))}
            disabled={currentExercise === 0}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous Exercise
          </button>

          {currentExercise === exercises.length - 1 ? (
            <button
              onClick={completeLesson}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Sandbox
            </button>
          ) : (
            <button
              onClick={() => setCurrentExercise(Math.min(exercises.length - 1, currentExercise + 1))}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Next Exercise
            </button>
          )}
        </div>

        {/* Sandbox Info */}
        <div className="mt-8 text-center">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50">
            <h3 className="font-semibold text-gray-800 mb-2">🏖️ Safe Learning Environment</h3>
            <p className="text-sm text-gray-600">
              This is your sandbox—a safe space to practice critical thinking without judgment. 
              Experiment with different approaches, make mistakes, and learn from the feedback. 
              The goal is growth, not perfection.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpistemicSandboxLesson;