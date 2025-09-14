'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/axiosInstance';
import { FaLock } from 'react-icons/fa';

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const sendOtp = async () => {
    if (!phone) return setMessage('Please enter your phone number');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { phone });
      setOtpSent(true);
      setMessage('OTP sent successfully!');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setMessage('Please enter OTP');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { phone, token: otp });
      if (!res.data.success) {
        setMessage('Invalid OTP');
        return;
      }
      setOtpVerified(true);
      setMessage('OTP verified! Now set your new password.');
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpVerified) return setMessage('Please verify OTP first');
    if (!newPassword || newPassword !== confirmPassword)
      return setMessage('Passwords do not match');

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { phone, newPassword });
      setMessage('Password reset successfully! Redirecting to login...');
      setTimeout(() => router.push('/auth/login'), 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-green-950 text-white">
      <div className="max-w-2xl w-full space-y-8 p-10 backdrop-blur-md bg-white/10 rounded-3xl border border-gray-700 shadow-2xl transition-all duration-300 transform scale-95 hover:scale-100">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <FaLock className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white">Reset Password</h2>
          <p className="mt-2 text-gray-300 text-lg">Enter your phone number to reset your password</p>
        </div>

        <form className="space-y-6" onSubmit={resetPassword}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Registered Phone Number</label>
              <div className="flex space-x-2">
                <input
                  type="tel"
                  placeholder="+91 1234567890"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={loading || otpSent}
                  className="px-4 py-3 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                >
                  {loading ? 'Sending...' : otpSent ? 'Sent' : 'Send OTP'}
                </button>
              </div>
            </div>

            {otpSent && !otpVerified && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Enter OTP</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    onClick={verifyOtp}
                    disabled={loading}
                    className="px-4 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

            {otpVerified && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-xl font-bold text-lg text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg transform hover:scale-105"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </>
            )}
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm ${
              message.includes('successful') || message.includes('verified')
                ? 'bg-green-700 text-green-100 border border-green-600'
                : 'bg-red-700 text-red-100 border border-red-600'
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Remembered your password?{' '}
            <Link href="/auth/login" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

