import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, BookOpen, UserPlus, CheckCircle } from 'lucide-react';
import { registerUser, selectAuthLoading, selectAuthError, clearError } from '../../features/auth/authSlice.js';
import { Button } from '../../components/ui/Button.jsx';
import { Input } from '../../components/ui/Input.jsx';
import { Alert } from '../../components/ui/index.jsx';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number').optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function Register() {
  const [showPass, setShowPass] = useState(false);
  const [registered, setRegistered] = useState(false);
  const dispatch = useDispatch();
  const isLoading = useSelector(selectAuthLoading);
  const authError = useSelector(selectAuthError);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    dispatch(clearError());
    const { confirmPassword, ...payload } = data;
    const result = await dispatch(registerUser(payload));
    if (registerUser.fulfilled.match(result)) {
      setRegistered(true);
      toast.success('Account created! Check your email to verify.');
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md text-center">
          <CheckCircle className="w-16 h-16 text-success-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Check Your Email</h1>
          <p className="text-slate-500 mb-6">
            We sent a verification link to your email. Click it to activate your account.
          </p>
          <Link to="/login" className="btn-primary">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-brand-700 to-brand-900 flex-col justify-between p-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-2xl text-white">AjayTips</span>
        </Link>
        <div>
          <h2 className="text-4xl font-bold text-white mb-4">Start Your Exam Prep Journey Today</h2>
          <p className="text-blue-200 text-lg">Free registration. Access free courses, mock tests, and daily quizzes instantly.</p>
        </div>
        <p className="text-blue-300 text-sm">© {new Date().getFullYear()} AjayTips. All rights reserved.</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-white">AjayTips</span>
          </Link>

          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Create Account</h1>
          <p className="text-slate-500 mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>

          {authError && <Alert type="error" className="mb-4">{authError}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <Input label="Full Name" type="text" id="reg-name" placeholder="Ajay Kumar" error={errors.name?.message} required {...register('name')} />
            <Input label="Email Address" type="email" id="reg-email" placeholder="you@example.com" error={errors.email?.message} required autoComplete="email" {...register('email')} />
            <Input label="Phone Number (optional)" type="tel" id="reg-phone" placeholder="9876543210" error={errors.phone?.message} hint="For exam notifications (optional)" {...register('phone')} />

            <div>
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                id="reg-password"
                placeholder="Min 8 chars, uppercase, number"
                error={errors.password?.message}
                required
                autoComplete="new-password"
                rightIcon={
                  <button type="button" onClick={() => setShowPass(!showPass)} aria-label="Toggle password">
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
                {...register('password')}
              />
            </div>

            <Input label="Confirm Password" type="password" id="reg-confirm" placeholder="Repeat password" error={errors.confirmPassword?.message} required autoComplete="new-password" {...register('confirmPassword')} />

            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full mt-2" id="register-submit-btn" leftIcon={<UserPlus />}>
              {isLoading ? 'Creating Account...' : 'Create Free Account'}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-slate-400">
            By registering, you agree to our{' '}
            <Link to="/terms" className="text-brand-600 hover:underline">Terms</Link> &{' '}
            <Link to="/privacy" className="text-brand-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
