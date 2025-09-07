import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RotateCcw, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';


const CircularReasoning: React.FC = () => {
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
      title: 'Understanding Circular Reasoning',
      content: `Circular reasoning (also called begging the question) occurs when the conclusion of an argument is used as a premise to support that same conclusion. It's like trying to lift yourself up by pulling on your own bootstraps.

**How Circular Reasoning Works:**
- The conclusion is assumed in the premises
- The argument goes in a circle without external support
- No new evidence or logic is actually provided
- The reasoning appears to support itself

**The Structure:**
"A is true because B is true, and B is true because A is true"

**Why It's Problematic:**
- Provides no actual evidence for the conclusion
- Assumes what it's trying to prove
- Can be convincing because it sounds logical
- Prevents genuine inquiry and evidence-gathering

**Simple Example:**
"The Bible is true because it's the word of God, and we know it's the word of God because the Bible says so."

**Subtle Example:**
"We need stricter laws because crime is increasing, and we know crime is increasing because we need stricter laws."

**The Illusion of Logic:**
Circular reasoning can sound logical because it follows a consistent pattern, but it provides no actual support for its conclusions.`
    },
    {
      id: 'types',
      title: 'Types of Circular Reasoning',
      content: `**Direct Circular Reasoning:**
- "This policy is good because it's beneficial"
- "He's guilty because he committed the crime"
- "This is the best solution because it's optimal"
- Problem: The conclusion just restates the premise

**Circular Definition:**
- "Democracy is good because it's democratic"
- "Natural foods are healthy because they're natural"
- "This is art because it's artistic"
- Problem: Defines terms using themselves

**Assumption of Conclusion:**
- "Since everyone knows X is true, we should act on X"
- "Given that Y is obviously correct, we must do Y"
- Problem: Assumes the conclusion without proving it

**Circular Citation:**
- Study A cites Study B, Study B cites Study A
- Expert 1 says Expert 2 is right, Expert 2 says Expert 1 is right
- Problem: No independent verification

**Complex Circular Reasoning:**
- A supports B, B supports C, C supports A
- Multiple steps that eventually circle back
- Harder to detect because of the complexity

**Circular Questioning:**
- "Why should we trust you?" "Because I'm trustworthy"
- "How do you know that's true?" "Because it's a fact"
- Problem: The answer assumes what the question challenges

**The Detection Key:**
Look for arguments where removing one premise makes the whole argument collapse, or where the conclusion is just a restatement of the premise.`
    },
    {
      id: 'practice',
      title: 'Practice: Spotting Circular Logic',
      content: 'Let\'s practice identifying circular reasoning in various arguments. Look for premises that assume their conclusions and arguments that go in logical circles.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Breaking the Circle',
      content: `**The External Evidence Request:**
When you suspect circular reasoning:
- "What evidence supports this that doesn't assume the conclusion?"
- "Can you provide independent verification for this claim?"
- "What would convince someone who doesn't already believe this?"
- "How do we know this without assuming it's true?"

**The Premise Challenge:**
- Identify which premise assumes the conclusion
- Ask for justification of that specific premise
- Request evidence that doesn't depend on the conclusion
- Look for independent sources of support

**The Restatement Test:**
- Try restating the argument without the circular elements
- See if any actual evidence remains
- Check if the argument still makes sense
- Look for what's actually being proven vs. assumed

**Red Flags to Watch For:**
- **Definitional Circularity**: Using terms to define themselves
- **Assumption Language**: "Since we know," "given that," "obviously"
- **Self-Reference**: Arguments that refer back to themselves
- **Missing External Evidence**: No independent support provided
- **Question Begging**: Assuming what needs to be proven

**The Independence Test:**
Ask: "If I didn't already believe the conclusion, would this argument convince me?"

**Breaking Circular Patterns:**
- Demand external evidence
- Ask for independent verification
- Look for objective measures
- Seek third-party confirmation
- Request specific, measurable criteria

**When Circularity Seems Valid:**
Sometimes apparent circularity involves legitimate foundational principles or definitions. The key is whether the reasoning provides new information or just restates assumptions.

**Remember:**
Good arguments provide independent reasons to believe their conclusions. If an argument only works by assuming what it's trying to prove, it's not actually proving anything.`
    }
  ];

  const practiceExamples = [
    {
      id: 'example1',
      statement: "We know this investment strategy works because it\'s been proven successful, and we know it\'s been proven successful because it works.",
      question: 'Why is this circular reasoning and what external evidence would you need?',
      analysis: 'This is circular because "works" and "proven successful" are the same claim restated. The argument provides no external evidence. External evidence needed: historical performance data, comparison to benchmarks, independent analysis, risk-adjusted returns, performance across different market conditions, and verification from unbiased sources.',
      explanation: 'This circular reasoning provides no actual evidence for the investment strategy\'s effectiveness, just restates the claim in different words. Real evidence would include measurable, verifiable performance data.'
    },
    {
      id: 'example2',
      statement: "This news source is reliable because it tells the truth, and we know it tells the truth because it\'s a reliable source.",
      question: 'How would you break this circular logic?',
      analysis: 'This is circular because "reliable" and "tells the truth" are essentially the same claim. To break the circle, ask for external evidence: fact-checking records, correction policies, source transparency, journalistic standards, independent media ratings, comparison with other sources, and specific examples of accuracy.',
      explanation: 'Media reliability must be demonstrated through external measures like accuracy records and transparent practices, not through self-referential claims about truthfulness.'
    },
    {
      id: 'example3',
      statement: "Our company culture is excellent because our employees are happy, and our employees are happy because we have an excellent company culture.",
      question: 'What makes this reasoning circular and how could it be improved?',
      analysis: 'This is circular because "excellent culture" and "happy employees" are treated as the same thing without independent definition. Better evidence: employee satisfaction surveys, retention rates, productivity measures, external workplace awards, comparison to industry standards, specific cultural practices and their measurable outcomes.',
      explanation: 'Company culture quality should be measured through specific, observable practices and outcomes, not through circular definitions that assume what they\'re trying to prove.'
    }
  ];

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['circular-reasoning'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-violet-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full mb-4">
            <RotateCcw className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Circular Reasoning
          </h1>
          <p className="text-lg text-gray-600">
            When the conclusion is used to support the premise
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
              className="bg-gradient-to-r from-violet-500 to-purple-500 h-2 rounded-full transition-all duration-300"
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
                    <RotateCcw className="w-5 h-5 text-violet-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Circular Logic Analysis {index + 1}
                      </h4>
                      <p className="text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic">
                        "{example.statement}"
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>{example.question}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAnswers(prev => ({ ...prev, [example.id]: true }))}
                    disabled={showAnswers[example.id]}
                    className="bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis'}
                  </button>

                  {showAnswers[example.id] && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <h5 className="font-semibold text-blue-800 mb-2">Expert Analysis:</h5>
                          <p className="text-blue-700 mb-2">{example.analysis}</p>
                          <p className="text-sm text-blue-600">
                            <strong>Why This Matters:</strong> {example.explanation}
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
              className="px-6 py-3 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CircularReasoning;