import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Fish, CheckCircle, Lightbulb } from 'lucide-react';
const RedHerring = () => {
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
            title: 'Understanding Red Herring',
            content: `A red herring is a fallacy that introduces irrelevant information to divert attention from the real issue being discussed. It's named after the practice of using strong-smelling fish to throw hunting dogs off a scent trail.

**How Red Herring Works:**
- Introduces irrelevant but emotionally engaging information
- Shifts focus away from the original argument or question
- Exploits our tendency to follow interesting tangents
- Allows the speaker to avoid addressing difficult points

**The Structure:**
Person A: "We should discuss policy X"
Person B: "But what about completely unrelated issue Y?"

**Why It's Effective:**
- Humans are naturally curious and easily distracted
- Emotional topics can override logical focus
- Complex issues can seem overwhelming, making tangents appealing
- People often don't notice when topics have shifted

**Red Herring vs. Relevant Information:**
- **Red Herring**: Information that's interesting but doesn't address the argument
- **Relevant**: Information that directly relates to the truth or validity of the claim

**The Distraction Trap:**
Red herrings work because they often involve real issues that deserve attention—just not in the current discussion. The fallacy isn't in the content of the distraction, but in using it to avoid the original topic.`
        },
        {
            id: 'types',
            title: 'Types of Red Herring Tactics',
            content: `**Topic Shifting:**
- Original: "Should we increase education funding?"
- Red Herring: "Teachers unions are corrupt and protect bad teachers!"
- Analysis: Union issues are separate from funding questions

**Emotional Distraction:**
- Original: "This policy has implementation problems"
- Red Herring: "How can you say that when families are suffering?"
- Analysis: Emotional appeal doesn't address implementation concerns

**Historical Deflection:**
- Original: "Current policy isn't working effectively"
- Red Herring: "Previous administration was much worse!"
- Analysis: Past performance doesn't justify current problems

**Personal Attack Diversion:**
- Original: "Your argument has logical flaws"
- Red Herring: "You're just saying that because you hate me!"
- Analysis: Personal feelings don't address logical validity

**Whataboutism:**
- Original: "Country A violated international law"
- Red Herring: "What about when Country B did something similar?"
- Analysis: Other violations don't justify current ones

**Complexity Overwhelm:**
- Original: "This specific aspect needs improvement"
- Red Herring: "The whole system is broken and needs complete overhaul!"
- Analysis: System-wide issues don't address specific concerns

**The Pattern:**
Red herrings often involve real issues, making them harder to dismiss than obviously irrelevant distractions.`
        },
        {
            id: 'practice',
            title: 'Practice: Spotting Red Herrings',
            content: 'Let\'s practice identifying red herrings and learning to redirect conversations back to the original topic. Look for topic shifts and irrelevant distractions.',
            interactive: true
        },
        {
            id: 'defense',
            title: 'Staying on Track',
            content: `**The Redirect Strategy:**
When someone introduces a red herring:
- "That's an interesting point, but let's first finish discussing [original topic]"
- "I'd like to address that issue separately. Right now, can we focus on [original question]?"
- "Before we move to that topic, can you respond to [specific point]?"

**The Acknowledgment and Return:**
- Acknowledge the red herring as potentially valid
- Suggest discussing it at an appropriate time
- Firmly but politely return to the original topic
- Don't let yourself be pulled into the distraction

**The Clarification Request:**
- "How does that relate to the question we were discussing?"
- "Can you help me understand the connection to [original topic]?"
- "Are you suggesting we should discuss that instead, or in addition to [original issue]?"

**Red Flags to Watch For:**
- **Sudden Topic Changes**: Abrupt shifts to unrelated issues
- **Emotional Escalation**: Introducing highly charged topics
- **"What About" Language**: Deflecting to other examples
- **Personal Attacks**: Shifting from issues to personalities
- **Historical Comparisons**: Bringing up past events inappropriately

**The Focus Maintenance:**
- Keep the original question or topic clearly in mind
- Write down key points if the conversation is complex
- Don't be afraid to seem "rude" by redirecting
- Remember that staying on topic serves everyone's interests

**When Red Herrings Are Legitimate:**
Sometimes apparent red herrings reveal important context or related issues. The key is determining whether the new information actually relates to the original discussion or is purely diversionary.

**Remember:**
You have the right to finish discussing one topic before moving to another. Don't let red herrings prevent you from getting answers to your original questions.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: 'Discussion: "Should we increase funding for public transportation?" Response: "Why are we talking about buses when homeless people are sleeping on the streets? Shouldn\'t we solve homelessness first?"',
            question: 'How is this a red herring and how would you redirect?',
            analysis: 'This is a red herring because homelessness, while important, is a separate issue from public transportation funding. The response diverts from the transportation discussion without addressing its merits. Redirect: "Homelessness is definitely important and deserves its own discussion. For now, can we focus on the transportation funding question and whether it would benefit the community?"',
            explanation: 'Red herrings often involve real, important issues that deserve attention—just not in the current discussion. The key is acknowledging the distraction while maintaining focus on the original topic.'
        },
        {
            id: 'example2',
            statement: 'Discussion: "This company\'s safety record needs improvement." Response: "Our competitors have much worse safety records! Why aren\'t you criticizing them instead of attacking us?"',
            question: 'Why is this deflection problematic?',
            analysis: 'This is a red herring (specifically whataboutism) because competitor safety records don\'t address this company\'s safety issues. It deflects responsibility by pointing to others\' problems. Redirect: "Other companies\' records are separate issues. Can we focus on specific steps this company could take to improve its safety performance?"',
            explanation: 'Whataboutism red herrings attempt to justify problems by pointing to other problems, preventing accountability and improvement in the original issue being discussed.'
        },
        {
            id: 'example3',
            statement: 'Discussion: "The proposed budget cuts to education seem problematic." Response: "Education is important, but we also need to consider infrastructure, healthcare, defense spending, and economic development. It\'s all interconnected."',
            question: 'Is this a red herring or legitimate context?',
            analysis: 'This is borderline—it could be legitimate context about budget trade-offs, or it could be a red herring to avoid discussing specific education cuts. The key is whether the speaker returns to address the education concerns specifically. Appropriate response: "You\'re right that budget decisions are interconnected. Can you help me understand how these education cuts specifically fit into those priorities?"',
            explanation: 'Not all topic expansions are red herrings—sometimes broader context is genuinely relevant. The test is whether the additional information helps address the original question or simply avoids it.'
        }
    ];
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['red-herring'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mb-4", children: _jsx(Fish, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Red Herring" }), _jsx("p", { className: "text-lg text-gray-600", children: "Spotting deliberate topic changes and distractions" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Fish, { className: "w-5 h-5 text-emerald-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Red Herring Analysis ", index + 1] }), _jsx("div", { className: "bg-gray-50 p-4 rounded-md mb-4", children: _jsx("p", { className: "text-gray-700 text-sm", children: example.statement }) }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowAnswers(prev => ({ ...prev, [example.id]: true })), disabled: showAnswers[example.id], className: "bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showAnswers[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition", children: "Next" }))] })] }) }));
};
export default RedHerring;
