import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
        return
      }
      navigate('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Wedding Theme Image and Text */}
      <div className="md:w-1/2 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex flex-col justify-center p-12 text-gray-700">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-emerald-800">
            Welcome Back
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 font-light">
            Continue creating your perfect wedding moments with WeddingGas.
          </p>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Create beautiful invitations</span>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Manage your guest list</span>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Track RSVPs easily</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="md:w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Sign in to your account</h2>
            <p className="text-gray-600">
              Welcome back! Please enter your details.
            </p>
          </div>

          {location.state?.message && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 text-sm">
              {location.state.message}
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-sm">
                <Link 
                  to="/register" 
                  className="font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Create an account
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                       bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                       disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {loading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
