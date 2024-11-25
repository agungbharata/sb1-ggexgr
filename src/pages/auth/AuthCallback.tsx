import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../config/supabase'
import { useAuth } from '../../contexts/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('AuthCallback mounted')
    
    const handleAuthCallback = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        console.log('Session data:', session)
        
        if (sessionError) {
          console.error('Session error:', sessionError)
          throw sessionError
        }

        if (session?.user) {
          console.log('Setting user:', session.user)
          setUser(session.user)
          navigate('/')
        } else {
          console.log('No session found')
          navigate('/auth/login')
        }
      } catch (error: any) {
        console.error('Auth callback error:', error)
        setError(error.message)
      }
    }

    handleAuthCallback()
  }, [navigate, setUser])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 text-center">
          <h2 className="text-2xl font-semibold text-red-600">Authentication Error</h2>
          <p className="mt-2 text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/auth/login')}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-900">Completing sign in...</h2>
        <p className="mt-2 text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  )
}
