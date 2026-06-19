// app/verify-otp/page.js
'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [tempToken, setTempToken] = useState('');

  // Register page se data le rahe hain
  useEffect(() => {
    const savedEmail = localStorage.getItem('emailForVerify');
    const savedToken = localStorage.getItem('tempToken');

    if (savedEmail && savedToken) {
      setEmail(savedEmail);
      setTempToken(savedToken);
    } else {
      // Agar data nahi mila to wapas register pe bhej do
      window.location.href = '/register';
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (otp.length !== 6) {
      setMessage('Please enter full 6-digit OTP');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await axios.post('http://localhost:4000/api/auth/verify-otp', {
        email: email,
        otp: otp,
        tempToken: tempToken
      });

      // Success
      localStorage.setItem('token', response.data.token);
      localStorage.removeItem('tempToken');
      localStorage.removeItem('emailForVerify');

      setMessage('Account verified successfully! Redirecting to home...');

      // 1.5 second baad blog home page pe redirect
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);

    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.error || 'Invalid OTP or expired token. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-zinc-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
            <p className="text-gray-600 mt-3">
              We sent a 6-digit code to<br />
              <span className="font-medium text-blue-600 break-all">{email}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="w-full text-center text-5xl tracking-[15px] font-mono py-6 border border-gray-300 rounded-2xl focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            {message && (
              <p className={`text-center text-sm font-medium ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={22} />
                  Verifying OTP...
                </>
              ) : (
                'VERIFY OTP'
              )}
            </button>
          </form>

          <div className="text-center mt-6">
            <button
              onClick={() => window.location.href = '/register'}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Back to Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}