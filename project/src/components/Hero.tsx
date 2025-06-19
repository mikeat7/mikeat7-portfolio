import React, { useEffect, useState } from 'react';
import { ArrowRight, Download, Github, Linkedin, Mail, Code, Sparkles, Video } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const skills = ['React', 'TypeScript', 'Node.js', 'Python', 'AI/ML', 'Cloud'];

  return (
    <section className="min-h-screen flex items-center justify-center pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className={`space-y-8 ${isVisible ? 'animate-fade-in-left' : 'opacity-0'}`}>
            {/* Greeting */}
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Welcome to my portfolio</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Hi, I'm{' '}
                <span className="gradient-text">Mike</span>
              </h1>
              
              <h2 className="text-xl sm:text-2xl text-gray-600 font-medium">
                Full-Stack Developer & AI Enthusiast
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              I craft exceptional digital experiences using cutting-edge technologies. 
              Passionate about AI, machine learning, and building scalable applications 
              that make a difference.
            </p>

            {/* Skills */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                Technologies I Love
              </h3>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 font-medium hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/portfolio"
                className="btn-primary flex items-center justify-center space-x-2 group"
              >
                <span>View My Work</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href="/resume.pdf"
                download
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download Resume</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              <a
                href="https://github.com/mikeat7"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <Github className="w-5 h-5 text-gray-600 group-hover:text-gray-900" />
              </a>
              <a
                href="https://linkedin.com/in/mikeat7"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <Linkedin className="w-5 h-5 text-gray-600 group-hover:text-blue-600" />
              </a>
              <Link
                to="/contact"
                className="p-3 bg-white rounded-lg shadow-md hover:shadow-lg transition-all hover:-translate-y-1 group"
              >
                <Mail className="w-5 h-5 text-gray-600 group-hover:text-green-600" />
              </Link>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className={`relative ${isVisible ? 'animate-fade-in-right' : 'opacity-0'}`}>
            {/* Main Card */}
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 hover-lift">
              {/* Profile Image Placeholder */}
              <div className="w-48 h-48 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                <Code className="w-24 h-24 text-white" />
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">50+</div>
                  <div className="text-sm text-gray-500">Projects</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">3+</div>
                  <div className="text-sm text-gray-500">Years Exp</div>
                </div>
                <div className="space-y-1">
                  <div className="text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-500">Passion</div>
                </div>
              </div>

              {/* Tavus CVI Integration Notice */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                <div className="flex items-center space-x-3">
                  <Video className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-800">AI Chat Available</h4>
                    <p className="text-sm text-green-600">
                      Chat with my AI avatar powered by Tavus CVI
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-pink-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 -left-8 w-12 h-12 bg-blue-400 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;