// FRONTENT/src/hooks/useAdminDashboard.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAdminDashboard = (router) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (!token || user.role !== 'admin') {
      router.push('/(auth)/login');
      return;
    }

    fetchData(token);
  }, [router]);

  const fetchData = async (token) => {
    try {
      const [statsRes, articlesRes] = await Promise.all([
        axios.get('http://localhost:4000/api/admin/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:4000/api/admin/articles', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setData({
        stats: statsRes.data,
        articles: articlesRes.data.articles,
        tagStats: articlesRes.data.tagStats,
        topPosts: articlesRes.data.topPosts
      });
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        router.push('/(auth)/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this post permanently?')) return;

    try {
      await axios.delete(`http://localhost:4000/api/admin/articles/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      window.location.reload();
    } catch (err) {
      alert('Failed to delete post');
    }
  };

  return { data, loading, handleDelete };
};

export default useAdminDashboard;