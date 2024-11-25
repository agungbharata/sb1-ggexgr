import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ErrorBoundary from './ErrorBoundary';
import DebugPanel from './DebugPanel';

interface DashboardLayoutProps {
  children: React.ReactNode;
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
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <DebugPanel />
    </div>
  );
};

export default DashboardLayout;
