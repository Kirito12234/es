import React from 'react'
import { Link } from 'react-router-dom'
import AccountSidebar from '../components/AccountSidebar.jsx'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

const inputClassName = 'w-full bg-[#f5f5f5] px-4 py-3 text-sm text-black outline-none'

const buildInitialForm = (user) => ({
  firstName: user?.firstName ?? '',
  lastName: user?.lastName ?? '',
  email: user?.email ?? '',
  address: user?.address ?? '',
  city: user?.city ?? '',
  phone: user?.phone ?? '',
  companyName: user?.companyName ?? '',
  apartment: user?.apartment ?? '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

function AccountPage() {
  const { updateAccount, user } = useAuth()
  const [formData, setFormData] = React.useState(() => buildInitialForm(user))
  const [message, setMessage] = React.useState('')
  const [error, setError] = React.useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }))
  }

  const handleCancel = () => {
    setFormData(buildInitialForm(user))
    setError('')
    setMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!formData.firstName.trim() || !formData.email.trim()) {
      setError('First name and email are required.')
      return
    }

    if (formData.newPassword.trim() && formData.newPassword !== formData.confirmPassword) {
      setError('New password and confirm password do not match.')
      return
    }

    const result = await updateAccount({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      phone: formData.phone,
      companyName: formData.companyName,
      apartment: formData.apartment,
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword,
    })

    if (!result.success) {
      setError(result.message)
      return
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }))
    setMessage('Your profile changes have been saved.')
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-black/60">
            <Link className="hover:text-black" to="/">
              Home
            </Link>{' '}
            / <span className="text-black">My Account</span>
          </div>

          <p className="text-sm text-black/60">
            Welcome! <span className="text-brand">{user?.name}</span>
          </p>
        </div>

        <section className="mt-16 grid gap-10 lg:grid-cols-[220px,1fr]">
          <AccountSidebar />

          <div className="border border-black/10 bg-white px-6 py-8 shadow-soft sm:px-10">
            <h1 className="text-xl font-medium text-brand">Edit Your Profile</h1>

            {message ? (
              <div className="mt-6 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            ) : null}

            {error ? (
              <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <form className="mt-8" onSubmit={handleSubmit}>
              <div className="grid gap-6 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">First Name</span>
                  <input
                    className={inputClassName}
                    name="firstName"
                    onChange={handleChange}
                    type="text"
                    value={formData.firstName}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Last Name</span>
                  <input
                    className={inputClassName}
                    name="lastName"
                    onChange={handleChange}
                    type="text"
                    value={formData.lastName}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Email</span>
                  <input
                    className={inputClassName}
                    name="email"
                    onChange={handleChange}
                    type="email"
                    value={formData.email}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Address</span>
                  <input
                    className={inputClassName}
                    name="address"
                    onChange={handleChange}
                    type="text"
                    value={formData.address}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Town / City</span>
                  <input
                    className={inputClassName}
                    name="city"
                    onChange={handleChange}
                    type="text"
                    value={formData.city}
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm text-black/60">Phone Number</span>
                  <input
                    className={inputClassName}
                    name="phone"
                    onChange={handleChange}
                    type="text"
                    value={formData.phone}
                  />
                </label>
              </div>

              <div className="mt-8">
                <h2 className="text-base font-medium">Password Changes</h2>
                <div className="mt-4 grid gap-4">
                  <input
                    className={inputClassName}
                    name="currentPassword"
                    onChange={handleChange}
                    placeholder="Current Password"
                    type="password"
                    value={formData.currentPassword}
                  />
                  <input
                    className={inputClassName}
                    name="newPassword"
                    onChange={handleChange}
                    placeholder="New Password"
                    type="password"
                    value={formData.newPassword}
                  />
                  <input
                    className={inputClassName}
                    name="confirmPassword"
                    onChange={handleChange}
                    placeholder="Confirm New Password"
                    type="password"
                    value={formData.confirmPassword}
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-end gap-5">
                <button
                  className="text-sm font-medium text-black transition hover:text-brand"
                  onClick={handleCancel}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="inline-flex items-center justify-center bg-brand px-12 py-4 text-sm font-medium text-white transition hover:bg-brand-dark"
                  type="submit"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AccountPage
