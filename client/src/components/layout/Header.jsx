import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  BookOpen, Menu, X, Search, Bell, ChevronDown, Sun, Moon,
  User, LogOut, LayoutDashboard, Settings, Shield
} from 'lucide-react';
import { selectIsAuthenticated, selectUser, logoutUser } from '../../features/auth/authSlice.js';
import { Avatar } from '../ui/index.jsx';
import { cn } from '../../utils/helpers.js';
import toast from 'react-hot-toast';

const NAV_LINKS = [
  { to: '/courses', label: 'Courses' },
  { to: '/test-series', label: 'Test Series' },
  { to: '/mock-tests', label: 'Mock Tests' },
  { to: '/jobs', label: 'Govt Jobs' },
  { to: '/resources', label: 'Resources' },
  {
    label: 'More', children: [
      { to: '/articles', label: 'Articles & News' },
      { to: '/daily-quiz', label: 'Daily Quiz' },
      { to: '/live-classes', label: 'Live Classes' },
      { to: '/results', label: 'Results & Keys' },
      { to: '/pyq', label: 'Previous Year Papers' },
    ],
  },
];

const useDarkMode = () => {
  const [dark, setDark] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('theme') === 'dark' ||
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return [dark, setDark];
};

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dark, setDark] = useDarkMode();
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change / outside click
  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('[data-menu]')) {
        setUserMenuOpen(false);
        setMoreOpen(false);
      }
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate('/');
    toast.success('Logged out successfully');
  };

  const adminRoles = ['admin', 'super_admin', 'content_editor', 'instructor'];
  const isAdmin = adminRoles.includes(user?.role);

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-brand-600 text-white text-xs py-1.5 text-center font-medium px-4">
        🎯 New SSC CGL 2024 Mock Tests Available! &nbsp;
        <Link to="/test-series/ssc-cgl" className="underline underline-offset-2 hover:no-underline">
          Start Practicing →
        </Link>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass shadow-md'
            : 'bg-white dark:bg-dark-bg border-b border-surface-200 dark:border-dark-border'
        )}
      >
        <div className="container-pad">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 shrink-0 group" aria-label="AjayTips Home">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-glow group-hover:bg-brand-700 transition-colors">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white hidden sm:block">
                Ajay<span className="text-brand-600">Tips</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 ml-4" aria-label="Main navigation">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label} className="relative" data-menu>
                    <button
                      onClick={() => setMoreOpen((o) => !o)}
                      className="nav-link pr-1"
                      aria-expanded={moreOpen}
                      aria-haspopup="true"
                    >
                      {link.label}
                      <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', moreOpen && 'rotate-180')} />
                    </button>
                    {moreOpen && (
                      <div className="absolute top-full left-0 mt-1 w-52 card shadow-card-lg py-1 z-50 animate-slide-down">
                        {link.children.map((child) => (
                          <NavLink
                            key={child.to}
                            to={child.to}
                            className={({ isActive }) =>
                              cn('block px-4 py-2.5 text-sm hover:bg-surface-50 dark:hover:bg-dark-border transition-colors', isActive && 'text-brand-600 font-medium')
                            }
                            onClick={() => setMoreOpen(false)}
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) =>
                      cn('nav-link', isActive && 'nav-link-active')
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="btn-ghost p-2 rounded-lg"
                aria-label="Search"
                id="header-search-btn"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Dark mode toggle */}
              <button
                onClick={() => setDark((d) => !d)}
                className="btn-ghost p-2 rounded-lg"
                aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
                id="theme-toggle"
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications */}
                  <button className="btn-ghost p-2 rounded-lg relative" aria-label="Notifications" id="notif-btn">
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full" aria-label="Unread notifications" />
                  </button>

                  {/* User menu */}
                  <div className="relative" data-menu>
                    <button
                      onClick={() => setUserMenuOpen((o) => !o)}
                      className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-surface-100 dark:hover:bg-dark-border transition-colors"
                      aria-expanded={userMenuOpen}
                      aria-haspopup="true"
                      id="user-menu-btn"
                    >
                      <Avatar src={user?.avatar} name={user?.name} size="sm" />
                      <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">
                        {user?.name}
                      </span>
                      <ChevronDown className={cn('w-3.5 h-3.5 text-slate-500 hidden md:block transition-transform', userMenuOpen && 'rotate-180')} />
                    </button>

                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-1.5 w-56 card shadow-card-lg py-1 z-50 animate-slide-down">
                        <div className="px-4 py-2.5 border-b border-surface-200 dark:border-dark-border">
                          <p className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">{user?.name}</p>
                          <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        </div>
                        {[
                          { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
                          { to: '/dashboard/profile', icon: User, label: 'My Profile' },
                          ...(isAdmin ? [{ to: '/admin', icon: Shield, label: 'Admin Panel' }] : []),
                          { to: '/dashboard/settings', icon: Settings, label: 'Settings' },
                        ].map((item) => (
                          <Link
                            key={item.to}
                            to={item.to}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-surface-50 hover:text-brand-600 dark:text-slate-400 dark:hover:bg-dark-border dark:hover:text-brand-400 transition-colors"
                            onClick={() => setUserMenuOpen(false)}
                          >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        ))}
                        <hr className="my-1 border-surface-200 dark:border-dark-border" />
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-error-600 hover:bg-error-50 dark:hover:bg-red-950/50 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="btn-secondary hidden sm:inline-flex" id="login-btn">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary" id="register-btn">
                    <span className="hidden sm:inline">Get Started</span>
                    <span className="sm:hidden">Join</span>
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden btn-ghost p-2 rounded-lg"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                id="mobile-menu-btn"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-surface-200 dark:border-dark-border bg-white dark:bg-dark-bg animate-slide-down">
            <nav className="container-pad py-3 flex flex-col gap-1" aria-label="Mobile navigation">
              {NAV_LINKS.map((link) =>
                link.children ? (
                  <div key={link.label}>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 py-2">{link.label}</p>
                    {link.children.map((child) => (
                      <NavLink
                        key={child.to}
                        to={child.to}
                        className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                ) : (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => cn('nav-link', isActive && 'nav-link-active')}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <div className="w-full max-w-xl card shadow-card-lg animate-slide-down">
            <div className="flex items-center gap-3 p-4">
              <Search className="w-5 h-5 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="search"
                placeholder="Search courses, tests, jobs..."
                className="flex-1 bg-transparent outline-none text-slate-800 dark:text-slate-100 placeholder:text-slate-400"
                aria-label="Search"
                id="global-search-input"
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                  if (e.key === 'Enter') {
                    navigate(`/search?q=${encodeURIComponent(e.target.value)}`);
                    setSearchOpen(false);
                  }
                }}
              />
              <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-600" aria-label="Close search">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="border-t border-surface-200 dark:border-dark-border px-4 py-3">
              <p className="text-xs text-slate-500">Popular: SSC CGL, RRB NTPC, Banking, Police, UPSC</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
