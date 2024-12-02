import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import TemplateSelector from '../../components/TemplateSelector';
import { TemplateGrid } from '../../components/TemplatePreview';
import TimeZoneSelector from '../../components/TimeZoneSelector';
import type { InvitationData, TimeZone } from '../../types/invitation';

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
  const [formData, setFormData] = React.useState<Partial<InvitationData>>(initialData);
  const [activeView, setActiveView] = useState('mobile');
  const [showTemplates, setShowTemplates] = useState(false);

  const handleUpdate = async (data: InvitationData) => {
    setFormData(data);
  };

  const handleChange = (data: InvitationData) => {
    setFormData(data);
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-12 text-2xl font-bold text-center">Create New Invitation</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Live Template Section with Tabs */}
        <div className="overflow-hidden sticky top-0 p-4 w-full h-screen bg-gray-100 lg:w-1/2">
          <div className="flex justify-center mb-4 space-x-4 border-b border-gray-200">
            <button
              onClick={() => setActiveView('mobile')}
              className={`pb-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeView === 'mobile'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Mobile View
            </button>
            <button
              onClick={() => setActiveView('tablet')}
              className={`pb-2 px-4 text-sm font-medium transition-colors duration-200 ${
                activeView === 'tablet'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Tablet View
            </button>
          </div>

          <div className="flex justify-center items-start h-[calc(100%-3rem)] overflow-y-auto py-4">
            <style jsx>{`
              .scrollbar-thin::-webkit-scrollbar {
                width: 4px;
              }
              .scrollbar-thin::-webkit-scrollbar-track {
                background: transparent;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb {
                background-color: rgb(209, 213, 219);
                border-radius: 20px;
              }
              .scrollbar-thin::-webkit-scrollbar-thumb:hover {
                background-color: rgb(156, 163, 175);
              }
              .scrollbar-thin {
                scrollbar-width: thin;
                scrollbar-color: rgb(209, 213, 219) transparent;
              }
            `}</style>

            {/* Mobile Preview */}
            {activeView === 'mobile' && (
              <div className="relative w-[320px] h-[640px] bg-white rounded-[3rem] shadow-xl p-2 border-8 border-gray-800">
                <div className="absolute top-0 left-1/2 w-24 h-6 bg-gray-800 rounded-b-2xl transform -translate-x-1/2"></div>
                <div className="w-full h-full overflow-auto rounded-[2.5rem] scrollbar-thin">
                  <TemplateSelector
                    templateId={formData.theme || 'javanese'}
                    data={formData}
                    isViewOnly={true}
                  />
                </div>
                <div className="absolute bottom-4 left-1/2 w-24 h-1 bg-gray-800 rounded-full transform -translate-x-1/2"></div>
              </div>
            )}

            {/* Tablet Preview */}
            {activeView === 'tablet' && (
              <div className="relative w-[600px] h-[800px] bg-white rounded-[2rem] shadow-xl p-3 border-[12px] border-gray-800">
                <div className="absolute top-0 left-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl transform -translate-x-1/2"></div>
                <div className="w-full h-full overflow-auto rounded-[1.5rem] scrollbar-thin">
                  <TemplateSelector
                    templateId={formData.theme || 'javanese'}
                    data={formData}
                    isViewOnly={true}
                  />
                </div>
                <div className="absolute bottom-4 left-1/2 w-32 h-1 bg-gray-800 rounded-full transform -translate-x-1/2"></div>
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full lg:w-1/2">


          <InvitationForm
            onUpdate={handleUpdate}
            onChange={handleChange}
            initialData={initialData}
            isEditing={false}
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
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                  className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Event Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Detail Acara</h3>
              
              {/* Akad Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-700 text-md">Akad Nikah</h4>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showAkad !== false}
                      onChange={(e) => handleFieldChange({
                        target: { name: 'showAkad', value: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Tampilkan</span>
                  </label>
                </div>

                {formData.showAkad !== false && (
                  <div className="pl-4 space-y-4 border-l-2 border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal Akad</label>
                      <input
                        type="date"
                        name="akadDate"
                        value={formData.akadDate || ''}
                        onChange={handleFieldChange}
                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Waktu Akad</label>
                      <input
                        type="time"
                        name="akadTime"
                        value={formData.akadTime || ''}
                        onChange={handleFieldChange}
                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Resepsi Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-gray-700 text-md">Resepsi</h4>
                  <label className="inline-flex relative items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showResepsi !== false}
                      onChange={(e) => handleFieldChange({
                        target: { name: 'showResepsi', value: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    <span className="ml-3 text-sm font-medium text-gray-700">Tampilkan</span>
                  </label>
                </div>

                {formData.showResepsi !== false && (
                  <div className="pl-4 space-y-4 border-l-2 border-gray-200">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tanggal Resepsi</label>
                      <input
                        type="date"
                        name="resepsiDate"
                        value={formData.resepsiDate || ''}
                        onChange={handleFieldChange}
                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Waktu Resepsi</label>
                      <input
                        type="time"
                        name="resepsiTime"
                        value={formData.resepsiTime || ''}
                        onChange={handleFieldChange}
                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                        className="block mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Timezone */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Zona Waktu</label>
                <TimeZoneSelector
                  value={formData.timezone || 'WIB'}
                  onChange={(timezone) => setFormData({ ...formData, timezone })}
                />
              </div>
            </div>
          </InvitationForm>
        </div>
        
 
      </div>
    </div>
  );
};

export default NewInvitation;
