import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMapMarker, faPhone, faEnvelope, faAngleUp, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faGooglePlus, faLinkedin, faInstagram } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <center>
                 <img 
                src="/footer-logo.png" 
                alt="Service Hub" 
                className="h-24 w-auto object-contain"
                
              />
              </center> 
              <p className="text-gray-300 mb-6 leading-relaxed mt-4">
                Your trusted marketplace for finding reliable service providers in your area. 
                We connect you with verified professionals for all your needs.
              </p>
              
              {/* Social Media Links */}
              <div className="flex space-x-4 mt-6">
                <a href="#" className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors">
                  <FontAwesomeIcon icon={faFacebook} className="text-sm" />
                </a>
                <a href="#" className="w-10 h-10 bg-primary-400 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                  <FontAwesomeIcon icon={faTwitter} className="text-sm" />
                </a>
                <a href="#" className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors">
                  <FontAwesomeIcon icon={faGooglePlus} className="text-sm" />
                </a>
                <a href="#" className="w-10 h-10 bg-primary-700 rounded-full flex items-center justify-center hover:bg-primary-800 transition-colors">
                  <FontAwesomeIcon icon={faLinkedin} className="text-sm" />
                </a>
                <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                  <FontAwesomeIcon icon={faInstagram} className="text-sm" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-primary-400 transition-colors">Contact</Link></li>
              <li><Link to="/providers" className="text-gray-300 hover:text-primary-400 transition-colors">Providers</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-primary-400 transition-colors">Services</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">Our Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services/electrician" className="text-gray-300 hover:text-primary-400 transition-colors">Electrician</Link></li>
              <li><Link to="/services/plumber" className="text-gray-300 hover:text-primary-400 transition-colors">Plumber</Link></li>
              <li><Link to="/services/ac-repair" className="text-gray-300 hover:text-primary-400 transition-colors">AC Repair</Link></li>
              <li><Link to="/services/carpenter" className="text-gray-300 hover:text-primary-400 transition-colors">Carpenter</Link></li>
              <li><Link to="/services/painter" className="text-gray-300 hover:text-primary-400 transition-colors">Painter</Link></li>
              <li><Link to="/services/cleaning" className="text-gray-300 hover:text-primary-400 transition-colors">Cleaning</Link></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-400">Contact Info</h4>
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon={faMapMarker} className="text-primary-400 mr-3 w-5" />
                <span className="text-gray-300">Indore, Madhya Pradesh, India</span>
              </div>
              <div className="flex items-center mb-3">
                <FontAwesomeIcon icon={faPhone} className="text-primary-400 mr-3 w-5" />
                <span className="text-gray-300">+91 7415587271</span>
              </div>
              <div className="flex items-center">
                <FontAwesomeIcon icon={faEnvelope} className="text-primary-400 mr-3 w-5" />
                <span className="text-gray-300">support@shivomgroup.com</span>
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
                  <FontAwesomeIcon icon={faPaperPlane} />
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
              <Link to="/privacy-policy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Terms of Service</Link>
              <Link to="/cookies-policy" className="text-gray-400 hover:text-primary-400 text-sm transition-colors">Cookie Policy</Link>
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
        <FontAwesomeIcon icon={faAngleUp} />
      </button>
    </footer>
  );
};

export default Footer;