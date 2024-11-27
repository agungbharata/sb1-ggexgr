import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Mail, Settings, User, Music, Image } from 'react-feather';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/invitations', icon: Mail, label: 'Invitations' },
    { path: '/dashboard/gallery', icon: Image, label: 'Gallery' },
    { path: '/dashboard/music', icon: Music, label: 'Music Library' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow-md min-h-screen">
      <nav className="mt-5 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md mb-1 ${
              isActive(item.path)
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon
              className={`mr-4 h-5 w-5 ${
                isActive(item.path)
                  ? 'text-emerald-500'
                  : 'text-gray-400 group-hover:text-gray-500'
              }`}
            />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
