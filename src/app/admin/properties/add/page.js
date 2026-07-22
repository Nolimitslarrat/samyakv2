'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, Video, X, Image as ImageIcon } from 'lucide-react'
import styles from './page.module.css'

export default function AddProperty() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: '', price: '', location: '', type: 'Plot', area: '', status: 'Available', description: ''
    })
    const [images, setImages] = useState([])
    const [video, setVideo] = useState(null)

    const handleImageChange = (e) => {
        if (e.target.files) {
            setImages(prev => [...prev, ...Array.from(e.target.files)])
        }
    }

    const removeImage = (index) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = new FormData()
        Object.keys(formData).forEach(key => data.append(key, formData[key]))

        images.forEach(file => data.append('images', file))
        if (video) data.append('video', video)
        if (formData.brochure) data.append('brochure', formData.brochure)
        if (formData.propertyPlan) data.append('propertyPlan', formData.propertyPlan)

        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                body: data
            })

            if (res.ok) {
                alert("Property Added Successfully")
                router.push('/admin/properties')
            } else {
                const errData = await res.json().catch(() => ({}));
                alert("Failed to add property: " + (errData.error || "Unknown error"));
            }
        } catch (err) {
            console.error(err)
            alert("Error submitting form")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.wrapper}>
            <Link href="/admin/properties" className={styles.backLink}>
                <ArrowLeft size={18} /> Back to List
            </Link>

            <div className={styles.header}>
                <h1 className={styles.title}>Add New Property</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.formCard}>
                <div className={styles.grid}>
                    {/* Basic Fields */}
                    <div className={styles.formGroup}>
                        <label>Property Title</label>
                        <input
                            type="text" required className={styles.input}
                            value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Price (₹)</label>
                        <input
                            type="number" required className={styles.input}
                            value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Location</label>
                        <input
                            type="text" required className={styles.input}
                            value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Type</label>
                        <select className={styles.select} value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}>
                            <option value="Plot">Plot / Land</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Area (Sq. Yards/Meters)</label>
                        <input
                            type="number" required className={styles.input}
                            value={formData.area} onChange={e => setFormData({ ...formData, area: e.target.value })}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Status</label>
                        <select className={styles.select} value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                            <option value="Available">Available</option>
                            <option value="Sold">Sold</option>
                            <option value="Under Negotiation">Under Negotiation</option>
                        </select>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label>Description</label>
                    <textarea
                        rows="4" className={styles.textarea}
                        value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                </div>

                {/* Image Upload */}
                <div className={styles.formGroup}>
                    <label>Images (Select Multiple)</label>
                    <div className={styles.uploadBox}>
                        <input
                            type="file" multiple accept="image/*"
                            className={styles.fileInput}
                            onChange={handleImageChange}
                        />
                        <div className={styles.uploadPlaceholder}>
                            <Upload size={24} />
                            <p>Click to upload images</p>
                        </div>
                    </div>
                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className={styles.previews}>
                            {images.map((file, idx) => (
                                <div key={idx} className={styles.previewItem}>
                                    <div className={styles.previewIcon}><ImageIcon size={16} /></div>
                                    <span className={styles.filename}>{file.name}</span>
                                    <button type="button" onClick={() => removeImage(idx)} className={styles.removeBtn}><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Video Upload */}
                <div className={styles.formGroup}>
                    <label>Property Video (Optional)</label>
                    <div className={styles.uploadBox}>
                        <input
                            type="file" accept="video/*"
                            className={styles.fileInput}
                            onChange={(e) => setVideo(e.target.files[0])}
                        />
                        <div className={styles.uploadPlaceholder}>
                            <Video size={24} />
                            <p>{video ? video.name : 'Click to upload video'}</p>
                        </div>
                    </div>
                </div>

                {/* Documents Upload */}
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Brochure (PDF)</label>
                        <div className={styles.miniUpload}>
                            <input type="file" accept=".pdf" onChange={(e) => setFormData({ ...formData, brochure: e.target.files[0] })} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Property Plan (Image)</label>
                        <div className={styles.miniUpload}>
                            <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, propertyPlan: e.target.files[0] })} />
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>Cancel</button>
                    <button type="submit" className={styles.saveBtn} disabled={loading}>
                        {loading ? 'Saving...' : <><Save size={18} /> Save Property</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
