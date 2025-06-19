import React from 'react';
import { Code, Brain, Rocket, Heart, Award, Users, Coffee, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const experiences = [
    {
      title: 'Senior Full-Stack Developer',
      company: 'Tech Innovations Inc.',
      period: '2022 - Present',
      description: 'Leading development of AI-powered applications and mentoring junior developers.',
      technologies: ['React', 'Node.js', 'Python', 'AWS', 'TensorFlow']
    },
    {
      title: 'Frontend Developer',
      company: 'Digital Solutions Co.',
      period: '2021 - 2022',
      description: 'Built responsive web applications and improved user experience metrics by 40%.',
      technologies: ['React', 'TypeScript', 'Tailwind CSS', 'GraphQL']
    },
    {
      title: 'Junior Developer',
      company: 'StartupXYZ',
      period: '2020 - 2021',
      description: 'Developed features for a SaaS platform serving 10,000+ users.',
      technologies: ['JavaScript', 'Vue.js', 'Express.js', 'MongoDB']
    }
  ];

  const values = [
    {
      icon: Code,
      title: 'Clean Code',
      description: 'I believe in writing maintainable, scalable, and well-documented code.'
    },
    {
      icon: Brain,
      title: 'Continuous Learning',
      description: 'Always exploring new technologies and staying updated with industry trends.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Working effectively with teams to deliver exceptional results.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Finding creative solutions to complex problems and challenges.'
    }
  ];

  const stats = [
    { icon: Coffee, value: '1000+', label: 'Cups of Coffee' },
    { icon: Code, value: '50+', label: 'Projects Completed' },
    { icon: Users, value: '20+', label: 'Happy Clients' },
    { icon: Award, value: '5+', label: 'Awards Won' }
  ];

  return (
    <div className="min-h-screen pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About <span className="gradient-text">Me</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            I'm a passionate full-stack developer with a love for creating innovative solutions 
            that bridge the gap between technology and human needs.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-12 mb-16">
          {/* Left Column - Story */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Heart className="w-6 h-6 text-red-500 mr-3" />
                My Story
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  My journey into technology began during college when I built my first website. 
                  What started as curiosity quickly became a passion for creating digital experiences 
                  that make people's lives easier and more enjoyable.
                </p>
                <p>
                  Over the years, I've had the privilege of working with startups and established 
                  companies, helping them bring their visions to life through code. I specialize 
                  in full-stack development with a particular interest in AI and machine learning applications.
                </p>
                <p>
                  When I'm not coding, you'll find me exploring new technologies, contributing to 
                  open-source projects, or sharing knowledge with the developer community through 
                  blog posts and mentoring.
                </p>
              </div>
            </div>

            {/* Experience Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                <Rocket className="w-6 h-6 text-blue-500 mr-3" />
                Experience
              </h2>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div key={index} className="relative pl-8 border-l-2 border-blue-100 last:border-l-0">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-500 rounded-full"></div>
                    <div className="space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{exp.title}</h3>
                        <p className="text-blue-600 font-medium">{exp.company}</p>
                        <p className="text-sm text-gray-500">{exp.period}</p>
                      </div>
                      <p className="text-gray-600">{exp.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Values & Stats */}
          <div className="space-y-8">
            {/* Values */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Core Values</h2>
              <div className="space-y-6">
                {values.map((value, index) => {
                  const Icon = value.icon;
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{value.title}</h3>
                        <p className="text-sm text-gray-600">{value.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">By the Numbers</h2>
              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="text-center">
                      <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg inline-block mb-3">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-500">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Skills Progress */}
            <div className="bg-white rounded-2xl shadow-lg p-8 hover-lift">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills</h2>
              <div className="space-y-4">
                {[
                  { skill: 'React/TypeScript', level: 95 },
                  { skill: 'Node.js/Express', level: 90 },
                  { skill: 'Python/AI/ML', level: 85 },
                  { skill: 'Cloud/DevOps', level: 80 },
                  { skill: 'UI/UX Design', level: 75 }
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{item.skill}</span>
                      <span className="text-sm text-gray-500">{item.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${item.level}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;