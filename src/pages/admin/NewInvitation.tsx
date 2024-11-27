import React from 'react';
import { useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import type { InvitationData } from '../../types/invitation';

const initialData: InvitationData = {
  brideNames: '',
  groomNames: '',
  date: '',
  time: '',
  venue: '',
  openingText: 'Bersama keluarga mereka',
  invitationText: 'Mengundang kehadiran Anda',
  gallery: [],
  socialLinks: [],
  bankAccounts: [],
  theme: 'default'
};

const NewInvitation: React.FC = () => {
  const navigate = useNavigate();

  const handleUpdate = async (data: InvitationData) => {
    // Handle form submission
    // This will be handled by the InvitationForm component internally
  };

  const handleChange = (data: InvitationData) => {
    // Handle form changes
    // This will be handled by the InvitationForm component internally
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Invitation</h1>
      <InvitationForm
        onUpdate={handleUpdate}
        onChange={handleChange}
        initialData={initialData}
        isEditing={false}
      />
    </div>
  );
};

export default NewInvitation;
