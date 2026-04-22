'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, FileText } from 'lucide-react'
import Link from 'next/link'
import styles from './page.module.css'

export default function AddProjectPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState(null)
    const [brochure, setBrochure] = useState(null)

    const [formData, setFormData] = useState({
        title: '',
        location: '',
        type: 'Township',
        status: 'Upcoming',
        launchDate: '',
        description: '',
        reraId: '',
        amenities: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = new FormData()
        Object.keys(formData).forEach(key => data.append(key, formData[key]))
        if (image) data.append('image', image)
        if (brochure) data.append('brochure', brochure)

        try {
            const res = await fetch('/api/projects', {
                method: 'POST',
                body: data
            })
            if (res.ok) {
                router.push('/admin/projects')
            } else {
                alert('Failed to save project')
            }
        } catch (err) {
            console.error(err)
            alert('Error saving project')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.wrapper}>
            <Link href="/admin/projects" className={styles.backLink}>
                <ArrowLeft size={20} /> Back to Projects
            </Link>

            <div className={styles.header}>
                <h1 className={styles.title}>Add New Project</h1>
                <p>Create a listing for a major development.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Project Title</label>
                        <input
                            className={styles.input}
                            required
                            placeholder="e.g. Samyak Green City"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Location</label>
                        <input
                            className={styles.input}
                            required
                            placeholder="e.g. Jewar Airport Road"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Project Type</label>
                        <select
                            className={styles.select}
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option>Township</option>
                            <option>Commercial</option>
                            <option>Residential Society</option>
                            <option>Farm Houses</option>
                            <option>Industrial</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Status</label>
                        <select
                            className={styles.select}
                            value={formData.status}
                            onChange={e => setFormData({ ...formData, status: e.target.value })}
                        >
                            <option>Upcoming</option>
                            <option>Ongoing</option>
                            <option>Completed</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Launch Date / Possession</label>
                        <input
                            className={styles.input}
                            placeholder="e.g. March 2026"
                            value={formData.launchDate}
                            onChange={e => setFormData({ ...formData, launchDate: e.target.value })}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>RERA ID (Optional)</label>
                        <input
                            className={styles.input}
                            placeholder="e.g. UPRERAPRJ..."
                            value={formData.reraId}
                            onChange={e => setFormData({ ...formData, reraId: e.target.value })}
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        className={styles.textarea}
                        rows="4"
                        required
                        placeholder="Detailed overview of the project..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                <div className={styles.formGroup}>
                    <label>Amenities (Comma separated)</label>
                    <input
                        className={styles.input}
                        placeholder="e.g. Club House, Swimming Pool, 24x7 Security"
                        value={formData.amenities}
                        onChange={e => setFormData({ ...formData, amenities: e.target.value })}
                    />
                </div>

                {/* Uploads */}
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Main Image *</label>
                        <div className={styles.uploadBox}>
                            <input
                                type="file"
                                required
                                accept="image/*"
                                onChange={e => setImage(e.target.files[0])}
                                className={styles.fileInput}
                            />
                            <div className={styles.uploadPlaceholder}>
                                <Upload size={24} />
                                <span>{image ? image.name : "Upload Hero Image"}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Brochure (PDF)</label>
                        <div className={styles.uploadBox} style={{ borderColor: '#cbd5e1' }}>
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={e => setBrochure(e.target.files[0])}
                                className={styles.fileInput}
                            />
                            <div className={styles.uploadPlaceholder}>
                                <FileText size={24} />
                                <span>{brochure ? brochure.name : "Upload Brochure PDF"}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>Cancel</button>
                    <button type="submit" className={styles.saveBtn} disabled={loading}>
                        {loading ? 'Saving...' : <><Save size={18} /> Publish Project</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
