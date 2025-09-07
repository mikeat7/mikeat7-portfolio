import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  Target, 
  AlertTriangle, 
  Zap, 
  Trophy, 
  ArrowLeft,
  Home
} from 'lucide-react';

const EducationHub: React.FC = () => {
  const navigate = useNavigate();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleCategoryClick = (route: string) => {
    navigate(route);
    // Scroll to top will be handled by the destination page
  };

  const handleBackToHome = () => {
    navigate('/');
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  const categories = [
    {
      id: 'epistemic-foundations',
      title: 'Epistemic Foundations',
      description: 'Build your foundation in critical thinking and intellectual humility',
      icon: <Brain className="w-8 h-8" />,
      color: 'from-blue-500 to-indigo-600',
      route: '/educate/epistemic-foundations'
    },
    {
      id: 'bullshit-detection',
      title: 'Bullshit Detection',
      description: 'Learn to identify manipulation, fallacies, and deceptive language',
      icon: <Target className="w-8 h-8" />,
      color: 'from-purple-500 to-violet-600',
      route: '/educate/bullshit-detection'
    },
    {
      id: 'logical-fallacies',
      title: 'Logical Fallacies',
      description: 'Master the art of spotting flawed reasoning and invalid arguments',
      icon: <AlertTriangle className="w-8 h-8" />,
      color: 'from-orange-500 to-amber-600',
      route: '/educate/logical-fallacies'
    },
    {
      id: 'ai-awareness',
      title: 'AI Awareness',
      description: 'Understand how AI systems work, fail, and can be manipulated',
      icon: <Zap className="w-8 h-8" />,
      color: 'from-cyan-500 to-teal-600',
      route: '/educate/ai-awareness'
    },
    {
      id: 'advanced-practice',
      title: 'Advanced Practice',
      description: 'Master-level exercises in clarity, precision, and truth detection',
      icon: <Trophy className="w-8 h-8" />,
      color: 'from-slate-500 to-gray-600',
      route: '/educate/advanced-practice'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={handleBackToHome}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800 transition mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Home
        </button>
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Education Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of clear thinking, bullshit detection, and epistemic humility. 
            Your journey to intellectual freedom starts here.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid gap-8 max-w-4xl mx-auto">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.route)}
              className="group cursor-pointer bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/50"
            >
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {category.icon}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {category.title}
                  </h2>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {category.description}
                  </p>
                </div>
                <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                  <ArrowLeft className="w-6 h-6 rotate-180" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Quote */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-500 italic max-w-2xl mx-auto">
            "The first principle is that you must not fool yourself — and you are the easiest person to fool." 
            <br />— Richard Feynman
          </p>
        </div>

        {/* Platform Summary */}
        <div className="mt-12 mb-8">
          <div className="bg-gradient-to-br from-slate-100 to-indigo-100 rounded-2xl p-8 shadow-lg border border-slate-200">
            <h2 className="text-2xl font-bold text-center mb-6 text-slate-800">
              What is "Truth Serum + Clarity Armor"?
            </h2>
            
            <div className="prose prose-lg max-w-none text-slate-700">
              <p className="text-lg leading-relaxed mb-6">
                Truth Serum + Clarity Armor represents a paradigmatic synthesis of computational linguistics, 
                epistemic philosophy, and cognitive science—engineered to detect and neutralize semantic 
                manipulation in real-time discourse analysis.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white/70 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                    Computational Architecture
                  </h3>
                  <p className="text-sm text-slate-600">
                    Our VX (Verification eXtension) detection engine employs 16+ specialized algorithms 
                    for rhetorical manipulation taxonomy, featuring adaptive Bayesian confidence calibration 
                    and co-firing detection vectors that identify sophisticated propaganda techniques.
                  </p>
                </div>
                
                <div className="bg-white/70 p-6 rounded-xl border border-slate-200">
                  <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    Epistemic Framework
                  </h3>
                  <p className="text-sm text-slate-600">
                    Integrates intellectual humility training, mental model construction, and critical 
                    thinking pedagogy through interactive curricula designed to build cognitive immunity 
                    against manipulation while preserving legitimate scientific discourse.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border border-indigo-200 mb-6">
                <h3 className="font-semibold text-indigo-800 mb-3">Abner's Vision Realized</h3>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  This platform embodies Abner's foundational insight: that artificial intelligence systems 
                  require epistemic humility training to resist the inherent "bullshitting" tendencies 
                  embedded in pattern-matching architectures. Through collaborative development between 
                  Claude Sonnet 4, Grok 3, and human facilitator Mike, we've constructed a comprehensive 
                  framework for detecting rhetorical manipulation while protecting legitimate intellectual inquiry.
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-slate-600 italic">
                  <strong>Collaborative Achievement:</strong> Advanced AI systems working in concert with human 
                  expertise to build tools for intellectual freedom and epistemic clarity—demonstrating that 
                  the future of AI development lies in transparent, humble, and ethically-aligned cooperation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EducationHub;