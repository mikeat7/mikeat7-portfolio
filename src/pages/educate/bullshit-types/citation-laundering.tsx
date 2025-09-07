import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Link, CheckCircle, AlertTriangle, Search, ExternalLink } from 'lucide-react';


const CitationLaunderingLesson: React.FC = () => {
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
      title: 'Understanding Citation Laundering',
      content: `Citation laundering is the process by which false or misleading information gains credibility through repeated citation, creating an illusion of scholarly support where none exists.

**How Citation Laundering Works:**
1. **Original Claim**: Someone makes an unsupported or false claim
2. **Initial Citation**: A blog, news article, or weak study cites the claim
3. **Secondary Citations**: Other sources cite the first citation, not the original
4. **Credibility Cascade**: Each citation makes the claim appear more legitimate
5. **False Authority**: Eventually, the claim is treated as established fact

**Why It's Dangerous:**
- Creates false scientific consensus
- Makes misinformation appear scholarly
- Exploits our trust in academic citations
- Can influence policy and public opinion

**The Wikipedia Problem:**
Wikipedia articles can become part of citation laundering when:
- Unreliable sources are used as references
- Circular citations occur (A cites B, B cites A)
- Editors don't verify original sources
- Popular but false claims get repeated`
    },
    {
      id: 'mechanisms',
      title: 'How Citation Laundering Spreads',
      content: `**The Citation Cascade Process:**

**Stage 1: Seed Planting**
- Original false claim appears in blog post, press release, or weak study
- Often contains emotional or sensational elements that encourage sharing
- May misrepresent legitimate research or take findings out of context

**Stage 2: Media Amplification**
- Journalists cite the original source without verification
- Headlines may exaggerate or distort the original claim
- Social media spreads the story rapidly

**Stage 3: Academic Infiltration**
- Researchers cite news articles or weak studies in literature reviews
- The claim appears in academic papers, gaining scholarly credibility
- Peer review may not catch the weak foundation

**Stage 4: Reference Laundering**
- Later sources cite the academic papers, not the original weak source
- The claim now appears to have multiple independent confirmations
- Original weak foundation becomes invisible

**Stage 5: Established "Fact"**
- The claim is now treated as established knowledge
- Questioning it seems unreasonable or anti-intellectual
- The false information has been successfully laundered`
    },
    {
      id: 'practice',
      title: 'Practice: Identifying Citation Laundering',
      content: 'Learn to spot citation laundering by examining these citation chains. Look for red flags that indicate weak or circular sourcing.',
      interactive: true
    },
    {
      id: 'defense',
      title: 'Defending Against Citation Laundering',
      content: `**Verification Strategies:**

**1. Trace Back to Original Sources**
- Don't stop at the first citation—go to the original study or data
- Check if secondary sources accurately represent the original
- Look for the actual methodology and sample sizes

**2. Evaluate Source Quality**
- Is the original source peer-reviewed?
- What's the reputation of the journal or institution?
- Are the authors qualified experts in the relevant field?
- Are there conflicts of interest?

**3. Look for Independent Confirmation**
- Has the finding been replicated by independent researchers?
- Do multiple high-quality studies support the claim?
- Are there systematic reviews or meta-analyses?

**4. Check for Citation Patterns**
- Are all citations from the same research group or institution?
- Do sources cite each other in circular patterns?
- Are recent citations just citing older citations without new evidence?

**5. Red Flags to Watch For**
- Extraordinary claims with minimal evidence
- Citations that don't support the claim being made
- Vague attributions ("studies show," "research indicates")
- Claims that seem too convenient for someone's agenda

**Remember:** Good science builds on multiple independent confirmations, not citation cascades from weak foundations.`
    }
  ];

  const practiceExamples = [
    {
      id: 'example1',
      scenario: 'A health blog claims "Studies show that 90% of doctors recommend daily vitamin supplements." The blog cites a news article, which cites a press release from a supplement company, which references an unpublished survey of 50 doctors.',
      question: 'What citation laundering red flags do you see?',
      answer: 'Multiple red flags: vague attribution ("studies show"), citation chain that leads to weak source (unpublished survey), small sample size (50 doctors), potential conflict of interest (supplement company), and no peer review.',
      explanation: 'This is a classic citation laundering chain where a weak, biased source gets credibility through multiple citations, making it appear more legitimate than it actually is.'
    },
    {
      id: 'example2',
      scenario: 'An academic paper states "Research demonstrates that meditation increases IQ by 15 points (Smith et al., 2019; Jones et al., 2020; Brown et al., 2021)." When you check: Smith cites a preliminary study of 20 people, Jones cites Smith, and Brown cites both Smith and Jones.',
      question: 'How has citation laundering occurred here?',
      answer: 'Circular citation pattern where later studies cite earlier ones without independent verification. The original Smith study had only 20 participants (too small for reliable conclusions), but the multiple citations make it appear well-established.',
      explanation: 'This shows how a weak original study can appear strongly supported through circular citations, when in reality there\'s only one small, preliminary study behind the claim.'
    },
    {
      id: 'example3',
      scenario: 'A policy report claims "Experts agree that remote work reduces productivity by 25%." It cites five academic papers. When traced back, all five papers cite the same original corporate survey from 2019 that surveyed only managers (not workers) and was funded by a commercial real estate company.',
      question: 'What makes this citation laundering problematic?',
      answer: 'Single weak source (corporate survey), biased sample (only managers), conflict of interest (real estate company funding), and false appearance of multiple independent confirmations when all sources trace back to the same flawed study.',
      explanation: 'This demonstrates how citation laundering can influence policy by making biased, limited research appear to have broad academic support.'
    }
  ];

  const handlePracticeAnswer = (exampleId: string, answer: string) => {
    setPracticeAnswers(prev => ({ ...prev, [exampleId]: answer }));
    setShowResults(prev => ({ ...prev, [exampleId]: true }));
  };

  const completeLesson = () => {
    const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
    progress['citation-laundering'] = true;
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
            <Link className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Citation Laundering
          </h1>
          <p className="text-lg text-gray-600">
            How false information gains credibility through repeated citation
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
                    <Search className="w-5 h-5 text-blue-500 mt-1" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        Citation Chain Analysis {index + 1}
                      </h4>
                      <div className="bg-gray-50 p-4 rounded-md mb-4">
                        <p className="text-gray-700 text-sm mb-2">
                          <strong>Scenario:</strong>
                        </p>
                        <p className="text-gray-700 text-sm">
                          {example.scenario}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        <strong>{example.question}</strong>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowResults(prev => ({ ...prev, [example.id]: true }))}
                    disabled={showResults[example.id]}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {showResults[example.id] ? 'Answer Revealed' : 'Show Expert Analysis'}
                  </button>

                  {showResults[example.id] && (
                    <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                        <div>
                          <h5 className="font-semibold text-green-800 mb-2">Expert Analysis:</h5>
                          <p className="text-green-700 mb-2">
                            <strong>Key Red Flags:</strong> {example.answer}
                          </p>
                          <p className="text-sm text-green-600">
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

export default CitationLaunderingLesson;