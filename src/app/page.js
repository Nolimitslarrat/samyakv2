import Link from 'next/link'
import { ArrowRight, Search, MapPin, CheckCircle2, ShieldCheck, Banknote, FileText } from 'lucide-react'
import PropertyCard from '@/components/property/PropertyCard'
import UpcomingProjects from '@/components/home/UpcomingProjects'
import MapSection from '@/components/home/MapSection'
import styles from './page.module.css'

// Force dynamic rendering to prevent build-time DB access
export const dynamic = 'force-dynamic'

async function getFeaturedProperties() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/properties`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.slice(0, 3) : []
  } catch (err) {
    console.error('Failed to fetch featured properties:', err)
    return []
  }
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties()

  // SEO JSON-LD for local business
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateAgent',
    name: 'Samyak Properties',
    image: 'https://samyak.org/images/logo.png',
    '@id': 'https://samyak.org',
    url: 'https://samyak.org',
    telephone: '+919876543210',
    priceRange: '₹₹₹',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Market',
      addressLocality: 'Pilkhuwa',
      addressRegion: 'UP',
      postalCode: '245304',
      addressCountry: 'IN'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 28.7112,
      longitude: 77.6616
    },
    sameAs: [
      'https://www.facebook.com/samyakproperties',
      'https://www.instagram.com/samyakproperties'
    ]
  }

  return (
    <main className="min-h-screen bg-slate-50 font-sans">
      {/* JSON-LD Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80")' }}
        ></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0A192F]/90 via-[#0A192F]/70 to-transparent"></div>

        <div className="container relative z-20 mx-auto px-6 lg:px-12 flex flex-col items-start pt-20">
          <span className="inline-block py-1 px-3 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold tracking-wider mb-6 backdrop-blur-md border border-[#D4AF37]/30">
            PREMIUM REAL ESTATE IN UP
          </span>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 max-w-3xl drop-shadow-lg">
            Find Your Dream Property in <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-200">
              Pilkhuwa &amp; Hapur
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl font-light leading-relaxed">
            Trusted by thousands of families. We don't just find you a plot, we help you secure your future with 100% verified documentation.
          </p>

          {/* Search Box - Modern Glassmorphism */}
          <div className="w-full max-w-4xl bg-white/10 backdrop-blur-xl border border-white/20 p-3 rounded-2xl shadow-2xl flex flex-col md:flex-row items-center gap-3">
            <div className="flex-1 flex items-center bg-white/10 rounded-xl px-4 py-3 w-full">
              <MapPin className="text-yellow-400 mr-3" size={24} />
              <select className="bg-transparent text-white w-full outline-none appearance-none cursor-pointer">
                <option className="text-slate-900">Location (All)</option>
                <option className="text-slate-900">Pilkhuwa</option>
                <option className="text-slate-900">Hapur</option>
                <option className="text-slate-900">Ghaziabad</option>
              </select>
            </div>
            
            <div className="flex-1 flex items-center bg-white/10 rounded-xl px-4 py-3 w-full">
              <CheckCircle2 className="text-yellow-400 mr-3" size={24} />
              <select className="bg-transparent text-white w-full outline-none appearance-none cursor-pointer">
                <option className="text-slate-900">Property Type</option>
                <option className="text-slate-900">Plot / Land</option>
                <option className="text-slate-900">Residential Home</option>
                <option className="text-slate-900">Commercial Space</option>
              </select>
            </div>
            
            <button className="w-full md:w-auto bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:from-[#B5952F] hover:to-[#917521] text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:-translate-y-1">
              <Search size={20} className="mr-2" />
              Search
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 md:gap-16 mt-16">
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">500+</h3>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Properties Sold</p>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">10+</h3>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Years Exp.</p>
            </div>
            <div className="w-px h-12 bg-white/20"></div>
            <div>
              <h3 className="text-3xl font-bold text-white mb-1">2k+</h3>
              <p className="text-slate-400 text-sm uppercase tracking-wider">Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-24 bg-slate-50">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-bold text-[#0A192F] mb-4">Featured Properties</h2>
              <p className="text-slate-600 text-lg">Handpicked premium properties providing the best ROI in Pilkhuwa and Hapur.</p>
            </div>
            <Link href="/properties" className="group flex items-center text-[#D4AF37] font-semibold hover:text-[#B5952F] transition-colors">
              View All Properties 
              <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className={styles.propertyGrid}>
            {featuredProperties.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-slate-500 text-lg">No properties available at the moment. Check back soon!</p>
              </div>
            ) : (
              featuredProperties.map(property => (
                <PropertyCard key={property.id} property={property} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Upcoming Projects Section */}
      <UpcomingProjects />

      {/* Why Choose Us Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-slate-50 rounded-l-[100px] -z-10 transform translate-x-1/4"></div>
        
        <div className="container mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-[#0A192F] mb-6">Why Choose Samyak Properties?</h2>
            <p className="text-lg text-slate-600">We ensure transparency, absolute trust, and guarantee the best market rates for our clients.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] mb-4">100% Verified Listings</h3>
              <p className="text-slate-600 leading-relaxed">Every property is physically verified by our legal team to ensure completely clean paperwork and dispute-free status.</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-yellow-50 text-[#D4AF37] rounded-2xl flex items-center justify-center mb-6">
                <Banknote size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] mb-4">Best Market Price</h3>
              <p className="text-slate-600 leading-relaxed">We facilitate direct deals with owners. Absolutely no hidden charges or absurd middlemen commissions.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-[#0A192F] mb-4">Full Documentation</h3>
              <p className="text-slate-600 leading-relaxed">We assist you from the initial agreement to final registry, making the entire property transfer process seamless.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Map Section */}
      <section className="py-24 bg-slate-900 text-white relative">
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Geographic Presence</h2>
            <p className="text-slate-400 text-lg">Serving key locations across Western UP with prime real estate offerings.</p>
          </div>
          <div className="bg-white/5 p-4 rounded-3xl backdrop-blur-sm border border-white/10 shadow-2xl">
            <MapSection />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#0A192F] to-[#172A46] relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="container mx-auto px-6 lg:px-12 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to find your perfect property?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Get in touch with our expert realtors today for a free, no-obligation consultation about your real estate needs.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="w-full sm:w-auto px-8 py-4 bg-[#D4AF37] hover:bg-[#B5952F] text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]">
              Contact Us Now
            </Link>
            <Link href="/properties" className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-white/30 hover:border-white text-white font-bold rounded-xl transition-all">
              Browse Listings
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
