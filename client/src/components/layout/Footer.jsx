import { Link } from 'react-router-dom';
import { BookOpen, Facebook, Youtube, Instagram, Twitter, Phone, Mail, MapPin } from 'lucide-react';

const footerLinks = {
  'Courses': [
    { to: '/courses', label: 'All Courses' },
    { to: '/courses?category=ssc', label: 'SSC Courses' },
    { to: '/courses?category=banking', label: 'Banking Courses' },
    { to: '/courses?category=railway', label: 'Railway Courses' },
    { to: '/courses?category=upsc', label: 'UPSC Courses' },
    { to: '/courses/free', label: 'Free Courses' },
  ],
  'Practice': [
    { to: '/test-series', label: 'Test Series' },
    { to: '/mock-tests', label: 'Mock Tests' },
    { to: '/daily-quiz', label: 'Daily Quiz' },
    { to: '/pyq', label: 'Previous Year Papers' },
    { to: '/resources', label: 'Study Materials' },
    { to: '/question-bank', label: 'Question Bank' },
  ],
  'Notifications': [
    { to: '/jobs', label: 'Govt Job Alerts' },
    { to: '/exam-notifications', label: 'Exam Notifications' },
    { to: '/results', label: 'Results & Answer Keys' },
    { to: '/live-classes', label: 'Live Classes' },
    { to: '/articles', label: 'Current Affairs' },
    { to: '/syllabus', label: 'Exam Syllabus' },
  ],
  'Company': [
    { to: '/about', label: 'About Us' },
    { to: '/contact', label: 'Contact' },
    { to: '/faq', label: 'FAQ' },
    { to: '/privacy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms & Conditions' },
    { to: '/refund', label: 'Refund Policy' },
  ],
};

const socials = [
  { href: '#', icon: Youtube, label: 'YouTube' },
  { href: '#', icon: Facebook, label: 'Facebook' },
  { href: '#', icon: Instagram, label: 'Instagram' },
  { href: '#', icon: Twitter, label: 'Twitter' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main footer */}
      <div className="container-pad py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                Ajay<span className="text-brand-400">Tips</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your trusted partner for competitive exam preparation. Comprehensive courses, 
              mock tests, and government job notifications for SSC, Banking, Railway, and 
              State exams.
            </p>
            {/* Socials */}
            <div className="flex items-center gap-3">
              {socials.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-brand-600 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <a href="mailto:support@ajaytips.com" className="hover:text-white transition-colors">
                  support@ajaytips.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                <a href="tel:+919999999999" className="hover:text-white transition-colors">
                  +91 99999 99999
                </a>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-white text-sm mb-4">{section}</h3>
              <ul className="space-y-2.5">
                {links.map(({ to, label }) => (
                  <li key={to}>
                    <Link
                      to={to}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-800">
        <div className="container-pad py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} AjayTips. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/refund" className="hover:text-slate-300 transition-colors">Refund</Link>
            <Link to="/disclaimer" className="hover:text-slate-300 transition-colors">Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
