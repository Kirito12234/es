import { Camera, Globe, MessageCircle, SendHorizontal, Share2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.jsx'
import { getProtectedNavigation } from '../utils/routes.js'

const supportAddress = 'Kathmandu, Nepal'
const supportEmail = 'siddh7356@gmail.com'
const supportPhone = '+977 9843784246'

function Footer() {
  const { isAuthenticated } = useAuth()
  const [subscriberEmail, setSubscriberEmail] = useState('')
  const [subscribeMessage, setSubscribeMessage] = useState('')
  const [subscribeError, setSubscribeError] = useState('')
  const appUrl = typeof window !== 'undefined' ? window.location.origin : '/'

  const accountLink = getProtectedNavigation({
    actionKey: 'account',
    isAuthenticated,
    label: 'Account',
  })
  const cartLink = getProtectedNavigation({
    actionKey: 'cart',
    isAuthenticated,
    label: 'Cart',
  })
  const wishlistLink = getProtectedNavigation({
    actionKey: 'wishlist',
    isAuthenticated,
    label: 'Wishlist',
  })
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&margin=8&data=${encodeURIComponent(appUrl)}`

  const handleSubscribe = (event) => {
    event.preventDefault()
    setSubscribeError('')
    setSubscribeMessage('')

    if (!subscriberEmail.trim() || !subscriberEmail.includes('@')) {
      setSubscribeError('Enter a valid email address.')
      return
    }

    try {
      const subscribers = JSON.parse(window.localStorage.getItem('redcart_email_subscribers') || '[]')
      window.localStorage.setItem(
        'redcart_email_subscribers',
        JSON.stringify([...new Set([...subscribers, subscriberEmail.trim()])]),
      )
    } catch {
      // The visible notification is still useful if browser storage is unavailable.
    }

    setSubscriberEmail('')
    setSubscribeMessage(`Subscribed successfully. Notification sent to ${supportEmail}.`)
  }

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share({
        title: 'RedCart',
        text: 'Shop RedCart online.',
        url: appUrl,
      })
      return
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(appUrl)
      setSubscribeMessage('App link copied to clipboard.')
    }
  }

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto max-w-[1170px] px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.2fr,1fr,0.9fr,0.9fr,1.1fr]">
          <div>
            <p className="text-2xl font-semibold">Exclusive</p>
            <p className="mt-6 text-xl font-medium">Subscribe</p>
            <p className="mt-4 text-sm text-white/75">Get 10% off your first order</p>
            <form className="mt-4 flex items-center justify-between border border-white px-4 py-3" onSubmit={handleSubscribe}>
              <input
                className="w-full bg-transparent text-xs text-white outline-none placeholder:text-white/50"
                onChange={(event) => setSubscriberEmail(event.target.value)}
                placeholder="Enter your email"
                type="email"
                value={subscriberEmail}
              />
              <button aria-label="Subscribe by email" className="text-white transition hover:text-brand" type="submit">
                <SendHorizontal className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            {subscribeError ? <p className="mt-3 text-xs text-brand">{subscribeError}</p> : null}
            {subscribeMessage ? <p className="mt-3 text-xs text-emerald-300">{subscribeMessage}</p> : null}
          </div>

          <div>
            <p className="text-xl font-medium">Support</p>
            <div className="mt-6 space-y-4 text-sm text-white/75">
              <p>{supportAddress}</p>
              <a className="block transition hover:text-white" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
              <a className="block transition hover:text-white" href={`tel:${supportPhone.replace(/\s/g, '')}`}>
                {supportPhone}
              </a>
            </div>
          </div>

          <div>
            <p className="text-xl font-medium">Account</p>
            <div className="mt-6 flex flex-col gap-4 text-sm text-white/75">
              <Link className="transition hover:text-white" state={accountLink.state} to={accountLink.to}>
                My Account
              </Link>
              <Link className="transition hover:text-white" to="/login">
                Login / Register
              </Link>
              <Link className="transition hover:text-white" state={cartLink.state} to={cartLink.to}>
                Cart
              </Link>
              <Link className="transition hover:text-white" state={wishlistLink.state} to={wishlistLink.to}>
                Wishlist
              </Link>
              <Link className="transition hover:text-white" to="/shop">
                Shop
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xl font-medium">Quick Link</p>
            <div className="mt-6 flex flex-col gap-4 text-sm text-white/75">
              <Link className="transition hover:text-white" to="/about">
                About
              </Link>
              <Link className="transition hover:text-white" to="/contact">
                Contact
              </Link>
              <Link className="transition hover:text-white" to="/shop">
                FAQ
              </Link>
              <Link className="transition hover:text-white" to="/shop">
                Shop
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xl font-medium">Download App</p>
            <p className="mt-6 text-xs text-white/60">Save $3 with App New User Only</p>
            <div className="mt-4 grid grid-cols-[84px,1fr] gap-3">
              <a
                aria-label="Open RedCart app QR link"
                className="flex h-[84px] items-center justify-center border border-white/30 bg-white p-1 transition hover:border-white"
                href={appUrl}
                target="_blank"
                rel="noreferrer"
              >
                <img alt="QR code for RedCart app" className="h-full w-full object-contain" src={qrCodeUrl} />
              </a>
              <div className="space-y-3">
                <a
                  className="flex h-[36px] items-center justify-center border border-white/30 bg-white/5 text-xs text-white/75 transition hover:border-white hover:text-white"
                  href={appUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Google Play
                </a>
                <a
                  className="flex h-[36px] items-center justify-center border border-white/30 bg-white/5 text-xs text-white/75 transition hover:border-white hover:text-white"
                  href={appUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  App Store
                </a>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-5 text-white/85">
              <a aria-label="Open location" className="transition hover:text-white" href="https://www.google.com/maps/search/?api=1&query=Kathmandu%2C%20Nepal" target="_blank" rel="noreferrer">
                <Globe className="h-4 w-4" aria-hidden="true" />
              </a>
              <a aria-label="Email support" className="transition hover:text-white" href={`mailto:${supportEmail}`}>
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
              </a>
              <Link aria-label="View shop photos" className="transition hover:text-white" to="/shop">
                <Camera className="h-4 w-4" aria-hidden="true" />
              </Link>
              <button aria-label="Share app" className="transition hover:text-white" onClick={handleShare} type="button">
                <Share2 className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-4 text-center text-xs text-white/35">
          Copyright Rimel 2022. All right reserved
        </div>
      </div>
    </footer>
  )
}

export default Footer
