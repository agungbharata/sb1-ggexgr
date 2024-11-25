import React, { useState, Suspense, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardLayout from '../components/DashboardLayout';
import type { InvitationData } from '../types';
import { useAuth } from '../contexts/AuthContext';

// Lazy load components
const InvitationForm = React.lazy(() => import('../components/InvitationForm'));
const InvitationPreview = React.lazy(() => import('../components/InvitationPreview'));
const AdminPanel = React.lazy(() => import('../components/AdminPanel'));

const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  console.error('AdminDashboard error:', error);
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Something went wrong</h2>
      <pre className="text-red-600 mb-4">{error.message}</pre>
      <button
        onClick={resetErrorBoundary}
        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
      >
        Try again
      </button>
    </div>
  );
};

export default function AdminDashboard() {
  const { currentUser, userRole, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'create' | 'admin'>('create');
  const [formData, setFormData] = useState<InvitationData>({
    id: '',
    brideNames: '',
    groomNames: '',
    date: '',
    time: '',
    venue: '',
    message: '',
    openingText: 'Bersama keluarga mereka',
    invitationText: 'Mengundang kehadiran Anda',
    gallery: [],
    bankAccounts: []
  });
  const [isEditing, setIsEditing] = useState(false);

  console.log('AdminDashboard render:', { currentUser, userRole, loading, currentView });

  useEffect(() => {
    console.log('AdminDashboard useEffect:', { currentUser, userRole, loading });
  }, [currentUser, userRole, loading]);

  const handleFormUpdate = (data: InvitationData) => {
    console.log('Form update:', data);
    setFormData(data);
  };

  const handleEdit = (invitation: InvitationData) => {
    console.log('Edit invitation:', invitation);
    setFormData(invitation);
    setIsEditing(true);
    setCurrentView('create');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => {
              console.log('Switching to create view');
              setCurrentView('create');
              if (!isEditing) {
                setFormData({
                  id: '',
                  brideNames: '',
                  groomNames: '',
                  date: '',
                  time: '',
                  venue: '',
                  message: '',
                  openingText: 'Bersama keluarga mereka',
                  invitationText: 'Mengundang kehadiran Anda',
                  gallery: [],
                  bankAccounts: []
                });
              }
            }}
            className={`px-4 py-2 rounded-md ${
              currentView === 'create'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isEditing ? 'Edit Undangan' : 'Buat Baru'}
          </button>
          <button
            onClick={() => {
              console.log('Switching to admin view');
              setCurrentView('admin');
              setIsEditing(false);
            }}
            className={`px-4 py-2 rounded-md ${
              currentView === 'admin'
                ? 'bg-primary text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            Daftar Undangan
          </button>
        </div>

        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            console.log('Resetting error boundary');
            setCurrentView('create');
            setIsEditing(false);
          }}
        >
          <Suspense fallback={<LoadingSpinner />}>
            {currentView === 'create' ? (
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <div className="order-2 space-y-6 lg:order-1">
                  <div className="sticky top-8">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">Preview</h2>
                    <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                      <InvitationPreview invitation={formData} />
                    </div>
                  </div>
                </div>

                <div className="order-1 space-y-6 lg:order-2">
                  <div className="p-6 bg-white rounded-lg shadow-lg">
                    <h2 className="mb-6 text-xl font-semibold text-gray-900">
                      {isEditing ? 'Edit Undangan' : 'Buat Undangan'}
                    </h2>
                    <InvitationForm
                      onUpdate={handleFormUpdate}
                      initialData={formData}
                      isEditing={isEditing}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <AdminPanel onEdit={handleEdit} />
            )}
          </Suspense>
        </ErrorBoundary>
      </div>
    </DashboardLayout>
  );
}