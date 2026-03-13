import React from 'react';
import { cn } from '../../utils/cn';

const Loader = React.forwardRef(({
  className,
  size = 'md',
  variant = 'spinner',
  text,
  ...props
}, ref) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const variants = {
    spinner: (
      <svg
        className={cn('animate-spin', sizeClasses[size], className)}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    ),
    dots: (
      <div className={cn('flex space-x-1', className)} {...props}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              'bg-primary-600 rounded-full animate-bounce',
              {
                'w-1 h-1': size === 'xs',
                'w-4 h-4': size === 'sm',
                'w-5 h-5': size === 'md',
                'w-3 h-3': size === 'lg',
                'w-8 h-8': size === 'xl',
              }
            )}
            style={{
              animationDelay: `${index * 0.1}s`,
            }}
          />
        ))}
      </div>
    ),
    pulse: (
      <div
        className={cn(
          'bg-primary-600 rounded-full animate-pulse',
          sizeClasses[size],
          className
        )}
        {...props}
      />
    ),
  };

  return (
    <div ref={ref} className="flex items-center justify-center">
      {variants[variant]}
      {text && (
        <span className="ml-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
});

Loader.displayName = 'Loader';

export default Loader;
