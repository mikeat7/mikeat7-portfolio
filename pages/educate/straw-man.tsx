import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';


const StrawMan: React.FC = () => {
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
      title: 'Understanding Straw Man Fallacy',
      content: `A straw man fallacy occurs when someone misrepresents another person's argument to make it easier to attack. Instead of addressing the actual argument, they create a distorted version (the "straw man") that's easier to knock down.

**How Straw Man Works:**
- Misrepresents the opponent's actual position
- Creates a weaker, more extreme version of their argument
- Attacks the distorted version instead of the real argument
- Claims victory over an argument the person never made

**The Structure:**
Person A: "I think we should consider reducing military spending"
Person B: "So you want to leave our country defenseless against enemies!"

**Why It's Effective:**
- The distorted version is easier to argue against
- Audiences may not notice the misrepresentation
- It puts the opponent on the defensive
- It avoids engaging with the actual argument

**Straw Man vs. Legitimate Criticism:**
- **Straw Man**: Attacks a distorted version of the argument
- **Legitimate**: Addresses the actual argument as presented

**The Misrepresentation Trap:**
Straw man arguments can be subtle—they often contain elements of the original argument but exaggerate or distort them in ways that make them seem unreasonable.`
    },
    {
      id: 'techniques',
      title: 'Straw Man Techniques',
      content: `**Extreme Exaggeration:**
- Original: "We should have stricter gun regulations"
- Straw Man: "So you want to ban all guns and leave people defenseless!"
- Reality: Regulation ≠ complete prohibition

**Oversimplification:**
- Original: "Climate change requires multiple policy approaches"
- Straw Man: "So you think government control will solve everything!"
- Reality: Multiple approaches ≠ government-only solutions

**Motive Attribution:**
- Original: "This policy has some problems"
- Straw Man: "You just hate progress and want things to stay the same!"
- Reality: Criticism ≠ opposition to all change

**Context Stripping:**
- Original: "In certain circumstances, this approach might work"
- Straw Man: "You think this is always the answer to everything!"
- Reality: Conditional support ≠ universal application

**False Implications:**
- Original: "We should consider alternative energy sources"
- Straw Man: "So you want to destroy the economy and put people out of work!"
- Reality: Considering alternatives ≠ immediate elimination of current systems

**Emotional Amplification:**
- Original: "This program needs better oversight"
- Straw Man: "You want to destroy this program that helps children!"
- Reality: Improving oversight ≠ elimination

**The Pattern:**
Straw man arguments often use words like "so you think," "you want," or "you're saying" followed by an extreme version of the original position.`
    },
    {
      id: 'practice',
      title: 'Practice: Identifying Straw Man Arguments',
      content: 'Let\'s practice recognizing when arguments are being misrepresented and learning to correct the record. Look for distortions, exaggerations, and mischaracterizations.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Defending Against Straw Man Attacks',
      content: `**The Clarification Response:**
When your argument is misrepresented:
- "That's not what I said. Let me clarify my actual position..."
- "I think you may have misunderstood my argument. What I'm actually saying is..."
- "I didn't argue for [extreme version]. My position is [actual position]"

**The Restatement Strategy:**
- Clearly restate your original argument
- Point out specific ways it was misrepresented
- Ask them to address your actual position
- Don't get drawn into defending the straw man

**The Question Redirect:**
- "Can you respond to what I actually said rather than that interpretation?"
- "Where did I say [extreme version they attributed to you]?"
- "Would you like me to restate my position so we can discuss it accurately?"

**Prevention Strategies:**
- Be clear and specific in your original arguments
- Anticipate potential misrepresentations and address them
- Use concrete examples rather than abstract principles
- Define key terms to prevent misinterpretation

**Red Flags to Watch For:**
- **"So You're Saying" Language**: Followed by extreme interpretations
- **Motive Attribution**: Claiming to know why you hold a position
- **Extreme Extrapolation**: Taking your position to unreasonable conclusions
- **Context Removal**: Ignoring qualifications or conditions you mentioned
- **Emotional Escalation**: Making your position sound more extreme than it is

**The Persistence Strategy:**
- Don't let the conversation move forward until your position is accurately understood
- Keep redirecting back to your actual argument
- Don't defend positions you never took
- Insist on accuracy before continuing the discussion

**When You Might Be Straw Manning:**
- Check that you understand their position before criticizing it
- Ask clarifying questions if you're unsure
- Restate their argument and ask if you got it right
- Address their strongest argument, not their weakest

**Remember:**
You have the right to have your actual arguments addressed, not distorted versions of them. Don't let straw man tactics derail productive discussion.`
    }
  ];

  const practiceExamples = [
    {
      id: 'example1',
      statement: 'Original argument: "I think we should have more bike lanes in the city." Response: "So you want to ban all cars and force everyone to ride bicycles everywhere, even in winter!"',
      question: 'How is this a straw man and how would you respond?',
      analysis: 'This is a straw man because it misrepresents "more bike lanes" as "ban all cars" and "force everyone to ride bicycles." Response: "That\'s not what I said. I suggested adding more bike lanes, not banning cars. Bike lanes can coexist with car traffic and give people more transportation options. Can you respond to my actual suggestion about adding bike infrastructure?"',
      explanation: 'This straw man takes a moderate infrastructure suggestion and transforms it into an extreme transportation mandate, making the original reasonable proposal seem unreasonable.'
    },
    {
      id: 'example2',
      statement: 'Original argument: "Social media companies should have some content moderation policies." Response: "You want to destroy free speech and create a totalitarian censorship state where no one can express their opinions!"',
      question: 'What\'s being misrepresented here?',
      analysis: 'This misrepresents "some content moderation" as "destroy free speech" and "totalitarian censorship." The straw man transforms a nuanced position about platform policies into an extreme position about eliminating all free expression. Response: "I didn\'t argue for eliminating free speech. I suggested that private platforms might need policies for things like harassment or misinformation. Can we discuss what reasonable content policies might look like?"',
      explanation: 'This straw man prevents discussion of nuanced content moderation approaches by framing any moderation as complete censorship, eliminating middle-ground solutions.'
    },
    {
      id: 'example3',
      statement: 'Original argument: "We should consider raising the minimum wage gradually over several years." Response: "Economists have shown that doubling wages overnight would destroy small businesses and cause massive unemployment!"',
      question: 'How does this misrepresent the original argument?',
      analysis: 'This misrepresents "gradually over several years" as "doubling wages overnight." The straw man changes both the amount (doubling vs. unspecified increase) and timing (overnight vs. gradual). Response: "I didn\'t suggest doubling wages overnight. I proposed a gradual increase over several years. Can we discuss the economic effects of modest, phased wage increases instead?"',
      explanation: 'This straw man changes both the scale and timeline of the proposal to make it seem economically reckless, preventing discussion of the actual gradual approach suggested.'
    }
  ];

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['straw-man'] = true;
    localStorage.setItem('education-progress', JSON.stringify(progress));
    navigate('/educate');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-amber-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Straw Man Fallacy
          </h1>
          <p className="text-lg text-gray-600">
            Recognizing when your position is misrepresented
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
              className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-300"
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
                    <User className="w-5 h-5 text-amber-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Straw Man Analysis {index + 1}
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <p className="text-gray-700 text-sm">
                          {example.statement}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>{example.question}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowAnswers(prev => ({ ...prev, [example.id]: true }))}
                    disabled={showAnswers[example.id]}
                    className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="px-6 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StrawMan;