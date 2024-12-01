import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Bell, Settings, User, ChevronDown, LogOut, Home, Mail, Music, Image, Plus } from 'react-feather';

const AdminNavbar: React.FC = () => {
  const { signOut, user } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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

  return (
    <nav className="bg-white shadow-md">
      <div className="px-4 mx-auto max-w-full sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/dashboard" className="text-xl font-bold text-primary hover:text-secondary">
                WeddingGas
              </Link>
            </div>
            
            {/* Navigation Menu */}
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/dashboard')
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Home className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/dashboard/invitations"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/dashboard/invitations')
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Mail className="w-4 h-4 mr-2" />
                Invitations
              </Link>
              <Link
                to="/dashboard/invitations/new"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/dashboard/invitations/new')
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Invitation
              </Link>
              <Link
                to="/dashboard/gallery"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/dashboard/gallery')
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Image className="w-4 h-4 mr-2" />
                Gallery
              </Link>
              <Link
                to="/dashboard/music"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  isActive('/dashboard/music')
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Music className="w-4 h-4 mr-2" />
                Music
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
    </nav>
  );
};

export default AdminNavbar;
