import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, CheckCircle, AlertTriangle, Lightbulb, RotateCcw } from 'lucide-react';

import { advancedAssessment } from '@/lib/assessment/AdvancedAssessmentEngine';

const NarrativeFramingAnalysis: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentSection, setCurrentSection] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});
  const [assessmentResults, setAssessmentResults] = useState<Record<string, any>>({});
  const [isAssessing, setIsAssessing] = useState<Record<string, boolean>>({});

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const sections = [
    {
      id: 'introduction',
      title: 'Advanced Narrative Framing Analysis',
      content: `Narrative framing is one of the most powerful yet subtle forms of influence. The same facts can be presented through completely different narrative lenses, creating entirely different emotional and logical responses without changing the underlying truth.

**What Makes This Advanced:**
This isn't just about recognizing bias—it's about understanding how narrative structure itself shapes perception, decision-making, and memory formation.

**The Frame Analysis Framework:**
- **Temporal Framing**: Past, present, or future focus
- **Causal Framing**: What's presented as cause vs. effect
- **Scope Framing**: Individual, group, or systemic perspective
- **Emotional Framing**: Crisis, opportunity, or neutral presentation
- **Agency Framing**: Who has power and responsibility

**Why This Matters:**
Master-level critical thinkers can:
- Recognize when they're being influenced by narrative structure
- Consciously shift between different frames to gain perspective
- Communicate more effectively by choosing appropriate frames
- Resist manipulation while remaining open to legitimate perspectives

**The Meta-Skill:**
Learning to see the frame itself, not just the picture within it.`
    },
    {
      id: 'frame-identification',
      title: 'Frame Identification Mastery',
        content: '',
      interactive: true
    },
    {
      id: 'perspective-reconstruction',
      title: 'Perspective Reconstruction Challenge',
      content: 'Now you\'ll practice the advanced skill of taking neutral facts and constructing different narrative frames. This develops your ability to see multiple perspectives and understand how framing influences interpretation.\n\n**Master-Level Skill**: The ability to consciously shift between frames while maintaining awareness of what you\'re doing.\n\n**Assessment Criteria**:\n- **Accuracy**: Does your frame accurately represent the facts?\n- **Consistency**: Is the narrative logic internally coherent?\n- **Effectiveness**: Does the frame create the intended perspective?\n- **Awareness**: Do you understand how the frame influences perception?',
      interactive: true
    },
    {
      id: 'frame-resistance',
      title: 'Frame Resistance and Construction',
      content: 'The highest level of narrative framing mastery involves two complementary skills:\n\n**Frame Resistance**: The ability to step outside of imposed frames and see the underlying facts clearly.\n\n**Frame Construction**: The ability to consciously choose frames that serve truth and understanding rather than manipulation.\n\n**Advanced Techniques:**\n\n**1. Frame Stacking**: Recognizing when multiple frames are layered together\n**2. Frame Switching**: Deliberately shifting perspectives mid-analysis\n**3. Frame Neutralization**: Stripping away narrative elements to see raw facts\n**4. Frame Optimization**: Choosing frames that enhance rather than distort understanding\n\n**The Ethical Dimension:**\nWith great framing power comes great responsibility. Use these skills to:\n- Enhance understanding, not manipulate\n- Reveal truth, not obscure it\n- Build bridges, not create divisions\n- Serve audiences, not personal agendas\n\n**Master\'s Mindset**: Frame consciously, frame ethically, frame effectively.'
    }
  ];

  const frameIdentificationExercises = [
    {
      id: 'exercise1',
      facts: 'A tech company announced 1,000 layoffs while reporting record quarterly profits of $2.8 billion, up 15% from last year.',
      question: 'Identify the different narrative frames this could be presented through.',
      analysis: 'Multiple frames possible: 1) **Corporate Greed Frame**: "Company fires workers despite record profits" (emphasizes inequality), 2) **Efficiency Frame**: "Company optimizes workforce for sustainable growth" (emphasizes business strategy), 3) **Market Frame**: "Competitive pressures drive restructuring decisions" (emphasizes external forces), 4) **Human Impact Frame**: "1,000 families face uncertainty as company prioritizes shareholders" (emphasizes personal consequences).',
      explanation: 'Each frame uses the same facts but creates completely different emotional responses and assigns different moral weight to the actions.'
    },
    {
      id: 'exercise2',
      facts: 'A new study of 500 participants found that people who meditate 20 minutes daily scored 12% higher on focus tests, though researchers noted the study was limited to college students.',
      question: 'How could this research be framed differently by different audiences?',
      analysis: 'Possible frames: 1) **Breakthrough Frame**: "Revolutionary study proves meditation boosts focus" (emphasizes discovery), 2) **Cautious Frame**: "Preliminary research suggests meditation may improve attention in students" (emphasizes limitations), 3) **Commercial Frame**: "Science confirms ancient wisdom about meditation benefits" (emphasizes validation), 4) **Skeptical Frame**: "Small study of college students shows modest improvements in one measure" (emphasizes constraints).',
      explanation: 'The same research can support different narratives depending on what aspects are emphasized and what limitations are highlighted or minimized.'
    }
  ];

  const reconstructionChallenges = [
    {
      id: 'challenge1',
      neutralFacts: 'City council voted 7-2 to approve a new bike lane project that will cost $2.3 million and remove 150 parking spaces while adding 3 miles of protected cycling infrastructure.',
      perspectives: ['Pro-cycling advocate', 'Local business owner', 'Traffic safety expert'],
      question: 'Frame this decision from each perspective while staying factually accurate.',
      analysis: '**Pro-cycling**: "City council prioritizes sustainable transportation with major bike safety investment" (emphasizes environmental benefits, safety). **Business owner**: "Parking elimination threatens local commerce despite costly bike infrastructure" (emphasizes economic impact, customer access). **Safety expert**: "Protected bike lanes reduce vehicle-cyclist conflicts through dedicated infrastructure" (emphasizes accident prevention, design benefits).',
      explanation: 'Each perspective emphasizes different aspects of the same decision, showing how legitimate stakeholders can have different but valid narrative frames based on their priorities and concerns.'
    },
    {
      id: 'challenge2',
      neutralFacts: 'A pharmaceutical company\'s new drug showed 65% effectiveness in treating a rare disease in clinical trials, with side effects reported in 23% of patients. The drug will cost $50,000 per year.',
      perspectives: ['Patient advocate', 'Healthcare economist', 'Medical researcher'],
      question: 'How would each perspective frame this drug approval decision?',
      analysis: '**Patient advocate**: "Life-saving treatment offers hope to rare disease patients despite high costs" (emphasizes patient benefit, treatment access). **Healthcare economist**: "Expensive drug with significant side effects raises cost-benefit questions" (emphasizes resource allocation, population health). **Medical researcher**: "Clinical trial demonstrates moderate efficacy with acceptable safety profile for rare condition" (emphasizes scientific evidence, risk-benefit analysis).',
      explanation: 'This shows how the same clinical data can be framed differently based on different values and priorities, all while remaining factually accurate and ethically defensible.'
    }
  ];

  const handleAnswerSubmit = async (exerciseId: string, answer: string) => {
    if (!answer.trim()) return;
    
    setIsAssessing(prev => ({ ...prev, [exerciseId]: true }));
    setUserAnswers(prev => ({ ...prev, [exerciseId]: answer }));
    
    try {
      // Get the scenario for context
      const exercise = frameIdentificationExercises.find(ex => ex.id === exerciseId) ||
                     reconstructionChallenges.find(ch => ch.id === exerciseId);
      
      const scenario = exercise ? (exercise as any).facts || (exercise as any).neutralFacts || '' : '';
      
      // Run real assessment
      const result = await advancedAssessment.assessNarrativeFraming(answer, scenario);
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
    progress['narrative-framing-analysis'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Narrative Framing Analysis
          </h1>
          <p className="text-lg text-gray-600">
            Master-level assessment: Deconstructing how stories shape perception
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{currentSection + 1} of {sections.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">
            {sections[currentSection].title}
          </h2>

          {sections[currentSection].interactive ? (
            <div className="space-y-8">
              {currentSection === 1 && (
                <div className="space-y-6">
                  <p className="text-gray-700 mb-6">
                    Let's analyze how the same factual information can be framed completely differently. Each frame emphasizes different aspects and creates different emotional responses.
                  </p>
                  
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-blue-800 mb-4">📊 Example: Unemployment Data Analysis</h3>
                    <p className="text-blue-700 font-medium mb-4">
                      <strong>Core Facts:</strong> Unemployment rate is 4.2%, down from 4.5% last month, up from 3.8% last year.
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
                      <h4 className="text-lg font-bold text-red-800 mb-3">🚨 Crisis Frame</h4>
                      <p className="text-red-700 italic mb-4">
                        "Unemployment crisis persists as millions remain jobless despite slight improvement"
                      </p>
                      <ul className="text-red-700 space-y-1">
                        <li>• <strong>Emphasizes:</strong> Ongoing suffering, inadequate progress</li>
                        <li>• <strong>Emotion:</strong> Concern, urgency for action</li>
                        <li>• <strong>Agency:</strong> Government/policy failure</li>
                      </ul>
                    </div>

                    <div className="bg-green-50 border-l-4 border-green-400 p-6 rounded-r-lg">
                      <h4 className="text-lg font-bold text-green-800 mb-3">📈 Recovery Frame</h4>
                      <p className="text-green-700 italic mb-4">
                        "Job market recovery accelerates with unemployment falling to 4.2%"
                      </p>
                      <ul className="text-green-700 space-y-1">
                        <li>• <strong>Emphasizes:</strong> Positive trend, improvement momentum</li>
                        <li>• <strong>Emotion:</strong> Optimism, confidence in direction</li>
                        <li>• <strong>Agency:</strong> Economic forces, policy success</li>
                      </ul>
                    </div>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
                      <h4 className="text-lg font-bold text-yellow-800 mb-3">📅 Historical Frame</h4>
                      <p className="text-yellow-700 italic mb-4">
                        "Unemployment rises above pre-pandemic levels despite recent gains"
                      </p>
                      <ul className="text-yellow-700 space-y-1">
                        <li>• <strong>Emphasizes:</strong> Comparison to past, incomplete recovery</li>
                        <li>• <strong>Emotion:</strong> Disappointment, unfinished business</li>
                        <li>• <strong>Agency:</strong> Pandemic impact, systemic challenges</li>
                      </ul>
                    </div>

                    <div className="bg-gray-50 border-l-4 border-gray-400 p-6 rounded-r-lg">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">📋 Technical Frame</h4>
                      <p className="text-gray-700 italic mb-4">
                        "Labor force participation adjustments affect unemployment calculations"
                      </p>
                      <ul className="text-gray-700 space-y-1">
                        <li>• <strong>Emphasizes:</strong> Methodology, measurement complexity</li>
                        <li>• <strong>Emotion:</strong> Analytical detachment</li>
                        <li>• <strong>Agency:</strong> Statistical processes, data interpretation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">💡</span>
                      <h4 className="text-lg font-bold text-purple-800">The Key Insight</h4>
                    </div>
                    <p className="text-purple-700">
                      None of these frames are "false"—they're different ways of organizing the same true information.
                    </p>
                  </div>
                </div>
              )}
              
              {currentSection !== 1 && (
                <p className="text-gray-700 mb-6">{sections[currentSection].content}</p>
              )}
              
              {currentSection === 1 && frameIdentificationExercises.map((exercise, index) => (
                <div key={exercise.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Eye className="w-5 h-5 text-indigo-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Frame Identification {index + 1}
                      </h4>
                      <div className="bg-blue-50 p-4 rounded-md mb-4">
                        <p className="text-blue-800 font-medium mb-2">Facts:</p>
                        <p className="text-blue-700 text-sm">{exercise.facts}</p>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>{exercise.question}</strong>
                      </p>
                    </div>
                  </div>

                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                    rows={4}
                    placeholder="Identify at least 3 different narrative frames for these facts..."
                    value={userAnswers[exercise.id] || ''}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, [exercise.id]: e.target.value }))}
                  />

                  <button
                    onClick={() => handleAnswerSubmit(exercise.id, userAnswers[exercise.id] || '')}
                    disabled={!userAnswers[exercise.id]?.trim() || isAssessing[exercise.id]}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAssessing[exercise.id] ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      'Submit for AI Assessment'
                    )}
                  </button>

                  {showFeedback[exercise.id] && (
                    <div className="mt-4 space-y-4">
                      {/* AI Assessment Results */}
                      {assessmentResults[exercise.id] && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <RotateCcw className="w-5 h-5 text-blue-500 mt-1" />
                            <div className="flex-1">
                              <h5 className="font-semibold text-blue-800 mb-2">
                                🤖 AI Assessment Results (Score: {Math.round(assessmentResults[exercise.id].overallScore * 100)}%)
                              </h5>
                              
                              <div className="mb-3">
                                <p className="text-blue-700 text-sm mb-2">
                                  <strong>Personalized Feedback:</strong> {assessmentResults[exercise.id].personalizedFeedback}
                                </p>
                              </div>
                              
                              {assessmentResults[exercise.id].strengths.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-green-700 text-sm">
                                    <strong>✅ Strengths:</strong> {assessmentResults[exercise.id].strengths.join(', ')}
                                  </p>
                                </div>
                              )}
                              
                              {assessmentResults[exercise.id].improvements.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-orange-700 text-sm">
                                    <strong>📈 Areas for Improvement:</strong> {assessmentResults[exercise.id].improvements.join(', ')}
                                  </p>
                                </div>
                              )}
                              
                              {assessmentResults[exercise.id].nextSteps.length > 0 && (
                                <div>
                                  <p className="text-purple-700 text-sm">
                                    <strong>🎯 Next Steps:</strong> {assessmentResults[exercise.id].nextSteps.join(', ')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Expert Example for Comparison */}
                      <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                        <div className="flex items-start gap-2">
                          <Lightbulb className="w-5 h-5 text-purple-500 mt-1" />
                          <div>
                            <h5 className="font-semibold text-purple-800 mb-2">📚 Expert Frame Analysis (For Comparison):</h5>
                            <p className="text-purple-700 mb-4 italic">"{exercise.analysis}"</p>
                            <p className="text-sm text-purple-600">
                              <strong>Why this works:</strong> {exercise.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {currentSection === 2 && reconstructionChallenges.map((challenge, index) => (
                <div key={challenge.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <RotateCcw className="w-5 h-5 text-indigo-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Perspective Reconstruction {index + 1}
                      </h4>
                      <div className="bg-green-50 p-4 rounded-md mb-4">
                        <p className="text-green-800 font-medium mb-2">Neutral Facts:</p>
                        <p className="text-green-700 text-sm mb-3">{challenge.neutralFacts}</p>
                        <p className="text-green-800 font-medium mb-2">Perspectives to Frame:</p>
                        <div className="flex gap-2">
                          {challenge.perspectives.map((perspective, i) => (
                            <span key={i} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                              {perspective}
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>{challenge.question}</strong>
                      </p>
                    </div>
                  </div>

                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 mb-4"
                    rows={5}
                    placeholder="Create narrative frames for each perspective while staying factually accurate..."
                    value={userAnswers[challenge.id] || ''}
                    onChange={(e) => setUserAnswers(prev => ({ ...prev, [challenge.id]: e.target.value }))}
                  />

                  <button
                    onClick={() => handleAnswerSubmit(challenge.id, userAnswers[challenge.id] || '')}
                    disabled={!userAnswers[challenge.id]?.trim() || isAssessing[challenge.id]}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isAssessing[challenge.id] ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Analyzing...
                      </>
                    ) : (
                      'Submit for AI Assessment'
                    )}
                  </button>

                  {showFeedback[challenge.id] && (
                    <div className="mt-4 space-y-4">
                      {/* AI Assessment Results */}
                      {assessmentResults[challenge.id] && (
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-start gap-2">
                            <RotateCcw className="w-5 h-5 text-blue-500 mt-1" />
                            <div className="flex-1">
                              <h5 className="font-semibold text-blue-800 mb-2">
                                🤖 AI Assessment Results (Score: {Math.round(assessmentResults[challenge.id].overallScore * 100)}%)
                              </h5>
                              
                              <div className="mb-3">
                                <p className="text-blue-700 text-sm mb-2">
                                  <strong>Personalized Feedback:</strong> {assessmentResults[challenge.id].personalizedFeedback}
                                </p>
                              </div>
                              
                              {assessmentResults[challenge.id].strengths.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-green-700 text-sm">
                                    <strong>✅ Strengths:</strong> {assessmentResults[challenge.id].strengths.join(', ')}
                                  </p>
                                </div>
                              )}
                              
                              {assessmentResults[challenge.id].improvements.length > 0 && (
                                <div className="mb-2">
                                  <p className="text-orange-700 text-sm">
                                    <strong>📈 Areas for Improvement:</strong> {assessmentResults[challenge.id].improvements.join(', ')}
                                  </p>
                                </div>
                              )}
                              
                              {assessmentResults[challenge.id].nextSteps.length > 0 && (
                                <div>
                                  <p className="text-purple-700 text-sm">
                                    <strong>🎯 Next Steps:</strong> {assessmentResults[challenge.id].nextSteps.join(', ')}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Expert Example for Comparison */}
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                          <div>
                            <h5 className="font-semibold text-green-800 mb-2">📚 Expert Reconstruction (For Comparison):</h5>
                            <p className="text-green-700 mb-2">{challenge.analysis}</p>
                            <p className="text-sm text-green-600">
                              <strong>Key Insight:</strong> {challenge.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 whitespace-pre-line">
                {sections[currentSection].content}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentSection === sections.length - 1 ? (
            <button
              onClick={completeLesson}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              Complete Lesson
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition"
            >
              Next
            </button>
          )}
        </div>

        {/* Master-Level Badge */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 shadow-sm border border-indigo-200">
            <h3 className="font-semibold text-indigo-800 mb-2">🏆 Master-Level Assessment</h3>
            <p className="text-sm text-indigo-700">
              This advanced lesson develops sophisticated narrative analysis skills used by 
              professional media analysts, policy experts, and communication specialists.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NarrativeFramingAnalysis;