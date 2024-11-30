import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { userRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/invitations', label: 'Invitations', icon: '💌' },
    { path: '/music', label: 'Music', icon: '🎵' },
    { path: '/gallery', label: 'Gallery', icon: '🖼️' },
    { path: '/guests', label: 'Guests', icon: '👥' },
    { path: '/settings', label: 'Settings', icon: '⚙️' },
  ];

  if (userRole === 'admin') {
    menuItems.push({ path: '/admin', label: 'Admin', icon: '🔑' });
  }

  return (
    <aside className="w-64 h-screen bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-200">
      <nav className="h-full px-4 py-6">
        <div className="space-y-4">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 group
                ${
                  isActive(item.path)
                    ? 'bg-[#D4B996] text-white shadow-md'
                    : 'text-[#8B7355] hover:bg-[#F5E9E2] hover:text-[#D4B996]'
                }`}
            >
              <span className="mr-3 text-xl group-hover:scale-110 transition-transform duration-200">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
              {isActive(item.path) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          ))}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
