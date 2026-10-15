import { cn } from '../../utils/helpers.js';
import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
  accent: 'btn-accent',
};

const sizes = {
  sm: 'text-xs px-2.5 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-6 py-3',
  xl: 'text-lg px-8 py-4',
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className,
  disabled,
  ...props
}) => (
  <button
    className={cn(variants[variant], sizes[size], className)}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? (
      <Loader2 className="w-4 h-4 animate-spin" />
    ) : leftIcon ? (
      <span className="w-4 h-4">{leftIcon}</span>
    ) : null}
    {children}
    {!isLoading && rightIcon && <span className="w-4 h-4">{rightIcon}</span>}
  </button>
);

export default Button;
