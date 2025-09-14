'use client';

import RoleGuard from '@/components/RoleGuard';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/utils/axiosInstance';

interface UserStats {
  level: number;
  xp: number;
  xpToNext: number;
  streak: number;
  completedModules: number;
  totalModules: number;
  achievements: string[];
}

interface UserRank {
  rank: number;
  xp: number;
  name: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export default function CitizenDashboard() {
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    xpToNext: 100,
    streak: 0,
    completedModules: 0,
    totalModules: 0,
    achievements: [],
  });
  const [userRank, setUserRank] = useState<UserRank | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [particles, setParticles] = useState<Particle[]>([]);

  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('access_token')
      : null;

  const fetchUserProgress = async () => {
    setLoading(true);
    try {
      // fetch progress
      const res = await api.get('/training/user/progress', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const progress = res.data;
      setUserStats({
        level: progress.level || 1,
        xp: progress.xp || 0,
        xpToNext: progress.xpToNext || 100,
        streak: progress.streak || 0,
        completedModules: progress.completedModules || 0,
        totalModules: progress.totalModules || 0,
        achievements: progress.achievements || [],
      });

      // fetch rank (new addition)
      const rankRes = await api.get('/training/leaderboard/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserRank(rankRes.data);

      setError('');
    } catch (err: any) {
      setError('Failed to load progress data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProgress();

    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
    }));
    setParticles(newParticles);
  }, []);

  const xpPercentage = (userStats.xp / userStats.xpToNext) * 100;
  const moduleProgress =
    userStats.totalModules > 0
      ? (userStats.completedModules / userStats.totalModules) * 100
      : 0;

  if (loading) {
    return (
      <RoleGuard role="CITIZEN">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="game-card p-8 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white text-xl">Loading your progress...</p>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error) {
    return (
      <RoleGuard role="CITIZEN">
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
          <div className="game-card p-8 text-center border-red-500/50 bg-red-900/20">
            <p className="text-red-400 text-xl mb-4">{error}</p>
            <button
              onClick={fetchUserProgress}
              className="game-button px-6 py-3"
            >
              Retry
            </button>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard role="CITIZEN">
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Floating Particles */}
        <div className="particles">
          {particles.map((p) => (
            <div
              key={p.id}
              className="particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-6 space-y-8">
          {/* Header with Stats */}
          <div className="slide-in-up">
            <div className="game-card p-8">
              <div className="flex flex-col lg:flex-row items-center justify-between space-y-6 lg:space-y-0">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Welcome back,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                      Eco Champion!
                    </span>
                  </h1>
                  <p className="text-gray-300 text-lg">
                    Ready to level up your environmental impact? 🌱
                  </p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="level-badge text-xl px-4 py-2">
                      Level {userStats.level}
                    </div>
                  </div>
                  <div className="streak-counter">
                    🔥 {userStats.streak} Day Streak
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white font-semibold">
                    Experience Points
                  </span>
                  <span className="text-purple-300">
                    {userStats.xp} / {userStats.xpToNext} XP
                  </span>
                </div>
                <div className="xp-bar">
                  <div
                    className="xp-fill"
                    style={{ width: `${xpPercentage}%` }}
                  />
                </div>
              </div>

              {/* My Rank (new section) */}
              {userRank && (
                <div className="mt-6">
                  <h3 className="text-white font-semibold mb-2">
                    Your Current Rank
                  </h3>
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-purple-500/30">
                    <span className="text-purple-300 font-bold text-lg">
                      #{userRank.rank}
                    </span>
                    <span className="text-white">
                      {userRank.name} ({userRank.xp} XP)
                    </span>
                  </div>
                </div>
              )}

              {/* Achievements */}
              <div className="mt-6">
                <h3 className="text-white font-semibold mb-3">
                  Recent Achievements
                </h3>
                {userStats.achievements.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {userStats.achievements.map((a, i) => (
                      <div key={i} className="achievement-badge">
                        🏆 {a}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm italic">
                    Complete your first module to unlock achievements!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 slide-in-left">
            {/* Modules */}
            <div className="game-card p-6 text-center">
              <div className="text-4xl mb-3">📚</div>
              <div className="text-2xl font-bold text-white mb-1">
                {userStats.completedModules}/{userStats.totalModules}
              </div>
              <div className="text-gray-300">Modules Completed</div>
              <div className="mt-3 w-full bg-slate-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${moduleProgress}%` }}
                />
              </div>
            </div>

            {/* XP */}
            <div className="game-card p-6 text-center">
              <div className="text-4xl mb-3">⚡</div>
              <div className="text-2xl font-bold text-white mb-1">
                {userStats.xp}
              </div>
              <div className="text-gray-300">Total XP Earned</div>
              <div className="mt-3 text-sm text-purple-300">
                {userStats.xp > 0
                  ? `Level ${userStats.level} Eco Champion!`
                  : 'Start learning to earn XP!'}
              </div>
            </div>

            {/* Streak */}
            <div className="game-card p-6 text-center">
              <div className="text-4xl mb-3">🎯</div>
              <div className="text-2xl font-bold text-white mb-1">
                {userStats.streak}
              </div>
              <div className="text-gray-300">Day Streak</div>
              <div className="mt-3 text-sm text-green-300">
                {userStats.streak > 0
                  ? 'Keep it up!'
                  : 'Start your streak today!'}
              </div>
            </div>
          </div>

          {/* Main Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 slide-in-right">
            {/* Training Quest */}
            <div
              className="game-card p-8 cursor-pointer group hover:scale-105 transition-all duration-500"
              onClick={() => router.push('/auth/dashboard/citizen/training')}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    🎮 Training Quest
                  </h2>
                  <p className="text-gray-300">
                    Continue your learning adventure
                  </p>
                </div>
                <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                  🚀
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white">Progress</span>
                  <span className="text-purple-300">
                    {moduleProgress.toFixed(0)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
                <div className="text-sm text-gray-400">
                  {userStats.totalModules - userStats.completedModules} modules
                  remaining
                </div>
              </div>

              {userStats.totalModules > 0 ? (
                <div className="mt-6">
                  <button
                    className="game-button w-full py-4 text-lg font-bold"
                    onClick={() => router.push('/auth/dashboard/citizen/training')}
                  >
                    Continue Learning Journey →
                  </button>
                </div>
              ) : (
                <div className="mt-6">
                  <div className="text-center text-gray-400 text-sm mb-4">
                    No training modules available yet
                  </div>
                  <button
                    className="game-button-secondary w-full py-4 text-lg font-bold"
                    onClick={fetchUserProgress}
                  >
                    Refresh
                  </button>
                </div>
              )}
            </div>

            {/* Daily Challenges */}
            <div className="game-card p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">
                    ⚔️ Daily Challenges
                  </h2>
                  <p className="text-gray-300">Complete today's missions</p>
                </div>
                <div className="text-6xl">🎯</div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-green-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                      1
                    </div>
                    <span className="text-white">Complete 1 Quiz</span>
                  </div>
                  <div className="text-green-400 font-bold">+50 XP</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-yellow-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                      3
                    </div>
                    <span className="text-white">Watch 3 Videos</span>
                  </div>
                  <div className="text-yellow-400 font-bold">+30 XP</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-purple-500/30">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
                      5
                    </div>
                    <span className="text-white">Review 5 Flashcards</span>
                  </div>
                  <div className="text-purple-400 font-bold">+25 XP</div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  className="game-button-secondary w-full py-4 text-lg font-bold"
                  onClick={() => router.push('/auth/dashboard/citizen/training')}
                >
                  Start Challenges 🎮
                </button>
              </div>
            </div>
          </div>

          {/* Live Asset Tracker - NEW SECTION */}
          <div
            className="game-card p-8 cursor-pointer group hover:scale-105 transition-all duration-500"
            onClick={() => {
              console.log('Redirecting to live asset tracker...');
              router.push('/auth/dashboard/citizen/track-assets');
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  🚚 Live Asset Tracker
                </h2>
                <p className="text-gray-300">
                  View waste collection vehicles and public facilities in real-time
                </p>
              </div>
              <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                🗺️
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Click to view real-time locations of waste vehicles and facilities.
            </div>
          </div>

          {/* Civic Reporting */}
          <div
            className="game-card p-8 cursor-pointer group hover:scale-105 transition-all duration-500"
            onClick={() => {
              console.log('Redirecting to civic-report...');
              router.push('/auth/dashboard/citizen/civic-report');
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  🏛️ Civic Reporting
                </h2>
                <p className="text-gray-300">
                  Report local issues and support community action
                </p>
              </div>
              <div className="text-6xl group-hover:scale-110 transition-transform duration-300">
                📍
              </div>
            </div>
            <div className="text-gray-400 text-sm">
              Click to view map, submit issues, and support reports.
            </div>
          </div>

          {/* Leaderboard CTA */}
          <div className="slide-in-up">
            <div className="game-card p-8 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                🌟 See Where You Stand
              </h2>
              <p className="text-gray-300 mb-6">
                Check the leaderboard to compare your progress with other Eco
                Champions!
              </p>
              <button
                className="game-button px-8 py-4 text-lg font-bold"
                onClick={() => router.push('/auth/dashboard/citizen/leaderboard')}
              >
                View Leaderboard →
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
