import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const { signUp } = useAuth()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError("Passwords don't match")
      return
    }

    setLoading(true)
    try {
      const { error } = await signUp(email, password)
      if (error) throw error
      navigate('/login', { state: { message: 'Registration successful! Please check your email for verification.' } })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side */}
      <div className="md:w-1/2 bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 flex flex-col justify-center p-12 text-gray-700">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-emerald-800">
            Start Your Journey
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 font-light">
            Create your wedding invitation and start planning your special day.
          </p>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Easy to customize</span>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Digital invitations</span>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>RSVP management</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="md:w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Create your account</h2>
            <p className="text-gray-600">
              Let's get started with your wedding planning
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                placeholder="Create a password"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm placeholder-gray-400 
                         focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
                         disabled:bg-gray-50 disabled:text-gray-500 disabled:border-gray-200 disabled:shadow-none"
                placeholder="Confirm your password"
                disabled={loading}
              />
            </div>

            <div className="text-sm text-right">
              <Link 
                to="/login" 
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Already have an account?
              </Link>
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
                  Creating account...
                </div>
              ) : (
                'Create account'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
