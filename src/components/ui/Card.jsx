import React from 'react';
import { cn } from '../../utils/cn';

const Card = React.forwardRef(({
  className,
  children,
  hover = false,
  interactive = false,
  padding = 'default',
  ...props
}, ref) => {
  const baseClasses = 'bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-200';
  
  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 cursor-pointer' : '';
  const interactiveClasses = interactive ? 'hover:border-primary-200' : '';
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const classes = cn(
    baseClasses,
    hoverClasses,
    interactiveClasses,
    paddingClasses[padding],
    className
  );

  return (
    <div ref={ref} className={classes} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;
