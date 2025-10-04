import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserX, CheckCircle, Lightbulb } from 'lucide-react';
const AdHominem = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [currentSection, setCurrentSection] = useState(0);
    const [showAnswers, setShowAnswers] = useState({});
    // Scroll to top when section changes
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [currentSection]);
    const sections = [
        {
            id: 'introduction',
            title: 'Understanding Ad Hominem',
            content: `Ad hominem (Latin for "to the person") is a fallacy that attacks the person making an argument rather than addressing the argument itself. It's one of the most common fallacies in political discourse and online debates.

**How Ad Hominem Works:**
- Shifts focus from the argument to the person making it
- Uses personal characteristics to discredit arguments
- Exploits irrelevant information about the speaker
- Avoids engaging with the actual logic or evidence

**The Structure:**
Person A: "We should consider policy X because of reasons Y and Z"
Person B: "You can't trust anything Person A says because they [personal attack]"

**Why It's Tempting:**
- Personal attacks are often easier than logical rebuttals
- They can be emotionally satisfying
- They may discredit the opponent in audiences' minds
- They avoid the hard work of addressing complex arguments

**Ad Hominem vs. Relevant Character Information:**
- **Ad Hominem**: Personal attacks unrelated to the argument's validity
- **Relevant**: Character information that actually affects credibility on the specific topic

**The Distraction Effect:**
Ad hominem attacks often work by making the discussion about the person rather than the issue, derailing productive conversation.`
        },
        {
            id: 'types',
            title: 'Types of Ad Hominem Attacks',
            content: `**Direct Personal Attack:**
- "You're stupid, so your argument is wrong"
- "You're biased, so we can't trust your opinion"
- "You're a hypocrite, so your position is invalid"
- Problem: Personal flaws don't invalidate logical arguments

**Circumstantial Ad Hominem:**
- "You only say that because you work for that company"
- "Of course you'd argue that—you benefit from it"
- "You're just saying that because of your political party"
- Problem: Motives don't determine argument validity

**Tu Quoque ("You Too"):**
- "You can't criticize my behavior—you do the same thing!"
- "How can you talk about ethics when you've made mistakes?"
- "You're being hypocritical!"
- Problem: Hypocrisy doesn't invalidate the argument

**Guilt by Association:**
- "You can't trust them—they associate with bad people"
- "Their supporters include extremists, so they must be wrong"
- "They were endorsed by [disliked group]"
- Problem: Associations don't determine argument merit

**Tone Policing:**
- "You're too angry to think clearly"
- "Your emotional response shows you're wrong"
- "Calm down and then we'll discuss this"
- Problem: Emotional tone doesn't affect logical validity

**Genetic Fallacy:**
- "That idea comes from [disliked source], so it's wrong"
- "We can't consider that—it originated with [bad person]"
- Problem: Origin doesn't determine current validity

**The Pattern:**
All ad hominem attacks share the same flaw—they address the messenger instead of the message.`
        },
        {
            id: 'practice',
            title: 'Practice: Identifying Ad Hominem',
            content: 'Let\'s practice distinguishing between ad hominem attacks and legitimate concerns about credibility. Learn to recognize when personal information is relevant vs. irrelevant.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Defending Against Ad Hominem',
            content: `**The Redirect Strategy:**
When attacked personally:
- "I'd prefer to discuss the argument rather than personal issues"
- "Can you address the specific points I raised?"
- "Let's focus on the evidence rather than personalities"
- "How does that relate to the validity of my argument?"

**The Separation Response:**
- Acknowledge personal flaws if they're true
- Separate personal issues from argument validity
- Return focus to the logical merits
- Don't get drawn into personal defense

**Example Response:**
"You may be right about [personal issue], but that doesn't address whether [argument] is logically sound. Can we evaluate the evidence I presented?"

**When Character is Relevant:**
Sometimes personal information IS relevant:
- **Expertise**: Relevant qualifications for the topic
- **Conflicts of Interest**: Financial or personal stakes in the outcome
- **Track Record**: History of accuracy on similar topics
- **Credibility**: Pattern of honesty or deception

**The Relevance Test:**
Ask: "Does this personal information actually affect the logical validity of the argument?"

**Red Flags to Watch For:**
- **Personal Insults**: Name-calling or character assassination
- **Irrelevant History**: Bringing up unrelated past actions
- **Motive Attribution**: Claiming to know why someone argues something
- **Association Attacks**: Guilt by association with disliked groups
- **Tone Focus**: Attacking how something is said rather than what is said

**The High Road Response:**
- Stay focused on the argument
- Don't respond to personal attacks with personal attacks
- Model the behavior you want to see
- Keep bringing the discussion back to evidence and logic

**Remember:**
Arguments stand or fall on their own merits, regardless of who makes them. Even bad people can make good arguments, and good people can make bad arguments.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: 'Argument: "We should increase funding for renewable energy research." Response: "You only say that because you drive a Tesla and want to feel superior to everyone else."',
            question: 'Why is this ad hominem and how would you respond?',
            analysis: 'This is ad hominem because it attacks the person\'s motives (superiority complex) and possessions (Tesla) rather than addressing the merits of renewable energy research funding. Response: "My car choice doesn\'t affect whether renewable energy research is a good investment. Can we discuss the potential benefits and costs of increased research funding?"',
            explanation: 'This ad hominem tries to discredit the argument by attributing negative motives to the speaker, avoiding engagement with the actual policy proposal and its merits.'
        },
        {
            id: 'example2',
            statement: 'Argument: "This company\'s safety practices need improvement." Response: "You\'re just a disgruntled former employee trying to get revenge. Nobody should listen to anything you say."',
            question: 'Is this always ad hominem or could employment history be relevant?',
            analysis: 'This is primarily ad hominem because it dismisses the safety argument based on employment status and attributed motives rather than evaluating the safety evidence. However, employment history could be relevant context if it affects access to information or creates bias. Better response: "Can you provide specific evidence about these safety concerns? Your employment history gives you inside knowledge, but we should evaluate the claims on their merits."',
            explanation: 'While employment history can provide relevant context about knowledge and potential bias, it shouldn\'t be used to automatically dismiss safety concerns without evaluating the evidence.'
        },
        {
            id: 'example3',
            statement: 'Argument: "This medical treatment shows promise in early trials." Response: "The lead researcher was convicted of fraud 20 years ago in a completely different field."',
            question: 'When does personal history become relevant to argument evaluation?',
            analysis: 'This is borderline—past fraud could be relevant to credibility, but 20 years ago in a different field is questionable relevance. Better approach: "Given the researcher\'s past issues, we should be extra careful to verify the methodology and seek independent replication, but let\'s evaluate this study on its own merits first." The argument should be assessed primarily on current evidence quality.',
            explanation: 'Past misconduct can be relevant context for evaluating credibility, but it shouldn\'t automatically invalidate current arguments without examining the present evidence and methodology.'
        }
    ];
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['ad-hominem'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-red-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4", children: _jsx(UserX, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Ad Hominem" }), _jsx("p", { className: "text-lg text-gray-600", children: "When the person is attacked instead of their argument" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(UserX, { className: "w-5 h-5 text-red-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Ad Hominem Analysis ", index + 1] }), _jsx("div", { className: "bg-gray-50 p-4 rounded-md mb-4", children: _jsx("p", { className: "text-gray-700 text-sm", children: example.statement }) }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowAnswers(prev => ({ ...prev, [example.id]: true })), disabled: showAnswers[example.id], className: "bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showAnswers[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition", children: "Next" }))] })] }) }));
};
export default AdHominem;
