'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react'
import styles from './page.module.css'

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        message: ''
    })
    const [status, setStatus] = useState('idle') // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStatus('loading')

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setStatus('success')
                setFormData({ name: '', phone: '', message: '' })
            } else {
                setStatus('error')
            }
        } catch (error) {
            console.error(error)
            setStatus('error')
        }
    }

    return (
        <div className={styles.wrapper}>
            {/* Header */}
            <section className={styles.headerSection}>
                <div className="container">
                    <h1 className={styles.title}>Get in Touch</h1>
                    <p className={styles.subtitle}>Have questions? We'd love to hear from you.</p>
                </div>
            </section>

            <div className={`container ${styles.contentContainer}`}>
                <div className={styles.grid}>

                    {/* Contact Info Side */}
                    <div className={styles.infoCard}>
                        <h2>Contact Information</h2>
                        <p className={styles.infoText}>Fill up the form and our team will get back to you within 24 hours.</p>

                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <Phone className={styles.icon} />
                                <div>
                                    <h3>Phone</h3>
                                    <p>+91 954 827 8205</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <Mail className={styles.icon} />
                                <div>
                                    <h3>Email</h3>
                                    <p>info@samyakproperties.com</p>
                                </div>
                            </div>
                            <div className={styles.infoItem}>
                                <MapPin className={styles.icon} />
                                <div>
                                    <h3>Office</h3>
                                    <p>Pilkhuwa, Hapur, Uttar Pradesh - 245304</p>
                                </div>
                            </div>
                        </div>

                        {/* Google Map Embed */}
                        <div className={styles.mapContainer}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111989.31313237658!2d77.6534!3d28.7077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c85c2c5c5c5c5%3A0x0!2sPilkhuwa%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy">
                            </iframe>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className={styles.formCard}>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    className={styles.input}
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Your Phone Number"
                                    className={styles.input}
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Message (Optional)</label>
                                <textarea
                                    rows="4"
                                    placeholder="How can we help you?"
                                    className={styles.textarea}
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={status === 'loading' || status === 'success'}
                            >
                                {status === 'loading' ? (
                                    <>Sending... <Loader2 className={styles.spin} size={18} /></>
                                ) : status === 'success' ? (
                                    <>Sent Successfully <CheckCircle2 size={18} /></>
                                ) : (
                                    <>Send Message <Send size={18} /></>
                                )}
                            </button>

                            {status === 'error' && (
                                <p className={styles.errorMsg}>Something went wrong. Please try again or check your connection.</p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
