import React, { useEffect, useState } from 'react';
import { ReactNode } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import DebugPanel from './DebugPanel';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { currentUser, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const [isInitialized, setIsInitialized] = useState(false);

  console.log('DashboardLayout render:', { currentUser, userRole, loading, isInitialized });

  useEffect(() => {
    console.log('DashboardLayout useEffect:', { currentUser, userRole, loading });
    
    if (!loading) {
      if (!currentUser) {
        console.log('No user found, redirecting to login');
        navigate('/login');
      }
      setIsInitialized(true);
    }
  }, [currentUser, loading, navigate]);

  if (loading || !isInitialized) {
    console.log('DashboardLayout showing loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <DebugPanel />
      </div>
    );
  }

  if (!currentUser) {
    console.log('DashboardLayout no user, returning null');
    return <DebugPanel />;
  }

  console.log('DashboardLayout rendering main content');
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF3E0] via-white to-[#F5E9E2]">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 transition-all duration-200 ease-in-out">
          <div className="mx-auto max-w-7xl">
            <div className="bg-white/80 backdrop-blur-sm shadow-lg rounded-xl p-6 transition-all duration-200 hover:shadow-xl">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </div>
          </div>
        </main>
      </div>
      <DebugPanel />
    </div>
  );
};

export default DashboardLayout;
