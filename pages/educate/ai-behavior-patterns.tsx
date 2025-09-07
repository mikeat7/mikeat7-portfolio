import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lightbulb, Plus, Brain, AlertTriangle, CheckCircle } from 'lucide-react';


const STORAGE_KEY = "ai_behavior_stories";

interface AIStory {
  id: string;
  title: string;
  story: string;
  lesson: string;
  author: string;
  timestamp: string;
  isUserSubmitted?: boolean;
}

const foundationStory: AIStory = {
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

const AIBehaviorPatterns: React.FC = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState<AIStory[]>([foundationStory]);
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
        const userStories: AIStory[] = JSON.parse(savedStories);
        setStories([foundationStory, ...userStories]);
      } catch (error) {
        console.error('Error loading user stories:', error);
      }
    }
  }, []);

  const validateStoryInput = (title: string, story: string, lesson: string): string | null => {
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
    const isDuplicate = stories.some(s => 
      s.title.toLowerCase().trim() === title.toLowerCase().trim()
    );

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

    const userStory: AIStory = {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
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
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Clarifying AI Behavior Patterns
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            How to talk to an AI so that it can understand you
          </p>
          <p className="text-sm text-gray-500 italic">
            Paste your favorite stories that made you say, "wow"
          </p>
          {userSubmissionCount > 0 && (
            <p className="text-sm text-green-600 mt-2">
              Including {userSubmissionCount} community story{userSubmissionCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Story Display */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-cyan-600" />
            <h2 className="text-2xl font-bold text-gray-900">{currentStory.title}</h2>
            {currentStory.isUserSubmitted && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                Community
              </span>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Brain className="w-5 h-5 text-blue-600" />
              The Story
            </h3>
            <div className="bg-blue-50 border-l-4 border-blue-400 p-6 rounded-r-lg">
              <p className="text-blue-800 whitespace-pre-line leading-relaxed">
                {currentStory.story}
              </p>
            </div>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              The AI Awareness Lesson
            </h3>
            <div className="bg-orange-50 border-l-4 border-orange-400 p-6 rounded-r-lg">
              <div className="text-orange-800 whitespace-pre-line leading-relaxed">
                {currentStory.lesson}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>By {currentStory.author}</span>
            <span>{currentStoryIndex + 1} of {stories.length}</span>
          </div>
        </div>

        {/* Navigation Controls */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={previousStory}
            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
          >
            ← Previous Story
          </button>
          <button
            onClick={nextStory}
            className="px-6 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition font-medium"
          >
            Next Story →
          </button>
          <button
            onClick={() => setShowSubmissionForm(!showSubmissionForm)}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
          >
            <Plus className="w-4 h-4" />
            Add Your Story
          </button>
          {userSubmissionCount > 0 && (
            <button
              onClick={exportStoriesForMike}
              className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"
            >
              📧 Email to Mike
            </button>
          )}
        </div>

        {/* Story Submission Form */}
        {showSubmissionForm && (
          <div className="bg-white/95 border-2 border-green-200 rounded-2xl p-8 shadow-xl backdrop-blur-sm mb-6">
            <div className="flex items-center gap-2 mb-6">
              <Plus className="w-6 h-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Share Your AI Story</h2>
            </div>
            
            <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6 flex items-start gap-2">
              <Brain className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-cyan-800">
                <strong>What makes a good AI story:</strong> Moments when AI behavior surprised you, 
                failed in interesting ways, or taught you something about how AI systems work. 
                Include what you learned about communicating with AI.
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="story-title" className="block text-sm font-medium text-gray-700 mb-2">
                  Story Title *
                </label>
                <input
                  id="story-title"
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g., 'When ChatGPT Convinced Me It Could Browse the Internet'"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90"
                  maxLength={100}
                />
              </div>
              
              <div>
                <label htmlFor="story-content" className="block text-sm font-medium text-gray-700 mb-2">
                  Your AI Story *
                </label>
                <textarea
                  id="story-content"
                  value={newStory}
                  onChange={(e) => setNewStory(e.target.value)}
                  placeholder="Tell us what happened... What did the AI do? How did you interact with it? What surprised you?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none bg-white/90"
                  rows={6}
                  maxLength={2000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newStory.length}/2000 characters
                </div>
              </div>
              
              <div>
                <label htmlFor="story-lesson" className="block text-sm font-medium text-gray-700 mb-2">
                  What This Teaches About AI *
                </label>
                <textarea
                  id="story-lesson"
                  value={newLesson}
                  onChange={(e) => setNewLesson(e.target.value)}
                  placeholder="What did this experience teach you about how AI systems work, their limitations, or how to communicate with them better?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 resize-none bg-white/90"
                  rows={4}
                  maxLength={1000}
                />
                <div className="text-xs text-gray-500 mt-1">
                  {newLesson.length}/1000 characters
                </div>
              </div>
              
              <div>
                <label htmlFor="story-author" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (optional)
                </label>
                <input
                  id="story-author"
                  type="text"
                  value={newAuthor}
                  onChange={(e) => setNewAuthor(e.target.value)}
                  placeholder="How would you like to be credited?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white/90"
                  maxLength={50}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmitStory}
                  disabled={!newTitle.trim() || !newStory.trim() || !newLesson.trim()}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Share Story
                </button>
                <button
                  onClick={() => {
                    setShowSubmissionForm(false);
                    setNewTitle("");
                    setNewStory("");
                    setNewLesson("");
                    setNewAuthor("");
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {stories[currentStoryIndex]?.isUserSubmitted && currentStoryIndex === stories.length - 1 && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">
              ✅ Your AI story has been added! Thank you for contributing to AI awareness education.
            </span>
          </div>
        )}

        {/* Educational Context */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 shadow-sm border border-indigo-200">
          <h3 className="text-xl font-bold text-indigo-800 mb-4">Why Stories Matter for AI Awareness</h3>
          <div className="prose text-indigo-700 space-y-4">
            <p>
              Real experiences with AI systems teach us more than theoretical knowledge. These stories reveal:
            </p>
            <ul className="space-y-2">
              <li><strong>Pattern Recognition:</strong> How AI systems process and respond to requests</li>
              <li><strong>Limitation Discovery:</strong> Where AI capabilities break down in practice</li>
              <li><strong>Communication Skills:</strong> How to phrase requests for better results</li>
              <li><strong>Expectation Calibration:</strong> What AI can and cannot actually do</li>
              <li><strong>Failure Modes:</strong> Common ways AI systems fail or mislead</li>
            </ul>
            <p className="text-sm italic">
              <strong>Community Learning:</strong> By sharing our experiences, we build collective AI literacy 
              and help others navigate AI interactions more effectively.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIBehaviorPatterns;