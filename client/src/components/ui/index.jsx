import { cn } from '../../utils/helpers.js';

export const Badge = ({ children, variant = 'blue', className }) => {
  const variants = {
    blue: 'badge-blue', green: 'badge-green', amber: 'badge-amber',
    red: 'badge-red', gray: 'badge-gray',
  };
  return (
    <span className={cn(variants[variant] || 'badge-gray', className)}>
      {children}
    </span>
  );
};

export const Skeleton = ({ className, ...props }) => (
  <div className={cn('skeleton', className)} aria-hidden="true" {...props} />
);

export const Spinner = ({ size = 'md', className }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8', xl: 'w-12 h-12' };
  return (
    <div className={cn('inline-block rounded-full border-2 border-current border-t-transparent animate-spin text-brand-600', sizes[size], className)} role="status" aria-label="Loading">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export const EmptyState = ({ icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    {icon && <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mb-4 text-slate-400 dark:bg-dark-border">{icon}</div>}
    <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
    {description && <p className="text-sm text-slate-500 max-w-sm">{description}</p>}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export const Alert = ({ type = 'info', title, children, className }) => {
  const styles = {
    info:    'bg-brand-50 border-brand-200 text-brand-800 dark:bg-brand-950 dark:border-brand-800 dark:text-brand-200',
    success: 'bg-success-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-200',
    warning: 'bg-accent-50 border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-200',
    error:   'bg-error-50 border-red-200 text-red-800 dark:bg-red-950 dark:border-red-800 dark:text-red-200',
  };
  return (
    <div className={cn('rounded-lg border p-4 text-sm', styles[type], className)} role="alert">
      {title && <p className="font-semibold mb-1">{title}</p>}
      {children}
    </div>
  );
};

export const Card = ({ children, className, hover = false, ...props }) => (
  <div className={cn(hover ? 'card-hover' : 'card', className)} {...props}>
    {children}
  </div>
);

export const Divider = ({ className }) => <hr className={cn('divider', className)} />;

export const Avatar = ({ src, name, size = 'md', className }) => {
  const sizes = {
    xs: 'w-6 h-6 text-2xs',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };
  const initials = name?.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('') || '?';

  return src ? (
    <img
      src={src}
      alt={name}
      className={cn('rounded-full object-cover ring-2 ring-white dark:ring-dark-border', sizes[size], className)}
    />
  ) : (
    <div
      className={cn('rounded-full bg-brand-100 text-brand-700 font-semibold flex items-center justify-center ring-2 ring-white dark:ring-dark-border dark:bg-brand-950 dark:text-brand-300', sizes[size], className)}
      aria-label={name}
    >
      {initials}
    </div>
  );
};

export const ProgressBar = ({ value = 0, max = 100, label, className }) => {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)));
  return (
    <div className={className}>
      {label && <div className="flex justify-between text-xs text-slate-500 mb-1"><span>{label}</span><span>{pct}%</span></div>}
      <div className="h-2 rounded-full bg-surface-200 dark:bg-dark-border overflow-hidden">
        <div
          className="h-full bg-brand-600 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label}
        />
      </div>
    </div>
  );
};

export const Tag = ({ children, onRemove, className }) => (
  <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-surface-100 text-slate-600 text-xs font-medium dark:bg-dark-border dark:text-slate-300', className)}>
    {children}
    {onRemove && (
      <button type="button" onClick={onRemove} className="hover:text-error-500 transition-colors" aria-label="Remove">
        ×
      </button>
    )}
  </span>
);
