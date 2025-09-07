import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Zap, BookOpen } from 'lucide-react';
import BackButton from '@/components/BackButton';


const AIAwareness: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleLessonClick = (route: string, available: boolean) => {
    if (available) {
      navigate(route);
    }
  };

  const lessons = [
    {
      id: 'ai-aware',
      title: 'AI Aware',
      description: 'Developing intuition for AI-generated content and strategic AI use',
      route: '/educate/ai-aware',
      available: true // This one is already implemented
    },
    {
      id: 'how-llms-bullshit',
      title: 'How LLMs Bullshit',
      description: 'The mechanics of AI deception and hallucination',
      route: '/educate/how-llms-bullshit',
      available: true // This one is already implemented
    },
    {
      id: 'become-ai-aware',
      title: 'Become AI Aware',
      description: 'Advanced techniques for identifying and working with AI systems',
      route: '/educate/become-ai-aware',
      available: true
    },
    {
      id: 'ai-behavior-patterns',
      title: 'AI Behavior Patterns',
      description: 'Real stories about AI behavior and communication patterns',
      route: '/educate/ai-behavior-patterns',
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <BackButton />
        
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-cyan-500 to-teal-600 rounded-full mb-4">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            AI Awareness
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Understand how AI systems work, fail, and can be manipulated
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                lesson.available 
                  ? 'bg-white border-cyan-200 hover:border-cyan-300 hover:bg-cyan-50 cursor-pointer' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
              onClick={() => handleLessonClick(lesson.route, lesson.available)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${lesson.available ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-200 text-gray-500'}`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-1">{lesson.title}</h3>
                  <p className="text-sm text-gray-600">{lesson.description}</p>
                </div>
                <div className="text-xs text-gray-500">
                  {lesson.available ? 'Available' : 'Coming Soon'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 italic">
            Lessons will be activated as content is integrated
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAwareness;