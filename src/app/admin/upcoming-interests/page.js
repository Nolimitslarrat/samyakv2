import styles from './page.module.css'
import { MessagesSquare } from 'lucide-react'

export const dynamic = 'force-dynamic'

async function getUpcomingEnquiries() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/enquiries?type=UPCOMING`, {
            cache: 'no-store',
        })
        if (!res.ok) return []
        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch (err) {
        console.error('Failed to fetch upcoming enquiries:', err)
        return []
    }
}

export default async function UpcomingInterestsPage() {
    const enquiries = await getUpcomingEnquiries()

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Upcoming Project Interests</h1>
                <p>Leads generated from the &quot;Coming Soon&quot; section.</p>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Project</th>
                            <th>Customer</th>
                            <th>Contact</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enquiries.length === 0 ? (
                            <tr>
                                <td colSpan="5" className={styles.empty}>No interests recorded yet.</td>
                            </tr>
                        ) : (
                            enquiries.map(enq => (
                                <tr key={enq.id}>
                                    <td>
                                        <span className={styles.projectBadge}>{enq.projectName || 'General'}</span>
                                    </td>
                                    <td>
                                        <div className={styles.name}>{enq.name}</div>
                                    </td>
                                    <td>
                                        <div className={styles.contact}>
                                            <span>{enq.phone}</span>
                                            {enq.emailCaptured && <span className={styles.email}>{enq.emailCaptured}</span>}
                                        </div>
                                    </td>
                                    <td>{new Date(enq.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <a
                                            href={`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}?text=Hello ${enq.name}, regarding your interest in ${enq.projectName}...`}
                                            target="_blank"
                                            className={styles.waBtn}
                                        >
                                            <MessagesSquare size={16} /> Reply
                                        </a>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
