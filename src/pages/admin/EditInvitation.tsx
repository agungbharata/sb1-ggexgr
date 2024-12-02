import React, { useState, useEffect, useCallback } from 'react';
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

  const handleChange = useCallback((data: InvitationData) => {
    if (!formData) return;
    const updatedData = {
      ...formData,
      ...data,
      customSlug: data.customSlug || formData.customSlug || '',
    };
    setFormData(updatedData);
  }, [formData]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Invitation not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="py-4 sm:py-6 lg:py-8">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Preview Section - Make it sticky */}
            <div className="w-full lg:w-1/2">
              <div className="sticky top-4">
                {/* Device Preview Controls */}
                <div className="flex justify-center gap-4 mb-6">
                  <button
                    onClick={() => setPreviewDevice('mobile')}
                    className={`px-4 py-2 rounded-lg ${
                      previewDevice === 'mobile'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Mobile
                  </button>
                  <button
                    onClick={() => setPreviewDevice('tablet')}
                    className={`px-4 py-2 rounded-lg ${
                      previewDevice === 'tablet'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Tablet
                  </button>
                  <button
                    onClick={() => setPreviewDevice('desktop')}
                    className={`px-4 py-2 rounded-lg ${
                      previewDevice === 'desktop'
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    Desktop
                  </button>
                </div>

                {/* Preview Container */}
                <div className="h-[calc(100vh-8rem)] overflow-hidden flex items-center justify-center bg-gray-50 rounded-xl">
                  {/* Device Frame Container with Scale */}
                  <div className={`origin-center transition-all duration-300 ${previewDevice === 'desktop' ? 'scale-[0.65] lg:scale-[0.75]' : deviceSizes[previewDevice].scale}`}>
                    {/* Device Frame */}
                    <div className={`relative ${previewDevice === 'desktop' ? 'w-[1200px] h-[750px]' : deviceSizes[previewDevice].frame} transition-all duration-300`}>
                      {/* Mobile Frame */}
                      {previewDevice === 'mobile' && (
                        <div className="relative w-full h-full">
                          {/* Phone Frame */}
                          <div className="absolute inset-0 bg-gray-800 rounded-[3rem] shadow-xl">
                            {/* Notch */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 h-8 w-[120px] bg-black rounded-b-3xl"></div>
                            {/* Side Buttons */}
                            <div className="absolute -left-1 top-[120px] w-1 h-12 bg-gray-700 rounded-l"></div>
                            <div className="absolute -left-1 top-[160px] w-1 h-12 bg-gray-700 rounded-l"></div>
                            <div className="absolute -right-1 top-[120px] w-1 h-16 bg-gray-700 rounded-r"></div>
                            {/* Bottom Bar */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-700 rounded-full"></div>
                          </div>
                          {/* Screen Content */}
                          <div className="absolute inset-[12px] rounded-[2.5rem] overflow-hidden bg-white">
                            <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                              <JavaneseTemplate data={formData} isViewOnly={true} />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Desktop Frame (Laptop) */}
                      {previewDevice === 'desktop' && (
                        <div className="relative w-full h-full">
                          {/* Laptop Frame */}
                          <div className="relative w-full h-full">
                            {/* Screen Frame */}
                            <div className="absolute -inset-3 bg-[#1a1a1a] rounded-xl shadow-xl">
                              {/* Camera */}
                              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black/30"></div>
                            </div>
                            {/* Screen Content */}
                            <div className="absolute inset-0 bg-white overflow-hidden">
                              {/* Browser Chrome */}
                              <div className="h-7 bg-gray-100 flex items-center space-x-3 px-3 border-b">
                                {/* Window Controls */}
                                <div className="flex space-x-1.5">
                                  <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                </div>
                                {/* URL Bar */}
                                <div className="flex-1 h-5 bg-white rounded flex items-center px-2">
                                  <div className="flex items-center space-x-2 text-[10px] text-gray-600">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span>weddinggas.com/invitation/preview</span>
                                  </div>
                                </div>
                              </div>
                              {/* Browser Content */}
                              <div className="h-[calc(100%-1.75rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                                <JavaneseTemplate data={formData} isViewOnly={true} />
                              </div>
                            </div>
                            {/* Laptop Base */}
                            <div className="absolute -bottom-12 -inset-x-3">
                              <div className="relative w-full">
                                {/* Base Top with Hinge */}
                                <div className="h-2 bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-t-sm">
                                  <div className="absolute inset-x-0 top-0 h-[1px] bg-gray-600/20"></div>
                                </div>
                                {/* Base Bottom */}
                                <div className="h-10 bg-gradient-to-b from-[#dadada] to-[#c0c0c0] rounded-b-xl">
                                  {/* Trackpad */}
                                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[40%] h-6 bg-[#b8b8b8] rounded-lg"></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tablet Frame */}
                      {previewDevice === 'tablet' && (
                        <div className="relative w-full h-full">
                          {/* Tablet Frame */}
                          <div className="absolute inset-0 bg-gray-800 rounded-[2rem] shadow-xl">
                            {/* Camera */}
                            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-700"></div>
                            {/* Home Button */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-2 border-gray-700"></div>
                          </div>
                          {/* Screen Content */}
                          <div className="absolute inset-[10px] rounded-[1.75rem] overflow-hidden bg-white">
                            <div className="w-full h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                              <JavaneseTemplate data={formData} isViewOnly={true} />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="w-full lg:w-1/2">
              <InvitationForm
                initialData={formData}
                onUpdate={handleUpdate}
                onChange={handleChange}
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
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
