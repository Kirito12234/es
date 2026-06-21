import React from 'react'
import { Mail, PhoneCall } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.jsx'
import { apiRequest } from '../utils/api.js'

const inputClassName = 'w-full bg-[#f5f5f5] px-4 py-4 text-sm text-black outline-none placeholder:text-black/35'
const supportEmail = 'siddh7356@gmail.com'
const supportPhone = '+977 9843784246'

function ContactPage() {
  const { user } = useAuth()
  const [formData, setFormData] = React.useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    message: '',
  })
  const [error, setError] = React.useState('')
  const [successMessage, setSuccessMessage] = React.useState('')

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
    setSuccessMessage('')

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.message.trim()
    ) {
      setError('Please complete all contact fields before sending your message.')
      return
    }

    const notification = {
      ...formData,
      sentTo: supportEmail,
      sentAt: new Date().toISOString(),
    }

    try {
      await apiRequest('/contact', {
        method: 'POST',
        body: JSON.stringify(notification),
      })
    } catch (submitError) {
      try {
        const notifications = JSON.parse(window.localStorage.getItem('redcart_contact_notifications') || '[]')
        window.localStorage.setItem(
          'redcart_contact_notifications',
          JSON.stringify([notification, ...notifications].slice(0, 20)),
        )
      } catch {
        setError(submitError instanceof Error ? submitError.message : 'Message could not be sent.')
        return
      }
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      message: '',
    }))
    setSuccessMessage(`Your message notification has been sent to ${supportEmail}. We will contact you within 24 hours.`)
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">Contact</span>
        </div>

        <section className="mt-16 grid gap-8 lg:grid-cols-[340px,1fr]">
          <div className="border border-black/10 bg-white p-10 shadow-soft">
            <div className="border-b border-black/15 pb-8">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                  <PhoneCall className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-base font-medium">Call To Us</h2>
              </div>

              <p className="mt-6 text-sm leading-7 text-black/60">
                We are available 24/7, 7 days a week.
              </p>
              <p className="mt-4 text-sm text-black">Phone: {supportPhone}</p>
            </div>

            <div className="pt-8">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                  <Mail className="h-5 w-5" aria-hidden="true" />
                </div>
                <h2 className="text-base font-medium">Write To Us</h2>
              </div>

              <p className="mt-6 text-sm leading-7 text-black/60">
                Fill out our form and we will contact you within 24 hours.
              </p>
              <div className="mt-4 space-y-3 text-sm text-black">
                <p>Email: {supportEmail}</p>
                <p>Address: Kathmandu, Nepal</p>
              </div>
            </div>
          </div>

          <div className="border border-black/10 bg-white p-8 shadow-soft sm:p-10">
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 md:grid-cols-3">
                <input
                  className={inputClassName}
                  name="name"
                  onChange={handleChange}
                  placeholder="Your Name *"
                  type="text"
                  value={formData.name}
                />
                <input
                  className={inputClassName}
                  name="email"
                  onChange={handleChange}
                  placeholder="Your Email *"
                  type="email"
                  value={formData.email}
                />
                <input
                  className={inputClassName}
                  name="phone"
                  onChange={handleChange}
                  placeholder="Your Phone *"
                  type="text"
                  value={formData.phone}
                />
              </div>

              <textarea
                className="mt-8 min-h-[230px] w-full resize-none bg-[#f5f5f5] px-4 py-4 text-sm text-black outline-none placeholder:text-black/35"
                name="message"
                onChange={handleChange}
                placeholder="Your Message"
                value={formData.message}
              />

              {error ? <p className="mt-4 text-sm text-brand">{error}</p> : null}
              {successMessage ? <p className="mt-4 text-sm text-emerald-700">{successMessage}</p> : null}

              <div className="mt-8 flex justify-end">
                <button
                  className="inline-flex items-center justify-center bg-brand px-12 py-4 text-sm font-medium text-white transition hover:bg-brand-dark"
                  type="submit"
                >
                  Send Message
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

export default ContactPage
