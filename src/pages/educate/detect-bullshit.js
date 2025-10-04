import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, CheckCircle, Search } from 'lucide-react';
const DetectBullshit = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [currentSection, setCurrentSection] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState({});
    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSection]);
    const sections = [
        {
            id: 'introduction',
            title: 'Understanding Bullshit',
            content: `Bullshit isn't always a lie. According to philosopher Harry Frankfurt, bullshit is language designed to sound impressive without regard for truth. Unlike lying (which requires knowing the truth), bullshit is indifferent to truth or falsehood.

**What Makes Something Bullshit:**
- Appeals to emotion rather than evidence
- Uses authority or credentials inappropriately
- Employs technical jargon to sound impressive
- Makes confident claims without supporting sources
- Shifts topics when challenged instead of answering directly

**Why Bullshit is Dangerous:**
- It pollutes public discourse with meaningless noise
- It makes real information harder to find and trust
- It exploits our cognitive shortcuts and biases
- It can influence important decisions without merit

**The Key Insight:**
Just because something sounds smart, authoritative, or uses big words doesn't mean it's true or meaningful. Bullshit often sounds more impressive than honest, careful communication.

**Frankfurt's Definition:**
"Bullshit is speech intended to persuade without regard for truth." The bullshitter doesn't care whether their statements are true or false—only whether they achieve their desired effect.`
        },
        {
            id: 'warning-signs',
            title: 'Warning Signs of Bullshit',
            content: `**Red Flags to Watch For:**

**1. Confident Claims Without Sources**
- "Studies show..." (which studies?)
- "Experts agree..." (which experts?)
- "It's proven that..." (proven how?)
- "Everyone knows..." (based on what evidence?)

**2. Vague Technical Language**
- Using complex terms without clear definitions
- Scientific-sounding words used incorrectly
- Jargon that doesn't add meaningful information
- "Quantum," "energy," "toxins" used loosely

**3. Emotional Appeals Over Evidence**
- Fear-based arguments without data
- Appeals to hope or desire rather than facts
- Personal attacks instead of addressing arguments
- Tribal language ("us vs them")

**4. Topic Shifting and Deflection**
- Changing the subject when challenged
- Answering different questions than asked
- Using whataboutism to avoid direct responses
- Attacking the questioner instead of addressing the question

**5. False Precision and Authority**
- Overly specific statistics without sources
- Name-dropping without relevant expertise
- Institutional affiliations used inappropriately
- Credentials that don't match the claims being made`
        },
        {
            id: 'practice',
            title: 'Practice: Identifying Bullshit',
            content: 'Let\'s practice identifying bullshit in various statements. Look for the warning signs and consider what questions you would ask to verify the claims.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Your Bullshit Detection Toolkit',
            content: `**Questions to Ask:**

**1. Evidence Questions**
- What's the evidence for this claim?
- Can I trace this back to original sources?
- Are there peer-reviewed studies supporting this?
- What would convince me this is wrong?

**2. Source Questions**
- Who is making this claim?
- What are their qualifications in this specific area?
- Do they have conflicts of interest?
- Are other qualified experts saying the same thing?

**3. Logic Questions**
- Does this argument make logical sense?
- Are there unstated assumptions?
- Does the conclusion follow from the premises?
- What alternative explanations exist?

**4. Context Questions**
- What information might be missing?
- How does this fit with what I already know?
- What would opponents of this view say?
- Is this claim too convenient for someone's agenda?

**The Bullshit Test:**
If you can't get clear, specific answers to these questions, you're probably dealing with bullshit.

**Remember:**
- Extraordinary claims require extraordinary evidence
- Complexity doesn't equal correctness
- Confidence doesn't equal competence
- If it sounds too good (or bad) to be true, it probably is

**Your Goal:**
Develop a healthy skepticism that protects you from manipulation while remaining open to legitimate new information.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: "Revolutionary quantum energy technology harnesses zero-point field fluctuations to boost cellular metabolism by 300%, as proven by leading scientists at prestigious institutions worldwide.",
            question: 'What bullshit warning signs do you see here?',
            analysis: 'Multiple red flags: 1) Misused scientific terms ("quantum energy," "zero-point field"), 2) Vague authority ("leading scientists," "prestigious institutions"), 3) Precise but unverifiable claims ("300%"), 4) No specific sources or studies cited, 5) Sounds impressive but is scientifically meaningless.',
            explanation: 'This combines scientific-sounding jargon with vague authority claims to create an impression of legitimacy without providing any verifiable information.'
        },
        {
            id: 'example2',
            statement: "Based on our preliminary analysis of 127 participants over 6 weeks, this intervention showed a 23% improvement in the primary outcome measure, though we need larger studies to confirm these findings and understand the mechanism.",
            question: 'How does this differ from bullshit?',
            analysis: 'This shows scientific integrity: 1) Specific methodology details (127 participants, 6 weeks), 2) Precise but appropriately qualified results (23% improvement), 3) Acknowledges limitations ("preliminary," "need larger studies"), 4) Admits uncertainty about mechanism, 5) Invites further research.',
            explanation: 'This demonstrates how legitimate scientific communication provides specific details, acknowledges limitations, and invites scrutiny rather than demanding acceptance.'
        },
        {
            id: 'example3',
            statement: "The mainstream media won't tell you this, but ancient wisdom traditions have always known what modern science is just discovering about the healing power of natural frequencies.",
            question: 'What makes this statement problematic?',
            analysis: 'Classic bullshit patterns: 1) Conspiracy implication ("media won\'t tell you"), 2) Vague authority ("ancient wisdom traditions"), 3) False scientific validation ("modern science discovering"), 4) Meaningless technical terms ("natural frequencies"), 5) No specific claims that can be verified.',
            explanation: 'This uses conspiracy thinking and false authority to make vague claims that sound meaningful but provide no actionable or verifiable information.'
        }
    ];
    const handleAnswerSubmit = (exampleId, answer) => {
        setUserAnswers(prev => ({ ...prev, [exampleId]: answer }));
        setShowFeedback(prev => ({ ...prev, [exampleId]: true }));
    };
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['detect-bullshit'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-purple-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mb-4", children: _jsx(Target, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "How to Detect Bullshit" }), _jsx("p", { className: "text-lg text-gray-600", children: "Learn to identify language designed to impress without regard for truth" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Search, { className: "w-5 h-5 text-purple-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Example ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic", children: ["\"", example.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("textarea", { className: "w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-4", rows: 3, placeholder: "Identify the bullshit warning signs in this statement...", value: userAnswers[example.id] || '', onChange: (e) => setUserAnswers(prev => ({ ...prev, [example.id]: e.target.value })) }), showFeedback[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition", children: "Next" }))] })] }) }));
};
export default DetectBullshit;
