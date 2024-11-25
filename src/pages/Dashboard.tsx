import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../config/supabase'
import Navbar from '../components/Navbar'

interface Invitation {
  id: string
  title: string
  bride_name: string
  groom_name: string
  date: string
  venue: string
  created_at: string
  status: string
}

interface Profile {
  username: string
  full_name: string
  avatar_url: string | null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      getProfile()
      getInvitations()
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

  async function getInvitations() {
    try {
      if (!user) throw new Error('No user')

      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setInvitations(data || [])
    } catch (error: any) {
      console.error('Error loading invitations:', error.message)
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50">
      <Navbar />
      
      <main className="py-10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-emerald-800">Welcome{profile?.full_name ? `, ${profile.full_name}` : ''}</h1>
            <p className="mt-2 text-gray-600">Manage your wedding invitations and create beautiful memories.</p>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <Link
              to="/invitation/new"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Invitation
            </Link>
          </div>

          {/* Invitations List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-serif font-semibold text-emerald-800 mb-4">Your Invitations</h2>
              
              {loading ? (
                <div className="text-center py-4">
                  <svg className="animate-spin h-8 w-8 mx-auto text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : invitations.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No invitations</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new invitation.</p>
                  <div className="mt-6">
                    <Link
                      to="/invitation/new"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Create Invitation
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          {invitation.bride_name} & {invitation.groom_name}
                        </h3>
                        <div className="text-sm text-gray-500 space-y-2">
                          <p className="flex items-center">
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(invitation.date).toLocaleDateString()}
                          </p>
                          <p className="flex items-center">
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {invitation.venue}
                          </p>
                        </div>
                        <div className="mt-4 flex space-x-3">
                          <Link
                            to={`/invitation/${invitation.id}`}
                            className="flex-1 text-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                          >
                            View
                          </Link>
                          <Link
                            to={`/invitation/${invitation.id}/edit`}
                            className="flex-1 text-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                          >
                            Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
