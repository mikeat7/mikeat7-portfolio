import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, BookOpen } from 'lucide-react';
import BackButton from '@/components/BackButton';

const LogicalFallacies: React.FC = () => {
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
      id: 'fallacies-overview',
      title: 'Fallacies Overview',
      description: 'Introduction to logical fallacies and why they matter',
      route: '/educate/fallacies-overview',
      available: true
    },
    {
      id: 'false-dichotomy',
      title: 'False Dichotomy',
      description: 'Breaking down artificial either/or choices',
      route: '/educate/false-dichotomy',
      available: true
    },
    {
      id: 'false-dilemma',
      title: 'False Dilemma',
      description: 'When complex issues are reduced to two options',
      route: '/educate/false-dilemma',
      available: true
    },
    {
      id: 'red-herring',
      title: 'Red Herring',
      description: 'Spotting deliberate topic changes and distractions',
      route: '/educate/red-herring',
      available: true
    },
    {
      id: 'straw-man',
      title: 'Straw Man Fallacy',
      description: 'Recognizing when your position is misrepresented',
      route: '/educate/straw-man',
      available: true
    },
    {
      id: 'steelman',
      title: 'Steelman Technique',
      description: 'The opposite of straw man - strengthening opposing arguments',
      route: '/educate/steelman',
      available: true
    },
    {
      id: 'ad-hominem',
      title: 'Ad Hominem',
      description: 'When the person is attacked instead of their argument',
      route: '/educate/ad-hominem',
      available: true
    },
    {
      id: 'circular-reasoning',
      title: 'Circular Reasoning',
      description: 'When the conclusion is used to support the premise',
      route: '/educate/circular-reasoning',
      available: true
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <BackButton />
        
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full mb-4">
            <AlertTriangle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            Logical Fallacies
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Master the art of spotting flawed reasoning and invalid arguments
          </p>
        </div>

        {/* Lessons Grid */}
        <div className="grid gap-4">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                lesson.available 
                  ? 'bg-white border-orange-200 hover:border-orange-300 hover:bg-orange-50 cursor-pointer' 
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
              onClick={() => handleLessonClick(lesson.route, lesson.available)}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${lesson.available ? 'bg-orange-100 text-orange-700' : 'bg-gray-200 text-gray-500'}`}>
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

export default LogicalFallacies;