'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function NewPostPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Technology');
  const [featuredImage, setFeaturedImage] = useState(null);

  const [aiLoading, setAiLoading] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [hasActivePlan, setHasActivePlan] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Check user subscription status
  useEffect(() => {
    checkUserPlan();
  }, []);

  const checkUserPlan = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/user/plan", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHasActivePlan(res.data.hasActivePlan || false);
    } catch (err) {
      setHasActivePlan(false);
    }
  };

  // Generate with AI
  const generateWithAI = async () => {
    if (!title.trim()) {
      alert("Please enter post title first!");
      return;
    }

    if (!hasActivePlan) {
      setShowPricing(true);
      return;
    }

    setAiLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/ai/generate",
        { title, category },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        setContent(res.data.data.content);
        alert("✅ AI ne blog successfully likh diya!");
      }
    } catch (error) {
      alert(error.response?.data?.message || "AI generation failed");
    } finally {
      setAiLoading(false);
    }
  };

  // Buy Plan
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
      alert("Payment page nahi khul saka");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Add New Post</h1>

        <div className="flex gap-3">
          <button className="px-5 py-2 border border-gray-300 rounded-lg font-medium">
            Save as Draft
          </button>

          <button
            onClick={generateWithAI}
            disabled={aiLoading || !title.trim()}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover:brightness-105 disabled:opacity-50 flex items-center gap-2"
          >
            {aiLoading ? "🤖 Generating..." : "✨ Generate with AI"}
          </button>

          <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
            Publish
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Post Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter post title"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cover Image</label>
          <input
            type="file"
            onChange={(e) => setFeaturedImage(e.target.files?.[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="AI generated content yahan dikhega..."
            className="w-full h-96 p-5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Pricing Modal */}
      {showPricing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl">
            <h2 className="text-3xl font-bold text-center mb-2">Choose Your Plan</h2>
            <p className="text-center text-gray-600 mb-8">Unlock AI Blog Writing</p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Basic Plan */}
              <div className="border rounded-2xl p-8 hover:border-blue-500 transition-all">
                <h3 className="text-2xl font-semibold">Basic Plan</h3>
                <p className="text-4xl font-bold mt-4">$5<span className="text-lg font-normal">/month</span></p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li>✓ 20 AI Generations/month</li>
                  <li>✓ Basic Support</li>
                  <li>✓ Standard Speed</li>
                </ul>
                <button
                  onClick={() => buyPlan('basic')}
                  className="w-full mt-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                >
                  Subscribe - $5/month
                </button>
              </div>

              {/* Premium Plan */}
              <div className="border-2 border-blue-600 rounded-2xl p-8 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">Popular</div>
                <h3 className="text-2xl font-semibold">Premium Plan</h3>
                <p className="text-4xl font-bold mt-4">$15<span className="text-lg font-normal">/month</span></p>
                <ul className="mt-6 space-y-3 text-sm">
                  <li>✓ Unlimited AI Generations</li>
                  <li>✓ Priority Support</li>
                  <li>✓ Fast Generation</li>
                </ul>
                <button
                  onClick={() => buyPlan('premium')}
                  className="w-full mt-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
                >
                  Subscribe - $15/month
                </button>
              </div>
            </div>

            <button 
              onClick={() => setShowPricing(false)}
              className="mt-6 text-gray-500 underline block mx-auto"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}