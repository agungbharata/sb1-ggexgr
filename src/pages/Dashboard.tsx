import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import Navbar from '../components/Navbar'

interface Profile {
  username: string
  full_name: string
  avatar_url: string | null
}

export default function Dashboard() {
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-900">Welcome to WeddingGas</h2>
              <p className="mt-1 text-sm text-gray-500">
                Start planning your perfect wedding!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
