import Link from 'next/link'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { MapPin, Calendar, FileText, CheckCircle, ArrowLeft, Phone } from 'lucide-react'
import styles from './page.module.css'

export const dynamic = 'force-dynamic'

async function getProject(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects/${id}`, {
            cache: 'no-store',
        })
        if (!res.ok) return null
        return res.json()
    } catch {
        return null
    }
}

export async function generateMetadata({ params }) {
    const { id } = await params
    const project = await getProject(id)
    if (!project) return { title: 'Project Not Found' }
    return {
        title: `${project.title} - ${project.location} | Samyak Properties`,
        description: `Explore ${project.title}, a premium ${project.type} in ${project.location}. Launching ${project.launchDate}.`
    }
}

export default async function ProjectDetailsPage({ params }) {
    const { id } = await params
    const project = await getProject(id)

    if (!project) notFound()

    const amenitiesList = project.amenities ? project.amenities.split(',').map(s => s.trim()) : []

    return (
        <main>
            {/* Hero Section */}
            <div className={styles.hero}>
                <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className={styles.heroImage}
                    priority
                />
                <div className={styles.heroOverlay}>
                    <div className="container">
                        <span className={styles.badge}>{project.status}</span>
                        <h1 className={styles.title}>{project.title}</h1>
                        <div className={styles.location}>
                            <MapPin size={20} /> {project.location}
                        </div>
                    </div>
                </div>
            </div>

            <div className={`container ${styles.contentWrapper}`}>
                <Link href="/" className={styles.backLink}>
                    <ArrowLeft size={18} /> Back to Home
                </Link>

                <div className={styles.grid}>
                    {/* Left Column: Details */}
                    <div className={styles.mainCol}>
                        <div className={styles.section}>
                            <h2>Overview</h2>
                            <p className={styles.description}>{project.description}</p>

                            <div className={styles.highlights}>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Type</span>
                                    <span className={styles.value}>{project.type}</span>
                                </div>
                                <div className={styles.stat}>
                                    <span className={styles.label}>Launch</span>
                                    <span className={styles.value}>{project.launchDate || 'To be announced'}</span>
                                </div>
                                {project.reraId && (
                                    <div className={styles.stat}>
                                        <span className={styles.label}>RERA ID</span>
                                        <span className={styles.value}>{project.reraId}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {amenitiesList.length > 0 && (
                            <div className={styles.section}>
                                <h2>Amenities &amp; Features</h2>
                                <div className={styles.amenitiesGrid}>
                                    {amenitiesList.map((item, idx) => (
                                        <div key={idx} className={styles.amenityItem}>
                                            <CheckCircle size={18} className={styles.checkIcon} />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: CTA */}
                    <div className={styles.sidebar}>
                        <div className={styles.ctaCard}>
                            <h3>Interested in this Project?</h3>
                            <p>Get exclusive launch offers and priority booking.</p>

                            {project.brochure && (
                                <a href={project.brochure} download className={styles.brochureBtn}>
                                    <FileText size={18} /> Download Brochure
                                </a>
                            )}

                            <a href={`https://wa.me/919910005995?text=I am interested in ${project.title}`} target="_blank" className={styles.contactBtn}>
                                <Phone size={18} /> Contact Sales
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
