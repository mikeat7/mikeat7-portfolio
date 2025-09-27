import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Brain, Shield, Eye } from 'lucide-react';
const BecomeAIAware = () => {
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
            title: 'Mastering AI Awareness',
            content: `AI awareness is becoming one of the most critical skills for navigating our increasingly AI-integrated world. This advanced lesson builds on foundational concepts to develop sophisticated AI detection and strategic use capabilities.

**Advanced AI Awareness Levels:**
- **Unconscious Incompetence**: Unaware of AI presence or capabilities
- **Conscious Incompetence**: Aware of AI but not its implications
- **Conscious Competence**: Actively developing AI detection and use skills
- **Unconscious Competence**: Intuitive AI awareness and strategic deployment

**The New Reality:**
By 2025, AI-generated content is everywhere:
- News articles written by AI
- Social media posts created by bots
- Academic papers with AI assistance
- Marketing copy generated automatically
- Customer service interactions with chatbots

**Why Advanced Awareness Matters:**
- **Information Integrity**: Distinguishing human from AI perspectives
- **Decision Quality**: Understanding when AI input is valuable vs. misleading
- **Cognitive Security**: Protecting against AI-powered manipulation
- **Strategic Advantage**: Using AI tools effectively while maintaining critical thinking

**The Awareness Paradox:**
The better AI becomes at mimicking human communication, the more important it becomes to develop sophisticated detection and evaluation skills.`
        },
        {
            id: 'advanced-detection',
            title: 'Advanced AI Detection Techniques',
            content: `**Sophisticated Detection Methods:**

**1. Contextual Inconsistency Analysis**
- Look for knowledge that doesn't match claimed experience
- Check for temporal inconsistencies (knowing future events)
- Notice absence of personal growth or learning over time
- Identify perfect recall of obscure information

**2. Emotional Authenticity Assessment**
- Genuine emotions have complexity and contradiction
- AI emotions tend to be consistent and appropriate
- Look for unexpected emotional responses
- Notice absence of emotional evolution in long conversations

**3. Creativity and Originality Evaluation**
- AI tends to combine existing patterns rather than create truly novel ideas
- Look for genuine insights vs. sophisticated recombination
- Check for personal creative processes and inspiration sources
- Notice whether creativity feels mechanical or organic

**4. Error Pattern Recognition**
- Humans make specific types of errors (typos, memory lapses, emotional mistakes)
- AI makes different errors (hallucinations, consistency failures, knowledge cutoffs)
- Look for error patterns that reveal the underlying system
- Notice whether corrections feel natural or programmatic

**5. Meta-Cognitive Awareness**
- Humans can reflect on their own thinking processes
- AI can describe thinking but may not genuinely experience it
- Look for authentic uncertainty and confusion
- Notice whether self-reflection feels genuine or performed

**Advanced Red Flags:**
- Perfect grammar in informal contexts
- Consistent expertise across unrelated domains
- Absence of personal anecdotes or specific memories
- Balanced perspectives on highly polarizing topics
- Inability to express genuine confusion or ignorance`
        },
        {
            id: 'practice',
            title: 'Practice: Advanced AI Detection',
            content: 'Test your advanced AI detection skills with these sophisticated examples that require deeper analysis beyond surface-level patterns.',
            interactive: true
        },
        {
            id: 'strategic-mastery',
            title: 'Strategic AI Mastery',
            content: `**Advanced AI Partnership Strategies:**

**1. AI as Research Accelerator**
- Use AI to rapidly explore multiple perspectives on complex topics
- Generate hypotheses for further investigation
- Identify potential blind spots in your thinking
- Create structured frameworks for analysis

**2. AI as Devil's Advocate**
- Ask AI to argue against your positions
- Use AI to identify weaknesses in your arguments
- Generate counterarguments to strengthen your reasoning
- Test your ideas against AI-generated criticism

**3. AI as Writing Enhancement**
- Use AI to improve clarity without changing meaning
- Generate multiple ways to express complex ideas
- Check for logical consistency in your arguments
- Identify potential misinterpretations

**4. AI as Learning Companion**
- Create personalized learning experiences
- Generate practice problems and scenarios
- Explain complex concepts from multiple angles
- Adapt explanations to your learning style

**5. AI as Creativity Catalyst**
- Use AI to break creative blocks
- Generate unexpected connections between ideas
- Explore alternative approaches to problems
- Combine concepts in novel ways

**The Master's Mindset:**
- **Complementary Intelligence**: Use AI to enhance, not replace, human thinking
- **Verification Discipline**: Always verify important AI-generated information
- **Boundary Awareness**: Know when to rely on AI vs. human judgment
- **Continuous Learning**: Stay updated on AI capabilities and limitations

**Ethical AI Use:**
- **Transparency**: Disclose AI assistance when appropriate
- **Responsibility**: Take ownership of AI-assisted decisions
- **Privacy**: Protect sensitive information in AI interactions
- **Fairness**: Consider how AI use affects others

**The Future-Ready Professional:**
Master AI awareness to thrive in an AI-integrated world while maintaining human agency, creativity, and critical thinking.`
        }
    ];
    const practiceExamples = [
        {
            id: 'example1',
            text: "I've been struggling with quantum mechanics for months now. My professor's explanations just don't click with me, and I'm starting to think I'm not cut out for physics. The math is overwhelming, and every time I think I understand something, the next concept completely confuses me again. It's really affecting my confidence.",
            question: 'Analyze this for AI vs. human indicators using advanced detection techniques.',
            analysis: 'This shows strong human indicators: 1) Authentic struggle and emotional complexity, 2) Specific learning difficulties with personal impact, 3) Confidence issues that feel genuine, 4) Temporal progression of understanding and confusion, 5) Personal vulnerability and self-doubt. The emotional authenticity and specific learning struggle patterns are difficult for AI to replicate convincingly.',
            explanation: 'This demonstrates genuine human learning struggle with authentic emotional complexity that AI rarely captures. The specific nature of the confusion and its emotional impact suggest human experience.'
        },
        {
            id: 'example2',
            text: "Quantum mechanics presents fascinating challenges for students across multiple educational contexts. While the mathematical frameworks can initially seem overwhelming, systematic study approaches combined with conceptual visualization techniques often help students develop understanding. The key is maintaining persistence while seeking appropriate pedagogical resources.",
            question: 'What advanced AI indicators do you detect here?',
            analysis: 'This shows multiple AI indicators: 1) Generic, non-personal language, 2) Balanced, educational tone without emotional investment, 3) Abstract advice without specific experience, 4) Perfect grammar and formal structure, 5) Lack of personal struggle or authentic confusion, 6) Educational jargon without personal context. The response feels like a textbook rather than personal experience.',
            explanation: 'This demonstrates classic AI patterns: generic advice, formal tone, lack of personal experience, and educational language that sounds helpful but lacks authentic human struggle or specific insight.'
        },
        {
            id: 'example3',
            text: "Look, I've been in tech for 15 years, and I can tell you that this whole AI hype is just another bubble. We've seen this before with blockchain, IoT, VR - every few years there's some 'revolutionary' technology that's going to change everything. Most of it ends up being overhyped nonsense that doesn't deliver on the promises.",
            question: 'Analyze this for authenticity using contextual and emotional indicators.',
            analysis: 'This shows mixed indicators. Human elements: 1) Specific experience claim (15 years), 2) Cynical tone based on experience, 3) Pattern recognition from past cycles, 4) Informal language ("Look," "whole AI hype"). Potential AI elements: 1) Generic tech skepticism, 2) Predictable pattern of hype cycles, 3) Could be trained response. The cynicism and specific experience claims lean human, but verification would require follow-up questions about specific technologies and experiences.',
            explanation: 'This is more challenging to assess - it could be genuine tech industry experience or sophisticated AI mimicking common skeptical perspectives. The informal tone and cynicism suggest human, but the generic nature of the skepticism could be AI-generated.'
        }
    ];
    const handleShowAnswer = (exampleId) => {
        setShowAnswers(prev => ({ ...prev, [exampleId]: true }));
    };
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['become-ai-aware'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mb-4", children: _jsx(Brain, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Become AI Aware" }), _jsx("p", { className: "text-lg text-gray-600", children: "Master-level AI detection and strategic use capabilities" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Progress" }), _jsxs("span", { children: [currentSection + 1, " of ", sections.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentSection + 1) / sections.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsx("h2", { className: "text-2xl font-bold mb-6 text-gray-900", children: sections[currentSection].title }), sections[currentSection].interactive ? (_jsxs("div", { className: "space-y-8", children: [_jsx("p", { className: "text-gray-700 mb-6", children: sections[currentSection].content }), practiceExamples.map((example, index) => (_jsxs("div", { className: "border border-gray-200 rounded-lg p-6", children: [_jsxs("div", { className: "flex items-start gap-3 mb-4", children: [_jsx(Eye, { className: "w-5 h-5 text-indigo-500 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-gray-800 mb-2", children: ["Advanced Analysis ", index + 1] }), _jsxs("p", { className: "text-gray-700 mb-4 p-4 bg-gray-50 rounded-md font-mono text-sm", children: ["\"", example.text, "\""] }), _jsx("p", { className: "text-sm text-gray-600 mb-4", children: _jsx("strong", { children: example.question }) })] })] }), _jsx("button", { onClick: () => handleShowAnswer(example.id), disabled: showAnswers[example.id], className: "bg-indigo-500 text-white px-4 py-2 rounded-md hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: showAnswers[example.id] ? 'Answer Revealed' : 'Show Expert Analysis' }), showAnswers[example.id] && (_jsx("div", { className: "mt-4 p-4 bg-purple-50 border border-purple-200 rounded-md", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Shield, { className: "w-5 h-5 text-purple-500 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-purple-800 mb-2", children: "Expert Analysis:" }), _jsx("p", { className: "text-purple-700 mb-2", children: example.analysis }), _jsxs("p", { className: "text-sm text-purple-600", children: [_jsx("strong", { children: "Why This Matters:" }), " ", example.explanation] })] })] }) }))] }, example.id)))] })) : (_jsx("div", { className: "prose prose-lg max-w-none", children: _jsx("div", { className: "text-gray-700 whitespace-pre-line", children: sections[currentSection].content }) }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentSection(Math.max(0, currentSection - 1)), disabled: currentSection === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous" }), currentSection === sections.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Lesson"] })) : (_jsx("button", { onClick: () => setCurrentSection(Math.min(sections.length - 1, currentSection + 1)), className: "px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition", children: "Next" }))] })] }) }));
};
export default BecomeAIAware;
