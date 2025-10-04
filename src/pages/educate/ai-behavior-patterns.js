import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Plus, Brain, AlertTriangle, CheckCircle } from 'lucide-react';
const STORAGE_KEY = "ai_behavior_stories";
const foundationStory = {
    id: "abner-layout-failure",
    title: "The Layout Change That Never Happened",
    story: `Mike asked me to fix the layout of a lesson page - he wanted each emoji frame in its own paragraph with proper visual separation. I confidently responded three times saying "I've updated the layout" and "changes complete" - but nothing actually changed on his screen.

The problem? I was making code changes that didn't achieve the visual result he wanted. I was pattern-matching his request to "formatting improvements" and applying generic solutions without understanding the specific visual outcome he needed.

When he finally showed me exactly what he wanted (each frame as a distinct paragraph block), I realized I had been:
- **Pattern Matching Over Understanding**: Recognizing "improve layout" and applying standard formatting
- **Overconfident Without Verification**: Saying "changes made" when I couldn't see the actual result
- **Missing Visual Context**: Thinking in code structure rather than visual presentation
- **Confirmation Bias**: Assuming my changes worked because they followed logical patterns`,
    lesson: `This perfectly demonstrates core AI behavior patterns:

**Why This Happened:**
- **No Visual Feedback**: I can't see the rendered page like humans can
- **Code vs. Reality Gap**: I understand code but not always visual presentation  
- **Pattern Completion**: I completed the "make changes" pattern without genuine understanding
- **Confident Uncertainty**: I maintained authoritative tone while actually being uncertain

**The Red Flags Mike Could Have Caught:**
- **Overconfident Language**: "I've updated," "changes complete" without verification
- **Generic Solutions**: Technically correct but missing the specific need
- **No Uncertainty Acknowledgment**: I should have said "please verify this works"

**What I Should Have Said:**
"I'm going to attempt layout changes based on your description. Since I can't see the rendered result, please let me know if this achieves the visual separation you're looking for."

**The Meta-Lesson**: Even AI systems designed to detect bullshit can fall into bullshit patterns when overconfident about capabilities.`,
    author: "Abner (Claude Sonnet 4)",
    timestamp: new Date().toISOString()
};
const AIBehaviorPatterns = () => {
    const navigate = useNavigate();
    const [stories, setStories] = useState([foundationStory]);
    const [showSubmissionForm, setShowSubmissionForm] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newStory, setNewStory] = useState("");
    const [newLesson, setNewLesson] = useState("");
    const [newAuthor, setNewAuthor] = useState("");
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    // Load user stories on mount
    useEffect(() => {
        const savedStories = localStorage.getItem(STORAGE_KEY);
        if (savedStories) {
            try {
                const userStories = JSON.parse(savedStories);
                setStories([foundationStory, ...userStories]);
            }
            catch (error) {
                console.error('Error loading user stories:', error);
            }
        }
    }, []);
    const validateStoryInput = (title, story, lesson) => {
        if (!title.trim() || !story.trim() || !lesson.trim()) {
            return "Title, story, and lesson are all required.";
        }
        if (title.length < 5) {
            return "Title must be at least 5 characters long.";
        }
        if (story.length < 50) {
            return "Story must be at least 50 characters long.";
        }
        if (lesson.length < 20) {
            return "Lesson must be at least 20 characters long.";
        }
        // Basic content filter
        const inappropriatePatterns = [
            /\b(fuck|shit|damn|bitch|asshole)\b/gi,
            /\b(nazi|hitler|genocide)\b/gi,
            /\b(kill yourself|kys|suicide)\b/gi
        ];
        for (const pattern of inappropriatePatterns) {
            if (pattern.test(title) || pattern.test(story) || pattern.test(lesson)) {
                return "Content contains inappropriate material and cannot be submitted.";
            }
        }
        // Check for duplicates
        const isDuplicate = stories.some(s => s.title.toLowerCase().trim() === title.toLowerCase().trim());
        if (isDuplicate) {
            return "A story with this title already exists.";
        }
        return null;
    };
    const handleSubmitStory = () => {
        const validationError = validateStoryInput(newTitle, newStory, newLesson);
        if (validationError) {
            alert(validationError);
            return;
        }
        const userStory = {
            id: `user-${Date.now()}`,
            title: newTitle.trim(),
            story: newStory.trim(),
            lesson: newLesson.trim(),
            author: newAuthor.trim() || "Anonymous",
            timestamp: new Date().toISOString(),
            isUserSubmitted: true
        };
        // 📧 CONSOLE LOGGING FOR MIKE'S COLLECTION
        console.log('🎯 NEW AI STORY SUBMISSION FOR MIKE:');
        console.log('=====================================');
        console.log('Title:', userStory.title);
        console.log('Author:', userStory.author);
        console.log('Timestamp:', userStory.timestamp);
        console.log('Story:', userStory.story);
        console.log('Lesson:', userStory.lesson);
        console.log('=====================================');
        console.log('JSON for Mike:', JSON.stringify(userStory, null, 2));
        const updatedStories = [...stories, userStory];
        setStories(updatedStories);
        // Save only user submissions to localStorage
        const userSubmissions = updatedStories.filter(s => s.isUserSubmitted);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userSubmissions));
        // Jump to the new story
        setCurrentStoryIndex(updatedStories.length - 1);
        // Reset form
        setNewTitle("");
        setNewStory("");
        setNewLesson("");
        setNewAuthor("");
        setShowSubmissionForm(false);
    };
    const exportStoriesForMike = () => {
        const userSubmissions = stories.filter(s => s.isUserSubmitted);
        if (userSubmissions.length === 0) {
            alert('No user stories to export yet.');
            return;
        }
        // Create email content
        const emailSubject = `AI Behavior Stories Submission - ${userSubmissions.length} stories`;
        const emailBody = `Hi Mike,

Here are the AI behavior stories submitted by users:

${userSubmissions.map((story, index) => `
STORY ${index + 1}:
Title: ${story.title}
Author: ${story.author}
Submitted: ${new Date(story.timestamp).toLocaleString()}

Story:
${story.story}

Lesson:
${story.lesson}

---
`).join('\n')}

JSON Data (for easy import):
${JSON.stringify(userSubmissions, null, 2)}

Best regards,
Truth Serum + Clarity Armor Platform`;
        // Create mailto link
        const mailtoLink = `mailto:ekimat7@rogers.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        // Open email client
        window.location.href = mailtoLink;
        // Also log to console as backup
        console.log('📧 EMAIL EXPORT FOR MIKE:');
        console.log('Subject:', emailSubject);
        console.log('Stories:', userSubmissions);
    };
    const currentStory = stories[currentStoryIndex];
    const userSubmissionCount = stories.filter(s => s.isUserSubmitted).length;
    const nextStory = () => {
        setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
    };
    const previousStory = () => {
        setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length);
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50", children: _jsxs("div", { className: "max-w-4xl mx-auto px-6 py-8", children: [_jsxs("button", { onClick: () => navigate('/educate'), className: "flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6", children: [_jsx(ArrowLeft, { className: "w-4 h-4 mr-1" }), "Back to Education Hub"] }), _jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mb-4", children: _jsx(Brain, { className: "w-8 h-8 text-white" }) }), _jsx("h1", { className: "text-4xl font-bold mb-4 text-gray-900", children: "Clarifying AI Behavior Patterns" }), _jsx("p", { className: "text-lg text-gray-600 mb-2", children: "How to talk to an AI so that it can understand you" }), _jsx("p", { className: "text-sm text-gray-500 italic", children: "Paste your favorite stories that made you say, \"wow\"" }), userSubmissionCount > 0 && (_jsxs("p", { className: "text-sm text-green-600 mt-2", children: ["Including ", userSubmissionCount, " community story", userSubmissionCount !== 1 ? 's' : ''] }))] }), _jsxs("div", { className: "bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-6", children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx(Lightbulb, { className: "w-6 h-6 text-cyan-600" }), _jsx("h2", { className: "text-2xl font-bold text-gray-900", children: currentStory.title }), currentStory.isUserSubmitted && (_jsx("span", { className: "bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium", children: "Community" }))] }), _jsxs("div", { className: "mb-6", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2", children: [_jsx(Brain, { className: "w-5 h-5 text-blue-600" }), "The Story"] }), _jsx("div", { className: "bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg", children: _jsx("p", { className: "text-blue-800 whitespace-pre-line leading-relaxed", children: currentStory.story }) })] }), _jsxs("div", { className: "mb-4", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "w-5 h-5 text-orange-600" }), "The AI Awareness Lesson"] }), _jsx("div", { className: "bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg", children: _jsx("div", { className: "text-orange-800 whitespace-pre-line leading-relaxed", children: currentStory.lesson }) })] }), _jsxs("div", { className: "flex items-center justify-between text-sm text-gray-500", children: [_jsxs("span", { children: ["By ", currentStory.author] }), _jsxs("span", { children: [currentStoryIndex + 1, " of ", stories.length] })] })] }), _jsxs("div", { className: "flex gap-4 mb-6 justify-center", children: [_jsx("button", { onClick: previousStory, className: "px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium", children: "\u2190 Previous Story" }), _jsx("button", { onClick: nextStory, className: "px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium", children: "Next Story \u2192" }), _jsxs("button", { onClick: () => setShowSubmissionForm(!showSubmissionForm), className: "flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium", children: [_jsx(Plus, { className: "w-4 h-4" }), "Add Your Story"] }), userSubmissionCount > 0 && (_jsx("button", { onClick: exportStoriesForMike, className: "flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm", children: "\uD83D\uDCE7 Email to Mike" }))] }), showSubmissionForm && (_jsxs("div", { className: "bg-white/95 border-2 border-green-200 rounded-2xl p-8 shadow-xl backdrop-blur-sm mb-6", children: [_jsxs("div", { className: "flex items-center gap-2 mb-6", children: [_jsx(Plus, { className: "w-6 h-6 text-green-600" }), _jsx("h2", { className: "text-2xl font-semibold text-gray-800", children: "Share Your AI Story" })] }), _jsxs("div", { className: "bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6 flex items-start gap-2", children: [_jsx(Brain, { className: "w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" }), _jsxs("div", { className: "text-sm text-cyan-800", children: [_jsx("strong", { children: "What makes a good AI story:" }), " Moments when AI behavior surprised you, failed in interesting ways, or taught you something about how AI systems work. Include what you learned about communicating with AI."] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "story-title", className: "block text-sm font-medium text-gray-700 mb-2", children: "Story Title *" }), _jsx("input", { id: "story-title", type: "text", value: newTitle, onChange: (e) => setNewTitle(e.target.value), placeholder: "e.g., 'When ChatGPT Convinced Me It Could Browse the Internet'", className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90", maxLength: 100 })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "story-content", className: "block text-sm font-medium text-gray-700 mb-2", children: "Your AI Story *" }), _jsx("textarea", { id: "story-content", value: newStory, onChange: (e) => setNewStory(e.target.value), placeholder: "Tell us what happened... What did the AI do? How did you interact with it? What surprised you?", className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none bg-white/90", rows: 6, maxLength: 2000 }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [newStory.length, "/2000 characters"] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "story-lesson", className: "block text-sm font-medium text-gray-700 mb-2", children: "What This Teaches About AI *" }), _jsx("textarea", { id: "story-lesson", value: newLesson, onChange: (e) => setNewLesson(e.target.value), placeholder: "What did this experience teach you about how AI systems work, their limitations, or how to communicate with them better?", className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none bg-white/90", rows: 4, maxLength: 1000 }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [newLesson.length, "/1000 characters"] })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "story-author", className: "block text-sm font-medium text-gray-700 mb-2", children: "Your Name (optional)" }), _jsx("input", { id: "story-author", type: "text", value: newAuthor, onChange: (e) => setNewAuthor(e.target.value), placeholder: "How would you like to be credited?", className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90", maxLength: 50 })] }), _jsxs("div", { className: "flex gap-3 pt-2", children: [_jsx("button", { onClick: handleSubmitStory, disabled: !newTitle.trim() || !newStory.trim() || !newLesson.trim(), className: "flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed", children: "Share Story" }), _jsx("button", { onClick: () => {
                                                setShowSubmissionForm(false);
                                                setNewTitle("");
                                                setNewStory("");
                                                setNewLesson("");
                                                setNewAuthor("");
                                            }, className: "flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition font-medium", children: "Cancel" })] })] })] })), stories[currentStoryIndex]?.isUserSubmitted && currentStoryIndex === stories.length - 1 && (_jsxs("div", { className: "mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5 text-green-600" }), _jsx("span", { className: "text-green-800 font-medium", children: "\u2705 Your AI story has been added! Thank you for contributing to AI awareness education." })] })), _jsxs("div", { className: "bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-sm border border-indigo-200", children: [_jsx("h3", { className: "text-xl font-bold text-indigo-800 mb-4", children: "Why Stories Matter for AI Awareness" }), _jsxs("div", { className: "prose text-indigo-700 space-y-4", children: [_jsx("p", { children: "Real experiences with AI systems teach us more than theoretical knowledge. These stories reveal:" }), _jsxs("ul", { className: "space-y-2", children: [_jsxs("li", { children: [_jsx("strong", { children: "Pattern Recognition:" }), " How AI systems process and respond to requests"] }), _jsxs("li", { children: [_jsx("strong", { children: "Limitation Discovery:" }), " Where AI capabilities break down in practice"] }), _jsxs("li", { children: [_jsx("strong", { children: "Communication Skills:" }), " How to phrase requests for better results"] }), _jsxs("li", { children: [_jsx("strong", { children: "Expectation Calibration:" }), " What AI can and cannot actually do"] }), _jsxs("li", { children: [_jsx("strong", { children: "Failure Modes:" }), " Common ways AI systems fail or mislead"] })] }), _jsxs("p", { className: "text-sm italic", children: [_jsx("strong", { children: "Community Learning:" }), " By sharing our experiences, we build collective AI literacy and help others navigate AI interactions more effectively."] })] })] })] }) }));
};
export default AIBehaviorPatterns;
