import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import TemplateSelector from '../../components/TemplateSelector';
import TimeZoneSelector from '../../components/TimeZoneSelector';
import JavaneseTemplate from '../../components/templates/JavaneseTemplate';
import type { InvitationData, TimeZone } from '../../types/invitation';
import { supabase } from '../../lib/supabase';
import { Smartphone, Monitor } from 'react-feather';

const EditInvitation: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');

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

  const handleUpdate = async () => {
    if (!formData) return;
    setSaving(true);
    try {
      const { error } = await supabase
        .from('invitations')
        .update(formData)
        .eq('id', id);

      if (error) throw error;
      // Show success toast or notification here
    } catch (error: any) {
      console.error('Error updating invitation:', error.message);
      // Show error toast or notification here
    } finally {
      setSaving(false);
    }
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
      <div className="min-h-screen">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
            Invitation not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Preview Section */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-4">
              {/* Preview Mode Switcher */}
              <div className="flex justify-center mb-4 space-x-2">
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    previewMode === 'mobile'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Mobile
                </button>
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                    previewMode === 'desktop'
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Desktop
                </button>
              </div>

              {/* Mobile Preview */}
              {previewMode === 'mobile' && (
                <div className="relative border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] sm:h-[700px] lg:h-[calc(100vh-100px)] w-full max-w-[420px] mx-auto">
                  <div className="h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg"></div>
                  <div className="h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[178px] rounded-s-lg"></div>
                  <div className="h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg"></div>
                  <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white">
                    <div className="h-[28px] bg-gray-800 w-[148px] absolute top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2"></div>
                    <div className="w-full h-full overflow-y-auto bg-white">
                      <JavaneseTemplate data={formData} isViewOnly={true} />
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Preview */}
              {previewMode === 'desktop' && (
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="h-8 bg-gray-800 flex items-center px-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="aspect-video overflow-y-auto">
                      <JavaneseTemplate data={formData} isViewOnly={true} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-xl p-4 sm:p-6">
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
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Save Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 md:hidden">
        <button 
          onClick={handleUpdate}
          disabled={saving}
          className={`w-full bg-primary hover:bg-primary-dark text-white py-3 px-4 rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
            saving ? 'opacity-75 cursor-not-allowed' : ''
          }`}
        >
          <span className="flex items-center justify-center">
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </span>
        </button>
      </div>

      {/* Desktop Save Button */}
      <button 
        onClick={handleUpdate}
        disabled={saving}
        className={`hidden md:flex fixed bottom-8 right-8 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
          saving ? 'opacity-75 cursor-not-allowed' : 'hover:scale-105'
        }`}
      >
        {saving ? (
          <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default EditInvitation;
