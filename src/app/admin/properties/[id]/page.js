'use client'
import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Save, Upload, Video, X, Image as ImageIcon, IndianRupee, Ruler, Phone, FileText, Map } from 'lucide-react'
import styles from '../add/page.module.css' // We reuse the Add page CSS

// Load Quill dynamically (SSR disabled — it uses browser APIs)
const QuillEditor = dynamic(() => import('@/components/admin/QuillEditor'), { ssr: false })

export default function EditProperty() {
    const router = useRouter()
    const params = useParams()
    const propertyId = params.id

    const [loading, setLoading] = useState(false)
    const [fetchingProperty, setFetchingProperty] = useState(true)
    const [formData, setFormData] = useState({
        title: '',
        price: '',
        pricePerUnit: '',
        location: '',
        type: 'Plot',
        area: '',
        dimensions: '',
        frontWidth: '',
        isOnRoad: false,
        contactPhone: '',
        status: 'Available',
    })
    const [description, setDescription] = useState('')

    const [existingImages, setExistingImages] = useState([]) // URLs of existing images
    const [newImages, setNewImages] = useState([]) // New File objects to upload
    const [video, setVideo] = useState(null)
    const [existingVideo, setExistingVideo] = useState(null)

    const [brochure, setBrochure] = useState(null)
    const [existingBrochure, setExistingBrochure] = useState(null)

    const [propertyPlan, setPropertyPlan] = useState(null)
    const [existingPropertyPlan, setExistingPropertyPlan] = useState(null)

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
                        pricePerUnit: data.pricePerUnit || '',
                        location: data.location || '',
                        type: data.type || 'Plot',
                        area: data.area || '',
                        dimensions: data.dimensions || '',
                        frontWidth: data.frontWidth || '',
                        isOnRoad: data.isOnRoad || false,
                        contactPhone: data.contactPhone || '',
                        status: data.status || 'Available',
                    })
                    setDescription(data.description || '')

                    // Parse and set existing images
                    try {
                        const parsedImages = JSON.parse(data.images || '[]')
                        setExistingImages(parsedImages)
                    } catch {
                        setExistingImages([])
                    }

                    // Set existing media
                    if (data.video) setExistingVideo(data.video)
                    if (data.brochure) setExistingBrochure(data.brochure)
                    if (data.propertyPlan) setExistingPropertyPlan(data.propertyPlan)
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

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleImageChange = (e) => {
        if (e.target.files) {
            setNewImages(prev => [...prev, ...Array.from(e.target.files)])
        }
    }

    const removeNewImage = (index) => setNewImages(prev => prev.filter((_, i) => i !== index))
    const removeExistingImage = (index) => setExistingImages(prev => prev.filter((_, i) => i !== index))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        const data = new FormData()
        data.append('id', propertyId)
        Object.keys(formData).forEach(key => data.append(key, formData[key]))
        data.append('description', description)

        // Send existing images as JSON string
        data.append('existingImages', JSON.stringify(existingImages))

        // Send new files
        newImages.forEach(file => data.append('images', file))
        if (video) data.append('video', video)
        if (brochure) data.append('brochure', brochure)
        if (propertyPlan) data.append('propertyPlan', propertyPlan)

        try {
            const res = await fetch('/api/properties', {
                method: 'PUT',
                body: data
            })

            if (res.ok) {
                alert("Property Updated Successfully!")
                router.push('/admin/properties')
            } else {
                const errData = await res.json().catch(() => ({}))
                alert('Failed to update: ' + (errData.error || 'Unknown error'))
            }
        } catch (err) {
            console.error(err)
            alert("Error submitting form")
        } finally {
            setLoading(false)
        }
    }

    if (fetchingProperty) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading property details...</div>
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
                
                {/* ── Section 1: Basic Info ─────────────────────────── */}
                <div className={styles.sectionTitle}>📋 Basic Information</div>
                <div className={styles.grid}>
                    <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label>Property Title <span className={styles.required}>*</span></label>
                        <input
                            type="text" name="title" required className={styles.input}
                            value={formData.title} onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Property Type <span className={styles.required}>*</span></label>
                        <select name="type" className={styles.select} value={formData.type} onChange={handleChange}>
                            <option value="Plot">Plot / Land</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Agricultural">Agricultural</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Status</label>
                        <select name="status" className={styles.select} value={formData.status} onChange={handleChange}>
                            <option value="Available">Available</option>
                            <option value="Sold">Sold</option>
                            <option value="Under Negotiation">Under Negotiation</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Location / Address <span className={styles.required}>*</span></label>
                        <input
                            type="text" name="location" required className={styles.input}
                            value={formData.location} onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <span className={styles.labelIcon}><Phone size={14} /></span>
                            Direct Contact Number
                        </label>
                        <input
                            type="tel" name="contactPhone" className={styles.input}
                            value={formData.contactPhone} onChange={handleChange}
                        />
                    </div>
                </div>

                {/* ── Section 2: Pricing ────────────────────────────── */}
                <div className={styles.sectionTitle}>💰 Pricing Details</div>
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Total Price (₹) <span className={styles.required}>*</span></label>
                        <div className={styles.inputWithIcon}>
                            <IndianRupee size={16} className={styles.inputIcon} />
                            <input
                                type="number" name="price" required className={styles.input}
                                value={formData.price} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>
                            <span className={styles.labelIcon}><IndianRupee size={14} /></span>
                            Price per Sq. Yard (₹/gaj)
                        </label>
                        <div className={styles.inputWithIcon}>
                            <IndianRupee size={16} className={styles.inputIcon} />
                            <input
                                type="number" name="pricePerUnit" className={styles.input}
                                value={formData.pricePerUnit} onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Section 3: Plot Dimensions ────────────────────── */}
                <div className={styles.sectionTitle}>📐 Plot Dimensions</div>
                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Area (Sq. Yards) <span className={styles.required}>*</span></label>
                        <div className={styles.inputWithIcon}>
                            <Ruler size={16} className={styles.inputIcon} />
                            <input
                                type="number" name="area" required className={styles.input}
                                value={formData.area} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Plot Dimensions</label>
                        <input
                            type="text" name="dimensions" className={styles.input}
                            value={formData.dimensions} onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Road Frontage / Front Width (feet)</label>
                        <input
                            type="number" name="frontWidth" className={styles.input}
                            value={formData.frontWidth} onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>On-Road Property?</label>
                        <div className={styles.toggleRow}>
                            <label className={styles.toggle}>
                                <input
                                    type="checkbox" name="isOnRoad"
                                    checked={formData.isOnRoad} onChange={handleChange}
                                />
                                <span className={styles.toggleSlider}></span>
                            </label>
                            <span className={styles.toggleLabel}>
                                {formData.isOnRoad ? '✅ Haan, On-Road Property' : 'Nahi (Inside Colony)'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* ── Section 4: Description ────────────────────────── */}
                <div className={styles.sectionTitle}>📝 Property Description</div>
                <div className={styles.formGroup}>
                    <label>Detailed Description</label>
                    <QuillEditor value={description} onChange={setDescription} />
                </div>

                {/* ── Section 5: Media Uploads ──────────────────────── */}
                <div className={styles.sectionTitle}>🖼️ Images & Media</div>
                
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
                                            style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '0.5rem' }}
                                        />
                                        <span className={styles.filename} style={{ flex: 1 }}>Image {idx + 1}</span>
                                        <button type="button" onClick={() => removeExistingImage(idx)} className={styles.removeBtn} title="Remove this image">
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

                <div className={styles.formGroup}>
                    <label>Property Video (Optional)</label>
                    {existingVideo && (
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.5rem' }}>
                            Current video: <a href={existingVideo} target="_blank" style={{ color: 'var(--color-primary)' }}>View</a>
                        </p>
                    )}
                    <div className={styles.uploadBox} style={{ padding: '1rem' }}>
                        <input
                            type="file" accept="video/*"
                            className={styles.fileInput}
                            onChange={(e) => setVideo(e.target.files[0])}
                        />
                        <div className={styles.uploadPlaceholder}>
                            <Video size={22} />
                            <p>{video ? video.name : 'Upload new video to replace'}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Brochure (PDF)</label>
                        {existingBrochure && (
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>
                                <a href={existingBrochure} target="_blank" style={{ color: '#2563eb' }}>View Current Brochure</a>
                            </p>
                        )}
                        <div className={styles.miniUpload}>
                            <input type="file" accept=".pdf" onChange={(e) => setBrochure(e.target.files[0])} />
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Property Plan (Image)</label>
                        {existingPropertyPlan && (
                            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.3rem' }}>
                                <a href={existingPropertyPlan} target="_blank" style={{ color: '#2563eb' }}>View Current Plan</a>
                            </p>
                        )}
                        <div className={styles.miniUpload}>
                            <input type="file" accept="image/*" onChange={(e) => setPropertyPlan(e.target.files[0])} />
                        </div>
                    </div>
                </div>

                {/* ── Actions ───────────────────────────────────────── */}
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
