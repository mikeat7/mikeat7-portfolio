import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, CheckCircle, AlertTriangle, Brain, Zap } from 'lucide-react';


const AIAwareLesson: React.FC = () => {
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
  const [practiceAnswers, setPracticeAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState<Record<string, boolean>>({});

  // Scroll to top when section changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentSection]);

  const sections = [
    {
      id: 'introduction',
      title: 'Developing AI Awareness',
      content: `AI awareness is the ability to recognize when you're interacting with artificial intelligence and understand its capabilities and limitations. As AI becomes more sophisticated, this skill becomes crucial for maintaining critical thinking.

**Why AI Awareness Matters:**
- AI-generated content is increasingly indistinguishable from human content
- AI systems can be used to spread misinformation at scale
- Understanding AI helps you use it more effectively
- Protects you from being manipulated by AI-powered systems

**The AI Awareness Spectrum:**
- **Unaware**: Doesn't recognize AI interaction or capabilities
- **Basic Aware**: Knows when using AI but not its limitations
- **Critically Aware**: Understands AI capabilities, limitations, and biases
- **Expert Aware**: Can detect AI content and use AI tools strategically

**Key Insight:** The goal isn't to fear AI, but to understand it well enough to benefit from its capabilities while avoiding its pitfalls.`
    },
    {
      id: 'detection-skills',
      title: 'Developing AI Detection Skills',
      content: `**Linguistic Patterns in AI Text:**

**Structural Markers:**
- Overly perfect grammar and punctuation
- Consistent paragraph lengths and structure
- Lack of typos or informal language
- Generic, non-specific examples

**Content Markers:**
- Balanced perspectives on controversial topics
- Absence of strong personal opinions
- Generic advice without specific context
- Repetitive phrasing patterns

**Contextual Clues:**
- Perfect recall of obscure information
- Lack of personal anecdotes or experiences
- Inability to reference recent events (unless specifically trained)
- Consistent tone regardless of topic complexity

**Advanced Detection:**
- Ask follow-up questions that require genuine understanding
- Look for emotional authenticity in responses
- Check for consistency across long conversations
- Verify specific claims and citations`
    },
    {
      id: 'practice',
      title: 'Practice: AI Detection Challenge',
      content: 'Test your AI detection skills with these examples. Try to identify which responses are likely AI-generated and which are human.',
      interactive: true
    },
    {
      id: 'strategic-use',
      title: 'Strategic AI Use',
      content: `**How to Use AI Effectively:**

**Best Practices:**
- Use AI as a research starting point, not the final answer
- Always verify important information from authoritative sources
- Be specific in your prompts to get better responses
- Ask AI to explain its reasoning and limitations

**AI Strengths:**
- Rapid information synthesis
- Pattern recognition across large datasets
- Consistent availability and patience
- Ability to explain complex concepts simply

**AI Limitations:**
- No real-time information (unless specifically designed)
- Can't verify the accuracy of its own responses
- Lacks genuine understanding and context
- May perpetuate biases from training data

**Red Flags - Don't Use AI For:**
- Medical, legal, or financial advice
- Real-time information or current events
- Highly personal or sensitive decisions
- Situations requiring genuine empathy or emotional intelligence

**The AI Partnership Model:**
Think of AI as a very knowledgeable but sometimes unreliable research assistant. Use its capabilities while maintaining your critical thinking and verification responsibilities.`
    }
  ];

  const practiceExamples = [
    {
      id: 'example1',
      text: "Climate change is a complex issue with multiple perspectives. While many scientists emphasize the urgency of addressing greenhouse gas emissions, others focus on adaptation strategies. The most effective approach likely involves a combination of mitigation and adaptation measures, considering both environmental and economic factors.",
      type: 'ai',
      explanation: 'This shows classic AI "both sides" framing, generic language, and avoids taking a strong position on a topic where scientific consensus is actually quite strong.'
    },
    {
      id: 'example2',
      text: "Ugh, I've been trying to understand quantum mechanics for my physics class and it's driving me crazy! My professor keeps using these weird analogies that don't make sense to me. Like, how is an electron supposed to be in two places at once? That's just... what?? Anyone else struggling with this or am I just dumb? 😅",
      type: 'human',
      explanation: 'This shows genuine frustration, informal language, personal struggle, emotional expression, and the kind of authentic confusion that AI rarely captures.'
    },
    {
      id: 'example3',
      text: "According to recent studies, approximately 73% of consumers prefer personalized shopping experiences. This trend reflects the growing importance of data-driven marketing strategies in today's competitive retail landscape. Companies that leverage customer insights effectively can achieve significant improvements in conversion rates and customer satisfaction.",
      type: 'ai',
      explanation: 'This has classic AI markers: vague citation ("recent studies"), precise but unverifiable statistic, business jargon, and generic marketing language without specific examples.'
    }
  ];

  const handlePracticeAnswer = (exampleId: string, answer: string) => {
    setPracticeAnswers(prev => ({ ...prev, [exampleId]: answer }));
    setShowResults(prev => ({ ...prev, [exampleId]: true }));
  };

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['ai-aware'] = true;
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
            Becoming AI Aware
          </h1>
          <p className="text-lg text-gray-600">
            Develop intuition for AI-generated content and strategic AI use
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
              
              {practiceExamples.map((example, index) => (
                <div key={example.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Zap className="w-5 h-5 text-indigo-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Example {index + 1}
                      </h4>
                      <p className="text-gray-700 mb-4 p-4 bg-gray-50 rounded-md">
                        "{example.text}"
                      </p>
                      <p className="text-sm text-gray-600 mb-4">
                        Is this likely AI-generated or human-written?
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 mb-4">
                    <button
                      onClick={() => handlePracticeAnswer(example.id, 'ai')}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
                    >
                      AI-Generated
                    </button>
                    <button
                      onClick={() => handlePracticeAnswer(example.id, 'human')}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition"
                    >
                      Human-Written
                    </button>
                  </div>

                  {showResults[example.id] && (
                    <div className={`mt-4 p-4 rounded-md ${
                      practiceAnswers[example.id] === example.type 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        {practiceAnswers[example.id] === example.type ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
                        )}
                        <div>
                          <h5 className={`font-semibold mb-2 ${
                            practiceAnswers[example.id] === example.type 
                              ? 'text-green-800' 
                              : 'text-red-800'
                          }`}>
                            {practiceAnswers[example.id] === example.type ? 'Correct!' : 'Not quite right'}
                          </h5>
                          <p className="text-sm text-gray-700 mb-2">
                            <strong>Answer:</strong> This is likely <strong>{example.type === 'ai' ? 'AI-generated' : 'human-written'}</strong>
                          </p>
                          <p className="text-sm text-gray-600">
                            {example.explanation}
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

export default AIAwareLesson;