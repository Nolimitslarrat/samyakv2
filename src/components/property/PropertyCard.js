import Image from 'next/image'
import Link from 'next/link'
import styles from './PropertyCard.module.css'
import { MapPin, BedDouble, Scaling } from 'lucide-react'

// Helper to determine image based on type if missing (Mock Logic)
const getFallbackImage = (type) => {
    if (type === 'Plot') return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    if (type === 'Commercial') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80'
}

export default function PropertyCard({ property }) {
    // Parse images if it's a JSON string
    let images = []
    try {
        images = typeof property.images === 'string' ? JSON.parse(property.images) : []
    } catch (e) {
        images = []
    }

    const imageUrl = images.length > 0 ? images[0] : getFallbackImage(property.type)

    return (
        <div className={styles.card}>
            <div className={styles.imageWrapper}>
                <div className={styles.badge} data-status={property.status}>
                    {property.status}
                </div>
                <Image
                    src={imageUrl}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                />
                <div className={styles.priceTag}>
                    {property.price}
                </div>
            </div>

            <div className={styles.content}>
                <span className={styles.type}>{property.type}</span>
                <h3 className={styles.title}>
                    <Link href={`/properties/${property.id}`}>
                        {property.title}
                    </Link>
                </h3>

                <div className={styles.location}>
                    <MapPin size={16} />
                    <span>{property.location}</span>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <Scaling size={18} />
                        <span>{property.area}</span>
                    </div>
                    {/* Add more features conditionally based on type if needed */}
                </div>

                <Link href={`/properties/${property.id}`} className={styles.viewBtn}>
                    View Details
                </Link>
            </div>
        </div>
    )
}
