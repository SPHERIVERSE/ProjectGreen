'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaUserCircle } from 'react-icons/fa';
import api from '@/utils/axiosInstance';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setMessage('Please enter email and password');
    
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      console.log('Login response:', res.data);

      localStorage.setItem('access_token', res.data.access_token);
      localStorage.setItem('role', res.data.role);

      setMessage('Login successful!');

      // Redirect based on role
      setTimeout(() => {
        switch (res.data.role) {
          case 'CITIZEN':
            router.push('/auth/dashboard/citizen');
            break;
          case 'WORKER':
            router.push('/auth/dashboard/worker');
            break;
          case 'ADMIN':
            router.push('/auth/dashboard/admin');
            break;
          default:
            router.push('/auth/dashboard');
        }
      }, 1000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-green-950 text-white">
      <div className="max-w-2xl w-full space-y-8 p-10 backdrop-blur-md bg-white/10 rounded-3xl border border-gray-700 shadow-2xl transition-all duration-300 transform scale-95 hover:scale-100">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <FaUserCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-white">Welcome Back</h2>
          <p className="mt-2 text-gray-300 text-lg">Sign in to continue your journey with Project Clean India</p>
        </div>

        <form className="space-y-6" onSubmit={login}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link
              href="/auth/forgot-password"
              className="text-sm font-medium text-green-400 hover:text-green-300 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg transform hover:scale-105"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          {message && (
            <div className={`p-4 rounded-xl text-sm ${
              message.includes('successful')
                ? 'bg-green-700 text-green-100 border border-green-600'
                : 'bg-red-700 text-red-100 border border-red-600'
            }`}>
              {message}
            </div>
          )}
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-green-400 hover:text-green-300 font-medium transition-colors">
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

