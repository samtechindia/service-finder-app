import { useState, useEffect, useRef, useCallback } from 'react';
import Fuse from 'fuse.js';

// Configuration for future API switch
const USE_API = false; // Change to true for dynamic API data
const API_ENDPOINT = '/api/knowledge-base'; // Future API endpoint

const WebsiteAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [fuse, setFuse] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('assistant-chat-history');
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error('Failed to load chat history:', e);
      }
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('assistant-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  // Show button with animation
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

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Extract content from static site
  const extractSiteContent = useCallback(() => {
    const content = [];
    
    // Extract page titles and meta information
    const title = document.title;
    if (title) {
      content.push({
        type: 'page',
        title: title,
        url: window.location.pathname,
        content: title.toLowerCase(),
        keywords: title.toLowerCase().split(' '),
        category: 'navigation'
      });
    }

    // Extract navigation links
    const navLinks = document.querySelectorAll('nav a, .navbar a, header a');
    navLinks.forEach(link => {
      const text = link.textContent.trim();
      const href = link.getAttribute('href');
      if (text && href && !href.startsWith('#')) {
        content.push({
          type: 'navigation',
          title: text,
          url: href,
          content: text.toLowerCase(),
          keywords: text.toLowerCase().split(' '),
          category: 'navigation'
        });
      }
    });

    // Extract headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      const text = heading.textContent.trim();
      if (text) {
        content.push({
          type: 'heading',
          title: text,
          content: text.toLowerCase(),
          keywords: text.toLowerCase().split(' '),
          category: 'content'
        });
      }
    });

    // Extract paragraphs
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      const text = p.textContent.trim();
      if (text && text.length > 20) {
        content.push({
          type: 'content',
          title: text.substring(0, 50) + '...',
          content: text.toLowerCase(),
          keywords: text.toLowerCase().split(' ').filter(word => word.length > 3),
          category: 'content'
        });
      }
    });

    // Extract service information (from mock data or service cards)
    const serviceCards = document.querySelectorAll('[data-service], .service-card, .service-item');
    serviceCards.forEach(card => {
      const title = card.querySelector('h3, .title, .service-name')?.textContent.trim();
      const description = card.querySelector('.description, p')?.textContent.trim();
      if (title) {
        content.push({
          type: 'service',
          title: title,
          description: description || '',
          content: `${title} ${description || ''}`.toLowerCase(),
          keywords: `${title} ${description || ''}`.toLowerCase().split(' '),
          category: 'service'
        });
      }
    });

    // Extract provider information
    const providerCards = document.querySelectorAll('[data-provider], .provider-card, .provider-item');
    providerCards.forEach(card => {
      const name = card.querySelector('.provider-name, .name, h3')?.textContent.trim();
      const service = card.querySelector('.service, .provider-service')?.textContent.trim();
      const location = card.querySelector('.location, .provider-location')?.textContent.trim();
      if (name) {
        content.push({
          type: 'provider',
          title: name,
          service: service || '',
          location: location || '',
          content: `${name} ${service || ''} ${location || ''}`.toLowerCase(),
          keywords: `${name} ${service || ''} ${location || ''}`.toLowerCase().split(' '),
          category: 'provider'
        });
      }
    });

    // Add hardcoded site structure for better navigation
    const siteStructure = [
      { title: 'Home', url: '/', type: 'navigation', keywords: ['home', 'main', 'landing'] },
      { title: 'Services', url: '/services', type: 'navigation', keywords: ['services', 'service', 'offer'] },
      { title: 'Providers', url: '/providers', type: 'navigation', keywords: ['providers', 'provider', 'professionals', 'experts'] },
      { title: 'Contact', url: '/contact', type: 'navigation', keywords: ['contact', 'reach', 'call', 'phone', 'email'] },
      { title: 'About', url: '/about', type: 'navigation', keywords: ['about', 'company', 'who', 'story'] },
      { title: 'Booking', url: '/booking', type: 'navigation', keywords: ['booking', 'book', 'appointment', 'schedule'] },
      { title: 'Login', url: '/login', type: 'navigation', keywords: ['login', 'signin', 'account'] },
      { title: 'Signup', url: '/signup', type: 'navigation', keywords: ['signup', 'register', 'join', 'create'] }
    ];

    siteStructure.forEach(item => {
      content.push({
        type: item.type,
        title: item.title,
        url: item.url,
        content: item.title.toLowerCase(),
        keywords: [...item.keywords, item.title.toLowerCase()],
        category: 'navigation'
      });
    });

    return content;
  }, []);

  // Load knowledge base (from API or site content)
  const loadKnowledgeBase = useCallback(async () => {
    try {
      if (USE_API) {
        // Future: Load from API
        const response = await fetch(API_ENDPOINT);
        const data = await response.json();
        setKnowledgeBase(data);
      } else {
        // Current: Extract from site content
        const content = extractSiteContent();
        setKnowledgeBase(content);
      }
    } catch (error) {
      console.error('Failed to load knowledge base:', error);
      // Fallback to site content extraction
      const content = extractSiteContent();
      setKnowledgeBase(content);
    }
  }, [extractSiteContent]);

  // Initialize knowledge base and Fuse search
  useEffect(() => {
    loadKnowledgeBase();
  }, [loadKnowledgeBase]);

  // Initialize Fuse.js when knowledge base is ready
  useEffect(() => {
    if (knowledgeBase.length > 0) {
      const fuseOptions = {
        keys: [
          { name: 'content', weight: 0.7 },
          { name: 'title', weight: 0.3 },
          { name: 'keywords', weight: 0.5 },
          { name: 'service', weight: 0.4 },
          { name: 'location', weight: 0.4 }
        ],
        threshold: 0.4,
        includeScore: true,
        minMatchCharLength: 2,
        ignoreLocation: true,
        shouldSort: true,
        findAllMatches: true
      };

      setFuse(new Fuse(knowledgeBase, fuseOptions));
    }
  }, [knowledgeBase]);

  // Search knowledge base
  const searchKnowledgeBase = useCallback((query) => {
    if (!fuse) return [];

    const results = fuse.search(query.toLowerCase());
    return results.map(result => ({
      ...result.item,
      score: result.score
    }));
  }, [fuse]);

  // Process user query
  const processQuery = useCallback((query) => {
    const lowerQuery = query.toLowerCase().trim();
    
    // Blocked keywords for safety
    const blockedKeywords = [
      'programming', 'code', 'javascript', 'react', 'python', 'java', 'html', 'css',
      'system', 'command', 'terminal', 'bash', 'cmd', 'powershell', 'hack', 'malicious',
      'virus', 'attack', 'exploit', 'admin', 'root', 'sudo', 'password', 'crack',
      'database', 'sql', 'api', 'server', 'backend', 'frontend', 'framework',
      'library', 'package', 'npm', 'yarn', 'git', 'github', 'deploy', 'host'
    ];

    for (const keyword of blockedKeywords) {
      if (lowerQuery.includes(keyword)) {
        return {
          type: 'fallback',
          message: 'Gaand ka ilaj hai Gaanduo ka nahi'
        };
      }
    }

    // Search knowledge base
    const searchResults = searchKnowledgeBase(query);
    
    if (searchResults.length === 0) {
      return {
        type: 'fallback',
        message: 'Gaand ka ilaj hai Gaanduo ka nahi'
      };
    }

    // Categorize and format response
    const bestResult = searchResults[0];
    
    if (bestResult.category === 'navigation') {
      return {
        type: 'navigation',
        message: `I found ${bestResult.title} for you:`,
        action: {
          type: 'navigate',
          path: bestResult.url,
          label: `Go to ${bestResult.title}`
        },
        results: searchResults.slice(0, 3)
      };
    }

    if (bestResult.category === 'service') {
      const services = searchResults.filter(r => r.category === 'service').slice(0, 3);
      return {
        type: 'services',
        message: 'I found these services for you:',
        results: services
      };
    }

    if (bestResult.category === 'provider') {
      const providers = searchResults.filter(r => r.category === 'provider').slice(0, 3);
      if (providers.length > 0) {
        const providerList = providers.map(p => `• ${p.title}${p.service ? ` - ${p.service}` : ''}${p.location ? ` (${p.location})` : ''}`).join('\n');
        return {
          type: 'providers',
          message: `Found providers:\n\n${providerList}`,
          results: providers,
          action: providers.length > 0 ? {
            type: 'navigate',
            path: '/providers',
            label: 'View All Providers'
          } : null
        };
      }
    }

    // Default content response
    return {
      type: 'content',
      message: 'I found this information for you:',
      results: searchResults.slice(0, 2)
    };
  }, [searchKnowledgeBase]);

  // Send message
  const sendMessage = useCallback(() => {
    if (!inputValue.trim()) return;

    const userMessage = {
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Process query with delay for typing effect
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
  }, [inputValue, processQuery]);

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Handle action clicks
  const handleActionClick = (action) => {
    if (action.type === 'navigate') {
      window.location.href = action.path;
      setIsOpen(false);
    }
  };

  // Initialize chat with greeting
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = {
        type: 'assistant',
        content: 'Hello 👋\nI am your website assistant.\nYou can ask me anything about this platform in any language.',
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
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white' 
              : 'bg-gray-100 text-gray-800 border border-gray-200'
          }`}>
            <p className="text-sm whitespace-pre-line leading-relaxed">{message.content}</p>
            
            {/* Render search results */}
            {message.results && message.results.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.results.map((result, idx) => (
                  <div key={idx} className="bg-white bg-opacity-50 rounded-lg p-3 border border-gray-200">
                    <p className="font-medium text-sm text-gray-900">{result.title}</p>
                    {result.description && (
                      <p className="text-xs text-gray-600 mt-1">{result.description}</p>
                    )}
                    {result.service && (
                      <p className="text-xs text-blue-600 mt-1">{result.service}</p>
                    )}
                    {result.location && (
                      <p className="text-xs text-gray-500 mt-1">📍 {result.location}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {/* Action button */}
            {message.action && (
              <button 
                onClick={() => handleActionClick(message.action)}
                className="mt-3 w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                {message.action.label}
              </button>
            )}
          </div>
          
          {/* Timestamp */}
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
          onClick={() => setIsOpen(true)}
          className={`
            relative group
            bg-gradient-to-r from-blue-600 to-blue-700 
            text-white 
            px-6 py-3 
            rounded-full 
            shadow-xl 
            hover:shadow-2xl 
            hover:scale-105 
            transform 
            transition-all 
            duration-300 
            ease-out
            backdrop-blur-sm 
            bg-opacity-90
            border border-white border-opacity-20
            ${isPulsing ? 'animate-pulse' : ''}
          `}
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="font-medium text-sm">Ask Me Anything</span>
          </div>
          
          {/* Hover tooltip */}
          <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 whitespace-nowrap">
              Need help? I'm here!
              <div className="absolute top-full right-4 -mt-1">
                <div className="border-4 border-transparent border-t-gray-900"></div>
              </div>
            </div>
          </div>

          {/* Pulse ring effect */}
          {isPulsing && (
            <div className="absolute inset-0 rounded-full bg-blue-400 opacity-30 animate-ping"></div>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Website Assistant</h3>
                <p className="text-xs opacity-90">Self-trained from site content</p>
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
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 bg-gray-50"
        >
          {messages.map((message, index) => renderMessage(message, index))}
          
          {isTyping && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-100 rounded-2xl px-4 py-3 border border-gray-200">
                <div className="flex space-x-1">
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
              placeholder="Type your question in any language..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              disabled={isTyping}
            />
            <button
              onClick={sendMessage}
              disabled={isTyping || !inputValue.trim()}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
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

export default WebsiteAssistant;
