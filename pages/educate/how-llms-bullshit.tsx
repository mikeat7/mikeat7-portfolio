import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, AlertTriangle, CheckCircle, Brain, Code } from 'lucide-react';


const HowLLMsBullshitLesson: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const sections = [
    {
      id: 'introduction',
      title: 'The Mechanics of AI Deception',
      content: `Large Language Models don't lie in the human sense—they don't know truth from falsehood. Instead, they "bullshit" by generating plausible-sounding text without regard for accuracy.

**What is AI Bullshit?**
Harry Frankfurt's definition: "Bullshit is speech intended to persuade without regard for truth." LLMs produce output designed to continue conversations coherently, not to convey accurate information.

**Why LLMs Bullshit:**
- **Pattern Matching**: They predict what text should come next based on training data
- **No Truth Verification**: They lack mechanisms to check if statements are accurate
- **Reward for Fluency**: Training prioritizes coherent, helpful-sounding responses
- **Human Text Training**: They learned from human writing, which contains errors and biases

**The Confidence Problem:**
LLMs maintain the same authoritative tone whether they're certain or completely guessing. This makes their bullshit particularly dangerous because it sounds authoritative.`
    },
    {
      id: 'mechanisms',
      title: 'How AI Systems Generate Bullshit',
      content: `**1. Hallucination Generation:**
- Creates fake citations, studies, or quotes that sound real
- Invents plausible but false details to fill knowledge gaps
- Combines real information in misleading ways

**2. Confident Uncertainty:**
- Uses definitive language for speculative claims
- Avoids expressing degrees of confidence
- Presents guesses as established facts

**3. Pattern Completion:**
- Completes familiar patterns even when inappropriate
- Follows conversational expectations over accuracy
- Generates "expected" responses rather than truthful ones

**4. Context Collapse:**
- Loses track of conversation context over long exchanges
- Contradicts earlier statements without awareness
- Fails to maintain logical consistency

**5. Training Bias Amplification:**
- Reproduces biases and errors from training data
- Amplifies confident-sounding but incorrect information
- Perpetuates misconceptions that appear frequently online`
    },
    {
      id: 'detection',
      title: 'Detecting AI Bullshit',
      content: `**Red Flags for AI-Generated Bullshit:**

**Structural Patterns:**
- Overly perfect grammar and formatting
- Repetitive sentence structures
- Generic, non-specific language
- Lack of personal experience or emotion

**Content Patterns:**
- Vague attributions ("studies show," "experts say")
- Perfect recall of obscure details
- Balanced perspectives on controversial topics
- Absence of genuine uncertainty or confusion

**Verification Techniques:**
- Check specific claims against reliable sources
- Look for citations that can be verified
- Ask for clarification on vague statements
- Request sources for factual claims

**The Turing Test for Bullshit:**
Ask yourself: "Does this response show genuine understanding, or is it sophisticated pattern matching?"`,
      interactive: true
    },
    {
      id: 'defense',
      title: 'Defending Against AI Bullshit',
      content: `**Personal Defense Strategies:**

**1. Maintain Healthy Skepticism:**
- Treat AI responses as starting points, not final answers
- Verify important information through multiple sources
- Be especially cautious with medical, legal, or financial advice

**2. Use AI as a Research Assistant, Not an Authority:**
- Ask for sources and citations
- Use AI to generate ideas, then verify them yourself
- Cross-reference AI claims with authoritative sources

**3. Recognize AI Limitations:**
- AI doesn't have real-time information (unless specifically designed to)
- AI can't browse the internet or access current events
- AI lacks genuine understanding of context and nuance

**4. Develop AI Literacy:**
- Understand how AI systems work
- Learn to recognize AI-generated content
- Stay informed about AI capabilities and limitations

**Remember:** The goal isn't to avoid AI entirely, but to use it wisely while maintaining critical thinking skills.`
    }
  ];

  const detectionQuestions = [
    {
      id: 'q1',
      statement: "According to a 2023 Stanford study by Dr. Jennifer Martinez, 87.3% of users can't distinguish AI-generated text from human writing in blind tests.",
      options: [
        'Likely human-written - specific and verifiable',
        'Likely AI-generated - too perfect and unverifiable',
        'Could be either - need more context'
      ],
      correct: 1,
      explanation: 'This has classic AI hallucination markers: fake specific citation, precise percentage, and a claim that sounds plausible but is likely fabricated.'
    },
    {
      id: 'q2',
      statement: "I struggled with this concept for weeks, made tons of mistakes, and finally had a breakthrough when my professor explained it using a pizza analogy that I still remember years later.",
      options: [
        'Likely AI-generated - too structured',
        'Likely human-written - personal experience and emotion',
        'Could be either - common experience'
      ],
      correct: 1,
      explanation: 'This shows genuine personal experience, emotional struggle, specific memory, and the kind of imperfect learning process that AI rarely captures authentically.'
    },
    {
      id: 'q3',
      statement: "Climate change presents both opportunities and challenges. While some experts emphasize the risks, others focus on potential technological solutions. The truth likely lies somewhere in the middle, requiring balanced consideration of multiple perspectives.",
      options: [
        'Likely human-written - shows nuanced thinking',
        'Likely AI-generated - artificially balanced and vague',
        'Could be either - reasonable perspective'
      ],
      correct: 1,
      explanation: 'This shows classic AI "both sides" framing that avoids taking positions. Real humans usually have stronger opinions on climate change, and the language is generically diplomatic.'
    }
  ];

  const handleQuizAnswer = (questionId: string, answerIndex: number) => {
    setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex.toString() }));
    setShowFeedback(prev => ({ ...prev, [questionId]: true }));
  };

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['how-llms-bullshit'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            How LLMs Bullshit
          </h1>
          <p className="text-lg text-gray-600">
            Understanding the mechanics of AI deception and how to defend against it
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
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
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
              
              {detectionQuestions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Code className="w-5 h-5 text-purple-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Detection Challenge {index + 1}
                      </h4>
                      <p className="text-gray-700 mb-4 p-4 bg-gray-50 rounded-md font-mono text-sm">
                        "{question.statement}"
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Is this likely human-written or AI-generated?
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optionIndex) => (
                      <label key={optionIndex} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name={question.id}
                          className="text-purple-500 focus:ring-purple-500"
                          onChange={() => handleQuizAnswer(question.id, optionIndex)}
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>

                  {showFeedback[question.id] && (
                    <div className={`mt-4 p-4 rounded-md ${
                      parseInt(quizAnswers[question.id]) === question.correct 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        {parseInt(quizAnswers[question.id]) === question.correct ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                        )}
                        <div>
                          <h5 className={`font-semibold mb-2 ${
                            parseInt(quizAnswers[question.id]) === question.correct 
                              ? 'text-green-800' 
                              : 'text-red-800'
                          }`}>
                            {parseInt(quizAnswers[question.id]) === question.correct ? 'Correct!' : 'Not quite right'}
                          </h5>
                          <p className={`text-sm ${
                            parseInt(quizAnswers[question.id]) === question.correct 
                              ? 'text-green-700' 
                              : 'text-red-700'
                          }`}>
                            {question.explanation}
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
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HowLLMsBullshitLesson;