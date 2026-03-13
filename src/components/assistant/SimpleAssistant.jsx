import { useState, useEffect, useRef } from 'react';

const SimpleAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    const pulseTimer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = processQuery(userMessage.content);
      const assistantMessage = {
        type: 'assistant',
        ...response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  const processQuery = (query) => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Navigation queries - more comprehensive
    if (lowerQuery.includes('contact') || lowerQuery.includes('reach') || lowerQuery.includes('call') || lowerQuery.includes('phone') || lowerQuery.includes('email') || lowerQuery.includes('support')) {
      return {
        type: 'navigation',
        message: 'You can reach us through our contact page:',
        action: {
          type: 'navigate',
          path: '/contact',
          label: 'Go to Contact Page'
        }
      };
    }
    
    if (lowerQuery.includes('about') || lowerQuery.includes('who') || lowerQuery.includes('company') || lowerQuery.includes('story') || lowerQuery.includes('mission')) {
      return {
        type: 'navigation',
        message: 'Learn more about our platform:',
        action: {
          type: 'navigate',
          path: '/about',
          label: 'Go to About Page'
        }
      };
    }
    
    if (lowerQuery.includes('home') || lowerQuery.includes('main') || lowerQuery.includes('homepage') || lowerQuery.includes('landing')) {
      return {
        type: 'navigation',
        message: 'Go back to the homepage:',
        action: {
          type: 'navigate',
          path: '/',
          label: 'Go to Home'
        }
      };
    }
    
    // Service queries - more variations
    if (lowerQuery.includes('service') && (lowerQuery.includes('offer') || lowerQuery.includes('what') || lowerQuery.includes('available') || lowerQuery.includes('list') || lowerQuery.includes('provide') || lowerQuery.includes('do you have'))) {
      return {
        type: 'services',
        message: 'We currently provide these services:\n\n• Electrician - Electrical repair and installation\n• Plumber - Pipe repair and plumbing services\n• AC Repair - Air conditioner maintenance and repair\n• Carpenter - Woodwork and furniture services\n• Painter - Interior and exterior painting\n• Cleaning - Home and office cleaning services\n\nWhich service are you interested in?'
      };
    }
    
    if (lowerQuery.includes('provider') || lowerQuery.includes('professional') || lowerQuery.includes('expert') || lowerQuery.includes('vendor') || lowerQuery.includes('contractor') || lowerQuery.includes('technician')) {
      return {
        type: 'navigation',
        message: 'Browse all our verified service providers:',
        action: {
          type: 'navigate',
          path: '/providers',
          label: 'View All Providers'
        }
      };
    }

    // Booking queries
    if (lowerQuery.includes('book') || lowerQuery.includes('appointment') || lowerQuery.includes('schedule') || lowerQuery.includes('reserve') || lowerQuery.includes('hire')) {
      return {
        type: 'navigation',
        message: 'You can book a service through our booking page:',
        action: {
          type: 'navigate',
          path: '/booking',
          label: 'Book a Service'
        }
      };
    }

    // Service-specific searches - more variations
    if (lowerQuery.includes('electrician') || lowerQuery.includes('electrical') || lowerQuery.includes('wiring') || lowerQuery.includes('light') || lowerQuery.includes('power')) {
      return {
        type: 'providers',
        message: 'Found electricians for you:\n\n• Ramesh Sharma (Ujjain) - ⭐ 4.5 - 8 years experience\n• Available for electrical repair and installation',
        action: {
          type: 'navigate',
          path: '/providers?category=electrician',
          label: 'View All Electricians'
        }
      };
    }
    
    if (lowerQuery.includes('plumber') || lowerQuery.includes('plumbing') || lowerQuery.includes('pipe') || lowerQuery.includes('water') || lowerQuery.includes('drain')) {
      return {
        type: 'providers',
        message: 'Found plumbers for you:\n\n• Amit Patel (Indore) - ⭐ 4.2 - 6 years experience\n• Available for pipe repair and installation',
        action: {
          type: 'navigate',
          path: '/providers?category=plumber',
          label: 'View All Plumbers'
        }
      };
    }

    if (lowerQuery.includes('ac') || lowerQuery.includes('air conditioner') || lowerQuery.includes('cooling') || lowerQuery.includes('hvac')) {
      return {
        type: 'providers',
        message: 'Found AC repair specialists:\n\n• Suresh Kumar (Bhopal) - ⭐ 4.8 - 10 years experience\n• Expert in all AC brands and models',
        action: {
          type: 'navigate',
          path: '/providers?category=hvac',
          label: 'View All AC Specialists'
        }
      };
    }

    if (lowerQuery.includes('carpenter') || lowerQuery.includes('wood') || lowerQuery.includes('furniture') || lowerQuery.includes('carpentry')) {
      return {
        type: 'providers',
        message: 'Found carpenters for you:\n\n• Vikram Singh (Ujjain) - ⭐ 4.6 - 12 years experience\n• Specialized in custom furniture and woodwork',
        action: {
          type: 'navigate',
          path: '/providers?category=carpentry',
          label: 'View All Carpenters'
        }
      };
    }

    if (lowerQuery.includes('painter') || lowerQuery.includes('painting') || lowerQuery.includes('paint') || lowerQuery.includes('color')) {
      return {
        type: 'providers',
        message: 'Found painters for you:\n\n• Rahul Verma (Indore) - ⭐ 4.3 - 5 years experience\n• Professional interior and exterior painting',
        action: {
          type: 'navigate',
          path: '/providers?category=painting',
          label: 'View All Painters'
        }
      };
    }

    if (lowerQuery.includes('cleaning') || lowerQuery.includes('clean') || lowerQuery.includes('housekeeping') || lowerQuery.includes('maid')) {
      return {
        type: 'providers',
        message: 'Found cleaning services:\n\n• Anita Desai (Bhopal) - ⭐ 4.7 - 4 years experience\n• Reliable home and office cleaning',
        action: {
          type: 'navigate',
          path: '/providers?category=cleaning',
          label: 'View All Cleaning Services'
        }
      };
    }

    // Location searches - more cities and variations
    if (lowerQuery.includes('indore')) {
      return {
        type: 'providers',
        message: 'Service providers available in Indore:\n\n• Amit Patel - Plumber (⭐ 4.2)\n• Rahul Verma - Painter (⭐ 4.3)\n• More providers available in your area',
        action: {
          type: 'navigate',
          path: '/providers?location=indore',
          label: 'View All Providers in Indore'
        }
      };
    }

    if (lowerQuery.includes('bhopal')) {
      return {
        type: 'providers',
        message: 'Service providers available in Bhopal:\n\n• Suresh Kumar - AC Repair (⭐ 4.8)\n• Anita Desai - Cleaning (⭐ 4.7)\n• More providers available in your area',
        action: {
          type: 'navigate',
          path: '/providers?location=bhopal',
          label: 'View All Providers in Bhopal'
        }
      };
    }

    if (lowerQuery.includes('ujjain')) {
      return {
        type: 'providers',
        message: 'Service providers available in Ujjain:\n\n• Ramesh Sharma - Electrician (⭐ 4.5)\n• Vikram Singh - Carpenter (⭐ 4.6)\n• More providers available in your area',
        action: {
          type: 'navigate',
          path: '/providers?location=ujjain',
          label: 'View All Providers in Ujjain'
        }
      };
    }

    // Help and general queries
    if (lowerQuery.includes('help') || lowerQuery.includes('assist') || lowerQuery.includes('support') || lowerQuery.includes('guide') || lowerQuery.includes('how')) {
      return {
        type: 'help',
        message: 'I can help you with:\n\n🔧 Finding service providers (electrician, plumber, etc.)\n📍 Locating providers in your city (Indore, Bhopal, Ujjain)\n📋 Browsing available services\n🧭 Navigating the website (contact, about, booking)\n📞 Getting support and contact information\n\nTry asking: "find electrician in indore" or "what services do you offer"'
      };
    }

    // Pricing and cost queries
    if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('rate') || lowerQuery.includes('charge') || lowerQuery.includes('fee')) {
      return {
        type: 'info',
        message: 'Service rates vary by provider and service type. Most providers offer:\n\n• Electrician: ₹75-150/hour\n• Plumber: ₹60-120/hour\n• AC Repair: ₹120-200/hour\n• Carpenter: ₹85-150/hour\n• Painter: ₹150-300/hour\n• Cleaning: ₹45-100/hour\n\nView provider profiles for exact pricing and book quotes.'
      };
    }

    // Emergency queries
    if (lowerQuery.includes('emergency') || lowerQuery.includes('urgent') || lowerQuery.includes('immediate') || lowerQuery.includes('asap')) {
      return {
        type: 'info',
        message: 'For emergency services:\n\n🚨 Emergency plumbing available\n⚡ Emergency electrical services available\n\nContact providers directly or call our emergency hotline for immediate assistance.\n\nSome providers offer 24/7 emergency services.'
      };
    }

    // Time and availability queries
    if (lowerQuery.includes('time') || lowerQuery.includes('available') || lowerQuery.includes('when') || lowerQuery.includes('schedule') || lowerQuery.includes('hours')) {
      return {
        type: 'info',
        message: 'Most providers are available:\n\n🕐 Monday - Saturday: 9:00 AM - 6:00 PM\n🕐 Sunday: Limited availability\n🚨 Emergency services: 24/7 (select providers)\n\nCheck individual provider profiles for specific availability and book appointments.'
      };
    }

    // Registration and account queries
    if (lowerQuery.includes('register') || lowerQuery.includes('signup') || lowerQuery.includes('join') || lowerQuery.includes('account') || lowerQuery.includes('login')) {
      return {
        type: 'navigation',
        message: 'Create an account to book services and manage appointments:',
        action: {
          type: 'navigate',
          path: '/signup',
          label: 'Sign Up Now'
        }
      };
    }

    // If no match found, provide random fallback message
    const fallbackMessages = [
      'Gaand ka ilaz hai ganduo ka nahi',
      'Bhag bhosdike',
      'Lovdey na bhojyam',
      'Muh me lele'
    ];
    
    const randomFallback = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    console.log('No match found for query:', query, 'Using fallback:', randomFallback);
    
    return {
      type: 'fallback',
      message: randomFallback
    };
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleActionClick = (action) => {
    if (action.type === 'navigate') {
      window.location.href = action.path;
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = {
        type: 'assistant',
        content: 'Hello 👋\nI am your website assistant.\nYou can ask me anything about this platform.',
        timestamp: new Date().toISOString()
      };
      setMessages([greeting]);
    }
  }, [isOpen, messages.length]);

  const renderMessage = (message, index) => {
    const isUser = message.type === 'user';
    
    return (
      <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${isUser ? 'order-2' : 'order-1'}`}>
          <div className={`rounded-2xl px-4 py-3 ${
            isUser 
              ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white' 
              : message.type === 'help' 
                ? 'bg-gradient-to-r from-green-50 to-blue-50 text-gray-800 border border-green-200'
                : message.type === 'info'
                  ? 'bg-gradient-to-r from-yellow-50 to-orange-50 text-gray-800 border border-yellow-200'
                  : message.type === 'fallback'
                    ? 'bg-red-50 text-red-800 border border-red-200'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            <p className="text-sm whitespace-pre-line leading-relaxed font-medium">
              {message.content || message.message}
            </p>
            
            {message.action && (
              <button 
                onClick={() => handleActionClick(message.action)}
                className="mt-3 w-full bg-primary-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {message.action.label}
              </button>
            )}
          </div>
          
          <div className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    );
  };

  if (!isOpen) {
    return (
      <div
        className={`fixed bottom-6 right-6 z-50 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <button
          onClick={() => {
            setIsOpen(true);
            setIsPulsing(false);
          }}
          className="relative group bg-gradient-to-r from-primary-600 to-primary-700 text-white px-6 py-3 rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transform transition-all duration-300 ease-out backdrop-blur-sm bg-opacity-90 border border-white border-opacity-20"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="font-medium text-sm">Ask Me Anything</span>
          </div>
          
          {/* Pulse ring effect */}
          {isPulsing && (
            <div className="absolute inset-0 rounded-full bg-primary-400 opacity-30 animate-ping"></div>
          )}
          
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
              Need help? I'm here!
              <div className="absolute top-full right-4 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Website Assistant</h3>
                <p className="text-xs opacity-90">I'm here to help you</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
          {messages.map((message, index) => renderMessage(message, index))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
                <div className="flex space-x-1">
                  {isPulsing && (
                    <div className="absolute inset-0 rounded-full bg-primary-400 opacity-30 animate-ping"></div>
                  )}
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !inputValue.trim()}
              className="bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3 rounded-xl hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleAssistant;
