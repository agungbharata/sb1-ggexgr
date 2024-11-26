import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../config/supabase'

interface Settings {
  id: string
  site_name: string
  site_description: string
  maintenance_mode: boolean
  registration_enabled: boolean
  max_invitations_per_user: number
  created_at: string
}

export default function AdminSettings() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }

    fetchSettings()
  }, [isAdmin, navigate])

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .single()

      if (error) throw error

      setSettings(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (field: keyof Settings, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [field]: value })
  }

  const handleSaveSettings = async () => {
    if (!settings) return

    try {
      const { error } = await supabase
        .from('settings')
        .update({
          site_name: settings.site_name,
          site_description: settings.site_description,
          maintenance_mode: settings.maintenance_mode,
          registration_enabled: settings.registration_enabled,
          max_invitations_per_user: settings.max_invitations_per_user
        })
        .eq('id', settings.id)

      if (error) throw error

      setSuccess('Pengaturan berhasil disimpan')
      setTimeout(() => setSuccess(null), 3000)
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg">
          {/* Header */}
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">Pengaturan Sistem</h2>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="px-4 py-5 sm:p-6">
            {error && (
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                </div>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : settings ? (
              <div className="space-y-6">
                <div>
                  <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                    Nama Situs
                  </label>
                  <input
                    type="text"
                    id="site_name"
                    value={settings.site_name}
                    onChange={(e) => handleSettingChange('site_name', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="site_description" className="block text-sm font-medium text-gray-700">
                    Deskripsi Situs
                  </label>
                  <textarea
                    id="site_description"
                    rows={3}
                    value={settings.site_description}
                    onChange={(e) => handleSettingChange('site_description', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label htmlFor="max_invitations" className="block text-sm font-medium text-gray-700">
                    Maksimal Undangan per User
                  </label>
                  <input
                    type="number"
                    id="max_invitations"
                    value={settings.max_invitations_per_user}
                    onChange={(e) => handleSettingChange('max_invitations_per_user', parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="maintenance_mode"
                      checked={settings.maintenance_mode}
                      onChange={(e) => handleSettingChange('maintenance_mode', e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="maintenance_mode" className="ml-2 block text-sm text-gray-900">
                      Mode Maintenance
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="registration_enabled"
                      checked={settings.registration_enabled}
                      onChange={(e) => handleSettingChange('registration_enabled', e.target.checked)}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="registration_enabled" className="ml-2 block text-sm text-gray-900">
                      Aktifkan Registrasi
                    </label>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                  >
                    Simpan Pengaturan
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
