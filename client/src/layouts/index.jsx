import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header.jsx';
import Footer from '../components/layout/Footer.jsx';

export function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export function MinimalLayout() {
  return (
    <div className="min-h-screen bg-surface-50 dark:bg-dark-bg flex flex-col">
      <Outlet />
    </div>
  );
}
