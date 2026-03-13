import React from 'react';
import { cn } from '../../utils/cn';

const SkeletonLoader = React.forwardRef(({
  className,
  variant = 'text',
  width,
  height,
  lines = 3,
  circle = false,
  ...props
}, ref) => {
  const baseClasses = 'loading-skeleton';
  
  const variants = {
    text: 'h-4',
    heading: 'h-8',
    avatar: 'w-10 h-10 rounded-full',
    button: 'h-10 w-20 rounded-lg',
    card: 'h-32',
    image: 'w-full h-48',
    custom: '',
  };

  const classes = cn(
    baseClasses,
    variants[variant],
    circle && 'rounded-full',
    className
  );

  const style = {
    width: width || (variant === 'custom' ? '100%' : undefined),
    height: height || (variant === 'custom' ? '1rem' : undefined),
    ...props.style,
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div ref={ref} className="space-y-2" {...props}>
        {Array.from({ length: lines }, (_, index) => (
          <div
            key={index}
            className={cn(baseClasses, 'h-4', className)}
            style={{
              width: index === lines - 1 ? '70%' : '100%',
              ...style,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className={classes}
      style={style}
      {...props}
    />
  );
});

SkeletonLoader.displayName = 'SkeletonLoader';

export default SkeletonLoader;
