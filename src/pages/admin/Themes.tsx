import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../config/supabase'

interface Theme {
  id: string
  name: string
  description: string
  preview_url: string
  price: number
  is_premium: boolean
  created_at: string
}

export default function AdminThemes() {
  const { isAdmin } = useAuth()
  const navigate = useNavigate()
  const [themes, setThemes] = useState<Theme[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newTheme, setNewTheme] = useState({
    name: '',
    description: '',
    preview_url: '',
    price: 0,
    is_premium: false
  })
  const [isAddingTheme, setIsAddingTheme] = useState(false)

  useEffect(() => {
    if (!isAdmin) {
      navigate('/')
      return
    }

    fetchThemes()
  }, [isAdmin, navigate])

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('themes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setThemes(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTheme = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data, error } = await supabase
        .from('themes')
        .insert([newTheme])
        .select()

      if (error) throw error

      setThemes([...(data as Theme[]), ...themes])
      setNewTheme({
        name: '',
        description: '',
        preview_url: '',
        price: 0,
        is_premium: false
      })
      setIsAddingTheme(false)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteTheme = async (themeId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus template ini?')) return

    try {
      const { error } = await supabase
        .from('themes')
        .delete()
        .eq('id', themeId)

      if (error) throw error

      setThemes(themes.filter(theme => theme.id !== themeId))
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
              <h2 className="text-lg font-medium text-gray-900">Kelola Template</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Kembali ke Dashboard
                </button>
                <button
                  onClick={() => setIsAddingTheme(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  Tambah Template
                </button>
              </div>
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

            {/* Add Theme Form */}
            {isAddingTheme && (
              <div className="mb-8">
                <form onSubmit={handleAddTheme} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nama Template
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={newTheme.name}
                      onChange={(e) => setNewTheme({ ...newTheme, name: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Deskripsi
                    </label>
                    <textarea
                      id="description"
                      value={newTheme.description}
                      onChange={(e) => setNewTheme({ ...newTheme, description: e.target.value })}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="preview_url" className="block text-sm font-medium text-gray-700">
                      URL Preview
                    </label>
                    <input
                      type="url"
                      id="preview_url"
                      value={newTheme.preview_url}
                      onChange={(e) => setNewTheme({ ...newTheme, preview_url: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                      Harga
                    </label>
                    <input
                      type="number"
                      id="price"
                      value={newTheme.price}
                      onChange={(e) => setNewTheme({ ...newTheme, price: Number(e.target.value) })}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="is_premium"
                      checked={newTheme.is_premium}
                      onChange={(e) => setNewTheme({ ...newTheme, is_premium: e.target.checked })}
                      className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                    />
                    <label htmlFor="is_premium" className="ml-2 block text-sm text-gray-900">
                      Template Premium
                    </label>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsAddingTheme(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <svg className="animate-spin h-8 w-8 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {themes.map((theme) => (
                  <div
                    key={theme.id}
                    className="bg-white overflow-hidden shadow rounded-lg divide-y divide-gray-200"
                  >
                    <div className="px-4 py-5 sm:p-6">
                      <img
                        src={theme.preview_url}
                        alt={theme.name}
                        className="w-full h-48 object-cover rounded-md mb-4"
                      />
                      <h3 className="text-lg font-medium text-gray-900">{theme.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{theme.description}</p>
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                          {theme.is_premium ? 'Premium' : 'Free'}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          Rp {theme.price.toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={() => handleDeleteTheme(theme.id)}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </button>
                        <button
                          onClick={() => window.open(`/preview/${theme.id}`, '_blank')}
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-emerald-600 hover:bg-emerald-700"
                        >
                          Preview
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
