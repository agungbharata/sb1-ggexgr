import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const { resetPassword } = useAuth()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    try {
      const { error } = await resetPassword(email)
      if (error) throw error
      setMessage('Check your email for password reset instructions')
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
            Password Recovery
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 font-light">
            Don't worry, we'll help you get back to planning your special day.
          </p>
          <div className="space-y-4 text-gray-600">
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Check your email</span>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Reset securely</span>
            </div>
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login again</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="md:w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="max-w-md w-full">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Reset your password</h2>
            <p className="text-gray-600">
              Enter your email and we'll send you instructions
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-700 text-sm">
              {message}
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
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

            <div className="text-sm text-right">
              <Link 
                to="/login" 
                className="font-medium text-emerald-600 hover:text-emerald-500"
              >
                Back to login
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
                  Sending reset link...
                </div>
              ) : (
                'Send reset link'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
