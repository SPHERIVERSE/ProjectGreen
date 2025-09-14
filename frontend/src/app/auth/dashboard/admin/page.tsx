'use client';

import Link from 'next/link';
import RoleGuard from '@/components/RoleGuard';

export default function AdminDashboard() {
  return (
    <RoleGuard role="ADMIN">
      <div className="p-6 bg-gray-950 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-tremor-content-white">Admin Dashboard</h1>
        <p className="mb-8 text-gray-400">Welcome, Admin 👋</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/auth/dashboard/admin/training">
            <div className="p-6 bg-blue-900 rounded-xl shadow-lg hover:bg-blue-800 transition-colors duration-200 cursor-pointer">
              <h2 className="text-xl font-semibold">📚 Training Modules</h2>
              <p className="text-sm mt-2 text-gray-300">Manage modules, flashcards, videos, and quizzes.</p>
            </div>
          </Link>

          <Link href="/auth/dashboard/admin/users">
            <div className="p-6 bg-green-900 rounded-xl shadow-lg hover:bg-green-800 transition-colors duration-200 cursor-pointer">
              <h2 className="text-xl font-semibold">👥 Users</h2>
              <p className="text-sm mt-2 text-gray-300">View and manage all registered users.</p>
            </div>
          </Link>

          <Link href="/auth/dashboard/admin/reports">
            <div className="p-6 bg-yellow-900 rounded-xl shadow-lg hover:bg-yellow-800 transition-colors duration-200 cursor-pointer">
              <h2 className="text-xl font-semibold">📊 Reports</h2>
              <p className="text-sm mt-2 text-gray-300">View and manage civic reports submitted by citizens.</p>
            </div>
          </Link>

          <Link href="/auth/dashboard/admin/assets">
            <div className="p-6 bg-purple-900 rounded-xl shadow-lg hover:bg-purple-800 transition-colors duration-200 cursor-pointer">
              <h2 className="text-xl font-semibold">📍 Manage Assets</h2>
              <p className="text-sm mt-2 text-gray-300">Add, edit, or delete public facilities and waste vehicles.</p>
            </div>
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}
