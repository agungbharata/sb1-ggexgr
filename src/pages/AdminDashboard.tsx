import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import InvitationForm from '../components/InvitationForm';
import InvitationPreview from '../components/InvitationPreview';
import AdminPanel from '../components/AdminPanel';
import DashboardLayout from '../components/DashboardLayout';
import type { InvitationData } from '../types';

export default function AdminDashboard() {
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

  const handleFormUpdate = (data: InvitationData) => {
    setFormData(data);
  };

  const handleEdit = (invitation: InvitationData) => {
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

        {currentView === 'create' ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Preview Section */}
            <div className="order-2 space-y-6 lg:order-1">
              <div className="sticky top-8">
                <h2 className="mb-6 text-xl font-semibold text-gray-900">Preview</h2>
                <div className="overflow-hidden bg-white rounded-lg shadow-lg">
                  <InvitationPreview invitation={formData} />
                </div>
              </div>
            </div>

            {/* Form Section */}
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
      </div>
    </DashboardLayout>
  );
}