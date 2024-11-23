import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import InvitationForm from '../components/InvitationForm';
import InvitationPreview from '../components/InvitationPreview';
import AdminPanel from '../components/AdminPanel';
import type { InvitationData } from '../types';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<'create' | 'admin'>('create');
  const [formData, setFormData] = useState<InvitationData>({
    brideNames: '',
    groomNames: '',
    date: '',
    time: '',
    venue: '',
    message: '',
    openingText: 'Together with their families',
    invitationText: 'Request the pleasure of your company',
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
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="w-6 h-6 text-pink-500 mr-2" />
              <h1 className="text-2xl font-semibold text-gray-900">Wedding Invitation Builder</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  setCurrentView('create');
                  if (!isEditing) {
                    setFormData({
                      brideNames: '',
                      groomNames: '',
                      date: '',
                      time: '',
                      venue: '',
                      message: '',
                      openingText: 'Together with their families',
                      invitationText: 'Request the pleasure of your company',
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

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {currentView === 'create' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Preview Section - Sekarang di sebelah kiri */}
            <div className="space-y-6 order-2 lg:order-1">
              <div className="sticky top-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Preview</h2>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <InvitationPreview invitation={formData} />
                </div>
              </div>
            </div>

            {/* Form Section - Sekarang di sebelah kanan */}
            <div className="space-y-6 order-1 lg:order-2">
              <div className="bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
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