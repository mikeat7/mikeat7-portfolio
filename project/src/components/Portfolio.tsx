import React, { useState } from 'react';
import { ExternalLink, Github, Filter, Search, Star, Calendar, Code, Zap } from 'lucide-react';

const Portfolio: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'web', label: 'Web Apps' },
    { id: 'mobile', label: 'Mobile' },
    { id: 'ai', label: 'AI/ML' },
    { id: 'api', label: 'APIs' }
  ];

  const projects = [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, and real-time inventory tracking.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop',
      category: 'web',
      technologies: ['React', 'Node.js', 'MongoDB', 'Stripe', 'Redux'],
      github: 'https://github.com/mikeat7/ecommerce-platform',
      demo: 'https://ecommerce-demo.mikeat7.com',
      featured: true,
      date: '2023-12-15'
    },
    {
      id: 2,
      title: 'AI Chat Assistant',
      description: 'Intelligent chatbot powered by OpenAI GPT-4 with custom training data. Includes conversation memory, context awareness, and multi-language support.',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop',
      category: 'ai',
      technologies: ['Python', 'OpenAI API', 'FastAPI', 'React', 'WebSocket'],
      github: 'https://github.com/mikeat7/ai-chat-assistant',
      demo: 'https://ai-chat.mikeat7.com',
      featured: true,
      date: '2023-11-20'
    },
    {
      id: 3,
      title: 'Task Management Mobile App',
      description: 'Cross-platform mobile app for team collaboration and task management. Features real-time sync, offline support, and push notifications.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop',
      category: 'mobile',
      technologies: ['React Native', 'Firebase', 'Redux', 'TypeScript'],
      github: 'https://github.com/mikeat7/task-manager-mobile',
      demo: 'https://apps.apple.com/app/taskmanager',
      featured: false,
      date: '2023-10-10'
    },
    {
      id: 4,
      title: 'Weather Analytics API',
      description: 'RESTful API providing weather data analytics with machine learning predictions. Includes historical data analysis and forecast accuracy metrics.',
      image: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop',
      category: 'api',
      technologies: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'ML'],
      github: 'https://github.com/mikeat7/weather-analytics-api',
      demo: 'https://api.weather-analytics.com/docs',
      featured: false,
      date: '2023-09-05'
    },
    {
      id: 5,
      title: 'Social Media Dashboard',
      description: 'Analytics dashboard for social media management with real-time metrics, automated reporting, and multi-platform integration.',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop',
      category: 'web',
      technologies: ['Vue.js', 'D3.js', 'Node.js', 'Redis', 'Chart.js'],
      github: 'https://github.com/mikeat7/social-dashboard',
      demo: 'https://social-dashboard.mikeat7.com',
      featured: true,
      date: '2023-08-15'
    },
    {
      id: 6,
      title: 'Image Recognition Service',
      description: 'Machine learning service for image classification and object detection using TensorFlow and custom trained models.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=500&h=300&fit=crop',
      category: 'ai',
      technologies: ['Python', 'TensorFlow', 'OpenCV', 'Flask', 'AWS'],
      github: 'https://github.com/mikeat7/image-recognition',
      demo: 'https://image-ai.mikeat7.com',
      featured: false,
      date: '2023-07-20'
    }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredProjects = projects.filter(project => project.featured);

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            My <span className="gradient-text">Portfolio</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A collection of projects that showcase my skills in full-stack development, 
            AI/ML, and modern web technologies.
          </p>
        </div>

        {/* Featured Projects */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <Star className="w-6 h-6 text-yellow-500 mr-3" />
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift group">
                <div className="relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                        +{project.technologies.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-3">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        <Github className="w-4 h-4 text-gray-600" />
                      </a>
                      <a
                        href={project.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-blue-600" />
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(project.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="flex items-center space-x-4">
            <Filter className="w-5 h-5 text-gray-500" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* All Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift group">
              <div className="relative overflow-hidden">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${
                    project.category === 'web' ? 'bg-blue-500' :
                    project.category === 'mobile' ? 'bg-green-500' :
                    project.category === 'ai' ? 'bg-purple-500' :
                    'bg-orange-500'
                  }`}>
                    {categories.find(cat => cat.id === project.category)?.label.replace(' Projects', '')}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex space-x-3">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors group"
                    >
                      <Github className="w-4 h-4 text-gray-600 group-hover:text-gray-900" />
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors group"
                    >
                      <ExternalLink className="w-4 h-4 text-blue-600 group-hover:text-blue-800" />
                    </a>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <Code className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have a Project in Mind?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            I'm always excited to work on new challenges and bring innovative ideas to life. 
            Let's discuss how we can collaborate on your next project.
          </p>
          <a
            href="/contact"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Let's Work Together</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;