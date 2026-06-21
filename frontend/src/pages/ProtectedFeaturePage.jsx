import { ArrowRight, ShieldCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'
import { useAuth } from '../hooks/useAuth.jsx'

function ProtectedFeaturePage({
  eyebrow,
  title,
  description,
  summary,
  ctaLabel = 'Back to Home',
  ctaTo = '/',
}) {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">{title}</span>
        </div>

        <section className="mt-10 grid gap-8 lg:grid-cols-[0.95fr,1.05fr]">
          <div className="bg-black px-8 py-12 text-white sm:px-12">
            <p className="text-sm font-medium text-brand">{eyebrow}</p>
            <h1 className="mt-5 text-4xl font-semibold leading-tight">{title}</h1>
            <p className="mt-5 max-w-[560px] text-sm leading-7 text-white/75">{description}</p>

            <div className="mt-8 border border-white/15 p-6">
              <p className="text-sm text-white/70">Signed in user</p>
              <p className="mt-2 text-2xl font-semibold">{user.name}</p>
              <p className="mt-2 text-sm text-white/70">{user.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-black/10 p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
                <ShieldCheck className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="mt-6 text-2xl font-semibold">Protected Page</h2>
              <p className="mt-3 text-sm leading-7 text-black/60">{summary}</p>
            </div>

            <div className="border border-black/10 p-8">
              <h2 className="text-2xl font-semibold">Next Step</h2>
              <p className="mt-3 text-sm leading-7 text-black/60">
                This route is now connected from the home page and navbar. You can
                expand it into the full feature screen without changing the auth flow.
              </p>
              <Link
                className="mt-8 inline-flex items-center gap-3 bg-brand px-8 py-3 text-sm font-medium text-white transition hover:bg-brand-dark"
                to={ctaTo}
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default ProtectedFeaturePage
