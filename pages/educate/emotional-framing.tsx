import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, AlertTriangle, CheckCircle, Brain } from 'lucide-react';


const EmotionalFramingLesson: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentSection, setCurrentSection] = useState(0);
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const sections = [
    {
      id: 'introduction',
      title: 'Understanding Emotional Manipulation',
      content: `Emotional framing is one of the most powerful tools of persuasion—and manipulation. When someone uses emotional language, they're trying to bypass your rational thinking and trigger an immediate emotional response.

**How Emotional Framing Works:**
- Triggers fight-or-flight responses that shut down critical thinking
- Creates urgency that prevents careful consideration
- Uses fear, anger, or guilt to motivate action
- Exploits our natural empathy and protective instincts

**The Emotional Manipulation Spectrum:**
- **Legitimate**: "This policy could help struggling families"
- **Manipulative**: "If you don't support this, children will suffer"
- **Extreme**: "Anyone who opposes this hates children"

**Why It's Effective:**
Emotions evolved to help us make quick survival decisions. When we feel threatened, our brain prioritizes immediate action over careful analysis. Manipulators exploit this ancient wiring.`
    },
    {
      id: 'techniques',
      title: 'Common Emotional Manipulation Techniques',
      content: `**Fear Appeals:**
- "If we don't act now, it will be too late"
- "This crisis threatens everything we hold dear"
- "The consequences will be catastrophic"

**Guilt Manipulation:**
- "Think of the children"
- "How can you be so selfish?"
- "Good people would support this"

**Anger Amplification:**
- "They're trying to control you"
- "This is an outrage that demands action"
- "We can't let them get away with this"

**False Urgency:**
- "Time is running out"
- "This is your last chance"
- "Act now before it's too late"

**Tribal Identity:**
- "Real Americans believe..."
- "Anyone with common sense knows..."
- "We're fighting for our way of life"`
    },
    {
      id: 'practice',
      title: 'Practice: Identify the Manipulation',
      content: 'Let\'s practice identifying emotional manipulation in real statements. For each example, identify the emotional technique being used.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Defending Against Emotional Manipulation',
      content: `**The Pause Technique:**
When you feel a strong emotional response to a message, pause and ask:
- "What emotion am I feeling right now?"
- "Is this emotion helping me think clearly?"
- "What would I think about this if I weren't feeling this way?"

**The Evidence Check:**
- "What specific evidence supports this claim?"
- "Are there alternative explanations?"
- "What would someone who disagrees say?"

**The Reframe Method:**
- Strip away emotional language and restate the core claim
- "So you're saying that [neutral restatement]?"
- Look for the logical argument beneath the emotional appeal

**Red Flags to Watch For:**
- Extreme language: "catastrophic," "devastating," "outrageous"
- Time pressure: "now," "immediately," "before it's too late"
- Moral absolutes: "good people," "anyone with sense," "obviously"
- Tribal language: "us vs them," "real [group]," "they want to"

**Remember:** Legitimate concerns can be discussed calmly with evidence. If someone needs to manipulate your emotions to convince you, question why.`
    }
  ];

  const practiceExamples = [
    {
      id: 'example1',
      statement: "If we don't pass this bill immediately, innocent children will continue to suffer while politicians play games with their lives.",
      techniques: ['Fear Appeal', 'Guilt Manipulation', 'False Urgency'],
      correctAnswer: 'fear-guilt-urgency',
      explanation: 'This combines fear (children suffering), guilt (your inaction causes harm), and false urgency (must act immediately). It prevents rational discussion of the bill\'s actual merits.'
    },
    {
      id: 'example2',
      statement: "Real patriots know that this policy threatens our fundamental freedoms and way of life.",
      techniques: ['Tribal Identity', 'Fear Appeal'],
      correctAnswer: 'tribal-fear',
      explanation: 'Uses tribal identity ("real patriots") to pressure agreement and fear appeal ("threatens freedoms") to create urgency without discussing specific policy details.'
    },
    {
      id: 'example3',
      statement: "How can anyone with a conscience support a policy that will devastate working families?",
      techniques: ['Guilt Manipulation', 'Moral Absolutes'],
      correctAnswer: 'guilt-moral',
      explanation: 'Questions the morality of disagreement and uses extreme language ("devastate") to amplify emotional impact rather than discussing actual policy effects.'
    }
  ];

  const handlePracticeAnswer = (exampleId: string, answer: string) => {
    setPracticeAnswers(prev => ({ ...prev, [exampleId]: answer }));
    setShowResults(prev => ({ ...prev, [exampleId]: true }));
  };

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['emotional-framing'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-red-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Emotional Manipulation
          </h1>
          <p className="text-lg text-gray-600">
            Learn to recognize when emotions are weaponized against reason
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
              className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300"
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
              
              {practiceExamples.map((example, index) => (
                <div key={example.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Example {index + 1}
                      </h4>
                      <p className="text-gray-700 italic mb-4 p-4 bg-gray-50 rounded-md">
                        "{example.statement}"
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        What emotional manipulation techniques do you see here?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {example.techniques.map(technique => (
                      <label key={technique} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-red-500 focus:ring-red-500"
                          onChange={(e) => {
                            const current = practiceAnswers[example.id] || '';
                            if (e.target.checked) {
                              setPracticeAnswers(prev => ({ ...prev, [example.id]: current + technique + ',' }));
                            } else {
                              setPracticeAnswers(prev => ({ ...prev, [example.id]: current.replace(technique + ',', '') }));
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{technique}</span>
                      </label>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowResults(prev => ({ ...prev, [example.id]: true }))}
                    disabled={showResults[example.id]}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showResults[example.id] ? 'Answer Revealed' : 'Show Expert Analysis'}
                  </button>

                  {showResults[example.id] && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <Brain className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <h5 className="font-semibold text-blue-800 mb-2">Analysis:</h5>
                          <p className="text-blue-700">{example.explanation}</p>
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
              className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmotionalFramingLesson;