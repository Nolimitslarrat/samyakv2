'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, MapPin } from 'lucide-react'
import styles from './UpcomingProjects.module.css'

export default function UpcomingProjectsClient({ initialProjects = [] }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null)
    const [formData, setFormData] = useState({ name: '', phone: '', email: '' })
    const [status, setStatus] = useState('idle') // idle, submitting, success, error

    const handleOpenModal = (project) => {
        setSelectedProject(project)
        setIsModalOpen(true)
        setStatus('idle')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('submitting')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    type: 'UPCOMING',
                    projectName: selectedProject ? selectedProject.title : 'General Notification',
                    message: formData.email
                })
            })

            if (res.ok) {
                setStatus('success')
                setTimeout(() => {
                    setIsModalOpen(false)
                    setFormData({ name: '', phone: '', email: '' })
                }, 2000)
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        }
    }

    if (initialProjects.length === 0) {
        return null // Don't show section if no projects
    }

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <div>
                        <h2 className={styles.title}>Coming Soon</h2>
                        <p className={styles.subtitle}>Be the first to know about our next big landmarks.</p>
                    </div>
                    <button className={styles.notifyBtn} onClick={() => handleOpenModal(null)}>Notify Me</button>
                </div>

                <div className={styles.grid}>
                    {initialProjects.map(project => (
                        <div key={project.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <span className={styles.badge}>Launching {project.launchDate}</span>
                                <img src={project.image} alt={project.title} className={styles.image} />
                                <div className={styles.overlay}>
                                    <Link href={`/projects/${project.id}`} className={styles.overlayBtn}>
                                        View Details
                                    </Link>
                                    <button onClick={() => handleOpenModal(project)} className={styles.overlayBtn}>
                                        Notify Me <ArrowRight size={16} />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.content}>
                                <div className={styles.meta}>
                                    <span className={styles.type}>{project.type}</span>
                                </div>
                                <h3>{project.title}</h3>
                                <div className={styles.location}>
                                    <MapPin size={16} /> {project.location}
                                </div>
                                <p>{project.description.substring(0, 100)}...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>&times;</button>

                        {status === 'success' ? (
                            <div className={styles.successMessage}>
                                <h3>Thank You!</h3>
                                <p>We have recorded your interest. We will update you via WhatsApp/Email when we launch.</p>
                            </div>
                        ) : (
                            <>
                                <h3>Get Launch Updates</h3>
                                <p className={styles.modalSubtitle}>
                                    {selectedProject ? `Interested in ${selectedProject.title}?` : "Be the first to know about new launches."}
                                </p>

                                <form onSubmit={handleSubmit} className={styles.form}>
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="WhatsApp Number"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <button type="submit" disabled={status === 'submitting'}>
                                        {status === 'submitting' ? 'Submitting...' : 'Notify Me'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    )
}
