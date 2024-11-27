import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';

// Public Pages
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import InvitationDisplay from './pages/public/InvitationDisplay';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminInvitations from './pages/admin/Invitations';
import AdminSettings from './pages/admin/Settings';
import AdminProfile from './pages/admin/Profile';
import InvitationForm from './pages/admin/InvitationForm';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/:slug" element={<InvitationDisplay />} />
            </Route>

            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/auth/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/auth/register" element={<PublicRoute><Register /></PublicRoute>} />
            </Route>

            {/* Admin Routes */}
            <Route path="/dashboard" element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="invitations" element={<AdminInvitations />} />
              <Route path="invitations/new" element={<InvitationForm />} />
              <Route path="invitations/edit/:id" element={<InvitationForm />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Redirect /login and /register to /auth/login and /auth/register */}
            <Route path="/login" element={<Navigate to="/auth/login" replace />} />
            <Route path="/register" element={<Navigate to="/auth/register" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </Router>
  );
}

export default App;