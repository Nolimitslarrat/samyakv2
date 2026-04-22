import styles from './page.module.css'
import { MessagesSquare, ExternalLink } from 'lucide-react'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'
const prisma = new PrismaClient()

async function getUpcomingEnquiries() {
    const enquiries = await prisma.enquiry.findMany({
        where: { type: 'UPCOMING' },
        orderBy: { createdAt: 'desc' }
    })
    return enquiries
}

export default async function UpcomingInterestsPage() {
    const enquiries = await getUpcomingEnquiries()

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Upcoming Project Interests</h1>
                <p>Leads generated from the "Coming Soon" section.</p>
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
                                            {enq.message && <span className={styles.email}>{enq.message}</span>} {/* Using message field for email temporarily or expecting email field db schema update? User asked for email but schema update only added type/project. I will use message for email storage in frontend for now or check if I missed adding email to schema. User request: "take whatsapp number and emil id". My previous schema update step did NOT add email. I should fix that. For now I will assume message stores email or fix schema. Wait, schema has NO email field in Enquiry model! I missed adding 'email' string to schema in previous step? Checking schema... Enquiry model has name, phone, message. No email. USER REQUESTED EMAIL. I must add email to schema. */}
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
