import React from 'react';
import { cn } from '../../utils/cn';

const RatingStars = React.forwardRef(({
  className,
  rating = 0,
  maxRating = 5,
  size = 'md',
  readonly = true,
  onChange,
  ...props
}, ref) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };

  const starClasses = cn(
    'flex items-center',
    className
  );

  const renderStar = (index) => {
    const filled = index < Math.floor(rating);
    const half = index === Math.floor(rating) && rating % 1 !== 0;
    
    return (
      <button
        key={index}
        type="button"
        className={cn(
          'transition-colors duration-200',
          readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
        )}
        onClick={() => !readonly && onChange && onChange(index + 1)}
        disabled={readonly}
      >
        <svg
          className={cn(
            sizeClasses[size],
            filled ? 'text-yellow-400' : half ? 'text-yellow-200' : 'text-gray-300'
          )}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          {half ? (
            <defs>
              <linearGradient id={`gradient-${index}`}>
                <stop offset="50%" stopColor="currentColor" />
                <stop offset="50%" stopColor="currentColor" stopOpacity="0.3" />
              </linearGradient>
            </defs>
          ) : null}
          <path
            fill={half ? `url(#gradient-${index})` : 'currentColor'}
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
          />
        </svg>
      </button>
    );
  };

  return (
    <div ref={ref} className={starClasses} {...props}>
      {Array.from({ length: maxRating }, (_, index) => renderStar(index))}
    </div>
  );
});

RatingStars.displayName = 'RatingStars';

export default RatingStars;
