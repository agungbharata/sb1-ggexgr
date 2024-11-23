import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import Invitation from './pages/Invitation';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/:slug" element={<Invitation />} />
    </Routes>
  );
}

export default App;