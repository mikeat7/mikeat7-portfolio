import React from 'react';
import { Heart, Code, Coffee, Github, Linkedin, Mail, ArrowUp } from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Contact', href: '/contact' }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/mikeat7', label: 'GitHub' },
    { icon: Linkedin, href: 'https://linkedin.com/in/mikeat7', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:mike@mikeat7.com', label: 'Email' }
  ];

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Code className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">Mike's Portfolio</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md leading-relaxed">
              Full-stack developer passionate about creating innovative solutions 
              that bridge technology and human needs. Always learning, always building.
            </p>
            <div className="flex items-center space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get In Touch</h3>
            <div className="space-y-2 text-gray-400">
              <p>mike@mikeat7.com</p>
              <p>+1 (555) 123-4567</p>
              <p>San Francisco, CA</p>
            </div>
            
            {/* Tavus CVI Status */}
            <div className="mt-6 p-3 bg-green-900/30 rounded-lg border border-green-700">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-400 text-sm font-medium">AI Chat Active</span>
              </div>
              <p className="text-green-300 text-xs mt-1">
                Powered by Tavus CVI
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 text-gray-400 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>and</span>
              <Coffee className="w-4 h-4 text-yellow-500" />
              <span>by Mike</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <p className="text-gray-400 text-sm">
                © {currentYear} Mike's Portfolio. All rights reserved.
              </p>
              <button
                onClick={scrollToTop}
                className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors group"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;