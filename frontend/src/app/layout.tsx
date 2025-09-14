import React from 'react';

export const metadata = {
  title: 'Swachh-Vikas - Integrated Waste Management Platform',
  description: 'Transforming waste management through technology and community engagement',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" 
          rel="stylesheet" 
        />
        <style>
          {`
            body {
              font-family: 'Inter', sans-serif;
            }
            .eco-gradient-text {
              background: linear-gradient(45deg, #4ade80, #16a34a);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .eco-button-primary {
              background-color: #22c55e;
              color: white;
              transition: all 0.3s ease;
              font-weight: 600;
            }
            .eco-button-primary:hover {
              background-color: #16a34a;
            }
            .eco-button-secondary {
              background-color: #374151;
              color: #d1d5db;
              border: 1px solid #4b5563;
              transition: all 0.3s ease;
              font-weight: 600;
            }
            .eco-button-secondary:hover {
              background-color: #4b5563;
              color: white;
            }
            .eco-card {
              background-color: #1f2937;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 10px 15px rgba(0, 0, 0, 0.1);
              transition: all 0.3s ease;
              border: 1px solid #374151;
            }
            .eco-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 20px 25px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.1);
            }
            .pulse-green {
              animation: pulse-green 2s infinite cubic-bezier(0.4, 0, 0.6, 1);
            }
            @keyframes pulse-green {
              0%, 100% {
                box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7);
              }
              50% {
                box-shadow: 0 0 0 10px rgba(34, 197, 94, 0);
              }
            }
            .float-animation {
              animation: float 6s ease-in-out infinite;
            }
            @keyframes float {
              0% { transform: translateY(0px) rotate(0deg); }
              50% { transform: translateY(-20px) rotate(5deg); }
              100% { transform: translateY(0px) rotate(0deg); }
            }
          `}
        </style>
      </head>
      <body className="min-h-screen bg-gray-950 text-gray-300">
        <header className="bg-gray-900/90 backdrop-blur-lg shadow-xl border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  <a href="/" className="hover:text-green-400 transition-colors">
                    Swachh-Vikas
                  </a>
                </h1>
              </div>
              <nav>
                <ul className="flex space-x-4 sm:space-x-6">
                  <li><a href="/about" className="text-gray-400 hover:text-green-400 transition-colors font-medium">About</a></li>
                  <li><a href="/services" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Services</a></li>
                  <li><a href="/contact" className="text-gray-400 hover:text-green-400 transition-colors font-medium">Contact</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </header>
        <main className="flex-1 flex flex-col items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <footer className="bg-gray-900/90 backdrop-blur-lg text-gray-500 py-6 mt-12 border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            &copy; {new Date().getFullYear()} Swachh-Vikas. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
