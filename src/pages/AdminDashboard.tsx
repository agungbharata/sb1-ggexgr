import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import InvitationForm from '../components/InvitationForm';
import InvitationPreview from '../components/InvitationPreview';
import AdminPanel from '../components/AdminPanel';
import type { InvitationData } from '../types';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<'create' | 'admin'>('create');
  const [formData, setFormData] = useState<InvitationData>({
    id: '', // Add this line
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

  const handleFormUpdate = (data: InvitationData) => {
    setFormData(data);
  };

  const handleEdit = (invitation: InvitationData) => {
    setFormData(invitation);
    setIsEditing(true);
    setCurrentView('create');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-50">
      <header className="bg-white shadow-sm">
        <div className="px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Heart className="mr-2 w-6 h-6 text-pink-500" />
              <h1 className="text-2xl font-semibold text-gray-900">Walimah.Me</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setCurrentView('create');
                  if (!isEditing) {
                    setFormData({
                      id: '', // Add this line
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
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-pink-50'
                }`}
              >
                {isEditing ? 'Edit Invitation' : 'Create New'}
              </button>
              <button
                onClick={() => {
                  setCurrentView('admin');
                  setIsEditing(false);
                }}
                className={`px-4 py-2 rounded-md ${
                  currentView === 'admin'
                    ? 'bg-pink-500 text-white'
                    : 'bg-white text-gray-600 hover:bg-pink-50'
                }`}
              >
                Admin Panel
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {currentView === 'create' ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Preview Section - Sekarang di sebelah kiri */}
            <div className="order-2 space-y-6 lg:order-1">
              <div className="sticky top-8">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">Preview</h2>
                <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                  <InvitationPreview invitation={formData} />
                </div>
              </div>
            </div>

            {/* Form Section - Sekarang di sebelah kanan */}
            <div className="order-1 space-y-6 lg:order-2">
              <div className="p-6 bg-white rounded-lg shadow-lg">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">
                  {isEditing ? 'Edit Invitation' : 'Create Your Invitation'}
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
      </main>
    </div>
  );
}