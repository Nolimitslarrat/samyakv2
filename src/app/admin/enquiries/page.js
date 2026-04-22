import { MessageSquare, Calendar, Phone, Mail, Reply, Trash2, Share2 } from 'lucide-react'
import { PrismaClient } from '@prisma/client'
import styles from './page.module.css'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function getEnquiries() {
    const enquiries = await prisma.enquiry.findMany({
        orderBy: { createdAt: 'desc' }
    })
    return enquiries
}

export default async function AdminEnquiries() {
    const enquiries = await getEnquiries()

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Customer Enquiries</h1>
                <div className={styles.countBadge}>{enquiries.length} Messages</div>
            </div>

            <div className={styles.grid}>
                {enquiries.length === 0 ? (
                    <div className={styles.emptyState}>
                        <MessageSquare size={48} color="#cbd5e1" />
                        <p>No enquiries yet.</p>
                    </div>
                ) : (
                    enquiries.map((msg) => (
                        <div key={msg.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.userInfo}>
                                    <div className={styles.avatar}>
                                        {msg.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className={styles.userName}>{msg.name}</h3>
                                        <div className={styles.metaRow}>
                                            <span className={styles.metaItem}>
                                                <Phone size={14} /> {msg.phone}
                                            </span>
                                            <span className={styles.metaItem}>
                                                <Calendar size={14} /> {new Date(msg.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.actions}>
                                    <a href={`https://wa.me/91${msg.phone.replace(/\D/g, '')}`} target="_blank" className={styles.actionBtn} title="Reply on WhatsApp">
                                        <Reply size={18} />
                                    </a>
                                    <button className={styles.actionBtn} title="Delete">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className={styles.messageBody}>
                                {msg.message || "No additional message provided."}
                                {msg.propertyId && (
                                    <div className={styles.contextBadge}>
                                        Ref: Property #{msg.propertyId}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
