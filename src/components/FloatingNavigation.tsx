import React from 'react';
import { Mail, Quote, Users, Handshake, GlassWater } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface FloatingNavigationProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

const FloatingNavigation: React.FC<FloatingNavigationProps> = ({ activeSection, onNavigate }) => {
  const navItems: NavItem[] = [
    { id: 'opening', label: 'Opening', icon: <Mail size={20} /> },
    { id: 'quotes', label: 'Quotes', icon: <Quote size={20} /> },
    { id: 'mempelai', label: 'Mempelai', icon: <Users size={20} /> },
    { id: 'akad', label: 'Akad', icon: <Handshake size={20} /> },
    { id: 'resepsi', label: 'Resepsi', icon: <GlassWater size={20} /> },
  ];

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg px-4 py-2 flex gap-4">
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center p-2 rounded-full transition-colors
            ${activeSection === item.id ? 'text-[#C1A87D]' : 'text-gray-500 hover:text-[#C1A87D]'}`}
        >
          {item.icon}
          <span className="text-xs mt-1">{item.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default FloatingNavigation;
