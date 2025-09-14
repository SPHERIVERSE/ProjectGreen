'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-700 rounded-full opacity-10 float-animation"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-green-800 rounded-full opacity-15 float-animation" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-40 left-20 w-24 h-24 bg-green-600 rounded-full opacity-5 float-animation" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-20 right-10 w-18 h-18 bg-green-900 rounded-full opacity-10 float-animation" style={{animationDelay: '0.5s'}}></div>
        </div>

        <div className={`relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gray-800 rounded-full text-green-400 text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Transforming India's Waste Management
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="eco-gradient-text">Swachh-Vikas</span>
            <br />
            <span className="text-gray-200">Starts Here</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join the revolution in waste management through our integrated platform that connects citizens, workers, and authorities for a cleaner, greener future.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link 
              href="/auth/register" 
              className="eco-button eco-button-primary text-lg px-8 py-4 pulse-green"
            >
              Start Your Journey
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/auth/login" 
              className="eco-button eco-button-secondary text-lg px-8 py-4"
            >
              Login
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="eco-card p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">10M+</div>
              <div className="text-gray-400">Tons of Waste Managed</div>
            </div>
            <div className="eco-card p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
              <div className="text-gray-400">Cities Connected</div>
            </div>
            <div className="eco-card p-6 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">1M+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Comprehensive Waste Management Solutions
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform integrates all stakeholders in the waste management ecosystem for maximum efficiency and environmental impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Citizen Features */}
            <div className="eco-card p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Citizen Engagement</h3>
              <p className="text-gray-400 mb-4">
                Report waste issues, schedule pickups, and earn rewards for responsible waste disposal practices.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Smart waste reporting</li>
                <li>• Pickup scheduling</li>
                <li>• Reward system</li>
                <li>• Educational resources</li>
              </ul>
            </div>

            {/* Worker Features */}
            <div className="eco-card p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Worker Efficiency</h3>
              <p className="text-gray-400 mb-4">
                Optimize routes, track collections, and manage tasks with our comprehensive worker dashboard.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Route optimization</li>
                <li>• Task management</li>
                <li>• Real-time tracking</li>
                <li>• Performance analytics</li>
              </ul>
            </div>

            {/* Authority Features */}
            <div className="eco-card p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Authority Control</h3>
              <p className="text-gray-400 mb-4">
                Monitor city-wide waste management, analyze trends, and make data-driven policy decisions.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• City-wide monitoring</li>
                <li>• Data analytics</li>
                <li>• Policy management</li>
                <li>• Resource allocation</li>
              </ul>
            </div>

            {/* Smart Technology */}
            <div className="eco-card p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Smart Technology</h3>
              <p className="text-gray-400 mb-4">
                AI-powered waste classification, IoT sensors, and predictive analytics for optimal operations.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• AI waste classification</li>
                <li>• IoT sensor integration</li>
                <li>• Predictive analytics</li>
                <li>• Automated reporting</li>
              </ul>
            </div>

            {/* Environmental Impact */}
            <div className="eco-card p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Environmental Impact</h3>
              <p className="text-gray-400 mb-4">
                Track carbon footprint reduction, recycling rates, and environmental benefits in real-time.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Carbon footprint tracking</li>
                <li>• Recycling analytics</li>
                <li>• Impact visualization</li>
                <li>• Sustainability reports</li>
              </ul>
            </div>

            {/* Community Building */}
            <div className="eco-card p-8 hover:shadow-2xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Community Building</h3>
              <p className="text-gray-400 mb-4">
                Foster community engagement through challenges, leaderboards, and collaborative initiatives.
              </p>
              <ul className="text-sm text-gray-500 space-y-2">
                <li>• Community challenges</li>
                <li>• Social leaderboards</li>
                <li>• Group initiatives</li>
                <li>• Educational campaigns</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Waste Management?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of citizens, workers, and authorities already making a difference in their communities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/auth/register" 
              className="bg-green-600 text-white hover:bg-green-700 font-semibold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Get Started Today
            </Link>
            <Link 
              href="/auth/login" 
              className="border-2 border-gray-500 text-gray-300 hover:bg-gray-700 hover:text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300"
            >
              Login
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
