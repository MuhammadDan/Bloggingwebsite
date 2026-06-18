// src/app/dashboard/articles/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function MyArticlesPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const router = useRouter();

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const fetchMyArticles = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/blog/articles/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data;
      setArticles(data.rows || data.articles || data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure to delete this blog?')) return;
    setDeletingId(id);
    try {
      await axios.delete(`http://localhost:4000/api/blog/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setArticles(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading your articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Blog Posts</h1>
            <p className="text-sm text-gray-400 mt-1">{articles.length} article{articles.length !== 1 ? 's' : ''} total</p>
          </div>
          <button
            onClick={() => router.push('/dashboard/articles/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
          >
            <span className="text-lg leading-none">+</span>
            New Post
          </button>
        </div>

        {/* Empty state */}
        {articles.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-16 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">There are no posts yet</h3>
            <p className="text-sm text-gray-400 mb-6">Start writing your first blog post!</p>
            <button
              onClick={() => router.push('/dashboard/articles/new')}
              className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Pehla Post Likho
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wide">
              <div className="col-span-5">Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-1 text-center">Views</div>
              <div className="col-span-1 text-center">Likes</div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* Article rows */}
            {articles.map((article, i) => (
              <div
                key={article.id}
                className={`grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors ${
                  i !== articles.length - 1 ? 'border-b border-slate-100' : ''
                }`}
              >
                {/* Title */}
                <div className="col-span-5 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">{article.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(article.createdAt).toLocaleDateString('en-US', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                  {article.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {article.tags.slice(0, 3).map((tag, ti) => (
                        <span key={ti} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-xs text-gray-400">+{article.tags.length - 3}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* Category */}
                <div className="col-span-2">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                    {article.category || '—'}
                  </span>
                </div>

                {/* Views */}
                <div className="col-span-1 text-center">
                  <span className="text-sm font-medium text-gray-700">{article.views ?? 0}</span>
                </div>

                {/* Likes */}
                <div className="col-span-1 text-center">
                  <span className="text-sm font-medium text-gray-700">{article.likesCount ?? 0}</span>
                </div>

                {/* Status badge */}
                <div className="col-span-1 text-center">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                    article.published
                      ? 'bg-green-50 text-green-600'
                      : 'bg-amber-50 text-amber-600'
                  }`}>
                    {article.published ? 'Live' : 'Draft'}
                  </span>
                </div>

                {/* Action buttons */}
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    onClick={() => router.push(`/dashboard/articles/${article.id}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(article.id)}
                    disabled={deletingId === article.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deletingId === article.id ? (
                      <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                      </svg>
                    )}
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}