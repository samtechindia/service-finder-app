import { useState, useEffect } from 'react';
import AssistantChat from './AssistantChat';

const AssistantWidget = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPulsing, setIsPulsing] = useState(true);

  useEffect(() => {
    // Show button after page loads
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Stop pulsing after 3 seconds
    const pulseTimer = setTimeout(() => {
      setIsPulsing(false);
    }, 3000);

    return () => {
      clearTimeout(timer);
      clearTimeout(pulseTimer);
    };
  }, []);

  const openChat = () => {
    setIsChatOpen(true);
    setIsPulsing(false);
  };

  const closeChat = () => {
    setIsChatOpen(false);
  };

  return (
    <>
      {/* Floating Assistant Button */}
      <div
        className={`fixed bottom-6 right-6 z-40 transition-all duration-500 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
        }`}
      >
        <button
          onClick={openChat}
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
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" 
              />
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

      {/* Assistant Chat Modal */}
      <AssistantChat isOpen={isChatOpen} onClose={closeChat} />
    </>
  );
};

export default AssistantWidget;
