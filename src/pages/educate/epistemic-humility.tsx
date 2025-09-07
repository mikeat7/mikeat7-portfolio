import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, CheckCircle, AlertTriangle, Brain } from 'lucide-react';


const EpistemicHumility: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentSection, setCurrentSection] = useState(0);
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);
  const sections = [
    {
      id: 'introduction',
      title: 'Understanding Epistemic Humility',
      content: `Epistemic humility is the recognition that our knowledge is always limited and potentially flawed. It encourages us to hold beliefs with appropriate levels of confidence, especially in complex or uncertain situations.

**What Epistemic Humility Means:**
- Acknowledging the limits of your knowledge
- Being willing to say "I don't know" when you don't know
- Holding beliefs with appropriate confidence levels
- Being open to changing your mind when presented with evidence

**Why It Matters:**
This mindset helps protect us from overconfidence and dogmatism. It's a foundational trait for honest inquiry, critical thinking, and genuine dialogue.

**The Confidence Calibration Problem:**
Most people are overconfident in their knowledge. Studies show that when people say they're 90% certain about something, they're often wrong 20-40% of the time. Epistemic humility helps calibrate confidence to actual knowledge.

**Historical Examples:**
- Scientists who acknowledged the limits of their theories (like Darwin's uncertainty about inheritance mechanisms)
- Leaders who admitted mistakes and changed course
- Thinkers who said "I know that I know nothing" (Socrates)`
    },
    {
      id: 'practices',
      title: 'Key Practices of Epistemic Humility',
      content: `**Core Practices:**

**1. Appropriate Confidence Levels**
- Match your confidence to the strength of your evidence
- Use qualifying language when uncertain ("It seems...", "Based on available evidence...")
- Distinguish between what you know and what you believe

**2. Active Uncertainty Acknowledgment**
- Say "I don't know" when you don't know
- Admit when you're speculating or guessing
- Acknowledge the complexity of difficult topics

**3. Evidence-Based Belief Revision**
- Hold strong opinions, but weakly — be ready to revise them with new evidence
- Ask "What would convince me I'm wrong?"
- Treat changing your mind as intellectual growth, not failure

**4. Question-Asking Over Assumption-Making**
- Ask questions instead of assuming you know
- Seek to understand before seeking to be understood
- Approach disagreements with curiosity rather than defensiveness

**5. Skepticism of Overconfidence**
- Be skeptical of people who sound absolutely certain about everything
- Question claims that seem too convenient or confirm all your biases
- Look for nuance in complex topics`
    },
    {
      id: 'practice',
      title: 'Practice: Applying Epistemic Humility',
      content: 'Let\'s practice applying epistemic humility in various scenarios. Consider how you would respond with appropriate uncertainty and openness.',
      interactive: true
    },
    {
      id: 'benefits',
      title: 'Benefits and Applications',
      content: `**Personal Benefits:**
- Better decision-making through more accurate self-assessment
- Reduced anxiety from needing to have all the answers
- Improved relationships through genuine listening
- Increased learning through openness to new information

**Professional Benefits:**
- More effective leadership through admitting limitations
- Better collaboration through intellectual humility
- Improved problem-solving through considering multiple perspectives
- Enhanced credibility through honest uncertainty

**Societal Benefits:**
- Reduced polarization through openness to other viewpoints
- Better public discourse through nuanced discussion
- Improved democratic decision-making through informed uncertainty
- More effective institutions through adaptive learning

**A Good Rule of Thumb:**
"The more confident someone sounds, the more you should ask what they might be missing."

**Remember:**
Epistemic humility isn't about being wishy-washy or never taking positions. It's about calibrating your confidence to your actual knowledge and being open to learning and growth.`
    }
  ];

  const practiceScenarios = [
    {
      id: 'scenario1',
      situation: 'A friend asks your opinion about a complex political issue that you\'ve only read a few articles about.',
      question: 'How would you respond with epistemic humility?',
      analysis: 'Good response: "I\'ve only read a few articles about this, so I don\'t feel qualified to have a strong opinion. From what I understand, [share what you know with qualifiers], but I\'d need to learn more to have a well-informed view. What\'s your take on it?"',
      explanation: 'This response acknowledges limited knowledge, shares what you do know with appropriate qualifiers, admits the need for more information, and turns the conversation toward learning from others.'
    },
    {
      id: 'scenario2',
      situation: 'You\'re in a work meeting and someone proposes a solution to a problem. You have concerns but aren\'t completely sure about the technical details.',
      question: 'How do you express your concerns with epistemic humility?',
      analysis: 'Good response: "I may be missing something, but I have some concerns about [specific aspect]. Could we walk through how this would handle [specific scenario]? I want to make sure I understand the approach correctly."',
      explanation: 'This response acknowledges potential gaps in understanding, raises specific concerns rather than vague objections, asks for clarification, and frames the discussion as seeking understanding rather than attacking the proposal.'
    },
    {
      id: 'scenario3',
      situation: 'Someone challenges one of your strongly held beliefs with evidence you haven\'t seen before.',
      question: 'How do you respond with epistemic humility?',
      analysis: 'Good response: "That\'s interesting - I haven\'t seen that evidence before. Could you help me understand [specific aspect]? I\'ve believed [your position] based on [your reasoning], but I\'d like to understand how this new information fits in."',
      explanation: 'This response shows openness to new information, asks for clarification rather than immediately dismissing, explains your current reasoning, and expresses willingness to integrate new evidence into your understanding.'
    }
  ];

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['epistemic-humility'] = true;
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
            <Lightbulb className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Epistemic Humility
          </h1>
          <p className="text-lg text-gray-600">
            The intellectual virtue of knowing the limits of your knowledge
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
              <p className="text-gray-700 mb-6">{sections[currentSection].content}</p>
              
              {practiceScenarios.map((scenario, index) => (
                <div key={scenario.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Brain className="w-5 h-5 text-indigo-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Scenario {index + 1}
                      </h4>
                      <p className="text-gray-700 mb-4 p-4 bg-gray-50 rounded-md">
                        {scenario.situation}
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>{scenario.question}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAnswers(prev => ({ ...prev, [scenario.id]: true }))}
                    disabled={showAnswers[scenario.id]}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showAnswers[scenario.id] ? 'Answer Revealed' : 'Show Example Response'}
                  </button>

                  {showAnswers[scenario.id] && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <h5 className="font-semibold text-blue-800 mb-2">Example Response:</h5>
                          <p className="text-blue-700 mb-2">{scenario.analysis}</p>
                          <p className="text-sm text-blue-600">
                            <strong>Why This Works:</strong> {scenario.explanation}
                          </p>
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
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {currentSection === sections.length - 1 ? (
            <button
              onClick={completeLesson}
              className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              <CheckCircle className="w-5 h-5" />
              Complete Lesson
            </button>
          ) : (
            <button
              onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpistemicHumility;