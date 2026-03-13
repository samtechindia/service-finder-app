import React from 'react';
import { cn } from '../../utils/cn';

const Avatar = React.forwardRef(({
  className,
  src,
  alt,
  size = 'md',
  fallback,
  status,
  ...props
}, ref) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl',
    '3xl': 'w-24 h-24 text-3xl',
  };

  const classes = cn(
    'relative inline-flex items-center justify-center rounded-full bg-gray-100 font-medium text-gray-600 overflow-hidden',
    sizeClasses[size],
    className
  );

  const statusClasses = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    busy: 'bg-warning-500',
    away: 'bg-yellow-500',
  };

  const statusSizeClasses = {
    xs: 'w-2 h-2',
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
    xl: 'w-4 h-4',
    '2xl': 'w-5 h-5',
    '3xl': 'w-6 h-6',
  };

  return (
    <div ref={ref} className={classes} {...props}>
      {src ? (
        <img 
          src={src} 
          alt={alt || 'Avatar'} 
          className="w-full h-full object-cover"
        />
      ) : (
        fallback || (
          <svg className="w-1/2 h-1/2 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      )}
      {status && (
        <span 
          className={cn(
            'absolute -bottom-0 -right-0 block rounded-full border-2 border-white',
            statusClasses[status],
            statusSizeClasses[size]
          )}
        />
      )}
    </div>
  );
});

Avatar.displayName = 'Avatar';

export default Avatar;
