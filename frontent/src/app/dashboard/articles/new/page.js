// src/app/dashboard/articles/new/page.js
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import PricingModal from '../../../../components/PricingModal';   // ← Import yahan karo

export default function NewArticlePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [featuredImageUrl, setFeaturedImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');

  const token = typeof window !== "undefined" ? localStorage.getItem('token') : null;

  // Check User Plan (Subscription)
  useEffect(() => {
    checkUserPlan();
  }, []);

  const checkUserPlan = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/user/plan", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const isActive = res.data.hasActivePlan || false;
      setHasActivePlan(isActive);

      if (isActive) {
        localStorage.setItem('hasActivePlan', 'true');
      } else {
        localStorage.removeItem('hasActivePlan');
      }
    } catch (err) {
      console.error("Check User Plan Error:", err);
      const hasPlanInStorage = localStorage.getItem('hasActivePlan') === 'true';
      setHasActivePlan(hasPlanInStorage);
    }
  };

  // ✅ Tag handlers
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, '');
      if (newTag && !tags.includes(newTag) && tags.length < 10) {
        setTags([...tags, newTag]);
      }
      setTagInput('');
    }
    if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // ==================== AI GENERATION ====================
  const generateWithAI = async () => {
    if (!title.trim()) {
      alert("First write a blog title");
      return;
    }

    // Double Layer Protection
    const hasPlan = hasActivePlan || localStorage.getItem('hasActivePlan') === 'true';

    if (!hasPlan) {
      setShowPricing(true);
      return;
    }

    setAiLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/ai/generate",
        { title, category: category || "Technology" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setContent(res.data.data.content);
        alert("✅ Your blog has been generated through AI");
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  // ==================== BUY PLAN ====================
  const buyPlan = async (planType) => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/payment/create-session",
        { plan: planType },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      alert("Payment page does not open");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:4000/api/blog/articles/upload-image',  // ← SAHI ROUTE
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
          // Content-Type mat likho, axios khud set karta hai FormData ke liye
        }
      );

      setFeaturedImageUrl(res.data.imageUrl);  // ← imageUrl aa raha hai backend se
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error(error);
      alert('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (publish = false) => {
    if (!title || !content) {
      alert("Title and Content are necessary please fill this!");
      return;
    }

    setLoading(true);

    const payload = {
      title,
      content,
      category: category || null,
      published: publish,
      featuredImage: featuredImageUrl || null,
      tags: tags,
    };

    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:4000/api/blog/articles', payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      alert(publish ? 'Post Published Successfully!' : 'Draft Saved!');
      router.push('/');

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.error || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-white rounded-2xl shadow-sm p-5 sm:p-8">

          <div className="flex flex-col gap-4 mb-8 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-bold">Add New Post</h1>

            <div className="grid grid-cols-1 gap-3 w-full sm:flex sm:w-auto">
              <button
                onClick={() => handleSubmit(false)}
                disabled={loading}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 border rounded-lg text-sm sm:text-base whitespace-nowrap"
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </button>

              {/* ✨ Generate with AI Button */}
              <button
                onClick={generateWithAI}
                disabled={aiLoading || !title.trim()}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:brightness-105 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base whitespace-nowrap"
              >
                {aiLoading ? "🤖 Generating..." : "✨ Generate with AI"}
              </button>

              <button
                onClick={() => handleSubmit(true)}
                disabled={loading || !title || !content}
                className="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm sm:text-base whitespace-nowrap"
              >
                {loading ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            <div>
              <label className="block mb-2 font-medium text-sm sm:text-base">Post Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 border rounded-xl text-sm sm:text-base"
                placeholder="Enter post title"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm sm:text-base">Cover Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="block w-full text-xs sm:text-sm text-gray-500 file:mr-3 sm:file:mr-4 file:py-2 file:px-3 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploading && <p className="text-blue-500 mt-2 text-sm">Uploading...</p>}
              {featuredImageUrl && <p className="text-green-600 mt-2 text-sm">✓ Image Uploaded</p>}
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm sm:text-base">Category (Optional)</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 border rounded-xl text-sm sm:text-base"
                placeholder="Technology"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-sm sm:text-base">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full p-3 border rounded-xl text-sm sm:text-base"
                placeholder="Write your content here... "
              />
            </div>
          </div>
        </div>
      </div>
      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        onSelectPlan={buyPlan}
      />
    </div>
  );
}