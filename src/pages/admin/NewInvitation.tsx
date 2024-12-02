import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import TemplateSelector from '../../components/TemplateSelector';
import TimeZoneSelector from '../../components/TimeZoneSelector';
import type { InvitationData, TimeZone } from '../../types/invitation';
import { supabase } from '../../lib/supabase';
import { Smartphone, Monitor } from 'react-feather';
import toast from 'react-hot-toast';

const defaultFormData: InvitationData = {
  brideNames: '',
  groomNames: '',
  brideParents: '',
  groomParents: '',
  showAkad: true,
  akadDate: '',
  akadTime: '',
  akadVenue: '',
  showResepsi: true,
  resepsiDate: '',
  resepsiTime: '',
  resepsiVenue: '',
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

const initialData: InvitationData = {
  ...defaultFormData,
  showMusicLibrary: false,
  backgroundMusic: '',
  timezone: 'WIB' as TimeZone,
};

const NewInvitation: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<InvitationData>(initialData);
  const [saving, setSaving] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const deviceSizes = {
    mobile: { 
      frame: 'w-[375px] h-[812px]',
      scale: 'scale-[0.7] lg:scale-[0.8]'
    },
    tablet: { 
      frame: 'w-[768px] h-[1024px]',
      scale: 'scale-[0.65] lg:scale-[0.75]'
    },
    desktop: { 
      frame: 'w-[1200px] h-[750px]',
      scale: 'scale-[0.65] lg:scale-[0.75]'
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const user = supabase.auth.user();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('invitations')
        .insert([
          {
            ...formData,
            user_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success('Undangan berhasil dibuat!');
      navigate('/dashboard/invitations');
    } catch (error: any) {
      console.error('Error creating invitation:', error);
      toast.error('Gagal membuat undangan. Silakan coba lagi.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Preview Panel */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Preview</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-2 rounded ${
                    previewDevice === 'mobile'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-2 rounded ${
                    previewDevice === 'desktop'
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'hover:bg-gray-100 text-gray-600'
                  }`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className={`flex justify-center transition-all duration-300 ${deviceSizes[previewDevice].scale}`}>
              <div className={`bg-white shadow-lg rounded-lg overflow-hidden ${deviceSizes[previewDevice].frame}`}>
                <TemplateSelector
                  templateId={formData.theme}
                  data={formData}
                  isViewOnly={true}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Panel */}
        <div className="lg:w-1/2">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Detail Undangan</h2>
            <InvitationForm
              initialData={formData}
              onSubmit={handleSubmit}
              onChange={setFormData}
              isSubmitting={saving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewInvitation;
