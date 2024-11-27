import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import { useState, useEffect } from 'react'

interface Profile {
  username: string
  full_name: string
  avatar_url: string | null
}

export default function Navbar() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (user) {
      getProfile()
    }
  }, [user])

  async function getProfile() {
    try {
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error: any) {
      console.error('Error loading profile:', error.message)
    }
  }

  async function handleSignOut() {
    try {
      const { error } = await signOut()
      if (error) throw error
      navigate('/login')
    } catch (error: any) {
      console.error('Error signing out:', error.message)
    }
  }

  return (
    <nav className="bg-white shadow">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/dashboard" className="text-xl font-bold text-gray-800">
                WeddingGas
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative ml-3">
              <div className="flex items-center">
                {profile?.avatar_url && (
                  <img
                    className="w-8 h-8 rounded-full"
                    src={profile.avatar_url}
                    alt="Profile"
                  />
                )}
                <span className="mx-2 text-sm font-medium text-gray-700">
                  {profile?.username || user?.email}
                </span>
                <Link
                  to="/profile/edit"
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
