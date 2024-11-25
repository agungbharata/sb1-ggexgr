import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../config/supabase';

const DebugPanel = () => {
  const { currentUser, userRole, loading } = useAuth();

  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log('Current Session:', data.session, error);
  };

  const checkUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    console.log('Current User:', user, error);
  };

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-white rounded-lg shadow-lg max-w-sm z-50 text-sm">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-2">
        <p>Loading: {loading.toString()}</p>
        <p>User: {currentUser ? currentUser.email : 'null'}</p>
        <p>Role: {userRole || 'null'}</p>
        <div className="space-x-2 mt-2">
          <button
            onClick={checkSession}
            className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Check Session
          </button>
          <button
            onClick={checkUser}
            className="px-2 py-1 bg-green-500 text-white rounded text-xs"
          >
            Check User
          </button>
        </div>
      </div>
    </div>
  );
};

export default DebugPanel;
