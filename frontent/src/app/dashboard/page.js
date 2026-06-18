'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import DashboardSidebar from '../../components/DashboardSidebar';
import StatsCards from '../../components/StatsCard';
import TagInsights from '../../components/TagInsights';
import TopPosts from '../../components/TopPosts';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    if (!token) { router.push('/auth'); return; }
    if (userData) { try { setUser(JSON.parse(userData)); } catch {} }

    fetch('http://localhost:4000/user/dashboard', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(result => {
        if (result.success) setDashboardData(result.data);
        else setError(true);
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, [router]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-sm text-slate-400">Failed to load dashboard. Please refresh.</p>
      </div>
    );
  }

  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-slate-50">
      <DashboardSidebar
        user={user}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* lg:ml-56 offsets the sidebar's fixed width on desktop; no offset on mobile since it's a drawer overlay */}
      <main className="lg:ml-56 min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto">

          <div className="mb-5 sm:mb-7 flex items-start gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mt-1 p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 shrink-0"
              aria-label="Open menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                {getGreeting()}! {firstName}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">{formatDate(new Date())}</p>
            </div>
          </div>

          <StatsCards data={dashboardData} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <TagInsights tagInsights={dashboardData.tagInsights} />
            </div>
            <div className="lg:col-span-5">
              <TopPosts topPosts={dashboardData.topPosts} />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}