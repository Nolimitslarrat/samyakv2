import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, Phone, Share2, ArrowLeft, Check, Calendar, Scaling, Home, FileText, Map } from 'lucide-react'
import styles from './page.module.css'
import ImageGallery from '@/components/property/ImageGallery'

export const dynamic = 'force-dynamic'

async function getProperty(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/properties/${id}`, {
            cache: 'no-store',
        })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

// Generate Dynamic Metadata for SEO
export async function generateMetadata({ params }) {
    const { id } = await params
    const property = await getProperty(id)

    if (!property) return { title: 'Property Not Found' }

    return {
        title: `${property.title} | Samyak Properties`,
        description: `Check out this ${property.type} for sale in ${property.location}. Price: ₹${property.price}. Contact us for a visit!`,
        openGraph: {
            images: ['/images/hero-bg.jpg'],
        },
    }
}

// Helper for Images
const getImages = (prop) => {
    try {
        const parsed = typeof prop.images === 'string' ? JSON.parse(prop.images) : []
        return parsed.length > 0 ? parsed : [getFallbackImage(prop.type)]
    } catch {
        return [getFallbackImage(prop.type)]
    }
}
const getFallbackImage = (type) => {
    if (type === 'Plot') return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80'
}

export default async function PropertyDetails({ params }) {
    const { id } = await params
    const property = await getProperty(id)

    if (!property) {
        notFound()
    }

    const images = getImages(property)
    const whatsappLink = `https://wa.me/919876543210?text=I am interested in ${property.title} (ID: ${property.id})`

    return (
        <main className={styles.main}>
            <div className={`container ${styles.container}`}>
                <Link href="/properties" className={styles.backLink}>
                    <ArrowLeft size={18} /> Back to Listings
                </Link>

                {/* Gallery Section */}
                <ImageGallery images={images} status={property.status} />

                <div className={styles.contentGrid}>
                    {/* Left: Info */}
                    <div className={styles.infoCol}>
                        <div className={styles.header}>
                            <h1 className={styles.title}>{property.title}</h1>
                            <div className={styles.location}>
                                <MapPin size={20} className={styles.icon} /> {property.location}
                            </div>
                            <div className={styles.price}>₹{property.price.toLocaleString()}</div>
                        </div>

                        <div className={styles.features}>
                            <div className={styles.featItem}>
                                <span className={styles.featLabel}>Type</span>
                                <span className={styles.featVal}><Home size={16} /> {property.type}</span>
                            </div>
                            <div className={styles.featItem}>
                                <span className={styles.featLabel}>Area</span>
                                <span className={styles.featVal}><Scaling size={16} /> {property.area}</span>
                            </div>
                            <div className={styles.featItem}>
                                <span className={styles.featLabel}>Posted</span>
                                <span className={styles.featVal}><Calendar size={16} /> {new Date(property.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className={styles.description}>
                            <h3>Description</h3>
                            <p>{property.description || "No description provided."}</p>
                        </div>

                        {property.video && (
                            <div className={styles.videoSection}>
                                <h3>Video Tour</h3>
                                <video controls className={styles.videoPlayer}>
                                    <source src={property.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </div>

                    {/* Right: Contact Card */}
                    <div className={styles.contactCol}>
                        <div className={styles.contactCard}>
                            <h3>Interested in this property?</h3>
                            <p>Connect with us to schedule a visit or get more details.</p>

                            <a href={whatsappLink} target="_blank" className={styles.whatsappBtn}>
                                <Share2 size={18} /> Share / Chat on WhatsApp
                            </a>
                            <Link href="/contact" className={styles.contactBtn}>
                                <Phone size={18} /> Contact Us Now
                            </Link>

                            <div className={styles.secureNote}>
                                <Check size={14} /> Verified Property
                            </div>

                            {/* Documents Section */}
                            {(property.brochure || property.propertyPlan) && (
                                <div className={styles.docsSection}>
                                    <h4>Property Documents</h4>
                                    <div className={styles.docButtons}>
                                        {property.brochure && (
                                            <a href={property.brochure} target="_blank" className={styles.docBtn} download>
                                                <FileText size={16} /> Brochure
                                            </a>
                                        )}
                                        {property.propertyPlan && (
                                            <a href={property.propertyPlan} target="_blank" className={styles.docBtn}>
                                                <Map size={16} /> Floor Plan
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
