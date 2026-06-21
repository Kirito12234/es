import { Globe, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import AuthShowcase from '../components/AuthShowcase.jsx'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

const initialForm = {
  name: '',
  email: '',
  password: '',
  role: 'buyer',
}

const inputClassName =
  'w-full border-b border-black/30 bg-transparent pb-3 text-sm text-black outline-none placeholder:text-black/35 focus:border-brand'

function SignUpPage() {
  const { signUp } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialForm)
  const [error, setError] = useState('')

  const requestedAction = location.state?.requestedAction

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

    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      setError('Please fill in name, email, and password.')
      return
    }

    if (formData.password.trim().length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    const result = await signUp(formData)

    if (!result.success) {
      setError(result.message)
      return
    }

    navigate('/login', {
      replace: true,
      state: {
        email: formData.email.trim().toLowerCase(),
        role: result.user.role,
        requestedAction,
        successMessage: `${result.user.role === 'seller' ? 'Seller' : 'Buyer'} account created successfully. Log in to continue.`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 py-14">
        <div className="grid items-center gap-10 lg:grid-cols-[1.12fr,0.88fr]">
          <AuthShowcase />

          <div className="mx-auto w-full max-w-[370px]">
            <h1 className="text-4xl font-medium">Create an account</h1>
            <p className="mt-4 text-sm text-black/75">Enter your details below</p>

            <p className="mt-4 text-sm leading-7 text-black/60">
              {requestedAction
                ? `Create an account to continue to ${requestedAction}.`
                : 'Choose a buyer account for shopping or a seller account for both shopping and selling.'}
            </p>

            {error ? (
              <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form className="mt-10 space-y-9" onSubmit={handleSubmit}>
              <div>
                <input
                  autoComplete="name"
                  className={inputClassName}
                  id="name"
                  name="name"
                  onChange={handleChange}
                  placeholder="Name"
                  type="text"
                  value={formData.name}
                />
              </div>

              <fieldset>
                <legend className="mb-3 text-sm font-medium text-black/75">Account role</legend>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    ['buyer', 'Buyer', 'Shop and place orders'],
                    ['seller', 'Seller', 'Shop and manage products'],
                  ].map(([value, label, description]) => (
                    <label
                      className={`cursor-pointer border p-4 transition ${
                        formData.role === value ? 'border-brand bg-brand-soft' : 'border-black/15'
                      }`}
                      key={value}
                    >
                      <input
                        checked={formData.role === value}
                        className="sr-only"
                        name="role"
                        onChange={handleChange}
                        type="radio"
                        value={value}
                      />
                      <span className="block text-sm font-semibold">{label}</span>
                      <span className="mt-1 block text-xs text-black/55">{description}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

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
                  autoComplete="new-password"
                  className={inputClassName}
                  id="password"
                  name="password"
                  onChange={handleChange}
                  placeholder="Password"
                  type="password"
                  value={formData.password}
                />
              </div>

              <button
                className="inline-flex w-full items-center justify-center gap-2 bg-brand px-5 py-4 text-sm font-medium text-white transition hover:bg-brand-dark"
                type="submit"
              >
                <UserPlus className="h-4 w-4" aria-hidden="true" />
                <span>Create Account</span>
              </button>
            </form>

            <Link
              className="mt-4 inline-flex w-full items-center justify-center gap-3 border border-black/20 px-5 py-4 text-sm font-medium text-black transition hover:border-black"
              state={{ requestedAction }}
              to="/login"
            >
              <Globe className="h-4 w-4 text-[#db4444]" aria-hidden="true" />
              <span>Sign up with Google</span>
            </Link>

            <p className="mt-8 text-center text-sm text-black/65">
              Already have account?{' '}
              <Link
                className="font-medium text-black underline underline-offset-4"
                state={{ requestedAction }}
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default SignUpPage
