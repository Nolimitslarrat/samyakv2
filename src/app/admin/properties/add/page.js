'use client'
import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Upload, Video, X, Image as ImageIcon, IndianRupee, Ruler, Phone, Road } from 'lucide-react'
import styles from './page.module.css'

// Load Quill dynamically (SSR disabled — it uses browser APIs)
const QuillEditor = dynamic(() => import('@/components/admin/QuillEditor'), { ssr: false })

export default function AddProperty() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
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
    const [images, setImages] = useState([])
    const [video, setVideo] = useState(null)
    const [brochure, setBrochure] = useState(null)
    const [propertyPlan, setPropertyPlan] = useState(null)

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

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
        data.append('description', description)

        images.forEach(file => data.append('images', file))
        if (video) data.append('video', video)
        if (brochure) data.append('brochure', brochure)
        if (propertyPlan) data.append('propertyPlan', propertyPlan)

        try {
            const res = await fetch('/api/properties', {
                method: 'POST',
                body: data
            })

            if (res.ok) {
                alert('Property Successfully Add Ho Gayi!')
                router.push('/admin/properties')
            } else {
                const errData = await res.json().catch(() => ({}))
                alert('Property add nahi hui: ' + (errData.error || 'Unknown error'))
            }
        } catch (err) {
            console.error(err)
            alert('Form submit karne mein error aaya')
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

                {/* ── Section 1: Basic Info ─────────────────────────── */}
                <div className={styles.sectionTitle}>📋 Basic Information</div>
                <div className={styles.grid}>
                    <div className={styles.formGroup} style={{ gridColumn: '1 / -1' }}>
                        <label>Property Title <span className={styles.required}>*</span></label>
                        <input
                            type="text" name="title" required className={styles.input}
                            placeholder="e.g. Premium Commercial Plot on Main Road, Pilkhuwa"
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
                            placeholder="e.g. Indian Gas Agency Road, Pilkhuwa"
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
                            placeholder="e.g. 9548278205 (blank = default)"
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
                                placeholder="e.g. 10890000"
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
                                placeholder="e.g. 45000"
                                value={formData.pricePerUnit} onChange={handleChange}
                            />
                        </div>
                        <span className={styles.hint}>Buyers yahi dekhte hain sabse pehle!</span>
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
                                placeholder="e.g. 242"
                                value={formData.area} onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Plot Dimensions</label>
                        <input
                            type="text" name="dimensions" className={styles.input}
                            placeholder='e.g. "30x24 feet" ya "45x60 feet"'
                            value={formData.dimensions} onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Road Frontage / Front Width (feet)</label>
                        <input
                            type="number" name="frontWidth" className={styles.input}
                            placeholder="e.g. 30"
                            value={formData.frontWidth} onChange={handleChange}
                        />
                        <span className={styles.hint}>Plot ke aage kitni feet ki sadak hai</span>
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
                    <span className={styles.hint}>Bold, Italic, Bullet points use kar sakte hain. Buyers yeh padh kar attract hote hain.</span>
                </div>

                {/* ── Section 5: Media Uploads ──────────────────────── */}
                <div className={styles.sectionTitle}>🖼️ Images & Media</div>
                <div className={styles.formGroup}>
                    <label>Property Images <span className={styles.required}>*</span></label>
                    <div className={styles.uploadBox}>
                        <input
                            type="file" multiple accept="image/*"
                            className={styles.fileInput}
                            onChange={handleImageChange}
                        />
                        <div className={styles.uploadPlaceholder}>
                            <Upload size={28} />
                            <p><strong>Click to upload</strong> ya drag & drop</p>
                            <p className={styles.uploadHint}>PNG, JPG, WEBP · Multiple images select kar sakte hain</p>
                        </div>
                    </div>
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

                <div className={styles.formGroup}>
                    <label>Property Video (Optional)</label>
                    <div className={styles.uploadBox} style={{ padding: '1rem' }}>
                        <input
                            type="file" accept="video/*"
                            className={styles.fileInput}
                            onChange={(e) => setVideo(e.target.files[0])}
                        />
                        <div className={styles.uploadPlaceholder}>
                            <Video size={22} />
                            <p>{video ? video.name : 'Click to upload video tour'}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.grid}>
                    <div className={styles.formGroup}>
                        <label>Brochure (PDF)</label>
                        <div className={styles.miniUpload}>
                            <input type="file" accept=".pdf" onChange={(e) => setBrochure(e.target.files[0])} />
                        </div>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Property Plan (Image)</label>
                        <div className={styles.miniUpload}>
                            <input type="file" accept="image/*" onChange={(e) => setPropertyPlan(e.target.files[0])} />
                        </div>
                    </div>
                </div>

                {/* ── Actions ───────────────────────────────────────── */}
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
