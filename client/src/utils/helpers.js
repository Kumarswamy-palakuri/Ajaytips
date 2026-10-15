import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes safely
export const cn = (...inputs) => twMerge(clsx(inputs));

// Format Indian currency
export const formatINR = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

// Format date to readable Indian locale
export const formatDate = (date, opts = {}) =>
  new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric', ...opts,
  });

// Time ago (relative)
export const timeAgo = (date) => {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const intervals = [
    [31536000, 'year'], [2592000, 'month'], [86400, 'day'],
    [3600, 'hour'], [60, 'minute'], [1, 'second'],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${label}${count > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};

// Countdown to date
export const getCountdown = (deadline) => {
  const diff = new Date(deadline) - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  return { days, hours, minutes, total: diff };
};

// Truncate text
export const truncate = (str, n = 100) =>
  str?.length > n ? str.slice(0, n) + '…' : str;

// Slug → readable title
export const slugToTitle = (slug) =>
  slug?.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || '';

// Get initials from name
export const getInitials = (name = '') =>
  name.split(' ').slice(0, 2).map((n) => n[0]?.toUpperCase()).join('');

// Percentage formatter
export const formatPercent = (value, total) =>
  total ? Math.round((value / total) * 100) : 0;

// Role label mapping
export const ROLE_LABELS = {
  guest: 'Guest',
  student: 'Student',
  content_editor: 'Content Editor',
  instructor: 'Instructor',
  admin: 'Admin',
  super_admin: 'Super Admin',
};

// Role badge colors
export const ROLE_COLORS = {
  guest: 'badge-gray',
  student: 'badge-blue',
  content_editor: 'badge-amber',
  instructor: 'badge-green',
  admin: 'badge-red',
  super_admin: 'badge-red',
};
