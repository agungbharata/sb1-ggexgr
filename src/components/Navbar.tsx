import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import { useState, useEffect } from 'react'
import { colors } from '../styles/colors'

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
    <nav className="bg-gradient-to-r from-[#FAF3E0] to-white shadow">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link to="/dashboard" className="text-xl font-bold text-[#8B7355] hover:text-[#D4B996] transition-colors duration-200">
                WeddingGas
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative ml-3">
              <div className="flex items-center space-x-4">
                {profile?.avatar_url && (
                  <img
                    className="w-8 h-8 rounded-full ring-2 ring-[#D4B996]"
                    src={profile.avatar_url}
                    alt="Profile"
                  />
                )}
                <span className="text-sm font-medium text-[#8B7355]">
                  {profile?.username || user?.email}
                </span>
                <Link
                  to="/profile/edit"
                  className="px-3 py-2 text-sm font-medium text-[#8B7355] hover:text-[#D4B996] hover:bg-[#F5E9E2] rounded-md transition-colors duration-200"
                >
                  Edit Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="px-3 py-2 text-sm font-medium text-[#8B7355] hover:text-[#D4B996] hover:bg-[#F5E9E2] rounded-md transition-colors duration-200"
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
