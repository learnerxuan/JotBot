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
    if (pathname === '/') return 'home'; // Special case for HomePage
    const parts = pathname.split('/');
    // Check if parts[1] exists and is one of our nav item IDs
    // Also handle dynamic routes like /journal/[id]
    if (parts[1] && ['journal', 'garden', 'circles', 'prompts'].includes(parts[1])) {
      return parts[1];
    }
    return 'home'; // Fallback to 'home' if no specific page part or unknown
  };

  const activePageId = getActivePageId(router.pathname);

  const navItems = [
    { id: 'home', name: 'HomePage', icon: '🏠', path: '/' },
    { id: 'journal', name: 'Journal', icon: '📝', path: '/journal' },
    { id: 'garden', name: 'Emotion Garden', icon: '🌳', path: '/garden' },
    // Hidden for hackathon scope - keeping these commented out or hidden via CSS for now.
    // { id: 'circles', name: 'Support Circles', icon: '💬', path: '/circles' },
    // { id: 'prompts', name: 'Mindful Moments', icon: '💡', path: '/prompts' },
  ];

  return (
    <div className="w-full md:w-64 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 md:p-8 rounded-lg shadow-xl m-2 flex flex-col justify-between relative z-20">
      <div>
        <h2 className="text-3xl font-extrabold mb-8 text-center tracking-tight">JotBot</h2>
        <nav>
          {navItems.map((item) => (
            <Link href={item.path} key={item.id} passHref legacyBehavior>
              <a
                role="button"
                tabIndex={0}
                className={`
                  flex items-center w-full px-4 py-3 mb-4 rounded-xl text-lg font-medium transition-all duration-300
                  cursor-pointer no-underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50
                  ${activePageId === item.id
                    ? 'bg-white text-gray-900 shadow-md transform scale-105'
                    : 'text-white hover:bg-indigo-700 hover:shadow-lg hover:text-white'
                  }
                `}
              >
                <span className="text-2xl mr-4">{item.icon}</span>
                {item.name}
              </a>
            </Link>
          ))}
        </nav>
      </div>

      {isAuthReady && userId && (
        <div className="mt-8 pt-4 border-t border-indigo-400 text-sm opacity-80 text-center break-words">
          <p>User ID:</p>
          <p className="font-mono text-xs mt-1 px-2 py-1 bg-indigo-700 rounded-md inline-block">{userId}</p>
        </div>
      )}
    </div>
  );
};

export default Sidebar;