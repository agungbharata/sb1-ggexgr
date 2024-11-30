import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Settings, User, ChevronDown, LogOut } from 'react-feather';

const AdminNavbar: React.FC = () => {
  const { signOut, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/dashboard" className="text-xl font-bold text-primary hover:text-secondary">
                WeddingGas Admin
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100">
              <Bell className="w-5 h-5" />
            </button>
            <Link 
              to="/dashboard/settings" 
              className="p-1 text-gray-500 rounded-full hover:text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <div className="relative">
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
                <div className="absolute right-0 z-10 py-1 mt-2 w-48 bg-white rounded-md border border-gray-200 shadow-lg">
                  <Link
                    to="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Your Profile
                  </Link>
                  <Link
                    to="/dashboard/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setIsUserMenuOpen(false);
                    }}
                    className="flex items-center px-4 py-2 space-x-2 w-full text-sm text-left text-primary hover:bg-gray-100"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
