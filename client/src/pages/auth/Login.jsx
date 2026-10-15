import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, BookOpen, LogIn } from 'lucide-react';
import { loginUser, selectAuthLoading, selectAuthError, clearError } from '../../features/auth/authSlice.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Alert } from '../../components/ui/index.jsx';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const redirect = new URLSearchParams(location.search).get('redirect') || '/dashboard';
  const sessionExpired = location.search.includes('session=expired');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    dispatch(clearError());
    const result = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(result)) {
      toast.success(`Welcome back, ${result.payload.name}!`);
      navigate(redirect, { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 to-brand-900 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl text-white">AjayTips</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">Your Gateway to Government Job Success</h2>
          <p className="text-blue-200 text-lg">Join 2.5 lakh+ students preparing for SSC, Banking, Railway, and State exams.</p>
          <div className="mt-8 space-y-3">
            {['10,000+ Mock Tests', 'Live Classes Daily', 'Telugu & English Content', 'Expert Faculty'].map((item) => (
              <div key={item} className="flex items-center gap-3 text-white/90">
                <div className="w-5 h-5 rounded-full bg-accent-400 flex items-center justify-center text-xs font-bold text-white">✓</div>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-blue-300 text-sm">© {new Date().getFullYear()} AjayTips. All rights reserved.</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">AjayTips</span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Sign In</h1>
          <p className="text-slate-500 mb-8">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:underline">Create one free</Link>
          </p>

          {sessionExpired && (
            <Alert type="warning" className="mb-4">Your session expired. Please sign in again.</Alert>
          )}
          {authError && (
            <Alert type="error" className="mb-4">{authError}</Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
            <Input
              label="Email Address"
              type="email"
              id="login-email"
              placeholder="you@example.com"
              autoComplete="email"
              error={errors.email?.message}
              required
              {...register('email')}
            />

            <div>
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                id="login-password"
                placeholder="Enter your password"
                autoComplete="current-password"
                error={errors.password?.message}
                required
                rightIcon={
                  <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? 'Hide password' : 'Show password'}>
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('password')}
              />
              <div className="text-right mt-1.5">
                <Link to="/forgot-password" className="text-xs text-brand-600 hover:underline">Forgot password?</Link>
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full" id="login-submit-btn" leftIcon={<LogIn />}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-brand-600 hover:underline">Terms</Link> &{' '}
            <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
