import React from 'react';
import { cn } from '../../utils/cn';

const EmptyState = ({ 
  title, 
  description, 
  icon, 
  action,
  className,
  illustration 
}) => {
  const defaultIcon = (
    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  );

  return (
    <div className={cn("text-center py-12", className)}>
      <div className="flex flex-col items-center">
        {/* Icon or Illustration */}
        <div className="mb-6">
          {illustration || icon || defaultIcon}
        </div>

        {/* Title */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          {description}
        </p>

        {/* Action Button */}
        {action && (
          <div className="flex justify-center">
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmptyState;
