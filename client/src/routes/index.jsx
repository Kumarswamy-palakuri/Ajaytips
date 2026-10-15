import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { PublicLayout, MinimalLayout } from '../layouts/index.jsx';
import { AuthGuard, RoleGuard, GuestGuard } from './guards.jsx';
import { Spinner } from '../components/ui/index.jsx';

// ── Lazy page imports ──────────────────────────────────────────────────────────
const Home               = lazy(() => import('../pages/Home.jsx'));
const Courses            = lazy(() => import('../pages/Courses.jsx'));
const CourseDetail       = lazy(() => import('../pages/CourseDetail.jsx'));
const TestSeries         = lazy(() => import('../pages/TestSeries.jsx'));
const MockTests          = lazy(() => import('../pages/MockTests.jsx'));
const DailyQuiz          = lazy(() => import('../pages/DailyQuiz.jsx'));
const Jobs               = lazy(() => import('../pages/Jobs.jsx'));
const JobDetail          = lazy(() => import('../pages/JobDetail.jsx'));
const Resources          = lazy(() => import('../pages/Resources.jsx'));
const Articles           = lazy(() => import('../pages/Articles.jsx'));
const ArticleDetail      = lazy(() => import('../pages/ArticleDetail.jsx'));
const LiveClasses        = lazy(() => import('../pages/LiveClasses.jsx'));
const Results            = lazy(() => import('../pages/Results.jsx'));
const About              = lazy(() => import('../pages/About.jsx'));
const Contact            = lazy(() => import('../pages/Contact.jsx'));
const FAQ                = lazy(() => import('../pages/FAQ.jsx'));
const Privacy            = lazy(() => import('../pages/policies/Privacy.jsx'));
const Terms              = lazy(() => import('../pages/policies/Terms.jsx'));
const Refund             = lazy(() => import('../pages/policies/Refund.jsx'));
const Disclaimer         = lazy(() => import('../pages/policies/Disclaimer.jsx'));

// Auth pages
const Login              = lazy(() => import('../pages/auth/Login.jsx'));
const Register           = lazy(() => import('../pages/auth/Register.jsx'));
const ForgotPassword     = lazy(() => import('../pages/auth/ForgotPassword.jsx'));
const ResetPassword      = lazy(() => import('../pages/auth/ResetPassword.jsx'));
const VerifyEmail        = lazy(() => import('../pages/auth/VerifyEmail.jsx'));

// Protected pages
const Dashboard          = lazy(() => import('../pages/dashboard/Dashboard.jsx'));
const DashboardProfile   = lazy(() => import('../pages/dashboard/Profile.jsx'));
const DashboardSettings  = lazy(() => import('../pages/dashboard/Settings.jsx'));

// Admin pages
const AdminDashboard     = lazy(() => import('../pages/admin/AdminDashboard.jsx'));
const AdminUsers         = lazy(() => import('../pages/admin/AdminUsers.jsx'));

// Error pages
const NotFound           = lazy(() => import('../pages/errors/NotFound.jsx'));
const Unauthorized       = lazy(() => import('../pages/errors/Unauthorized.jsx'));

const Loading = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <Spinner size="lg" />
  </div>
);

const withSuspense = (Component) => (
  <Suspense fallback={<Loading />}>
    <Component />
  </Suspense>
);

const router = createBrowserRouter([
  // Public routes
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: withSuspense(Home) },
      { path: '/courses', element: withSuspense(Courses) },
      { path: '/courses/:slug', element: withSuspense(CourseDetail) },
      { path: '/test-series', element: withSuspense(TestSeries) },
      { path: '/mock-tests', element: withSuspense(MockTests) },
      { path: '/daily-quiz', element: withSuspense(DailyQuiz) },
      { path: '/jobs', element: withSuspense(Jobs) },
      { path: '/jobs/:id', element: withSuspense(JobDetail) },
      { path: '/resources', element: withSuspense(Resources) },
      { path: '/articles', element: withSuspense(Articles) },
      { path: '/articles/:slug', element: withSuspense(ArticleDetail) },
      { path: '/live-classes', element: withSuspense(LiveClasses) },
      { path: '/results', element: withSuspense(Results) },
      { path: '/about', element: withSuspense(About) },
      { path: '/contact', element: withSuspense(Contact) },
      { path: '/faq', element: withSuspense(FAQ) },
      { path: '/privacy', element: withSuspense(Privacy) },
      { path: '/terms', element: withSuspense(Terms) },
      { path: '/refund', element: withSuspense(Refund) },
      { path: '/disclaimer', element: withSuspense(Disclaimer) },
    ],
  },

  // Auth routes (guest only)
  {
    element: <MinimalLayout />,
    children: [
      {
        path: '/login',
        element: <GuestGuard>{withSuspense(Login)}</GuestGuard>,
      },
      {
        path: '/register',
        element: <GuestGuard>{withSuspense(Register)}</GuestGuard>,
      },
      { path: '/forgot-password', element: withSuspense(ForgotPassword) },
      { path: '/reset-password', element: withSuspense(ResetPassword) },
      { path: '/verify-email', element: withSuspense(VerifyEmail) },
    ],
  },

  // Student dashboard (auth required)
  {
    path: '/dashboard',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <AuthGuard>{withSuspense(Dashboard)}</AuthGuard>,
      },
      {
        path: 'profile',
        element: <AuthGuard>{withSuspense(DashboardProfile)}</AuthGuard>,
      },
      {
        path: 'settings',
        element: <AuthGuard>{withSuspense(DashboardSettings)}</AuthGuard>,
      },
    ],
  },

  // Admin (admin/super_admin only)
  {
    path: '/admin',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: (
          <RoleGuard roles={['admin', 'super_admin']}>
            {withSuspense(AdminDashboard)}
          </RoleGuard>
        ),
      },
      {
        path: 'users',
        element: (
          <RoleGuard roles={['admin', 'super_admin']}>
            {withSuspense(AdminUsers)}
          </RoleGuard>
        ),
      },
    ],
  },

  // Error pages
  {
    element: <PublicLayout />,
    children: [
      { path: '/unauthorized', element: withSuspense(Unauthorized) },
      { path: '*', element: withSuspense(NotFound) },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
