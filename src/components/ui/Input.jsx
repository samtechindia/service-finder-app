import React from 'react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  className,
  type = 'text',
  error,
  success,
  label,
  helperText,
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const inputClasses = cn(
    'block w-full px-4 py-3 text-sm border rounded-lg transition-colors duration-200 placeholder-gray-600 text-gray-900',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    error ? 'border-error-500 focus:ring-error-500 focus:border-error-500 bg-error-50' :
    success ? 'border-success-500 focus:ring-success-500 focus:border-success-500 bg-success-50' :
    'border-gray-300 focus:ring-primary-500 focus:border-primary-500 bg-white',
    icon && iconPosition === 'left' ? 'pl-12' : '',
    icon && iconPosition === 'right' ? 'pr-12' : '',
    className
  );

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">
              {icon}
            </span>
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={inputClasses}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400 sm:text-sm">
              {icon}
            </span>
          </div>
        )}
      </div>
      {error && (
        <p className="form-error">{error}</p>
      )}
      {success && (
        <p className="form-success">{success}</p>
      )}
      {helperText && !error && !success && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
