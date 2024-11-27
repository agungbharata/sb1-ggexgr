import React from 'react';
import { useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import TemplateSelector from '../../components/TemplateSelector';
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
  const [formData, setFormData] = React.useState<InvitationData>(initialData);

  const handleUpdate = async (data: InvitationData) => {
    setFormData(data);
  };

  const handleChange = (data: InvitationData) => {
    setFormData(data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Invitation</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <InvitationForm
            onUpdate={handleUpdate}
            onChange={handleChange}
            initialData={initialData}
            isEditing={false}
          />
        </div>
        
        {/* Live Template Section */}
        <div className="w-full lg:w-1/2 sticky top-0 h-screen overflow-auto">
          <TemplateSelector
            templateId={formData.theme || 'javanese'}
            data={formData}
            isViewOnly={true}
          />
        </div>
      </div>
    </div>
  );
};

export default NewInvitation;
