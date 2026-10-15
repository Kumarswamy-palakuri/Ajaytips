// Generate placeholder stub pages for Phase 1
// Run: node scripts/gen-stubs.js

import { writeFileSync, mkdirSync, existsSync } from 'fs';

const pages = [
  ['src/pages/Courses.jsx', 'Courses', '/courses'],
  ['src/pages/CourseDetail.jsx', 'Course Detail', '/courses'],
  ['src/pages/TestSeries.jsx', 'Test Series', '/test-series'],
  ['src/pages/MockTests.jsx', 'Mock Tests', '/mock-tests'],
  ['src/pages/DailyQuiz.jsx', 'Daily Quiz', '/daily-quiz'],
  ['src/pages/Jobs.jsx', 'Government Job Notifications', '/jobs'],
  ['src/pages/JobDetail.jsx', 'Job Detail', '/jobs'],
  ['src/pages/Resources.jsx', 'Study Resources', '/resources'],
  ['src/pages/Articles.jsx', 'Articles & Current Affairs', '/articles'],
  ['src/pages/ArticleDetail.jsx', 'Article Detail', '/articles'],
  ['src/pages/LiveClasses.jsx', 'Live Classes', '/live-classes'],
  ['src/pages/Results.jsx', 'Results & Answer Keys', '/results'],
  ['src/pages/About.jsx', 'About AjayTips', '/about'],
  ['src/pages/Contact.jsx', 'Contact Us', '/contact'],
  ['src/pages/FAQ.jsx', 'Frequently Asked Questions', '/faq'],
  ['src/pages/policies/Privacy.jsx', 'Privacy Policy', '/privacy'],
  ['src/pages/policies/Terms.jsx', 'Terms & Conditions', '/terms'],
  ['src/pages/policies/Refund.jsx', 'Refund Policy', '/refund'],
  ['src/pages/policies/Disclaimer.jsx', 'Disclaimer', '/disclaimer'],
  ['src/pages/auth/ForgotPassword.jsx', 'Forgot Password', '/forgot-password'],
  ['src/pages/auth/ResetPassword.jsx', 'Reset Password', '/reset-password'],
  ['src/pages/auth/VerifyEmail.jsx', 'Verify Email', '/verify-email'],
  ['src/pages/dashboard/Dashboard.jsx', 'My Dashboard', '/dashboard'],
  ['src/pages/dashboard/Profile.jsx', 'My Profile', '/dashboard/profile'],
  ['src/pages/dashboard/Settings.jsx', 'Account Settings', '/dashboard/settings'],
  ['src/pages/admin/AdminDashboard.jsx', 'Admin Dashboard', '/admin'],
  ['src/pages/admin/AdminUsers.jsx', 'User Management', '/admin/users'],
  ['src/pages/errors/NotFound.jsx', '404 — Page Not Found', '/'],
  ['src/pages/errors/Unauthorized.jsx', '403 — Access Denied', '/'],
];

const stub = (name, path) => `export default function ${name.replace(/[^a-zA-Z]/g, '')}Page() {
  return (
    <div className="container-pad section-sm">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">${name}</h1>
      <p className="text-slate-500">This page is coming in Phase 2+. Route: <code>${path}</code></p>
    </div>
  );
}
`;

pages.forEach(([file, name, path]) => {
  const dir = file.split('/').slice(0, -1).join('/');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(file)) {
    writeFileSync(file, stub(name, path));
    console.log(`Created ${file}`);
  } else {
    console.log(`Skipped ${file} (exists)`);
  }
});

console.log('✅ Done');
