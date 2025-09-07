import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, AlertTriangle, Eye } from 'lucide-react';


const ConfirmationBias: React.FC = () => {
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
      title: 'Understanding Confirmation Bias',
      content: `Confirmation bias is the tendency to seek out, interpret, and remember information in a way that confirms our preexisting beliefs or hypotheses. It's one of the most pervasive cognitive biases affecting human reasoning.

**How Confirmation Bias Works:**
- **Selective Attention**: We notice information that supports our views
- **Biased Interpretation**: We interpret ambiguous information as confirming our beliefs
- **Selective Recall**: We remember confirming evidence better than disconfirming evidence
- **Biased Search**: We seek sources that align with our existing views

**Why It Evolved:**
Confirmation bias likely evolved as a mental shortcut that helped our ancestors make quick decisions in dangerous situations. If you believed certain areas were dangerous, it was safer to assume you were right than to test the belief.

**The Modern Problem:**
In our complex world, confirmation bias can lead to:
- Poor decision-making based on incomplete information
- Increased polarization and echo chambers
- Resistance to changing beliefs even when evidence warrants it
- Overconfidence in our own knowledge and judgment`
    },
    {
      id: 'mechanisms',
      title: 'How Confirmation Bias Manifests',
      content: `**Types of Confirmation Bias:**

**1. Cherry-Picking Evidence**
- Selecting only studies or data that support your position
- Ignoring larger bodies of contradictory evidence
- Focusing on anecdotal evidence that confirms beliefs

**2. Biased Source Selection**
- Only reading news sources that align with your views
- Following social media accounts that echo your opinions
- Dismissing credible sources that challenge your beliefs

**3. Motivated Reasoning**
- Working backward from desired conclusions
- Finding flaws in studies that contradict your views while accepting similar flaws in supporting studies
- Setting higher standards of evidence for opposing viewpoints

**4. Interpretation Bias**
- Seeing patterns that aren't there when they support your beliefs
- Explaining away contradictory evidence as exceptions or flawed
- Reframing negative evidence as actually supporting your position

**Real-World Examples:**
- **Health**: Believing supplements work and only noticing times you felt better after taking them
- **Politics**: Only sharing news stories that support your preferred candidate
- **Investing**: Focusing on analyst reports that support your stock picks while ignoring warnings
- **Relationships**: Interpreting ambiguous behavior from someone you like as positive`
    },
    {
      id: 'practice',
      title: 'Practice: Identifying Confirmation Bias',
      content: 'Let\'s practice recognizing confirmation bias in various scenarios. Look for selective attention, biased interpretation, and motivated reasoning.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Overcoming Confirmation Bias',
      content: `**Strategies to Counter Confirmation Bias:**

**1. Actively Seek Disconfirming Evidence**
- Ask: "What evidence would prove me wrong?"
- Deliberately search for opposing viewpoints
- Set aside time to read sources that challenge your views
- Engage with people who disagree with you respectfully

**2. Use the "Consider the Opposite" Technique**
- Before making a decision, list reasons why you might be wrong
- Imagine you had to argue the opposite position
- Ask trusted friends to play devil's advocate

**3. Diversify Your Information Sources**
- Read news from multiple perspectives
- Follow experts who disagree with each other
- Use fact-checking websites for important claims
- Seek primary sources rather than interpretations

**4. Practice Intellectual Humility**
- Acknowledge the limits of your knowledge
- Be willing to say "I don't know" or "I was wrong"
- Treat belief revision as intellectual growth, not failure
- Focus on being accurate rather than being right

**5. Use Systematic Decision-Making**
- Create pros and cons lists for important decisions
- Use structured frameworks for evaluating evidence
- Set criteria for what would change your mind before researching
- Document your reasoning process to review later

**Questions for Self-Reflection:**
- "What sources do I typically turn to for information?"
- "When was the last time I changed my mind about something important?"
- "Do I spend equal time considering opposing viewpoints?"
- "How do I react when my beliefs are challenged?"`
    }
  ];

  const practiceScenarios = [
    {
      id: 'scenario1',
      situation: 'Alex believes that a particular diet is the healthiest approach. When researching online, Alex primarily visits websites and forums that promote this diet, bookmarks success stories, and dismisses studies showing potential risks as "funded by the food industry."',
      question: 'What confirmation bias behaviors is Alex displaying?',
      analysis: 'Alex shows multiple confirmation bias patterns: 1) Biased source selection (only pro-diet websites), 2) Cherry-picking evidence (success stories), 3) Motivated reasoning (dismissing contrary studies), and 4) Source derogation (attacking funding rather than methodology).',
      explanation: 'This demonstrates how confirmation bias can affect health decisions by creating a false sense of certainty about complex nutritional science.'
    },
    {
      id: 'scenario2',
      situation: 'Maria strongly supports a political candidate. When a scandal breaks, she immediately searches for articles explaining why the allegations are false, shares posts defending the candidate, and argues that the timing of the scandal is suspicious. She doesn\'t read the original investigative reporting.',
      question: 'How is confirmation bias affecting Maria\'s information processing?',
      analysis: 'Maria exhibits: 1) Selective search (looking only for exonerating information), 2) Biased sharing (amplifying defensive content), 3) Conspiracy thinking (suspicious timing), and 4) Source avoidance (not reading original reporting). She\'s working backward from her desired conclusion.',
      explanation: 'This shows how confirmation bias can prevent us from objectively evaluating new information about people or causes we support, potentially leading to continued support despite legitimate concerns.'
    },
    {
      id: 'scenario3',
      situation: 'Dr. Smith has been using a particular treatment for years and believes it\'s effective. When new research suggests the treatment may be no better than placebo, Dr. Smith focuses on methodological flaws in the new study while not applying the same scrutiny to older studies that supported the treatment.',
      question: 'What professional confirmation bias is Dr. Smith demonstrating?',
      analysis: 'Dr. Smith shows: 1) Asymmetric skepticism (higher standards for challenging evidence), 2) Status quo bias (resistance to changing established practices), 3) Motivated reasoning (finding flaws in unwelcome studies), and 4) Professional identity protection (treatment choice reflects competence).',
      explanation: 'This illustrates how confirmation bias can affect professional judgment, potentially leading to continued use of ineffective treatments when practitioners have invested time and reputation in particular approaches.'
    }
  ];

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['confirmation-bias'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Confirmation Bias
          </h1>
          <p className="text-lg text-gray-600">
            Why we seek information that confirms our existing beliefs
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
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
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
                    <Eye className="w-5 h-5 text-green-500 mt-1" />
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
                    className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showAnswers[scenario.id] ? 'Answer Revealed' : 'Show Expert Analysis'}
                  </button>

                  {showAnswers[scenario.id] && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-500 mt-1" />
                        <div>
                          <h5 className="font-semibold text-blue-800 mb-2">Expert Analysis:</h5>
                          <p className="text-blue-700 mb-2">{scenario.analysis}</p>
                          <p className="text-sm text-blue-600">
                            <strong>Why This Matters:</strong> {scenario.explanation}
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
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmationBias;