import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InvitationForm from '../../components/InvitationForm';
import TimeZoneSelector from '../../components/TimeZoneSelector'; // Add this line
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
  timeZone: 'WIB' as TimeZone,
};

const NewInvitation: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState<Partial<InvitationData>>(initialData);

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
    <div className="container px-4 py-8 mx-auto max-w-3xl">
      <h1 className="mb-8 text-2xl font-bold text-center">Create New Invitation</h1>
      <InvitationForm 
        data={formData} 
        onChange={handleChange}
        onUpdate={handleUpdate}
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
          <TimeZoneSelector
            value={formData.timeZone || 'WIB'}
            onChange={(value) => {
              setFormData({ ...formData, timeZone: value });
            }}
            className="mb-4"
          />
        </div>
      </InvitationForm>
    </div>
  );
};

export default NewInvitation;
