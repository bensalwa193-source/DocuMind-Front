import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Upload, MessageCircle, Search, Zap } from 'lucide-react';

const Hero = () => {
  const features = [
    {
      icon: Upload,
      title: 'Upload Documents',
      description: 'Drag and drop your files or select from your device'
    },
    {
      icon: Search,
      title: 'Smart Analysis',
      description: 'Information extraction and automatic summarization'
    },
    {
      icon: MessageCircle,
      title: 'Interactive Chat',
      description: 'Ask questions and get instant answers'
    },
    {
      icon: Zap,
      title: 'High Speed',
      description: 'Instant processing with AI technologies'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-emerald-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            <span className="block">Analyze Your Documents</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-600">
              With Advanced AI
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            DocuMind uses the latest AI technologies to analyze your documents and chat with them.
            Upload your files and get instant answers to all your questions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/documents"
              className="inline-flex items-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5 rtl:rotate-180" />
            </Link>
            
            <Link
              to="/about"
              className="inline-flex items-center px-8 py-4 border border-gray-300 text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Learn More
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-20 h-20 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 animate-pulse delay-1000"></div>
    </div>
  );
};

export default Hero;