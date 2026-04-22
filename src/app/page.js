import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Search, MapPin, CheckCircle2 } from 'lucide-react'
import { PrismaClient } from '@prisma/client'
import styles from './page.module.css'
import PropertyCard from '@/components/property/PropertyCard'
import UpcomingProjects from '@/components/home/UpcomingProjects'
import MapSection from '@/components/home/MapSection'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function getFeaturedProperties() {
  const properties = await prisma.property.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
    // In real app, filter by featured: true
  })
  return properties
}

export default async function Home() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <div className={`container ${styles.heroContent}`}>
          <h1 className={styles.heroTitle}>
            Find Your Dream Property in <br />
            <span className={styles.highlight}>Pilkhuwa & Hapur</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Trusted by thousands of families. We not only find you a plot, we find you a future.
          </p>

          <div className={styles.searchBox}>
            <div className={styles.inputGroup}>
              <MapPin className={styles.icon} size={20} />
              <select className={styles.select}>
                <option>Location (All)</option>
                <option>Pilkhuwa</option>
                <option>Hapur</option>
                <option>Ghaziabad</option>
              </select>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.inputGroup}>
              <CheckCircle2 className={styles.icon} size={20} />
              <select className={styles.select}>
                <option>Property Type</option>
                <option>Plot / Land</option>
                <option>Residential</option>
                <option>Commercial</option>
              </select>
            </div>
            <button className={styles.searchBtn}>
              <Search size={20} />
              <span>Search</span>
            </button>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <h3>500+</h3>
              <p>Properties Sold</p>
            </div>
            <div className={styles.statItem}>
              <h3>10+</h3>
              <p>Years Experience</p>
            </div>
            <div className={styles.statItem}>
              <h3>2000+</h3>
              <p>Happy Clients</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Featured Properties</h2>
              <p className={styles.sectionSubtitle}>Handpicked premium properties just for you</p>
            </div>
            <Link href="/properties" className={styles.viewAllBtn}>
              View All <ArrowRight size={18} />
            </Link>
          </div>

          <div className={styles.propertyGrid}>
            {featuredProperties.length === 0 ? (
              <p style={{ textAlign: 'center', width: '100%', padding: '2rem', color: '#64748b' }}>
                No properties available at the moment.
              </p>
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

      {/* Coverage Map Section */}
      <section className={styles.section} style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className={styles.sectionTitle}>Our Presence</h2>
              <p className={styles.sectionSubtitle}>Serving key locations across the region</p>
            </div>
          </div>
          <MapSection />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className={styles.featuresSection}>
        <div className="container">
          <div className={styles.featureContent}>
            <h2 className={styles.sectionTitle}>Why Choose Samyak Properties?</h2>
            <p className={styles.sectionSubtitle}>We ensure transparency, trust, and the best market rates.</p>

            <div className={styles.featureGrid}>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🛡️</div>
                <h3>100% Verified Listings</h3>
                <p>Every property is physically verified by our team to ensure clean paperwork.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>💰</div>
                <h3>Best Market Price</h3>
                <p>Direct deals with owners. No hidden charges or middlemen commissions.</p>
              </div>
              <div className={styles.featureCard}>
                <div className={styles.featureIcon}>🤝</div>
                <h3>Full Documentation Support</h3>
                <p>We assist you from agreement to registry, making the process hassle-free.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaCard}>
            <h2>Ready to find your perfect property?</h2>
            <p>Get in touch with us today for a free consultation.</p>
            <div className={styles.ctaButtons}>
              <Link href="/contact" className="btn btn-primary">Contact Us Now</Link>
              <Link href="/properties" className="btn btn-outline" style={{ borderColor: 'white', color: 'white' }}>Browse Listings</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
