import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Settings, 
  Users, 
  Layout,
  Image,
  MessageSquare,
  Gift,
  Calendar
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    {
      name: 'Dashboard',
      icon: <Home className="w-5 h-5" />,
      path: '/dashboard'
    },
    {
      name: 'Template',
      icon: <Layout className="w-5 h-5" />,
      path: '/dashboard/templates'
    },
    {
      name: 'Galeri',
      icon: <Image className="w-5 h-5" />,
      path: '/dashboard/gallery'
    },
    {
      name: 'Tamu',
      icon: <Users className="w-5 h-5" />,
      path: '/dashboard/guests'
    },
    {
      name: 'Ucapan',
      icon: <MessageSquare className="w-5 h-5" />,
      path: '/dashboard/wishes'
    },
    {
      name: 'Hadiah',
      icon: <Gift className="w-5 h-5" />,
      path: '/dashboard/gifts'
    },
    {
      name: 'Acara',
      icon: <Calendar className="w-5 h-5" />,
      path: '/dashboard/events'
    },
    {
      name: 'Pengaturan',
      icon: <Settings className="w-5 h-5" />,
      path: '/dashboard/settings'
    }
  ];

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <Link to="/dashboard" className="flex items-center">
            <span className="text-xl font-bold text-primary">WalimahMe</span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${currentPath === item.path
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <p className="font-medium">Admin</p>
              <p className="text-sm text-gray-500">admin@walimahme.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
