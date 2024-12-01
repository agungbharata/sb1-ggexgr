import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import TemplateSelector from '../../components/TemplateSelector';
import TimeZoneSelector from '../../components/TimeZoneSelector';
import type { InvitationData, TimeZone } from '../../types/invitation';
import { supabase } from '../../lib/supabase';

const EditInvitation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!id) {
        navigate('/dashboard');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('invitations')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        if (!data) {
          throw new Error('Invitation not found');
        }

        setFormData(data);
      } catch (error) {
        console.error('Error loading invitation:', error);
        alert('Error loading invitation. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [id, navigate]);

  const handleUpdate = async (data: InvitationData) => {
    setFormData(data);
  };

  const handleChange = (data: InvitationData) => {
    setFormData(data);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Invitation not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Invitation</h1>
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form Section */}
        <div className="w-full lg:w-1/2">
          <InvitationForm
            onUpdate={handleUpdate}
            onChange={handleChange}
            initialData={formData}
            isEditing={true}
          >
            {/* Bride & Parents */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Pengantin Wanita</label>
                <input
                  type="text"
                  name="brideNames"
                  value={formData.brideNames}
                  onChange={handleFieldChange}
                  placeholder="Masukkan nama lengkap pengantin wanita"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Orang Tua Pengantin Wanita</label>
                <input
                  type="text"
                  name="brideParents"
                  value={formData.brideParents}
                  onChange={handleFieldChange}
                  placeholder="Contoh: Bapak Ahmad & Ibu Siti"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Groom & Parents */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Pengantin Pria</label>
                <input
                  type="text"
                  name="groomNames"
                  value={formData.groomNames}
                  onChange={handleFieldChange}
                  placeholder="Masukkan nama lengkap pengantin pria"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama Orang Tua Pengantin Pria</label>
                <input
                  type="text"
                  name="groomParents"
                  value={formData.groomParents}
                  onChange={handleFieldChange}
                  placeholder="Contoh: Bapak Budi & Ibu Ani"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Detail Acara</h3>
              
              {/* Akad Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium text-gray-700">Akad Nikah</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showAkad !== false}
                      onChange={(e) => handleFieldChange({
                        target: { name: 'showAkad', value: e.target.checked }
                      } as any)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Tampilkan</span>
                  </label>
                </div>

                {formData.showAkad !== false && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal Akad</label>
                      <input
                        type="date"
                        name="akadDate"
                        value={formData.akadDate || ''}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Waktu Akad</label>
                      <input
                        type="time"
                        name="akadTime"
                        value={formData.akadTime || ''}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tempat Akad</label>
                      <input
                        type="text"
                        name="akadVenue"
                        value={formData.akadVenue || ''}
                        onChange={handleFieldChange}
                        placeholder="Masukkan lokasi akad nikah"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Resepsi Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium text-gray-700">Resepsi</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showResepsi !== false}
                      onChange={(e) => handleFieldChange({
                        target: { name: 'showResepsi', value: e.target.checked }
                      } as any)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Tampilkan</span>
                  </label>
                </div>

                {formData.showResepsi !== false && (
                  <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal Resepsi</label>
                      <input
                        type="date"
                        name="resepsiDate"
                        value={formData.resepsiDate || ''}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Waktu Resepsi</label>
                      <input
                        type="time"
                        name="resepsiTime"
                        value={formData.resepsiTime || ''}
                        onChange={handleFieldChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tempat Resepsi</label>
                      <input
                        type="text"
                        name="resepsiVenue"
                        value={formData.resepsiVenue || ''}
                        onChange={handleFieldChange}
                        placeholder="Masukkan lokasi resepsi"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </InvitationForm>
        </div>

        {/* Preview Section */}
        <div className="w-full lg:w-1/2 sticky top-0">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden">
              <iframe
                src={`/preview/${id}`}
                className="w-full h-full"
                title="Preview Invitation"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditInvitation;
