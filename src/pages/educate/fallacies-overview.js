import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, CheckCircle, Brain, Lightbulb } from 'lucide-react';
const FallaciesOverview = () => {
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
            title: 'Understanding Logical Fallacies',
            content: `Logical fallacies are errors in reasoning that undermine the logic of an argument. They're patterns of invalid reasoning that can make arguments appear stronger than they actually are, often by exploiting cognitive biases or emotional responses.

**What Makes Something a Fallacy:**
- The reasoning process is flawed, regardless of whether the conclusion is true
- The argument doesn't logically support its conclusion
- The error follows a recognizable pattern that can be identified and named
- The flaw makes the argument unreliable as evidence for its conclusion

**Why Fallacies Matter:**
- They pollute public discourse with invalid reasoning
- They can lead to poor decisions based on flawed logic
- They exploit our cognitive shortcuts and biases
- They can be used deliberately to manipulate audiences

**The Key Insight:**
A fallacious argument can still have a true conclusion—the problem is that the reasoning doesn't support that conclusion. Learning to spot fallacies helps you evaluate the quality of reasoning, not just the appeal of conclusions.

**Historical Context:**
The study of logical fallacies dates back to Aristotle, who first systematically catalogued errors in reasoning. This ancient wisdom remains relevant because human cognitive biases haven't changed—we still fall for the same reasoning errors our ancestors did.`
        },
        {
            id: 'categories',
            title: 'Categories of Logical Fallacies',
            content: `**Formal vs. Informal Fallacies:**

**Formal Fallacies:**
- Errors in logical structure that can be identified through symbolic logic
- The form of the argument is invalid regardless of content
- Example: "If A then B. B is true. Therefore A is true." (Affirming the consequent)

**Informal Fallacies:**
- Errors in content, context, or relevance rather than pure logical form
- Often exploit psychological biases or emotional responses
- Most fallacies we encounter in daily life are informal

**Major Categories:**

**1. Relevance Fallacies:**
- Arguments that use irrelevant information
- Ad hominem, red herring, appeal to emotion
- The premises don't actually support the conclusion

**2. Presumption Fallacies:**
- Arguments that assume what they're trying to prove
- Circular reasoning, false dichotomy, loaded questions
- Hidden assumptions that aren't justified

**3. Ambiguity Fallacies:**
- Arguments that exploit unclear language
- Equivocation, amphiboly, composition/division
- Multiple meanings create confusion

**4. Weak Induction Fallacies:**
- Arguments where premises provide weak support for conclusions
- Hasty generalization, false analogy, slippery slope
- Evidence exists but isn't strong enough to support the conclusion`
        },
        {
            id: 'practice',
            title: 'Practice: Identifying Fallacy Types',
            content: 'Let\'s practice identifying different types of logical fallacies. For each example, identify the fallacy and explain why the reasoning is flawed.',
            interactive: true
        },
        {
            id: 'application',
            title: 'Applying Fallacy Knowledge',
            content: `**How to Use Fallacy Knowledge Effectively:**

**1. Focus on Reasoning, Not Conclusions**
- A fallacious argument doesn't necessarily mean the conclusion is false
- Evaluate whether the reasoning actually supports the conclusion
- Look for better arguments for the same conclusion

**2. Avoid the Fallacy Fallacy**
- Just because an argument contains a fallacy doesn't mean the conclusion is wrong
- The fallacy shows the argument is unreliable, not that the conclusion is false
- Seek better evidence rather than dismissing the topic entirely

**3. Use Fallacies Constructively**
- Point out reasoning flaws to improve discussion quality
- Ask for better arguments rather than just naming fallacies
- Help others strengthen their reasoning

**4. Check Your Own Arguments**
- We all use fallacious reasoning sometimes
- Review your own arguments for logical flaws
- Be willing to revise arguments when flaws are pointed out

**5. Understand Context and Intent**
- Some apparent fallacies may be reasonable in context
- Consider whether the speaker is making a logical argument or expressing emotion
- Distinguish between honest mistakes and deliberate manipulation

**Remember:**
The goal isn't to win arguments by naming fallacies—it's to improve the quality of reasoning and discussion for everyone involved.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            statement: "We shouldn't listen to Senator Johnson's economic policy proposals because he was caught cheating on his taxes.",
            question: 'What type of fallacy is this and why is the reasoning flawed?',
            analysis: 'This is an ad hominem fallacy. The reasoning is flawed because the senator\'s personal tax issues don\'t logically relate to the merit of his economic policy proposals. His policies should be evaluated on their own evidence and logic, not his personal conduct.',
            explanation: 'Ad hominem fallacies attack the person making an argument rather than addressing the argument itself, which is irrelevant to the logical merit of their position.'
        },
        {
            id: 'example2',
            statement: "Either we ban all cars from the city center, or we accept that pollution will kill everyone. There's no middle ground on this issue.",
            question: 'What fallacy is being used here?',
            analysis: 'This is a false dichotomy (false dilemma). The reasoning is flawed because it presents only two extreme options when many alternatives exist: emission standards, electric vehicle incentives, public transit improvements, congestion pricing, etc. The argument artificially eliminates reasonable middle-ground solutions.',
            explanation: 'False dichotomies limit options to two extremes when multiple alternatives usually exist, forcing artificial either/or choices that prevent consideration of nuanced solutions.'
        },
        {
            id: 'example3',
            statement: "My grandfather smoked two packs a day and lived to 95, so smoking can't be that dangerous.",
            question: 'What makes this reasoning fallacious?',
            analysis: 'This is a hasty generalization fallacy. The reasoning is flawed because it draws a broad conclusion about smoking safety from a single anecdotal case. One person\'s experience doesn\'t override statistical evidence from millions of cases showing smoking\'s health risks.',
            explanation: 'Hasty generalization uses insufficient evidence (often personal anecdotes) to make broad claims that require much larger samples and controlled studies to support.'
        }
    ];
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['fallacies-overview'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-orange-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mb-4", children: _jsx(AlertTriangle, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Logical Fallacies Overview" }), _jsx("p", { className: "text-lg text-gray-600", children: "Understanding the foundation of flawed reasoning patterns" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-orange-500 to-amber-600 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Brain, { className: "w-5 h-5 text-orange-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Fallacy Analysis ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md italic", children: ["\"", example.statement, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => setShowAnswers(prev => ({ ...prev, [example.id]: true })), disabled: showAnswers[example.id], className: "bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showAnswers[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Lightbulb, { className: "w-5 h-5 text-blue-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-blue-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-blue-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-blue-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition", children: "Next" }))] })] }) }));
};
export default FallaciesOverview;
