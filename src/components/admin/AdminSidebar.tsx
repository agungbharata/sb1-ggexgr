import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Mail, Settings, User, Music, Image, Plus } from 'react-feather';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    {
      path: '/dashboard/invitations',
      icon: Mail,
      label: 'Invitations',
      children: [
        { path: '/dashboard/invitations/new', icon: Plus, label: 'New Invitation' }
      ]
    },
    { path: '/dashboard/gallery', icon: Image, label: 'Gallery' },
    { path: '/dashboard/music', icon: Music, label: 'Music Library' },
    { path: '/dashboard/profile', icon: User, label: 'Profile' },
    { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
  ];

  const renderMenuItem = (item: any) => {
    const active = isActive(item.path);
    
    return (
      <div key={item.path}>
        <Link
          to={item.path}
          className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors duration-150 ${
            active
              ? 'text-gray-800 bg-primary-light'
              : 'text-gray-800 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <item.icon
            className={`mr-3 h-5 w-5 transition-colors duration-150 ${
              active
                ? 'text-gray-800'
                : 'text-gray-700 group-hover:text-gray-500'
            }`}
          />
          {item.label}
        </Link>
        
        {item.children && active && (
          <div className="ml-8 space-y-1">
            {item.children.map((child: any) => (
              <Link
                key={child.path}
                to={child.path}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  location.pathname === child.path
                    ? 'bg-primary-light text-gray-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <child.icon
                  className={`mr-3 h-4 w-4 ${
                    location.pathname === child.path
                      ? 'text-primary'
                      : 'text-gray-600 group-hover:text-gray-500'
                  }`}
                />
                {child.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside className="w-64 min-h-screen bg-white shadow-md">
      <div className="px-3 py-6">
        <nav className="space-y-1">
          {menuItems.map(renderMenuItem)}
        </nav>
      </div>
    </aside>
  );
};

export default AdminSidebar;
