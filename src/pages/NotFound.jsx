import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <div className="p-8 text-center">
              {/* 404 Illustration */}
              <div className="mb-8">
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.05, 0.95, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="mx-auto w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center"
                >
                  <span className="text-4xl font-bold text-primary-600">404</span>
                </motion.div>
              </div>

              {/* Error Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h1>
              
              <p className="text-gray-600 mb-8">
                Oops! The page you're looking for doesn't exist or has been moved.
                Don't worry, let's get you back on track.
              </p>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link to="/" className="block">
                  <Button className="w-full">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Go Home
                  </Button>
                </Link>
                
                <Link to="/services" className="block">
                  <Button variant="outline" className="w-full">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Browse Services
                  </Button>
                </Link>
              </div>

              {/* Help Links */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-4">
                  Looking for something specific?
                </p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Link to="/about" className="text-primary-600 hover:text-primary-700 font-medium">
                    About Us
                  </Link>
                  <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                    Contact Support
                  </Link>
                  <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign In
                  </Link>
                  <Link to="/signup" className="text-primary-600 hover:text-primary-700 font-medium">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Additional Help */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Card className="bg-blue-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600 mb-4">
                If you believe this is an error, please contact our support team for assistance.
              </p>
              <Link to="/contact">
                <Button size="sm" variant="outline">
                  Contact Support
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
