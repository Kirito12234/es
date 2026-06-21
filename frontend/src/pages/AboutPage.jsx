import {
  Camera,
  CircleDollarSign,
  Globe,
  Headphones,
  MessageCircle,
  ShieldCheck,
  Share2,
  ShoppingBag,
  Store,
  Truck,
  UsersRound,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'

const stats = [
  {
    icon: Store,
    label: 'Sellers active in our site',
    value: '10.5k',
  },
  {
    icon: CircleDollarSign,
    label: 'Monthly product sale',
    value: '33k',
    active: true,
  },
  {
    icon: ShoppingBag,
    label: 'Customer active in our site',
    value: '45.5k',
  },
  {
    icon: UsersRound,
    label: 'Annual gross sale in our site',
    value: '25k',
  },
]

const teamMembers = [
  {
    name: 'Tom Cruise',
    role: 'Founder & Chairman',
    initials: 'TC',
    bgClassName: 'from-[#dce8f6] to-[#f6fbff]',
    accentClassName: 'text-[#3f6e9b]',
  },
  {
    name: 'Emma Watson',
    role: 'Managing Director',
    initials: 'EW',
    bgClassName: 'from-[#f7e1de] to-[#fff8f7]',
    accentClassName: 'text-[#9f4b43]',
  },
  {
    name: 'Will Smith',
    role: 'Product Designer',
    initials: 'WS',
    bgClassName: 'from-[#e4e4e4] to-[#fbfbfb]',
    accentClassName: 'text-[#4b4b4b]',
  },
]

const services = [
  {
    title: 'FREE AND FAST DELIVERY',
    copy: 'Free delivery for all orders over $140',
    icon: Truck,
  },
  {
    title: '24/7 CUSTOMER SERVICE',
    copy: 'Friendly 24/7 customer support',
    icon: Headphones,
  },
  {
    title: 'MONEY BACK GUARANTEE',
    copy: 'We return money within 30 days',
    icon: ShieldCheck,
  },
]

function AboutPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <main className="mx-auto max-w-[1170px] px-4 pb-20 pt-10">
        <div className="text-sm text-black/60">
          <Link className="hover:text-black" to="/">
            Home
          </Link>{' '}
          / <span className="text-black">About</span>
        </div>

        <section className="mt-12 grid items-center gap-10 lg:grid-cols-[0.9fr,1.1fr]">
          <div>
            <h1 className="text-5xl font-semibold leading-tight">Our Story</h1>
            <div className="mt-10 space-y-6 text-sm leading-7 text-black/65">
              <p>
                Launched in 2024, Exclusive is South Asia&apos;s premium online shopping
                marketplace with an active presence across fashion, technology, home,
                and lifestyle categories.
              </p>
              <p>
                Supported by a trusted merchandising team and service-led operations,
                we help customers discover standout products while giving sellers a
                strong platform for growth.
              </p>
            </div>
          </div>

          <div className="overflow-hidden bg-[#db4444]">
            <div className="flex min-h-[520px] items-center justify-center bg-[#e98cb0] p-6 sm:p-10">
              <img
                alt="Shopping illustration"
                className="w-full max-w-[620px]"
                src="/auth-shopping-scene.svg"
              />
            </div>
          </div>
        </section>

        <section className="pt-20">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  className={`border px-8 py-9 text-center transition ${
                    stat.active
                      ? 'border-brand bg-brand text-white shadow-panel'
                      : 'border-black/15 bg-white text-black'
                  }`}
                  key={stat.label}
                >
                  <div
                    className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${
                      stat.active ? 'bg-white/15' : 'bg-black/10'
                    }`}
                  >
                    <div
                      className={`flex h-14 w-14 items-center justify-center rounded-full ${
                        stat.active ? 'bg-white text-brand' : 'bg-black text-white'
                      }`}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <p className="mt-6 text-3xl font-semibold">{stat.value}</p>
                  <p className={`mt-2 text-sm ${stat.active ? 'text-white/85' : 'text-black/65'}`}>
                    {stat.label}
                  </p>
                </div>
              )
            })}
          </div>
        </section>

        <section className="pt-20">
          <div className="grid gap-8 md:grid-cols-3">
            {teamMembers.map((member) => (
              <article key={member.name}>
                <div
                  className={`flex h-[430px] items-end justify-center overflow-hidden bg-gradient-to-b ${member.bgClassName}`}
                >
                  <div className="flex h-72 w-56 items-center justify-center rounded-[32px] bg-white/55 shadow-soft">
                    <span className={`text-7xl font-semibold ${member.accentClassName}`}>
                      {member.initials}
                    </span>
                  </div>
                </div>
                <h2 className="mt-8 text-3xl font-medium">{member.name}</h2>
                <p className="mt-2 text-sm text-black/60">{member.role}</p>
                <div className="mt-4 flex items-center gap-4">
                  <Globe className="h-4 w-4 text-black/70" aria-hidden="true" />
                  <Camera className="h-4 w-4 text-black/70" aria-hidden="true" />
                  <MessageCircle className="h-4 w-4 text-black/70" aria-hidden="true" />
                  <Share2 className="h-4 w-4 text-black/70" aria-hidden="true" />
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            {[0, 1, 2, 3, 4].map((index) => (
              <span
                className={`block h-3 w-3 rounded-full ${index === 2 ? 'bg-brand' : 'bg-black/20'}`}
                key={index}
              />
            ))}
          </div>
        </section>

        <section className="pb-4 pt-24">
          <div className="grid gap-10 md:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon

              return (
                <div className="text-center" key={service.title}>
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-black/10">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-black/60">{service.copy}</p>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default AboutPage
