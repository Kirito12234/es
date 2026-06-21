import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto flex max-w-[1170px] flex-1 flex-col px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">404 Error</span>
        </div>

        <section className="flex flex-1 items-center justify-center py-24 text-center">
          <div>
            <h1 className="text-[64px] font-semibold tracking-[0.02em] sm:text-[96px]">404 Not Found</h1>
            <p className="mt-6 text-sm text-black/60">
              Your visited page was not found. You may go back to the home page.
            </p>
            <Link
              className="mt-10 inline-flex items-center justify-center bg-brand px-12 py-4 text-sm font-medium text-white transition hover:bg-brand-dark"
              to="/"
            >
              Back to home page
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default NotFoundPage
