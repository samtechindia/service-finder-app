import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
          
              <img 
                src="/logo.png" 
                alt="Service Hub" 
                className="h-24 w-auto object-contain"
                
              />
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Services
            </Link>
            <Link 
              to="/providers" 
              className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Providers
            </Link>
            <Link 
              to="/booking" 
              className="text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              Book Now
            </Link>
            <Link 
              to="/login" 
              className="ml-4 bg-primary-600 text-white hover:bg-primary-700 px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105"
            >
              Login / Signup
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-primary-600 p-2 rounded-lg hover:bg-primary-50 transition-all duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 animate-slide-up">
            <div className="space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Home
              </Link>
              <Link 
                to="/services" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Services
              </Link>
              <Link 
                to="/providers" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Providers
              </Link>
              <Link 
                to="/booking" 
                onClick={() => setIsMenuOpen(false)}
                className="block text-gray-700 hover:text-primary-600 hover:bg-primary-50 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
              >
                Book Now
              </Link>
              <Link 
                to="/login" 
                onClick={() => setIsMenuOpen(false)}
                className="block bg-primary-600 text-white hover:bg-primary-700 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-center"
              >
                Login
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
