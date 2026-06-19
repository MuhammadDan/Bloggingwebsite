'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (sessionId) {
      verifyPayment();
    }
  }, [sessionId]);

  const verifyPayment = async () => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:4000/api/payment/verify', 
        { sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess(true);
      
      // ==================== UPDATED PART ====================
      setTimeout(() => {
        localStorage.setItem('hasActivePlan', 'true');   // ← Yeh line add ki
        router.push('/dashboard/articles/new');         // New Post page pe wapas
      }, 2500);

    } catch (error) {
      console.error(error);
      alert("Payment does not verify");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center bg-white p-10 rounded-2xl shadow-lg max-w-md">
        {loading ? (
          <div>
            <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            <h2 className="text-2xl font-semibold mt-6">Verifying Payment...</h2>
          </div>
        ) : success ? (
          <div>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-600 mt-4">Congrats! AI Feature activated...</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting back to New Post...</p>
          </div>
        ) : (
          <div>
            <h2 className="text-red-600 text-2xl">Something went wrong</h2>
          </div>
        )}
      </div>
    </div>
  );
}