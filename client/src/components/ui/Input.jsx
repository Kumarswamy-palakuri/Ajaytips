import { forwardRef } from 'react';
import { cn } from '../../utils/helpers.js';

export const Input = forwardRef(({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="label">
          {label}
          {props.required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            error ? 'input-error' : 'input',
            leftIcon && 'pl-9',
            rightIcon && 'pr-9',
            className
          )}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          aria-invalid={!!error}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4">
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p id={`${inputId}-error`} className="field-error" role="alert">{error}</p>}
      {!error && hint && <p id={`${inputId}-hint`} className="text-xs text-slate-500 mt-1">{hint}</p>}
    </div>
  );
});
Input.displayName = 'Input';

export const Textarea = forwardRef(({ label, error, hint, className, id, ...props }, ref) => {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && <label htmlFor={inputId} className="label">{label}</label>}
      <textarea
        id={inputId}
        ref={ref}
        className={cn(error ? 'input-error' : 'input', 'resize-none', className)}
        aria-describedby={error ? `${inputId}-error` : undefined}
        aria-invalid={!!error}
        {...props}
      />
      {error && <p id={`${inputId}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  );
});
Textarea.displayName = 'Textarea';

export default Input;
