import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GitBranch, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';


const FalseDichotomy: React.FC = () => {
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
      title: 'Understanding False Dichotomy',
      content: `A false dichotomy (also called false dilemma or either/or fallacy) occurs when someone presents only two options as if they're the only possibilities, when in reality there are other alternatives available.

**How False Dichotomy Works:**
- Reduces complex situations to simple either/or choices
- Eliminates middle ground and nuanced positions
- Forces people to choose between extremes
- Makes one option appear obviously better by comparison

**The Structure:**
"Either we do X or Y will happen" (ignoring options Z, A, B, C...)

**Why It's Persuasive:**
- Simplifies complex decisions
- Creates urgency by limiting options
- Makes the preferred choice seem obvious
- Exploits our preference for clear, simple choices

**Real vs. False Dichotomies:**
- **Real**: "Either we turn left or right at this intersection"
- **False**: "Either we spend more on defense or we'll be invaded"

**The Spectrum Problem:**
Most real-world issues exist on spectrums with multiple positions, not binary choices. False dichotomies artificially collapse these spectrums into two extreme positions.`
    },
    {
      id: 'examples',
      title: 'False Dichotomy in Action',
      content: `**Political Examples:**
- "You're either with us or against us"
- "Either we cut taxes or the economy will collapse"
- "You either support law enforcement or you support crime"
- Reality: Multiple approaches to each issue exist

**Personal Examples:**
- "Either you trust me completely or you don't trust me at all"
- "Either we buy the expensive option or we'll regret getting cheap junk"
- "Either you're successful or you're a failure"
- Reality: Trust, quality, and success exist on spectrums

**Business Examples:**
- "Either we expand rapidly or our competitors will crush us"
- "Either we cut costs drastically or we'll go bankrupt"
- "Either you're a team player or you're working against us"
- Reality: Multiple strategic options usually exist

**Social Examples:**
- "Either you care about the environment or you care about the economy"
- "Either you support free speech or you support safety"
- "Either you're progressive or you're conservative"
- Reality: People can hold nuanced positions on complex issues

**The Pattern:**
False dichotomies often use "either/or" language, but they can also be implied through context or framing that suggests only two options exist.`
    },
    {
      id: 'practice',
      title: 'Practice: Spotting False Dichotomies',
      content: 'Let\'s practice identifying false dichotomies and finding the missing alternatives. For each example, identify why it\'s a false dichotomy and suggest other options.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Defending Against False Dichotomies',
      content: `**The Third Option Strategy:**
When presented with an either/or choice, ask:
- "Are these really the only two options?"
- "What other alternatives might exist?"
- "Is there a middle ground or compromise position?"
- "What would a third option look like?"

**The Spectrum Recognition:**
- Look for issues that naturally exist on spectrums
- Identify the extremes being presented
- Find positions between the extremes
- Consider multiple dimensions of the issue

**The Reframe Technique:**
- "I see you've presented two options. Let me think about other possibilities..."
- "Before choosing between these, are there other approaches we haven't considered?"
- "What if we combined elements from both options?"

**Red Flags to Watch For:**
- **Either/Or Language**: "Either we do this or that will happen"
- **Extreme Comparisons**: Presenting moderate positions as extreme
- **Urgency Pressure**: "We must choose now between these two options"
- **Dismissal of Alternatives**: "There's no other way" or "No middle ground"

**Questions to Ask:**
- "What assumptions are built into these two choices?"
- "Who benefits from limiting the options this way?"
- "What would happen if we took more time to explore alternatives?"
- "Are there successful examples of different approaches?"

**The Nuance Response:**
- "This seems more complex than an either/or choice"
- "I'd like to explore some alternative approaches"
- "What if we considered a spectrum of options rather than just two?"

**Remember:**
Most important decisions deserve more than two options. When someone limits your choices artificially, they're often trying to manipulate your decision.`
    }
  ];

  const practiceExamples = [
    {
      id: 'example1',
      statement: "Either we implement strict gun control laws, or we accept that mass shootings will continue to happen. There's no other solution to this problem.",
      question: 'Why is this a false dichotomy and what alternatives exist?',
      analysis: 'This is a false dichotomy because it presents only two extreme options when many alternatives exist: improved background checks, mental health programs, school security measures, safe storage requirements, red flag laws, community intervention programs, etc. The issue is complex with multiple contributing factors requiring multifaceted solutions.',
      explanation: 'Complex social problems rarely have simple either/or solutions. This false dichotomy prevents consideration of the many evidence-based approaches that could address different aspects of the problem simultaneously.'
    },
    {
      id: 'example2',
      statement: "You either believe in science or you believe in religion. You can't have it both ways.",
      question: 'What makes this a false dichotomy?',
      analysis: 'This creates a false dichotomy between science and religion when many people successfully integrate both perspectives. Alternatives include: viewing them as addressing different questions, seeing religion as providing meaning while science provides mechanism, compartmentalizing different domains, or finding synthesis approaches. Many scientists are religious and many religious people accept scientific findings.',
      explanation: 'This false dichotomy ignores the millions of people who find ways to integrate scientific understanding with religious or spiritual beliefs, treating complex philosophical questions as simple either/or choices.'
    },
    {
      id: 'example3',
      statement: "Either we reopen the economy completely right now, or we destroy people's livelihoods with endless lockdowns.",
      question: 'What alternatives does this false dichotomy ignore?',
      analysis: 'This ignores numerous middle-ground approaches: phased reopening, sector-specific guidelines, capacity limitations, outdoor alternatives, improved ventilation, targeted restrictions for high-risk areas, financial support for affected businesses, hybrid work arrangements, etc. The choice isn\'t binary between "completely open" and "endless lockdowns."',
      explanation: 'Public health policy involves balancing multiple factors and can be adjusted gradually based on conditions, rather than requiring extreme either/or choices between health and economy.'
    }
  ];

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['false-dichotomy'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mb-4">
            <GitBranch className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            False Dichotomy
          </h1>
          <p className="text-lg text-gray-600">
            When complex issues are reduced to artificial either/or choices
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
              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
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
                    <GitBranch className="w-5 h-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Dichotomy Analysis {index + 1}
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
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis'}
                  </button>

                  {showAnswers[example.id] && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-purple-500 mt-1" />
                        <div>
                          <h5 className="font-semibold text-purple-800 mb-2">Expert Analysis:</h5>
                          <p className="text-purple-700 mb-2">{example.analysis}</p>
                          <p className="text-sm text-purple-600">
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
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FalseDichotomy;