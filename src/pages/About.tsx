import React from 'react';
import Layout from '../components/Layout/Layout';
import { FileText, Users, Target, Lightbulb, Shield, Zap } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Zap,
      title: 'Fast Analysis',
      description: 'Instant document processing using the latest AI technologies'
    },
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'Complete protection of your data with military-grade encryption'
    },
    {
      icon: Lightbulb,
      title: 'Advanced AI',
      description: 'Multiple language models for deeper understanding of your document content'
    }
  ];

  const team = [
    {
      name: 'Ayoub Habbaj',
      role: 'Project Documentation Manager',
      description: 'Specialized in preparing and writing project specifications (Cahier des Charges) and ensuring clarity of functional and technical requirements'
    },
    {
      name: 'Sifeddine Habbaj',
      role: 'Project Leader',
      description: 'Oversees all development stages including AI, Frontend, Backend, and Information Security aspects'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-emerald-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <FileText className="mx-auto h-16 w-16 text-blue-600 mb-6" />
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-blue-600">DocuMind</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We believe in the power of technology to simplify working with documents. 
            DocuMind is an intelligent platform that transforms how you interact with your documents using advanced AI.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-4">
                <Target className="h-8 w-8 text-blue-600 ml-3" />
                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
              </div>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                We aim to make document interaction smarter and more efficient. 
                We want to provide users with a powerful tool that enables them to extract information and get instant answers from their documents.
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                We strive to fully support the Arabic language and provide an exceptional experience for Arabic-speaking users.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-gray-700">Documents Analyzed</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
                <div className="text-gray-700">Active Users</div>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-orange-600 mb-2">99.9%</div>
                <div className="text-gray-700">Uptime</div>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
                <div className="text-gray-700">User Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why DocuMind?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We offer a range of advanced features that make working with documents easier and more efficient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl mb-6">
                    <Icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-blue-600 ml-3" />
              <h2 className="text-3xl font-bold text-gray-900">Our Team</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A team of dedicated professionals passionate about developing the best technical solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-6 mx-auto">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600">{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already benefiting from DocuMind for managing and analyzing their documents
          </p>
          <button className="bg-white text-blue-600 hover:bg-blue-50 text-lg font-semibold px-8 py-3 rounded-lg transition-colors">
            Start for Free Now
          </button>
          <div className="mt-4">
            <a href="/contact" className="text-white hover:text-blue-100 text-lg font-medium">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;