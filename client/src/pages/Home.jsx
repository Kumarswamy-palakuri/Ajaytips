import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, Users, BookOpen, Trophy, Clock,
  Zap, CheckCircle, TrendingUp, Bell, PlayCircle,
  FileText, Briefcase, ChevronRight, Award
} from 'lucide-react';
import { Card, Badge, Skeleton } from '../components/ui/index.jsx';
import { formatDate, formatINR } from '../utils/helpers.js';

// ── Static data (will come from API in Phase 2) ────────────────────────────────
const EXAM_CATEGORIES = [
  { id: 'ssc', name: 'SSC', icon: '🏛️', count: 120, color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  { id: 'banking', name: 'Banking', icon: '🏦', count: 85, color: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300', border: 'border-green-200 dark:border-green-800' },
  { id: 'railway', name: 'Railway', icon: '🚆', count: 95, color: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-800' },
  { id: 'police', name: 'Police', icon: '👮', count: 60, color: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-800' },
  { id: 'upsc', name: 'UPSC', icon: '📋', count: 45, color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  { id: 'teaching', name: 'Teaching', icon: '📚', count: 70, color: 'bg-pink-50 text-pink-700 dark:bg-pink-950 dark:text-pink-300', border: 'border-pink-200 dark:border-pink-800' },
  { id: 'state-psc', name: 'State PSC', icon: '🗺️', count: 55, color: 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300', border: 'border-teal-200 dark:border-teal-800' },
  { id: 'forest', name: 'Forest', icon: '🌳', count: 30, color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
];

const FEATURED_COURSES = [
  { id: 1, title: 'SSC CGL 2024 Complete Course', exam: 'SSC CGL', lessons: 180, students: 12500, rating: 4.8, price: 1999, originalPrice: 4999, tag: 'Bestseller', instructor: 'Ajay Kumar', thumb: 'https://placehold.co/400x225/2563eb/ffffff?text=SSC+CGL' },
  { id: 2, title: 'RRB NTPC 2024 Full Preparation', exam: 'RRB NTPC', lessons: 140, students: 8900, rating: 4.7, price: 1499, originalPrice: 3999, tag: 'Trending', instructor: 'Ramesh Gupta', thumb: 'https://placehold.co/400x225/16a34a/ffffff?text=RRB+NTPC' },
  { id: 3, title: 'SBI PO Banking Course', exam: 'SBI PO', lessons: 160, students: 7200, rating: 4.9, price: 2499, originalPrice: 5999, tag: 'New', instructor: 'Priya Singh', thumb: 'https://placehold.co/400x225/7c3aed/ffffff?text=SBI+PO' },
  { id: 4, title: 'AP Police SI Complete Batch', exam: 'AP Police', lessons: 200, students: 5100, rating: 4.6, price: 1799, originalPrice: 3999, tag: 'Popular', instructor: 'Suresh Nair', thumb: 'https://placehold.co/400x225/dc2626/ffffff?text=AP+Police' },
];

const STATS = [
  { icon: Users, label: 'Students Enrolled', value: '2,50,000+' },
  { icon: BookOpen, label: 'Courses Available', value: '500+' },
  { icon: Trophy, label: 'Mock Tests', value: '10,000+' },
  { icon: Award, label: 'Success Stories', value: '45,000+' },
];

const RECENT_JOBS = [
  { id: 1, title: 'SSC CGL 2024', org: 'Staff Selection Commission', vacancies: 17727, lastDate: '2025-01-15', category: 'SSC' },
  { id: 2, title: 'RRB ALP & Technician', org: 'Railway Recruitment Board', vacancies: 9144, lastDate: '2025-01-20', category: 'Railway' },
  { id: 3, title: 'SBI Clerk 2024', org: 'State Bank of India', vacancies: 13735, lastDate: '2025-02-10', category: 'Banking' },
  { id: 4, title: 'APPSC Group-1', org: 'Andhra Pradesh PSC', vacancies: 503, lastDate: '2025-01-25', category: 'State PSC' },
  { id: 5, title: 'TSPSC Group-2', org: 'Telangana State PSC', vacancies: 783, lastDate: '2025-02-05', category: 'State PSC' },
];

const TESTIMONIALS = [
  { name: 'Ravi Kumar', score: 'SSC CGL 2023 — AIR 234', text: 'AjayTips mock tests were exactly like the real exam. The detailed analysis helped me identify weak areas. Highly recommended!', avatar: 'RK' },
  { name: 'Priya Reddy', score: 'RRB NTPC 2023 — Selected', text: 'The Telugu medium content was a game changer for me. Practice tests and PYQs helped me crack the exam in first attempt!', avatar: 'PR' },
  { name: 'Suresh Varma', score: 'SBI PO 2024 — Selected', text: 'Best platform for banking exam prep. The live classes and doubt sessions are extremely helpful and interactive.', avatar: 'SV' },
];

// ── Sub-components ─────────────────────────────────────────────────────────────
function CourseCard({ course }) {
  const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);
  return (
    <Link to={`/courses/${course.id}`} className="group">
      <Card hover className="overflow-hidden h-full flex flex-col">
        <div className="relative">
          <img src={course.thumb} alt={course.title} className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
          <span className="absolute top-3 left-3 badge-amber text-xs font-bold">{course.tag}</span>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="blue">{course.exam}</Badge>
          </div>
          <h3 className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 group-hover:text-brand-600 transition-colors mb-1">
            {course.title}
          </h3>
          <p className="text-xs text-slate-500 mb-3">by {course.instructor}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mb-auto">
            <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />{course.lessons} Lessons</span>
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{course.students.toLocaleString('en-IN')}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-surface-200 dark:border-dark-border flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{formatINR(course.price)}</span>
              <span className="text-xs text-slate-400 line-through ml-2">{formatINR(course.originalPrice)}</span>
            </div>
            <span className="badge-green text-xs font-bold">{discount}% OFF</span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{course.rating}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function JobRow({ job }) {
  const daysLeft = Math.max(0, Math.floor((new Date(job.lastDate) - Date.now()) / 86400000));
  const urgency = daysLeft < 7 ? 'red' : daysLeft < 15 ? 'amber' : 'green';
  return (
    <Link to={`/jobs/${job.id}`} className="flex items-start sm:items-center justify-between gap-4 p-4 hover:bg-surface-50 dark:hover:bg-dark-border transition-colors rounded-lg group">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <Badge variant={urgency === 'green' ? 'green' : urgency === 'amber' ? 'amber' : 'red'}>{job.category}</Badge>
          {daysLeft < 7 && <Badge variant="red">Closing Soon!</Badge>}
        </div>
        <h4 className="font-semibold text-slate-800 dark:text-slate-100 group-hover:text-brand-600 transition-colors truncate">{job.title}</h4>
        <p className="text-xs text-slate-500">{job.org}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{job.vacancies.toLocaleString('en-IN')} posts</p>
        <p className="text-xs text-slate-500">Last: {formatDate(job.lastDate)}</p>
        <p className={`text-xs font-semibold mt-0.5 ${daysLeft < 7 ? 'text-error-600' : daysLeft < 15 ? 'text-accent-600' : 'text-success-600'}`}>
          {daysLeft} days left
        </p>
      </div>
    </Link>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

        <div className="container-pad py-20 md:py-28 relative">
          <div className="max-w-3xl">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 bg-white/15 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6 backdrop-blur-sm">
              <Zap className="w-4 h-4 text-accent-300" />
              India's Most Trusted Exam Prep Platform
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight text-balance mb-6">
              Crack Your Dream{' '}
              <span className="text-accent-300">Government Job</span>{' '}
              Exam in 2024
            </h1>

            <p className="text-lg text-blue-100 leading-relaxed mb-8 max-w-2xl">
              Expert courses, 10,000+ mock tests, live classes, and real-time job notifications.
              Trusted by 2.5 lakh+ students across Andhra Pradesh & Telangana.
            </p>

            {/* CTA */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link to="/courses" id="hero-explore-btn" className="inline-flex items-center gap-2 bg-white text-brand-700 font-semibold px-6 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-lg text-base">
                Explore Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/mock-tests" id="hero-test-btn" className="inline-flex items-center gap-2 bg-white/15 text-white border border-white/30 font-semibold px-6 py-3.5 rounded-xl hover:bg-white/25 transition-colors backdrop-blur-sm text-base">
                <PlayCircle className="w-4 h-4" />
                Free Mock Test
              </Link>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-5 text-sm text-blue-100">
              {[
                '✅ Free to join',
                '📱 Mobile-friendly',
                '🌐 Telugu & English',
                '🔴 Live classes daily',
              ].map((item) => (
                <span key={item} className="flex items-center gap-1">{item}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section className="bg-white dark:bg-dark-surface border-b border-surface-200 dark:border-dark-border">
        <div className="container-pad py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <div className="inline-flex w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-brand-600" />
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
                <p className="text-sm text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exam Categories ─────────────────────────────────────────────────── */}
      <section className="section-sm bg-surface-50 dark:bg-dark-bg">
        <div className="container-pad">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Browse by Exam Category</h2>
              <p className="text-slate-500 text-sm mt-1">Choose your target exam and start preparing today</p>
            </div>
            <Link to="/courses" className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              All Exams <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {EXAM_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/courses?category=${cat.id}`}
                className={`group flex flex-col items-center p-4 rounded-xl border-2 ${cat.border} ${cat.color} hover:shadow-card-md transition-all duration-200 hover:-translate-y-0.5 text-center`}
                id={`category-${cat.id}`}
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="font-semibold text-sm">{cat.name}</span>
                <span className="text-xs opacity-70 mt-0.5">{cat.count} courses</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Courses ─────────────────────────────────────────────────── */}
      <section className="section bg-white dark:bg-dark-bg">
        <div className="container-pad">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Featured Courses</h2>
              <p className="text-slate-500 text-sm mt-1">Expertly crafted courses for top competitive exams</p>
            </div>
            <Link to="/courses" className="text-brand-600 text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">
              All Courses <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED_COURSES.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Mock Tests + Jobs ─────────────────────────────────────────────────── */}
      <section className="section-sm bg-surface-50 dark:bg-dark-bg">
        <div className="container-pad">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Mock Tests */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-brand-600" /> Free Mock Tests
                </h2>
                <Link to="/mock-tests" className="text-brand-600 text-sm font-medium flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <Card>
                <div className="p-4 space-y-3">
                  {[
                    { name: 'SSC CGL Full Mock Test 1', questions: 100, duration: 60, attempted: 45200 },
                    { name: 'RRB NTPC Stage 1 Mock', questions: 100, duration: 90, attempted: 38100 },
                    { name: 'SBI PO Prelims Mock Test', questions: 100, duration: 60, attempted: 29800 },
                    { name: 'AP Police Constable Mock', questions: 200, duration: 120, attempted: 21500 },
                  ].map((test, i) => (
                    <Link
                      key={i}
                      to="/mock-tests"
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-surface-50 dark:hover:bg-dark-border transition-colors group"
                    >
                      <div>
                        <p className="font-medium text-sm text-slate-800 dark:text-slate-100 group-hover:text-brand-600 transition-colors">{test.name}</p>
                        <p className="text-xs text-slate-500">{test.questions} Qs • {test.duration} min • {test.attempted.toLocaleString('en-IN')} attempted</p>
                      </div>
                      <span className="badge-blue shrink-0">Free</span>
                    </Link>
                  ))}
                </div>
                <div className="px-4 pb-4">
                  <Link to="/mock-tests" className="btn-primary w-full justify-center" id="view-all-tests-btn">
                    Start Free Mock Test
                  </Link>
                </div>
              </Card>
            </div>

            {/* Latest Jobs */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-600" /> Latest Job Notifications
                </h2>
                <Link to="/jobs" className="text-brand-600 text-sm font-medium flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <Card>
                <div className="divide-y divide-surface-200 dark:divide-dark-border">
                  {RECENT_JOBS.map((job) => <JobRow key={job.id} job={job} />)}
                </div>
                <div className="px-4 pb-4 pt-2">
                  <Link to="/jobs" className="btn-outline w-full justify-center" id="view-all-jobs-btn">
                    View All Job Notifications
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why AjayTips ─────────────────────────────────────────────────────── */}
      <section className="section bg-white dark:bg-dark-bg">
        <div className="container-pad">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Why Students Choose AjayTips</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to crack your dream government job — in one platform</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Exam-Focused Content', desc: 'All content specifically tailored to latest exam patterns and syllabi.' },
              { icon: '📊', title: 'Detailed Analytics', desc: 'Track your performance with subject-wise analysis and improvement tips.' },
              { icon: '🌐', title: 'Telugu & English', desc: 'Study in your preferred language with bilingual content and explanations.' },
              { icon: '📱', title: 'Learn Anywhere', desc: 'Access on any device — mobile, tablet, or desktop, online or offline.' },
              { icon: '👨‍🏫', title: 'Expert Instructors', desc: 'Learn from experienced educators with proven track records.' },
              { icon: '💰', title: 'Affordable Pricing', desc: 'Premium content at affordable prices with flexible payment options.' },
            ].map(({ icon, title, desc }) => (
              <Card key={title} className="p-6">
                <span className="text-4xl mb-4 block">{icon}</span>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────────── */}
      <section className="section-sm bg-brand-600">
        <div className="container-pad">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-white mb-2">Students Who Cracked It</h2>
            <p className="text-blue-100 text-sm">Real success stories from our community</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, score, text, avatar }) => (
              <div key={name} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20">
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-accent-300 fill-accent-300" />
                  ))}
                </div>
                <p className="text-white/90 text-sm leading-relaxed mb-4">"{text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm">
                    {avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white text-sm">{name}</p>
                    <p className="text-blue-200 text-xs">{score}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────────────────────────────────────── */}
      <section className="section-sm bg-surface-50 dark:bg-dark-bg">
        <div className="container-pad">
          <Card className="overflow-hidden">
            <div className="p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-5 h-5 text-brand-600" />
                  <Badge variant="blue">Get Notified</Badge>
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  Never Miss a Job Notification
                </h2>
                <p className="text-slate-500">
                  Subscribe to get instant alerts for new job notifications, exam dates, and study materials.
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input md:w-64"
                  id="newsletter-email"
                  aria-label="Email for notifications"
                />
                <button className="btn-primary whitespace-nowrap" id="newsletter-subscribe-btn">
                  Subscribe Free
                </button>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
