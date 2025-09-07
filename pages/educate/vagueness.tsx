import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';


const VaguenessLesson: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentSection, setCurrentSection] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const sections = [
    {
      id: 'introduction',
      title: 'The Power of Precision',
      content: `Vague language is one of the most subtle yet powerful tools of manipulation. When someone uses imprecise words, they can make claims that sound meaningful while avoiding accountability.

**Why Vagueness Works:**
- Creates illusion of knowledge without actual content
- Allows speaker to avoid specific commitments
- Makes disagreement difficult (how do you argue with "some people say"?)
- Exploits our tendency to fill in gaps with our own assumptions

**The Vagueness Spectrum:**
- **Precise**: "The study of 1,247 participants found a 23% reduction"
- **Vague**: "Studies show significant improvement"
- **Meaningless**: "Many experts believe it works better"`
    },
    {
      id: 'examples',
      title: 'Vagueness in Action',
      content: `Let's examine how vague language conceals weak arguments:

**Political Example:**
- Vague: "The economy is doing better under our policies"
- Precise: "GDP grew 2.1% this quarter, unemployment fell to 4.2%"

**Medical Example:**
- Vague: "This supplement boosts immunity"
- Precise: "This supplement increased white blood cell count by 15% in a 30-day trial of 200 participants"

**News Example:**
- Vague: "Cases are rising across the country"
- Precise: "COVID cases increased 12% week-over-week in 23 of 50 states"`
    },
    {
      id: 'practice',
      title: 'Practice: Spot the Vagueness',
      content: 'Now let\'s practice identifying vague language. For each statement, identify what makes it vague and how it could be more precise.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Defending Against Vagueness',
      content: `**The Precision Response:**
When someone uses vague language, ask for specifics:

- "What do you mean by 'many people'?"
- "Which studies specifically?"
- "Can you quantify 'significant'?"
- "What's your definition of 'better'?"

**The Clarification Technique:**
- "Help me understand what you mean by..."
- "Could you be more specific about..."
- "What evidence supports that claim?"

**Red Flags to Watch For:**
- Weasel words: "some," "many," "often," "frequently"
- Undefined superlatives: "best," "most," "leading"
- Vague quantities: "a lot," "significant," "substantial"
- Anonymous authorities: "experts say," "studies show"`
    }
  ];

  const practiceQuestions = [
    {
      id: 'q1',
      statement: "Many doctors recommend this treatment for better health outcomes.",
      correctAnswer: "Vague terms: 'many doctors' (how many?), 'better health outcomes' (better than what? by how much?)",
      explanation: "This statement uses multiple vague terms that make it impossible to verify or evaluate the claim."
    },
    {
      id: 'q2',
      statement: "Studies show that people who exercise regularly live longer.",
      correctAnswer: "Vague terms: 'studies' (which studies?), 'regularly' (how often?), 'longer' (how much longer?)",
      explanation: "While this may be true, the vague language prevents us from understanding the actual evidence."
    },
    {
      id: 'q3',
      statement: "Our product is significantly more effective than the competition.",
      correctAnswer: "Vague terms: 'significantly' (by what measure?), 'more effective' (at what?), 'competition' (which competitors?)",
      explanation: "Marketing language designed to sound impressive while making no verifiable claims."
    }
  ];

  const handleAnswerSubmit = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answer }));
    setShowFeedback(prev => ({ ...prev, [questionId]: true }));
  };

  const completeLesson = () => {
    // Mark lesson as completed in localStorage
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['vagueness'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    
    // Navigate back to education hub
    navigate('/educate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Vagueness & Precision
          </h1>
          <p className="text-lg text-gray-600">
            Learn to identify and counter imprecise language that conceals weak arguments
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
              className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300"
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
              
              {practiceQuestions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Question {index + 1}
                      </h4>
                      <p className="text-gray-700 italic mb-4">
                        "{question.statement}"
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        What makes this statement vague? How could it be more precise?
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowFeedback(prev => ({ ...prev, [question.id]: true }))}
                    disabled={showFeedback[question.id]}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showFeedback[question.id] ? 'Answer Revealed' : 'Show Expert Analysis'}
                  </button>

                  {showFeedback[question.id] && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <h5 className="font-semibold text-blue-800 mb-2">Sample Analysis:</h5>
                          <p className="text-blue-700 mb-2">{question.correctAnswer}</p>
                          <p className="text-sm text-blue-600">{question.explanation}</p>
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
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaguenessLesson;