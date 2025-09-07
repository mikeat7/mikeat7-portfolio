import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Brain, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';


const CognitiveDissonance: React.FC = () => {
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
      title: 'Understanding Cognitive Dissonance',
      content: `Cognitive dissonance is the mental discomfort experienced when you hold two or more contradictory beliefs, ideas, or values simultaneously. This psychological tension drives us to reduce the conflict, often in ways that compromise our reasoning.

**How Cognitive Dissonance Works:**
- **The Conflict**: Two beliefs contradict each other
- **The Discomfort**: Mental tension from the contradiction
- **The Resolution**: Mind seeks to reduce discomfort through rationalization

**Why It Matters for Clear Thinking:**
Cognitive dissonance can lead us to:
- Ignore contradictory evidence
- Rationalize poor decisions
- Maintain false beliefs
- Resist changing our minds even when presented with facts

**The Classic Example:**
A person knows smoking is harmful but continues to smoke. To reduce dissonance, they might:
- Downplay health risks ("My grandfather smoked and lived to 90")
- Emphasize benefits ("It helps me manage stress")
- Question the science ("Those studies aren't conclusive")
- Minimize personal risk ("I don't smoke that much")`
    },
    {
      id: 'mechanisms',
      title: 'How Dissonance Affects Reasoning',
      content: `**Common Dissonance Reduction Strategies:**

**1. Selective Attention**
- Focus only on information that supports existing beliefs
- Ignore or dismiss contradictory evidence
- Seek out confirming sources while avoiding challenging ones

**2. Rationalization**
- Create logical-sounding explanations for contradictory behavior
- Reframe actions to align with values
- Minimize the importance of conflicting information

**3. Belief Modification**
- Change less important beliefs to preserve core ones
- Adjust the strength of convictions rather than abandoning them
- Create exceptions or special circumstances

**4. Source Derogation**
- Attack the credibility of sources that provide conflicting information
- Question motives of those presenting contradictory evidence
- Dismiss expertise when it challenges existing beliefs

**Real-World Examples:**
- **Investment**: Continuing to hold losing stocks while ignoring negative news
- **Politics**: Supporting a candidate despite actions that contradict stated values
- **Health**: Maintaining unhealthy habits while knowing the risks
- **Relationships**: Staying in harmful relationships while recognizing the damage`
    },
    {
      id: 'practice',
      title: 'Practice: Recognizing Dissonance',
      content: 'Let\'s practice identifying cognitive dissonance in various scenarios. Look for the contradictory beliefs and how people might resolve the tension.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Managing Cognitive Dissonance',
      content: `**Healthy Approaches to Dissonance:**

**1. Embrace the Discomfort**
- Recognize dissonance as a signal that something needs examination
- Don't rush to resolve the tension immediately
- Sit with uncertainty while you gather more information

**2. Systematic Evaluation**
- List out the conflicting beliefs or values clearly
- Examine the evidence for each position objectively
- Consider which belief is more strongly supported by facts

**3. Seek Disconfirming Evidence**
- Actively look for information that challenges your beliefs
- Ask: "What would convince me I'm wrong?"
- Engage with credible sources that disagree with you

**4. Update Beliefs Based on Evidence**
- Be willing to change your mind when evidence warrants it
- Recognize that changing beliefs is a sign of intellectual growth
- Don't treat belief revision as personal failure

**5. Accept Complexity**
- Some situations genuinely involve competing values
- Not all dissonance needs to be resolved immediately
- Learn to hold nuanced positions that acknowledge trade-offs

**Questions for Self-Reflection:**
- "What beliefs do I hold that might contradict each other?"
- "Am I avoiding information that challenges my views?"
- "How do I typically respond when my beliefs are questioned?"
- "What would I need to see to change my mind on this topic?"`
    }
  ];

  const practiceScenarios = [
    {
      id: 'scenario1',
      situation: 'Sarah believes strongly in environmental protection and drives a hybrid car. However, she frequently takes international flights for vacation, which have a much larger carbon footprint than her car savings.',
      question: 'What cognitive dissonance might Sarah experience, and how might she resolve it?',
      analysis: 'Sarah experiences dissonance between her environmental values and high-carbon travel behavior. She might resolve this by: 1) Minimizing flight impact ("It\'s just a few trips per year"), 2) Offsetting ("I buy carbon credits"), 3) Compartmentalizing ("Travel broadens perspectives"), or 4) Questioning flight impact data.',
      explanation: 'This shows how we can maintain contradictory behaviors by creating mental separations or finding ways to justify actions that conflict with our stated values.'
    },
    {
      id: 'scenario2',
      situation: 'Mark prides himself on being rational and evidence-based. He discovers that a political candidate he strongly supports has been caught in several documented lies, but Mark continues his support.',
      question: 'How might cognitive dissonance manifest in Mark\'s thinking?',
      analysis: 'Mark faces dissonance between his rational self-image and supporting a dishonest candidate. He might: 1) Minimize the lies ("All politicians lie"), 2) Question sources ("Fake news"), 3) Emphasize other qualities ("Still better than the alternative"), or 4) Redefine rationality ("Emotions matter too").',
      explanation: 'This demonstrates how dissonance can lead us to compromise our stated principles rather than admit we made a poor choice, protecting our self-image at the cost of clear thinking.'
    },
    {
      id: 'scenario3',
      situation: 'Dr. Johnson, a medical professional, knows that a particular treatment has limited scientific support. However, many of her patients report feeling better after receiving it, and it generates significant revenue for her practice.',
      question: 'What dissonance might Dr. Johnson experience between her scientific training and practice?',
      analysis: 'Dr. Johnson faces conflict between scientific rigor and patient satisfaction/financial incentives. She might resolve this by: 1) Emphasizing patient reports ("Patients feel better"), 2) Questioning study limitations ("More research needed"), 3) Focusing on harm reduction ("At least it doesn\'t hurt"), or 4) Reframing her role ("I provide hope").',
      explanation: 'This shows how professional and financial pressures can create dissonance with scientific principles, leading to rationalization of practices that may not be evidence-based.'
    }
  ];

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['cognitive-dissonance'] = true;
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Cognitive Dissonance
          </h1>
          <p className="text-lg text-gray-600">
            Understanding how contradictory beliefs affect our reasoning
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
              className="bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
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
                    <AlertTriangle className="w-5 h-5 text-purple-500 mt-1" />
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
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showAnswers[scenario.id] ? 'Answer Revealed' : 'Show Expert Analysis'}
                  </button>

                  {showAnswers[scenario.id] && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-5 h-5 text-blue-500 mt-1" />
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

export default CognitiveDissonance;