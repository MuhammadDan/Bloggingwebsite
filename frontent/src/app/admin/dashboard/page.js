// FRONTENT/src/app/admin/dashboard/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '../../../components/DashboardSidebar';
import useAdminDashboard from '../../../hooks/useAdminDashboard';
import AdminHeader from '../../../components/AdminHeader';
import AdminStats from '../../../components/AdminStats';
import TagInsights from '../../../components/TagInsights';
import TopPosts from '../../../components/TopPosts';

export default function AdminDashboard() {
  const router = useRouter();
  const { data, loading, handleDelete } = useAdminDashboard(router);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-2xl font-medium bg-gray-50">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar isAdmin={true} user={user} />

      <div className="flex-1 p-6 lg:p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <AdminHeader />

          <AdminStats stats={data?.stats} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <TagInsights tagInsights={data?.tagStats || []} />

            <div className="lg:col-span-2">
              <TopPosts topPosts={data?.topPosts || []} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}