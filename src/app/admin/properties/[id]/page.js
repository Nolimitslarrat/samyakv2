'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Upload, Video, X, Image as ImageIcon } from 'lucide-react'
import styles from '../add/page.module.css'

export default function EditProperty() {
    const router = useRouter()
    const params = useParams()
    const propertyId = params.id

    const [loading, setLoading] = useState(false)
    const [fetchingProperty, setFetchingProperty] = useState(true)
    const [formData, setFormData] = useState({
        title: '', price: '', location: '', type: 'Plot', area: '', status: 'Available', description: ''
    })
    const [existingImages, setExistingImages] = useState([]) // URLs of existing images
    const [newImages, setNewImages] = useState([]) // New File objects to upload
    const [video, setVideo] = useState(null)
    const [existingVideo, setExistingVideo] = useState(null)

    useEffect(() => {
        // Fetch existing property data
        async function fetchProperty() {
            try {
                const res = await fetch(`/api/properties/${propertyId}`)
                if (res.ok) {
                    const data = await res.json()
                    setFormData({
                        title: data.title || '',
                        price: data.price || '',
                        location: data.location || '',
                        type: data.type || 'Plot',
                        area: data.area || '',
                        status: data.status || 'Available',
                        description: data.description || ''
                    })

                    // Parse and set existing images
                    try {
                        const parsedImages = JSON.parse(data.images || '[]')
                        setExistingImages(parsedImages)
                    } catch {
                        setExistingImages([])
                    }

                    // Set existing video
                    if (data.video) {
                        setExistingVideo(data.video)
                    }
                } else {
                    alert('Property not found')
                    router.push('/admin/properties')
                }
            } catch (err) {
                console.error(err)
                alert('Error loading property')
            } finally {
                setFetchingProperty(false)
            }
        }

        if (propertyId) {
            fetchProperty()
        }
    }, [propertyId, router])

    const handleImageChange = (e) => {
        if (e.target.files) {
            setNewImages(prev => [...prev, ...Array.from(e.target.files)])
        }
    }

    const removeNewImage = (index) => {
        setNewImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeExistingImage = (index) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = new FormData()
        data.append('id', propertyId)
        Object.keys(formData).forEach(key => data.append(key, formData[key]))

        // Send existing images as JSON string
        data.append('existingImages', JSON.stringify(existingImages))

        // Send new images as files
        newImages.forEach(file => data.append('images', file))

        if (video) data.append('video', video)
        if (formData.brochure) data.append('brochure', formData.brochure)
        if (formData.propertyPlan) data.append('propertyPlan', formData.propertyPlan)

        try {
            const res = await fetch('/api/properties', {
                method: 'PUT',
                body: data
            })

            if (res.ok) {
                alert("Property Updated Successfully")
                router.push('/admin/properties')
            } else {
                alert("Failed to update property")
            }
        } catch (err) {
            console.error(err)
            alert("Error submitting form")
        } finally {
            setLoading(false)
        }
    }

    if (fetchingProperty) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading property...</div>
    }

    return (
        <div className={styles.wrapper}>
            <Link href="/admin/properties" className={styles.backLink}>
                <ArrowLeft size={18} /> Back to List
            </Link>

            <div className={styles.header}>
                <h1 className={styles.title}>Edit Property</h1>
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
                    <label>Property Images</label>

                    {/* Existing Images */}
                    {existingImages.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                Current Images ({existingImages.length})
                            </p>
                            <div className={styles.previews}>
                                {existingImages.map((url, idx) => (
                                    <div key={`existing-${idx}`} className={styles.previewItem} style={{ position: 'relative' }}>
                                        <img
                                            src={url}
                                            alt={`Existing ${idx + 1}`}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginRight: '0.5rem'
                                            }}
                                        />
                                        <span className={styles.filename} style={{ flex: 1 }}>Image {idx + 1}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(idx)}
                                            className={styles.removeBtn}
                                            title="Remove this image"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Upload New Images */}
                    <div className={styles.uploadBox}>
                        <input
                            type="file" multiple accept="image/*"
                            className={styles.fileInput}
                            onChange={handleImageChange}
                        />
                        <div className={styles.uploadPlaceholder}>
                            <Upload size={24} />
                            <p>Click to upload additional images</p>
                        </div>
                    </div>

                    {/* New Image Previews */}
                    {newImages.length > 0 && (
                        <div style={{ marginTop: '1rem' }}>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
                                New Images to Upload ({newImages.length})
                            </p>
                            <div className={styles.previews}>
                                {newImages.map((file, idx) => (
                                    <div key={`new-${idx}`} className={styles.previewItem}>
                                        <div className={styles.previewIcon}><ImageIcon size={16} /></div>
                                        <span className={styles.filename}>{file.name}</span>
                                        <button type="button" onClick={() => removeNewImage(idx)} className={styles.removeBtn}><X size={14} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Video Upload */}
                <div className={styles.formGroup}>
                    <label>Property Video (Optional)</label>
                    {existingVideo && (
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            Current video: <a href={existingVideo} target="_blank" style={{ color: 'var(--color-primary)' }}>View</a>
                        </p>
                    )}
                    <div className={styles.uploadBox}>
                        <input
                            type="file" accept="video/*"
                            className={styles.fileInput}
                            onChange={(e) => setVideo(e.target.files[0])}
                        />
                        <div className={styles.uploadPlaceholder}>
                            <Video size={24} />
                            <p>{video ? video.name : existingVideo ? 'Upload new video to replace' : 'Click to upload new video'}</p>
                        </div>
                    </div>
                </div>

                {/* Documents Upload */}
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Brochure (PDF - Optional)</label>
                        <div className={styles.miniUpload}>
                            <input type="file" accept=".pdf" onChange={(e) => setFormData({ ...formData, brochure: e.target.files[0] })} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Property Plan (Image - Optional)</label>
                        <div className={styles.miniUpload}>
                            <input type="file" accept="image/*" onChange={(e) => setFormData({ ...formData, propertyPlan: e.target.files[0] })} />
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button type="button" className={styles.cancelBtn} onClick={() => router.back()}>Cancel</button>
                    <button type="submit" className={styles.saveBtn} disabled={loading}>
                        {loading ? 'Updating...' : <><Save size={18} /> Update Property</>}
                    </button>
                </div>
            </form>
        </div>
    )
}
