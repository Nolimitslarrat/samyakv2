import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MapPin, Phone, Share2, ArrowLeft, Check, Calendar, Scaling, Home, FileText, Map, Ruler } from 'lucide-react'
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

    const rateStr = property.pricePerUnit
        ? ` | ₹${property.pricePerUnit.toLocaleString('en-IN')}/gaj`
        : ''

    return {
        title: `${property.title} | Samyak Properties - ${property.location}`,
        description: `${property.type} for sale in ${property.location}. Area: ${property.area} Sq. Yards${rateStr}. Buy premium real estate in Pilkhuwa and Hapur with Samyak Properties.`,
        keywords: [property.type, property.location, 'Samyak Properties', `Buy ${property.type} in ${property.location}`, 'Property for sale Hapur Pilkhuwa'],
        openGraph: {
            title: `${property.title} | Samyak Properties`,
            description: `${property.type} for sale in ${property.location}.`,
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

    // Contact number — use property-specific or fallback to company number
    const rawPhone = (property.contactPhone || '919548278205').replace(/[^0-9]/g, '')
    const displayPhone = rawPhone.startsWith('91') ? rawPhone.slice(2) : rawPhone
    const whatsappLink = `https://wa.me/${rawPhone.startsWith('91') ? rawPhone : '91' + rawPhone}?text=Namaste! Main ${encodeURIComponent(property.title)} (ID: ${property.id}) mein interested hoon. Kripya details batayein.`
    const callLink = `tel:+91${displayPhone}`

    // Calculate rate per gaj
    const ratePerGaj = property.pricePerUnit
        ? property.pricePerUnit
        : property.area > 0 ? Math.round(property.price / property.area) : null

    // Generate Structured JSON-LD Data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'RealEstateListing',
        name: property.title,
        description: property.description
            ? property.description.replace(/<[^>]+>/g, '') // Strip HTML for SEO
            : `Property in ${property.location}`,
        image: images,
        offers: {
            '@type': 'Offer',
            price: property.price,
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock'
        },
    }

    return (
        <main className={styles.main}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
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
                            {/* Badges */}
                            <div className={styles.badges}>
                                <span className={styles.typeBadge}>{property.type}</span>
                                {property.isOnRoad && (
                                    <span className={styles.onRoadBadge}>🛣️ On-Road Property</span>
                                )}
                            </div>

                            <h1 className={styles.title}>{property.title}</h1>
                            <div className={styles.location}>
                                <MapPin size={20} className={styles.icon} /> {property.location}
                            </div>

                            {/* Price section */}
                            <div className={styles.priceSection}>
                                <div className={styles.price}>₹{property.price.toLocaleString('en-IN')}</div>
                                {ratePerGaj && (
                                    <div className={styles.rateTag}>
                                        ₹{ratePerGaj.toLocaleString('en-IN')} / gaj
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Key Details Grid */}
                        <div className={styles.features}>
                            <div className={styles.featItem}>
                                <span className={styles.featLabel}>Type</span>
                                <span className={styles.featVal}><Home size={16} /> {property.type}</span>
                            </div>
                            <div className={styles.featItem}>
                                <span className={styles.featLabel}>Area</span>
                                <span className={styles.featVal}><Scaling size={16} /> {property.area} Sq. Yards</span>
                            </div>
                            {property.dimensions && (
                                <div className={styles.featItem}>
                                    <span className={styles.featLabel}>Dimensions</span>
                                    <span className={styles.featVal}>📐 {property.dimensions}</span>
                                </div>
                            )}
                            {property.frontWidth && (
                                <div className={styles.featItem}>
                                    <span className={styles.featLabel}>Front Width</span>
                                    <span className={styles.featVal}><Ruler size={16} /> {property.frontWidth} feet</span>
                                </div>
                            )}
                            <div className={styles.featItem}>
                                <span className={styles.featLabel}>Posted</span>
                                <span className={styles.featVal}>
                                    <Calendar size={16} />
                                    {new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                            </div>
                        </div>

                        {/* Description — renders HTML from Quill */}
                        <div className={styles.description}>
                            <h3>Description</h3>
                            {property.description
                                ? <div dangerouslySetInnerHTML={{ __html: property.description }} className={styles.richText} />
                                : <p>No description provided.</p>
                            }
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
                            <p>Samyak Properties ke expert se baat karein. Site visit schedule karein ya aur details lein.</p>

                            <a href={whatsappLink} target="_blank" className={styles.whatsappBtn}>
                                <Share2 size={18} /> Chat on WhatsApp
                            </a>
                            <a href={callLink} className={styles.callBtn}>
                                <Phone size={18} /> Call: {displayPhone.replace(/(\d{5})(\d{5})/, '$1 $2')}
                            </a>

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
