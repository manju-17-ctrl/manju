
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight gradient-text">DreamGen AI</span>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Showcase</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Pricing</a>
          <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Documentation</a>
        </nav>
        <div className="flex items-center gap-3">
          <button className="text-sm font-medium px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            Login
          </button>
        </div>
      </div>
    </header>
  );
};
