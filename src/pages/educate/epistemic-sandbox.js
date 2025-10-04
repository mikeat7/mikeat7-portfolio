import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Codesandbox as Sandbox, CheckCircle, AlertTriangle, Lightbulb, Target } from 'lucide-react';
import { advancedAssessment } from '@/lib/assessment/AdvancedAssessmentEngine';
const EpistemicSandboxLesson = () => {
    const navigate = useNavigate();
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const [currentExercise, setCurrentExercise] = useState(0);
    const [userResponses, setUserResponses] = useState({});
    const [showFeedback, setShowFeedback] = useState({});
    const [assessmentResults, setAssessmentResults] = useState({});
    const [isAssessing, setIsAssessing] = useState({});
    const exercises = [
        {
            id: 'confidence-calibration',
            title: 'Confidence Calibration Exercise',
            description: 'Practice expressing appropriate levels of confidence in your knowledge.',
            prompt: 'You\'re asked: "What percentage of the Earth\'s surface is covered by water?" How would you respond with proper epistemic humility?',
            goodResponse: 'I believe it\'s around 70%, but I\'m not completely certain. I know it\'s the majority of the surface, and I recall learning it was roughly two-thirds to three-quarters, so 70% seems reasonable, but I could be off by several percentage points.',
            feedback: 'This response shows good calibration by expressing reasonable confidence while acknowledging uncertainty about precision.'
        },
        {
            id: 'source-evaluation',
            title: 'Source Evaluation Practice',
            description: 'Learn to critically evaluate information sources and claims.',
            prompt: 'Someone shares an article titled "Scientists Discover Miracle Cure for Aging" from a website called "HealthTruthNews.com". How do you evaluate this claim?',
            goodResponse: 'This raises several red flags: "miracle cure" is sensational language, the source isn\'t a recognized scientific publication, and extraordinary claims about aging would require extraordinary evidence from peer-reviewed research. I\'d want to see the original study, check if it\'s been replicated, and look for coverage in reputable scientific journals.',
            feedback: 'Excellent critical thinking! You identified sensational language, questioned the source, and outlined proper verification steps.'
        },
        {
            id: 'uncertainty-expression',
            title: 'Expressing Uncertainty Appropriately',
            description: 'Practice communicating what you don\'t know without appearing ignorant.',
            prompt: 'In a discussion about quantum physics, someone asks you to explain quantum entanglement. You have only basic knowledge. How do you respond?',
            goodResponse: 'I have a basic understanding that quantum entanglement involves particles that remain connected in some way even when separated, but I don\'t understand the mechanics well enough to explain it accurately. This is a complex topic that requires deep physics knowledge that I don\'t have. I\'d recommend consulting a physics textbook or expert for a proper explanation.',
            feedback: 'Perfect! You acknowledged your limitations while still sharing what you do know, and directed them to better sources.'
        },
        {
            id: 'bias-recognition',
            title: 'Recognizing Your Own Biases',
            description: 'Practice identifying when your own biases might be affecting your judgment.',
            prompt: 'You strongly support renewable energy. You see a study claiming solar panels are less efficient than reported. Your first instinct is to dismiss it. How do you handle this?',
            goodResponse: 'I notice my immediate reaction is to dismiss this because it conflicts with my views on renewable energy. This suggests my bias might be affecting my judgment. I should examine the study objectively: Who conducted it? What\'s their methodology? Is it peer-reviewed? Are there conflicts of interest? Even if I support renewable energy, I need to evaluate evidence fairly.',
            feedback: 'Excellent self-awareness! Recognizing your bias is the first step to overcoming it and evaluating evidence objectively.'
        },
        {
            id: 'nuanced-thinking',
            title: 'Embracing Nuance and Complexity',
            description: 'Practice avoiding oversimplification of complex issues.',
            prompt: 'Someone says "Social media is destroying society." How do you respond with nuanced thinking?',
            goodResponse: 'Social media has both positive and negative effects that vary by platform, usage patterns, and individual circumstances. It can facilitate connection and information sharing, but also spread misinformation and create addiction-like behaviors. The impact likely depends on how it\'s used, by whom, and in what context. Rather than being wholly good or bad, it\'s a complex tool with mixed consequences.',
            feedback: 'Great nuanced thinking! You avoided binary thinking and recognized the complexity of the issue while acknowledging multiple perspectives.'
        }
    ];
    const handleResponseSubmit = async (exerciseId, response) => {
        if (!response.trim())
            return;
        setIsAssessing(prev => ({ ...prev, [exerciseId]: true }));
        setUserResponses(prev => ({ ...prev, [exerciseId]: response }));
        try {
            // Get the exercise scenario for context
            const exercise = exercises.find(ex => ex.id === exerciseId);
            const scenario = exercise ? exercise.prompt : '';
            // Run real epistemic humility assessment
            const result = await advancedAssessment.assessEpistemicHumility(response, scenario);
            setAssessmentResults(prev => ({ ...prev, [exerciseId]: result }));
            setShowFeedback(prev => ({ ...prev, [exerciseId]: true }));
        }
        catch (error) {
            console.error('Assessment failed:', error);
            // Fallback to showing expert analysis
            setShowFeedback(prev => ({ ...prev, [exerciseId]: true }));
        }
        finally {
            setIsAssessing(prev => ({ ...prev, [exerciseId]: false }));
        }
    };
    const completeLesson = () => {
        const progress = JSON.parse(localStorage.getItem('education-progress') || '{}');
        progress['epistemic-sandbox'] = true;
        localStorage.setItem('education-progress', JSON.stringify(progress));
        navigate('/educate');
    };
    const currentEx = exercises[currentExercise];
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-green-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full mb-4", children: _jsx(Sandbox, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Epistemic Sandbox" }), _jsx("p", { className: "text-lg text-gray-600", children: "Safe environment to practice critical thinking skills without consequences" })] }), _jsxs("div", { className: "mb-8", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-600 mb-2", children: [_jsx("span", { children: "Exercise Progress" }), _jsxs("span", { children: [currentExercise + 1, " of ", exercises.length] })] }), _jsx("div", { className: "w-full bg-gray-200 rounded-full h-2", children: _jsx("div", { className: "bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-300", style: { width: `${((currentExercise + 1) / exercises.length) * 100}%` } }) })] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-8", children: [_jsxs("div", { className: "flex items-center gap-3 mb-6", children: [_jsx(Target, { className: "w-6 h-6 text-green-600" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: currentEx.title })] }), _jsx("p", { className: "text-gray-600 mb-6", children: currentEx.description }), _jsxs("div", { className: "bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6", children: [_jsx("h3", { className: "font-semibold text-blue-800 mb-3", children: "Scenario:" }), _jsx("p", { className: "text-blue-700", children: currentEx.prompt })] }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-gray-700 font-medium mb-2", children: "Your Response:" }), _jsx("textarea", { className: "w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none", rows: 6, placeholder: "Take your time to craft a thoughtful response that demonstrates epistemic humility...", value: userResponses[currentEx.id] || '', onChange: (e) => setUserResponses(prev => ({ ...prev, [currentEx.id]: e.target.value })) })] }), _jsx("button", { onClick: () => handleResponseSubmit(currentEx.id, userResponses[currentEx.id] || ''), disabled: !userResponses[currentEx.id]?.trim(), className: "bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2", children: isAssessing[currentEx.id] ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" }), "Analyzing..."] })) : ('Submit for AI Assessment') }), showFeedback[currentEx.id] && (_jsxs("div", { className: "mt-6 space-y-6", children: [assessmentResults[currentEx.id] && (_jsx("div", { className: "p-6 bg-blue-50 border border-blue-200 rounded-lg", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Target, { className: "w-6 h-6 text-blue-600 mt-1" }), _jsxs("div", { className: "flex-1", children: [_jsxs("h4", { className: "font-semibold text-blue-800 mb-3", children: ["\uD83E\uDD16 AI Assessment Results (Score: ", Math.round(assessmentResults[currentEx.id].overallScore * 100), "%)"] }), _jsx("div", { className: "mb-4", children: _jsxs("p", { className: "text-blue-700 mb-3", children: [_jsx("strong", { children: "Personalized Feedback:" }), " ", assessmentResults[currentEx.id].personalizedFeedback] }) }), assessmentResults[currentEx.id].strengths.length > 0 && (_jsx("div", { className: "mb-3", children: _jsxs("p", { className: "text-green-700 text-sm", children: [_jsx("strong", { children: "\u2705 Strengths Identified:" }), " ", assessmentResults[currentEx.id].strengths.join(', ')] }) })), assessmentResults[currentEx.id].improvements.length > 0 && (_jsx("div", { className: "mb-3", children: _jsxs("p", { className: "text-orange-700 text-sm", children: [_jsx("strong", { children: "\uD83D\uDCC8 Areas for Growth:" }), " ", assessmentResults[currentEx.id].improvements.join(', ')] }) })), assessmentResults[currentEx.id].nextSteps.length > 0 && (_jsx("div", { children: _jsxs("p", { className: "text-purple-700 text-sm", children: [_jsx("strong", { children: "\uD83C\uDFAF Recommended Next Steps:" }), " ", assessmentResults[currentEx.id].nextSteps.join(', ')] }) }))] })] }) })), _jsx("div", { className: "bg-green-50 border border-green-200 rounded-lg p-6", children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx(Lightbulb, { className: "w-6 h-6 text-green-600 mt-1" }), _jsxs("div", { children: [_jsx("h4", { className: "font-semibold text-green-800 mb-3", children: "\uD83D\uDCDA Expert Example (For Learning):" }), _jsxs("p", { className: "text-green-700 mb-4 italic", children: ["\"", currentEx.goodResponse, "\""] }), _jsxs("p", { className: "text-green-600 text-sm", children: [_jsx("strong", { children: "Why this works:" }), " ", currentEx.feedback] })] })] }) }), _jsx("div", { className: "bg-yellow-50 border border-yellow-200 rounded-lg p-4", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-yellow-600 mt-1" }), _jsxs("div", { children: [_jsx("h5", { className: "font-semibold text-yellow-800 mb-2", children: "Reflection Questions:" }), _jsxs("ul", { className: "text-yellow-700 text-sm space-y-1", children: [_jsx("li", { children: "\u2022 How did your response compare to the example?" }), _jsx("li", { children: "\u2022 What aspects of epistemic humility did you include or miss?" }), _jsx("li", { children: "\u2022 How might you improve your response?" })] })] })] }) })] }))] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("button", { onClick: () => setCurrentExercise(Math.max(0, currentExercise - 1)), disabled: currentExercise === 0, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50 disabled:cursor-not-allowed", children: "Previous Exercise" }), currentExercise === exercises.length - 1 ? (_jsxs("button", { onClick: completeLesson, className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: [_jsx(CheckCircle, { className: "w-5 h-5" }), "Complete Sandbox"] })) : (_jsx("button", { onClick: () => setCurrentExercise(Math.min(exercises.length - 1, currentExercise + 1)), className: "px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition", children: "Next Exercise" }))] }), _jsx("div", { className: "mt-8 text-center", children: _jsxs("div", { className: "bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-white/50", children: [_jsx("h3", { className: "font-semibold text-gray-800 mb-2", children: "\uD83C\uDFD6\uFE0F Safe Learning Environment" }), _jsx("p", { className: "text-sm text-gray-600", children: "This is your sandbox\u2014a safe space to practice critical thinking without judgment. Experiment with different approaches, make mistakes, and learn from the feedback. The goal is growth, not perfection." })] }) })] }) }));
};
export default EpistemicSandboxLesson;
