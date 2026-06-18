// src/app/dashboard/articles/[id]/page.js
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

export default function EditArticlePage() {
  const router = useRouter();
  const { id } = useParams();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [published, setPublished] = useState(false);
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (id) fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/api/blog/articles/id/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const a = res.data;
      setTitle(a.title || '');
      setContent(a.content || '');
      setCategory(a.category || '');
      setPublished(a.published || false);
      setFeaturedImageUrl(a.featuredImage || '');
      setTags(Array.isArray(a.tags) ? a.tags : []);
    } catch (err) {
      console.error(err);
      alert('Could not load article ' + (err.response?.data?.error || err.message));
      router.push('/dashboard/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setTags(prev => [...prev, newTag]);
      }
      setTagInput('');
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(prev => prev.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(
        'http://localhost:4000/api/blog/articles/upload-image',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeaturedImageUrl(res.data.imageUrl);
      alert('✅ Image uploaded!');
    } catch {
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async (publishStatus) => {
    if (!title || !content) {
      alert('Title aur Content zaroor chahiye!');
      return;
    }

    setSaving(true);

    // ✅ const ki jagah let use karo taake reassign na ho
    const payload = {
      title,
      content,
      category: category || null,
      published: publishStatus,
      featuredImage: featuredImageUrl || null,
      tags,
    };

    try {
      await axios.put(
        `http://localhost:4000/api/blog/articles/${id}`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(publishStatus ? '✅ Article is publish!' : '✅ Draft is saved!');
      router.push('/dashboard/articles');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Update failed: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading article...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-sm p-8">

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push('/dashboard/articles')}
                className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-gray-500"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => handleUpdate(false)}
                disabled={saving}
                className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save as Draft'}
              </button>
              <button
                onClick={() => handleUpdate(true)}
                disabled={saving || !title || !content}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Publishing...' : published ? 'Update & Publish' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="space-y-6">

            {/* Title */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Enter post title"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Cover Image</label>
              {featuredImageUrl && (
                <img
                  src={featuredImageUrl}
                  alt="cover"
                  className="w-full h-48 object-cover rounded-xl mb-3"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && <p className="text-blue-500 text-xs mt-2">Uploading...</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Technology"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Tags
                <span className="text-gray-400 font-normal ml-2 text-xs">(Enter ya comma dabao add karne ke liye)</span>
              </label>
              <div className="w-full min-h-12 p-3 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 flex flex-wrap gap-2 items-center cursor-text">
                {tags.map((tag, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-400 hover:text-blue-700 font-bold ml-1 leading-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder={tags.length === 0 ? 'React, Next.js, Node.js...' : ''}
                  className="flex-1 min-w-32 outline-none text-sm p-1 bg-transparent"
                />
              </div>
              {tags.length > 0 && (
                <p className="text-xs text-gray-400 mt-1">{tags.length}/10 tags • Backspace se last tag delete hoga</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                placeholder="Write your content here..."
              />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}