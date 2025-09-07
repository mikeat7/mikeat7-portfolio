import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, BookOpen, Home } from 'lucide-react';


const BullshitDetection: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBackToEducationHub = () => {
    navigate('/educate');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const handleLessonClick = (route: string, available: boolean) => {
    if (available) {
      navigate(route);
    }
  };

  const lessons = [
    {
      id: 'detect-bullshit',
      title: 'Detect Bullshit',
      description: 'Core principles of identifying deceptive communication',
      route: '/educate/detect-bullshit',
      available: true
    },
    {
      id: 'vagueness',
      title: 'Vagueness',
      description: 'How imprecise language conceals weak arguments',
      route: '/educate/vagueness',
      available: true // This one is already implemented
    },
    {
      id: 'emotional-framing',
      title: 'Emotional Framing',
      description: 'Recognizing when emotions are used to bypass logic',
      route: '/educate/emotional-framing',
      available: true // This one is already implemented
    },
    {
      id: 'speculative-authority',
      title: 'Speculative Authority',
      description: 'Identifying misuse of expertise and credentials',
      route: '/educate/speculative-authority',
      available: true // This one is already implemented
    },
    {
      id: 'citation-laundering',
      title: 'Citation Laundering',
      description: 'How false information gains credibility through repetition',
      route: '/educate/bullshit-types/citation-laundering',
      available: true // This one is already implemented
    },
    {
      id: 'jargon-overload',
      title: 'Jargon Overload',
      description: 'When technical language is used to confuse rather than clarify',
      route: '/educate/jargon-overload',
      available: true
    },
    {
      id: 'false-urgency',
      title: 'False Urgency',
      description: 'Manufactured time pressure to prevent careful consideration',
      route: '/educate/false-urgency',
      available: true
    },
    {
      id: 'appeal-to-authority',
      title: 'Appeal to Authority',
      description: 'When expert opinion becomes logical fallacy',
      route: '/educate/appeal-to-authority',
      available: true
    },
    {
      id: 'appeal-to-emotion',
      title: 'Appeal to Emotion',
      description: 'How feelings are weaponized against reason',
      route: '/educate/appeal-to-emotion',
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={handleBackToEducationHub}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Education Hub
        </button>
        
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-violet-600 rounded-full mb-4">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Bullshit Detection
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Learn to identify manipulation, fallacies, and deceptive language
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                lesson.available 
                  ? 'bg-white border-purple-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
              onClick={() => handleLessonClick(lesson.route, lesson.available)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${lesson.available ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>
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

export default BullshitDetection;