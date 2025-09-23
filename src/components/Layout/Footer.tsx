import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">DocuMind</span>
            </div>
            <p className="text-gray-300 mb-4">
              An intelligent platform for document analysis and interaction using advanced AI technologies
            </p>
            <div className="flex space-x-4 rtl:space-x-reverse">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Mail className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Phone className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <MapPin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/documents" className="text-gray-300 hover:text-white transition-colors">
                  Documents
                </Link>
              </li>
              <li>
                <Link to="/chat" className="text-gray-300 hover:text-white transition-colors">
                  Chat
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-300 hover:text-white transition-colors">
                  History
                </Link>
              </li>
              <li>
                <Link to="/settings" className="text-gray-300 hover:text-white transition-colors">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/docs" className="text-gray-300 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 DocuMind. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;