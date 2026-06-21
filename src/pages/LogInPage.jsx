import { LogIn } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShowcase from '../components/AuthShowcase.jsx'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

const inputClassName =
  'w-full border-b border-black/30 bg-transparent pb-3 text-sm text-black outline-none placeholder:text-black/35 focus:border-brand'

function LogInPage() {
  const { login } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: location.state?.email ?? '',
    password: '',
  })
  const [error, setError] = useState('')

  const requestedAction = location.state?.requestedAction
  const successMessage = location.state?.successMessage
  const registeredRole = location.state?.role

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please enter both email and password.')
      return
    }

    const result = await login(formData)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate(result.user.role === 'seller' || result.user.role === 'admin' ? '/dashboard' : '/shop', {
      replace: true,
    })
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.12fr,0.88fr]">
          <AuthShowcase />

          <div className="mx-auto w-full max-w-[370px]">
            <h1 className="text-4xl font-medium">Log in to Exclusive</h1>
            <p className="mt-4 text-sm text-black/75">Enter your details below</p>

            <p className="mt-4 text-sm leading-7 text-black/60">
              {requestedAction
                ? `Log in to continue to ${requestedAction}.`
                : registeredRole
                  ? `Log in to continue with your ${registeredRole} account.`
                  : 'Use the email and password saved during sign up.'}
            </p>

            {successMessage ? (
              <div className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form className="mt-10 space-y-9" onSubmit={handleSubmit}>
              <div>
                <input
                  autoComplete="email"
                  className={inputClassName}
                  id="email"
                  name="email"
                  onChange={handleChange}
                  placeholder="Email or Phone Number"
                  type="email"
                  value={formData.email}
                />
              </div>

              <div>
                <input
                  autoComplete="current-password"
                  className={inputClassName}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  value={formData.password}
                />
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="inline-flex items-center justify-center gap-2 bg-brand px-12 py-4 text-sm font-medium text-white transition hover:bg-brand-dark"
                  type="submit"
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span>Log In</span>
                </button>

                <span className="text-sm text-brand">Forget Password?</span>
              </div>
            </form>

            <p className="mt-8 text-sm text-black/65">
              Need an account?{' '}
              <Link
                className="font-medium text-black underline underline-offset-4"
                state={{ requestedAction }}
                to="/signup"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default LogInPage
