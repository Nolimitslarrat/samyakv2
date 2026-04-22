import Link from 'next/link'
import styles from './page.module.css'
import { Building2, IndianRupee, Users, TrendingUp, Plus, ExternalLink, MessageSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getStats() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/dashboard`, {
            cache: 'no-store',
        })
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
    } catch (error) {
        console.error("Dashboard Error:", error)
        return {
            propertyCount: 0,
            enquiryCount: 0,
            revenue: 'Error',
            recentProperties: [],
            recentEnquiries: [],
        }
    }
}

export default async function AdminDashboard() {
    const { propertyCount, enquiryCount, revenue, recentProperties, recentEnquiries } = await getStats()

    return (
        <div className={styles.dashboard}>
            <div className={styles.welcomeSection}>
                <h1>Dashboard Overview</h1>
                <p>Welcome back, Admin. Here&apos;s what&apos;s happening today.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#e0e7ff', color: '#4f46e5' }}>
                        <Building2 size={24} />
                    </div>
                    <div>
                        <h3>{propertyCount}</h3>
                        <p>Total Properties</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#dcfce7', color: '#16a34a' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <h3>{enquiryCount}</h3>
                        <p>Active Enquiries</p>
                    </div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statIcon} style={{ background: '#fef3c7', color: '#d97706' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3>{revenue}</h3>
                        <p>Total Revenue (Est)</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <h2 className={styles.sectionTitle}>Quick Actions</h2>
            <div className={styles.actionsGrid}>
                <Link href="/admin/properties/add" className={styles.actionCard}>
                    <Plus size={20} />
                    <span>Add New Property</span>
                </Link>
                <Link href="/admin/enquiries" className={styles.actionCard}>
                    <MessageSquare size={20} />
                    <span>View Enquiries</span>
                </Link>
                <Link href="/" target="_blank" className={styles.actionCard}>
                    <ExternalLink size={20} />
                    <span>View Live Website</span>
                </Link>
            </div>

            <div className={styles.feedGrid}>
                {/* Recent Properties */}
                <div className={styles.feedCard}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Properties</h3>
                        <Link href="/admin/properties" className={styles.viewMore}>View All</Link>
                    </div>
                    <div className={styles.list}>
                        {recentProperties.length === 0 ? <p className={styles.empty}>No properties yet.</p> : (
                            recentProperties.map(p => (
                                <div key={p.id} className={styles.listItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>{p.title}</h4>
                                        <p>{p.location} • ₹{p.price}</p>
                                    </div>
                                    <div className={`status ${p.status.toLowerCase()}`}>{p.status}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Enquiries */}
                <div className={styles.feedCard}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Enquiries</h3>
                        <Link href="/admin/enquiries" className={styles.viewMore}>View All</Link>
                    </div>
                    <div className={styles.list}>
                        {recentEnquiries.length === 0 ? <p className={styles.empty}>No enquiries yet.</p> : (
                            recentEnquiries.map(e => (
                                <div key={e.id} className={styles.listItem}>
                                    <div className={styles.itemInfo}>
                                        <h4>{e.name}</h4>
                                        <p>{e.phone}</p>
                                    </div>
                                    <span className={styles.date}>{new Date(e.createdAt).toLocaleDateString()}</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
