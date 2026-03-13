import React from 'react';

const EmptyState = ({ 
  icon, 
  title, 
  description, 
  actionText, 
  onAction,
  className = ''
}) => {
  const defaultIcon = (
    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
          {icon || defaultIcon}
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3">
        {title}
      </h3>
      
      <p className="text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">
        {description}
      </p>
      
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-primary"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
