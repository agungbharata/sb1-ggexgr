import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import InvitationPage from './pages/InvitationPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/:invitationSlug" element={<InvitationPage />} />
    </Routes>
  );
}

export default App;