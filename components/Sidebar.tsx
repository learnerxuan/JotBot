// components/Sidebar.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router'; // Import useRouter to get active path

interface SidebarProps {
  userId: string | null;
  isAuthReady: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ userId, isAuthReady }) => {
  const router = useRouter(); // Get the current router object
  const activePage = router.pathname.split('/')[1] || 'journal'; // Determine active page from URL

  const navItems = [
    { id: 'journal', name: 'Journal', icon: '📝', path: '/journal' },
    { id: 'garden', name: 'Emotion Garden', icon: '🌳', path: '/garden' },
    // Hidden for hackathon scope - but keeping file structure:
    // { id: 'circles', name: 'Support Circles', icon: '💬', path: '/circles' },
    // { id: 'prompts', name: 'Mindful Moments', icon: '💡', path: '/prompts' },
  ];

  return (
    <div className="w-full md:w-64 bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 md:p-8 rounded-lg shadow-xl m-2">
      <h2 className="text-3xl font-extrabold mb-8 text-center tracking-tight">MoodLingo</h2>
      <nav>
        {navItems.map((item) => (
          <Link href={item.path} key={item.id} passHref>
            <button
              className={`
                flex items-center w-full px-4 py-3 mb-4 rounded-xl text-lg font-medium transition-all duration-300
                ${activePage === item.id ? 'bg-white text-indigo-700 shadow-md transform scale-105' : 'hover:bg-indigo-700 hover:shadow-lg'}
              `}
            >
              <span className="text-2xl mr-4">{item.icon}</span>
              {item.name}
            </button>
          </Link>
        ))}
      </nav>
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