import React, { useEffect } from 'react';

const Footer = () => {

  useEffect(() => {
    const fontAwesomeLink = document.createElement('link');
    fontAwesomeLink.rel = 'stylesheet';
    fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    document.head.appendChild(fontAwesomeLink);
  }, []);

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold mb-4 text-primary-400">Service Platform</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">
                Your trusted marketplace for finding reliable service providers in your area. 
                We connect you with verified professionals for all your needs.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <i className="fas fa-facebook text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <i className="fas fa-twitter text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <i className="fas fa-google-plus text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-800 transition-colors">
                  <i className="fas fa-linkedin text-sm"></i>
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <i className="fas fa-instagram text-sm"></i>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/about" className="text-gray-300 hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">Contact</a></li>
              <li><a href="/providers" className="text-gray-300 hover:text-primary-400 transition-colors">Providers</a></li>
              <li><a href="/services" className="text-gray-300 hover:text-primary-400 transition-colors">Services</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">Our Services</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Electrician</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Plumber</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">AC Repair</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Carpenter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Painter</a></li>
              <li><a href="#" className="text-gray-300 hover:text-primary-400 transition-colors">Cleaning</a></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">Contact Info</h4>
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <i className="fas fa-map-marker text-primary-400 mr-3 w-5"></i>
                <span className="text-gray-300">Jaipur, India</span>
              </div>
              <div className="flex items-center mb-3">
                <i className="fas fa-phone text-primary-400 mr-3 w-5"></i>
                <span className="text-gray-300">+91 95711 95353</span>
              </div>
              <div className="flex items-center">
                <i className="fas fa-envelope text-primary-400 mr-3 w-5"></i>
                <span className="text-gray-300">support@serviceplatform.com</span>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h5 className="text-sm font-semibold mb-3 text-primary-400">Subscribe to Newsletter</h5>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:outline-none focus:border-primary-400 text-gray-300 placeholder-gray-500"
                />
                <button className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 transition-colors">
                  <i className="fas fa-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              2026 Service Platform. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <a href="/privacypolicy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Privacy Policy</a>
              <a href="/termsofservices" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Terms of Service</a>
              <a href="/coockiespolicy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 z-50 flex items-center justify-center"
        title="Back to Top"
      >
        <i className="fas fa-angle-up"></i>
      </button>
    </footer>
  );
};

export default Footer;