import Link from 'next/link'
import styles from './page.module.css'
import { Plus, MapPin, Calendar, Edit, Trash2 } from 'lucide-react'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'
const prisma = new PrismaClient()

async function getProjects() {
    const projects = await prisma.project.findMany({
        orderBy: { createdAt: 'desc' }
    })
    return projects
}

export default async function AdminProjectsPage() {
    const projects = await getProjects()

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Manage Projects</h1>
                    <p>Townships, Commercial Hubs, and Large Developments</p>
                </div>
                <Link href="/admin/projects/add" className={styles.addBtn}>
                    <Plus size={20} /> Add New Project
                </Link>
            </div>

            <div className={styles.grid}>
                {projects.length === 0 ? <div className={styles.empty}>No schemes/projects added yet.</div> : (
                    projects.map(project => (
                        <div key={project.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <img src={project.image} alt={project.title} className={styles.image} />
                                <span className={styles.statusBadge}>{project.status}</span>
                            </div>
                            <div className={styles.content}>
                                <h3>{project.title}</h3>
                                <div className={styles.row}>
                                    <MapPin size={16} /> {project.location}
                                </div>
                                <div className={styles.row}>
                                    <Calendar size={16} /> Launch: {project.launchDate}
                                </div>
                                <div className={styles.stats}>
                                    <span>Type: {project.type}</span>
                                </div>
                                <div className={styles.actions}>
                                    <button className={styles.actionBtn}>
                                        <Edit size={16} /> Edit
                                    </button>
                                    <button className={styles.deleteBtn}>
                                        <Trash2 size={16} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
