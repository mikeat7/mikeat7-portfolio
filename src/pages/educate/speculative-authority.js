import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Users } from 'lucide-react';
const SpeculativeAuthorityLesson = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [currentSection, setCurrentSection] = useState(0);
    const [quizAnswers, setQuizAnswers] = useState({});
    const [showFeedback, setShowFeedback] = useState({});
    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSection]);
    const sections = [
        {
            id: 'introduction',
            title: 'The Authority Trap',
            content: `Authority can be a legitimate source of knowledge—but it can also be weaponized to shut down critical thinking. Speculative authority occurs when someone uses the appearance of expertise to make claims beyond their actual knowledge or competence.

**How Authority Manipulation Works:**
- Borrows credibility from legitimate institutions
- Uses vague attributions that can't be verified
- Transfers authority from one domain to another
- Creates false consensus among "experts"

**The Authority Spectrum:**
- **Legitimate**: "Dr. Smith, a cardiologist with 20 years experience, says..."
- **Questionable**: "Doctors say that..."
- **Manipulative**: "Experts agree that anyone who disagrees is wrong"

**Why We Fall for It:**
Humans evolved in small groups where authority figures had direct, verifiable expertise. In our complex modern world, we can't personally verify every claim, so we rely on authority shortcuts—which can be exploited.`
        },
        {
            id: 'types',
            title: 'Types of Authority Manipulation',
            content: `**Vague Expert Appeals:**
- "Scientists claim..."
- "Doctors recommend..."
- "Experts agree..."
- "Studies show..."

**Institutional Name-Dropping:**
- "The CDC says..." (without context about data limitations)
- "Harvard research proves..." (without citing specific study)
- "Government data shows..." (without methodology details)

**False Consensus:**
- "All reputable scientists agree..."
- "No serious expert disputes..."
- "The scientific community has reached consensus..."

**Authority Transfer:**
- Celebrity endorsements of medical products
- Politicians making scientific claims
- Business leaders giving health advice

**Manufactured Expertise:**
- Self-proclaimed "experts" with questionable credentials
- Think tanks with official-sounding names
- "Studies" funded by interested parties`
        },
        {
            id: 'practice',
            title: 'Practice: Evaluate Authority Claims',
            content: 'Let\'s practice evaluating different authority claims. For each statement, identify what makes the authority claim weak or strong.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Defending Against Authority Manipulation',
            content: `**The Verification Questions:**
- Who specifically is making this claim?
- What are their actual qualifications in this specific area?
- Can I find and read their original work?
- Do other qualified experts agree or disagree?

**The Context Check:**
- Is this person speaking within their area of expertise?
- Do they have conflicts of interest?
- Are they representing their own views or institutional positions?
- What's the quality of evidence behind their claims?

**The Consensus Reality Check:**
- How do I know there's actually consensus?
- Who's included in this "consensus"?
- What do dissenting experts say?
- Is disagreement being suppressed or ignored?

**Red Flags:**
- Vague attributions ("experts say")
- Claims of universal agreement
- Dismissal of all disagreement as illegitimate
- Authority figures speaking outside their expertise
- Emotional language attached to authority claims

**Remember:** Real experts acknowledge uncertainty, cite specific evidence, and welcome scrutiny of their claims.`
        }
    ];
    const practiceQuestions = [
        {
            id: 'q1',
            statement: "Dr. Johnson, a leading epidemiologist at Johns Hopkins with 15 years of infectious disease research, published a peer-reviewed study showing that mask effectiveness varies by type and fit.",
            options: [
                'Strong authority - specific credentials, verifiable claim',
                'Weak authority - too specific to be trusted',
                'Manipulative authority - appeals to prestige'
            ],
            correct: 0,
            explanation: 'This provides specific, verifiable credentials directly relevant to the claim, and acknowledges nuance rather than making absolute statements.'
        },
        {
            id: 'q2',
            statement: "Scientists agree that climate change is a hoax perpetrated by government agencies to control the population.",
            options: [
                'Strong authority - cites scientific consensus',
                'Weak authority - vague and contradicts established science',
                'Neutral authority - presents both sides'
            ],
            correct: 1,
            explanation: 'This uses vague attribution ("scientists") to make a claim that contradicts overwhelming scientific evidence, and adds conspiracy elements.'
        },
        {
            id: 'q3',
            statement: "A Harvard study proves that this supplement cures diabetes.",
            options: [
                'Strong authority - Harvard is prestigious',
                'Weak authority - lacks specifics and makes extreme claims',
                'Moderate authority - university research is reliable'
            ],
            correct: 1,
            explanation: 'While Harvard is prestigious, this lacks specific study details and makes an extreme medical claim ("cures") that would require extensive evidence.'
        }
    ];
    const handleQuizAnswer = (questionId, answerIndex) => {
        setQuizAnswers(prev => ({ ...prev, [questionId]: answerIndex.toString() }));
        setShowFeedback(prev => ({ ...prev, [questionId]: true }));
    };
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['speculative-authority'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-purple-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full mb-4", children: _jsx(Shield, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Speculative Authority" }), _jsx("p", { className: "text-lg text-gray-600", children: "Learn to distinguish legitimate expertise from manipulative authority claims" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-purple-500 to-indigo-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceQuestions.map((question, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Users, { className: "w-5 h-5 text-purple-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Question ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md", children: ["\"", question.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: "How would you evaluate this authority claim?" })] })] }), _jsx("div", { className: "space-y-2 mb-4", children: question.options.map((option, optionIndex) => (_jsxs("label", { className: "flex items-center gap-2 cursor-pointer", children: [_jsx("input", { type: "radio", name: question.id, className: "text-purple-500 focus:ring-purple-500", onChange: () => handleQuizAnswer(question.id, optionIndex) }), _jsx("span", { className: "text-sm text-gray-700", children: option })] }, optionIndex))) }), showFeedback[question.id] && (_jsx("div", { className: `mt-4 p-4 rounded-md ${parseInt(quizAnswers[question.id]) === question.correct
                                                ? 'bg-green-50 border border-green-200'
                                                : 'bg-red-50 border border-red-200'}`, children: _jsxs("div", { className: "flex items-start gap-2", children: [parseInt(quizAnswers[question.id]) === question.correct ? (_jsx(CheckCircle, { className: "w-5 h-5 text-green-500 mt-1" })) : (_jsx(AlertTriangle, { className: "w-5 h-5 text-red-500 mt-1" })), _jsxs("div", { children: [_jsx("h5", { className: `font-semibold mb-2 ${parseInt(quizAnswers[question.id]) === question.correct
                                                                    ? 'text-green-800'
                                                                    : 'text-red-800'}`, children: parseInt(quizAnswers[question.id]) === question.correct ? 'Correct!' : 'Not quite right' }), _jsx("p", { className: `text-sm ${parseInt(quizAnswers[question.id]) === question.correct
                                                                    ? 'text-green-700'
                                                                    : 'text-red-700'}`, children: question.explanation })] })] }) }))] }, question.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition", children: "Next" }))] })] }) }));
};
export default SpeculativeAuthorityLesson;
