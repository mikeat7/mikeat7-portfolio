import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, CheckCircle, AlertTriangle, Lightbulb } from 'lucide-react';


const AppealToAuthorityLesson: React.FC = () => {
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
      title: 'Understanding Appeal to Authority',
      content: `Appeal to authority becomes a logical fallacy when someone's expertise or status is used inappropriately to support an argument. While legitimate expertise is valuable, authority can be misused to bypass critical thinking and evidence-based reasoning.

**When Authority is Legitimate:**
- Expert speaks within their field of expertise
- Claims are supported by evidence, not just credentials
- Other qualified experts generally agree
- The authority welcomes scrutiny and questions

**When Authority Becomes Fallacious:**
- Expert speaks outside their area of expertise
- Credentials are used to replace evidence
- Authority is vague or unverifiable
- Disagreement is dismissed based on authority alone

**The Authority Spectrum:**
- **Valid**: "Dr. Smith, a cardiologist, explains heart surgery risks based on 20 years of surgical experience"
- **Questionable**: "Dr. Smith says this diet is best" (outside expertise)
- **Fallacious**: "Famous person endorses this product, so it must work"

**Why We Fall for It:**
We evolved in small groups where authority figures had direct, verifiable expertise. In our complex world, we can't verify everything personally, so we use authority as a shortcut—which can be exploited.`
    },
    {
      id: 'types',
      title: 'Types of Authority Misuse',
      content: `**Irrelevant Expertise:**
- Celebrity endorsements of products outside their field
- Scientists speaking on topics outside their specialty
- Business leaders giving medical advice
- Athletes promoting financial products

**Vague Authority Claims:**
- "Doctors recommend..." (which doctors?)
- "Experts agree..." (which experts?)
- "Studies show..." (which studies?)
- "Scientists say..." (which scientists?)

**False Consensus:**
- "All reputable scientists agree..."
- "No serious expert disputes..."
- "The medical community has reached consensus..."
- Often: Ignoring legitimate dissent

**Credential Inflation:**
- Using impressive but irrelevant credentials
- Emphasizing institutional affiliations over actual expertise
- Name-dropping without relevant qualifications
- Creating false impression of universal expert support

**Authority Transfer:**
- Using institutional prestige to support personal opinions
- Borrowing credibility from one field for claims in another
- Leveraging past achievements for current unrelated claims
- Trading on reputation rather than evidence

**The Key Distinction:**
Legitimate authority provides evidence and reasoning. Fallacious authority replaces evidence with credentials.`
    },
    {
      id: 'practice',
      title: 'Practice: Evaluating Authority Claims',
      content: 'Let\'s practice distinguishing between legitimate expertise and fallacious appeals to authority. Consider the relevance of credentials and the quality of reasoning.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Defending Against Authority Manipulation',
      content: `**The Expertise Verification:**
- Is this person qualified in this specific area?
- Are they speaking within their field of expertise?
- What's the quality of their reasoning and evidence?
- Do other qualified experts agree or disagree?

**The Evidence Check:**
- What evidence supports their claim beyond their credentials?
- Can their reasoning be evaluated independently?
- Are they providing data or just opinions?
- Would the argument stand without the authority claim?

**The Consensus Reality Check:**
- How do we know there's actually consensus?
- Who's included in this supposed agreement?
- What do dissenting experts say?
- Is disagreement being suppressed or ignored?

**Red Flags to Watch For:**
- **Irrelevant Credentials**: Expertise in one field used for claims in another
- **Vague Attributions**: "Experts say" without naming specific experts
- **Credential Substitution**: Using impressive titles instead of evidence
- **Consensus Claims**: Assertions of universal agreement
- **Authority Intimidation**: Suggesting only experts can have opinions

**The Authority Test:**
Ask yourself: "Would this argument be convincing if it came from someone without credentials?"

**Questions to Ask:**
- "What's their specific expertise in this area?"
- "What evidence supports their claim?"
- "Do other experts in this field agree?"
- "Are there conflicts of interest?"

**Remember:**
- Expertise is valuable but not infallible
- Even experts can be wrong, especially outside their field
- Evidence matters more than credentials
- You can respect expertise while still thinking critically

**The Authority Balance:**
Use expert knowledge as valuable input while maintaining your critical thinking. Don't surrender your judgment, but don't ignore legitimate expertise either.`
    }
  ];

  const practiceExamples = [
    {
      id: 'example1',
      statement: "Nobel Prize-winning physicist Dr. Johnson says this new cryptocurrency will revolutionize the global economy and everyone should invest immediately.",
      question: 'What authority misuse do you see here?',
      analysis: 'Authority misuse through: 1) Irrelevant expertise (physics ≠ economics/finance), 2) Credential inflation (Nobel Prize impressive but irrelevant), 3) Absolute claims ("revolutionize global economy"), 4) Investment advice outside expertise, 5) Urgency pressure ("immediately"). Physics expertise doesn\'t qualify someone for financial advice.',
      explanation: 'This shows how impressive credentials can be misused to lend authority to claims outside the expert\'s field of knowledge, potentially misleading people into poor financial decisions.'
    },
    {
      id: 'example2',
      statement: "Leading doctors agree that this supplement is essential for optimal health, and anyone who questions it is ignoring medical science.",
      question: 'How is authority being manipulated here?',
      analysis: 'Authority manipulation through: 1) Vague attribution ("leading doctors" - which ones?), 2) Absolute claims ("essential"), 3) False consensus ("doctors agree"), 4) Dismissal of dissent ("ignoring medical science"), 5) No specific evidence provided. Creates false impression of medical consensus.',
      explanation: 'This uses vague authority claims to shut down legitimate questions about a health product, creating false impression of medical consensus without providing verifiable evidence.'
    },
    {
      id: 'example3',
      statement: "Dr. Martinez, an infectious disease specialist with 15 years of experience, explains that hand hygiene remains one of the most effective ways to prevent disease transmission, based on multiple peer-reviewed studies.",
      question: 'How does this differ from fallacious authority?',
      analysis: 'This shows legitimate authority use: 1) Relevant expertise (infectious disease specialist), 2) Specific qualifications (15 years experience), 3) Evidence-based claim (peer-reviewed studies), 4) Reasonable, verifiable claim, 5) No dismissal of questions or alternative views. The authority supports rather than replaces evidence.',
      explanation: 'This demonstrates how legitimate expertise can be presented appropriately, with relevant credentials supporting evidence-based claims rather than replacing the need for evidence.'
    }
  ];

  const handleAnswerSubmit = (exampleId: string, answer: string) => {
    setUserAnswers(prev => ({ ...prev, [exampleId]: answer }));
    setShowFeedback(prev => ({ ...prev, [exampleId]: true }));
  };

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['appeal-to-authority'] = true;
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Appeal to Authority
          </h1>
          <p className="text-lg text-gray-600">
            When expert opinion becomes logical fallacy
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
              
              {practiceExamples.map((example, index) => (
                <div key={example.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Crown className="w-5 h-5 text-purple-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Authority Analysis {index + 1}
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
                    onClick={() => setShowFeedback(prev => ({ ...prev, [example.id]: true }))}
                    disabled={showFeedback[example.id]}
                    className="bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showFeedback[example.id] ? 'Answer Revealed' : 'Show Expert Analysis'}
                  </button>

                  {showFeedback[example.id] && (
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

export default AppealToAuthorityLesson;