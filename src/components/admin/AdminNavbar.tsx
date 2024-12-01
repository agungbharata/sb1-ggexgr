import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Settings, User, ChevronDown, LogOut, Home, Mail, Music, Image, Menu } from 'react-feather';

const AdminNavbar: React.FC = () => {
  const { signOut, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/dashboard/invitations', icon: Mail, label: 'Invitations' },
    { path: '/dashboard/gallery', icon: Image, label: 'Gallery' },
    { path: '/dashboard/music', icon: Music, label: 'Music' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 mx-auto w-full sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-xl font-bold text-primary hover:text-secondary">
                WeddingGas
              </Link>
            </div>
            
            {/* Desktop Navigation Menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    isActive(item.path)
                      ? 'text-gray-900 bg-gray-100'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-2" />
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Right Menu */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <button className="p-1 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100">
                <Bell className="w-5 h-5" />
              </button>
              <Link 
                to="/dashboard/settings" 
                className="p-1 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100"
              >
                <Settings className="w-5 h-5" />
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <Menu className="h-6 w-6" />
            </button>

            {/* User Menu (Desktop) */}
            <div className="hidden md:block relative">
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center px-3 py-2 space-x-2 text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-100"
              >
                <div className="flex justify-center items-center w-8 h-8 rounded-full bg-primary-light">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <span className="text-sm font-medium">{user?.email}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                  <Link
                    to="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span className="flex items-center">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-3 py-2 text-base font-medium rounded-md ${
                  isActive(item.path)
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            ))}
            <div className="border-t border-gray-200 my-2"></div>
            <Link
              to="/dashboard/settings"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Link>
            <Link
              to="/dashboard/profile"
              className="flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </Link>
            <button
              onClick={() => {
                handleSignOut();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 rounded-md hover:text-gray-900 hover:bg-gray-50"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
