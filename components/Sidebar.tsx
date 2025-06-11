// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface SidebarProps {
  userId: string | null;
  isAuthReady: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userId, isAuthReady }) => {
  const router = useRouter();

  const getActivePageId = (pathname: string): string => {
    if (pathname === '/') return 'home';
    const parts = pathname.split('/');
    if (parts[1] && ['journal', 'garden', 'circles', 'prompts'].includes(parts[1])) {
      return parts[1];
    }
    return 'home';
  };

  const activePageId = getActivePageId(router.pathname);

  const navItems = [
    { id: 'home', name: 'HomePage', icon: '🏠', path: '/', gradient: 'from-blue-400 to-blue-600' },
    { id: 'journal', name: 'Journal', icon: '📝', path: '/journal', gradient: 'from-purple-400 to-purple-600' },
    { id: 'garden', name: 'Emotion Garden', icon: '🌳', path: '/garden', gradient: 'from-green-400 to-green-600' },
    // { id: 'circles', name: 'Support Circles', icon: '💬', path: '/circles', gradient: 'from-pink-400 to-pink-600' },
    // { id: 'prompts', name: 'Mindful Moments', icon: '💡', path: '/prompts', gradient: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="w-full md:w-72 bg-white/10 backdrop-blur-xl border border-white/20 text-white p-6 md:p-8 rounded-2xl shadow-2xl m-2 flex flex-col justify-between relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/80 via-purple-600/80 to-pink-500/80 animate-gradient-x"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/40 via-transparent to-cyan-400/40 animate-pulse"></div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-xl">
            <span className="text-3xl">🤖</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent tracking-tight">
            JotBot
          </h2>
          <p className="text-sm text-white/70 mt-1 font-medium">Smart Emotional Journal</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-3">
          {navItems.map((item, index) => (
            <Link href={item.path} key={item.id} passHref legacyBehavior>
              <a
                className={`
                  group relative flex items-center w-full px-4 py-4 rounded-xl text-base font-semibold 
                  transition-all duration-300 ease-out cursor-pointer no-underline
                  transform hover:scale-105 hover:-translate-y-1
                  focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-transparent
                  ${activePageId === item.id
                    ? 'bg-white/20 backdrop-blur-md shadow-xl border border-white/30 text-white scale-105'
                    : 'text-white/90 hover:bg-white/10 hover:backdrop-blur-md hover:shadow-lg hover:border hover:border-white/20'
                  }
                `}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                {/* Active indicator */}
                {activePageId === item.id && (
                  <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-white to-blue-200 rounded-r-full shadow-lg"></div>
                )}
                
                {/* Icon container with gradient background */}
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-lg mr-4 
                  bg-gradient-to-br ${item.gradient} shadow-lg
                  group-hover:shadow-xl group-hover:scale-110 transition-all duration-300
                `}>
                  <span className="text-xl filter drop-shadow-sm">{item.icon}</span>
                </div>
                
                <span className="flex-1 group-hover:translate-x-1 transition-transform duration-300">
                  {item.name}
                </span>
                
                {/* Hover arrow */}
                <div className="opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            </Link>
          ))}
        </nav>
      </div>

      {/* User Info Section */}
      {isAuthReady && userId && (
        <div className="relative z-10 mt-8 pt-6 border-t border-white/20">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-sm">👤</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Connected</p>
                <p className="text-xs text-white/70">Active Session</p>
              </div>
            </div>
            <div className="text-xs text-white/60">
              <p className="mb-1">User ID:</p>
              <div className="bg-black/20 backdrop-blur-sm rounded-lg px-3 py-2 font-mono text-xs break-all border border-white/10">
                {userId.length > 20 ? `${userId.substring(0, 20)}...` : userId}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-full blur-lg"></div>
    </div>
  );
};

export default Sidebar;