import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import EditProfile from './pages/profile/EditProfile'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import InvitationPage from './pages/InvitationPage'
import InvitationForm from './pages/InvitationForm'
import MusicLibrary from './pages/MusicLibrary'
import PrivateRoute from './components/PrivateRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password" element={<ResetPassword />} />
          
          {/* Protected Dashboard Routes */}
          <Route path="/" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/admin" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
          
          <Route path="/invitation/new" element={
            <PrivateRoute>
              <InvitationForm />
            </PrivateRoute>
          } />
          
          <Route path="/invitation/edit/:id" element={
            <PrivateRoute>
              <InvitationForm />
            </PrivateRoute>
          } />
          
          <Route path="/music-library" element={
            <PrivateRoute>
              <MusicLibrary />
            </PrivateRoute>
          } />
          
          <Route path="/profile/edit" element={
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          } />
          
          {/* Public Routes */}
          <Route path="/invitation/:invitationSlug" element={<InvitationPage />} />
          
          {/* Catch-all Route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App