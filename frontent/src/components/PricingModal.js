// src/components/PricingModal.js
'use client';

export default function PricingModal({ isOpen, onClose, onSelectPlan }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full mx-4 shadow-2xl">
        <h2 className="text-3xl font-bold text-center mb-2">Choose Your Plan</h2>
        <p className="text-center text-gray-600 mb-8">Unlock AI Blog Writing</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Plan */}
          <div className="border rounded-2xl p-8 hover:border-blue-500 transition">
            <h3 className="text-2xl font-semibold">Basic Plan</h3>
            <p className="text-4xl font-bold mt-4">$5<span className="text-lg font-normal">/month</span></p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>✓ 20 AI Generations/month</li>
              <li>✓ Standard Speed</li>
              <li>✓ Basic Support</li>
            </ul>
            <button
              onClick={() => onSelectPlan('basic')}
              className="w-full mt-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
              Subscribe - $5/month
            </button>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-blue-600 rounded-2xl p-8 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs px-4 py-1 rounded-full">Most Popular</div>
            <h3 className="text-2xl font-semibold">Premium Plan</h3>
            <p className="text-4xl font-bold mt-4">$15<span className="text-lg font-normal">/month</span></p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>✓ Unlimited AI Generations</li>
              <li>✓ Priority Support</li>
              <li>✓ Fast Generation</li>
            </ul>
            <button
              onClick={() => onSelectPlan('premium')}
              className="w-full mt-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700"
            >
              Subscribe - $15/month
            </button>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="mt-6 text-gray-500 underline block mx-auto"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}