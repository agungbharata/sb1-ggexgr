import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../components/admin/AdminNavbar';

const AdminLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      <main className="min-h-[calc(100vh-4rem)]">
        <div className="w-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
