'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, Send, Loader2, CheckCircle2 } from 'lucide-react'

export default function Contact() {
    const [formData, setFormData] = useState({ name: '', phone: '', message: '' })
    const [status, setStatus] = useState('idle')

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
        } catch {
            setStatus('error')
        }
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Header */}
            <section className="bg-gradient-to-br from-[#0A192F] to-[#172A46] pt-36 pb-20 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-1/4 w-64 h-64 bg-[#D4AF37] rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#D4AF37] rounded-full blur-[120px]" />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto px-6">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold tracking-wider mb-6 border border-[#D4AF37]/30">
                        Contact Us
                    </span>
                    <h1 className="text-5xl font-extrabold text-white mb-4">Get in Touch</h1>
                    <p className="text-slate-400 text-xl">Have questions? We'd love to hear from you. Our team responds within 24 hours.</p>
                </div>
            </section>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

                    {/* Info Side (2 cols) */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Info Card */}
                        <div className="bg-gradient-to-br from-[#0A192F] to-[#172A46] rounded-3xl p-8 text-white shadow-xl">
                            <h2 className="text-2xl font-bold mb-2">Contact Information</h2>
                            <p className="text-slate-400 mb-8">Fill up the form and our team will get back to you within 24 hours.</p>

                            <div className="space-y-6">
                                <a href="tel:+919548278205" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/30 transition-colors">
                                        <Phone size={20} className="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Phone</p>
                                        <p className="font-semibold text-white">+91 9548278205</p>
                                    </div>
                                </a>
                                <a href="mailto:info@samyakproperties.com" className="flex items-center gap-4 group">
                                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#D4AF37]/30 transition-colors">
                                        <Mail size={20} className="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Email</p>
                                        <p className="font-semibold text-white">info@samyakproperties.com</p>
                                    </div>
                                </a>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} className="text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-0.5">Office</p>
                                        <p className="font-semibold text-white">Pilkhuwa, Hapur, UP – 245304</p>
                                    </div>
                                </div>
                            </div>

                            {/* Decorative dots */}
                            <div className="mt-12 flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-[#D4AF37]" />
                                <div className="w-2 h-2 rounded-full bg-[#D4AF37]/50" />
                                <div className="w-2 h-2 rounded-full bg-[#D4AF37]/20" />
                            </div>
                        </div>

                        {/* Map */}
                        <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-100 h-64">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55994.65656618829!2d77.6534!3d28.7077!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390c85c2c5c5c5c5%3A0x0!2sPilkhuwa%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1600000000000!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                            />
                        </div>
                    </div>

                    {/* Form Side (3 cols) */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <h2 className="text-2xl font-bold text-[#0A192F] mb-2">Send us a Message</h2>
                            <p className="text-slate-500 mb-8">We'll get back to you as soon as possible.</p>

                            {status === 'success' ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                                        <CheckCircle2 size={40} className="text-emerald-600" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0A192F] mb-2">Message Sent!</h3>
                                    <p className="text-slate-500 mb-6">Our team will get back to you within 24 hours.</p>
                                    <button
                                        onClick={() => setStatus('idle')}
                                        className="px-6 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#B5952F] transition-colors"
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-[#0A192F] mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter your full name"
                                            className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-slate-800 placeholder-slate-400 bg-slate-50"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#0A192F] mb-2">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            placeholder="Your 10-digit phone number"
                                            className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-slate-800 placeholder-slate-400 bg-slate-50"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-[#0A192F] mb-2">Message <span className="text-slate-400 font-normal">(Optional)</span></label>
                                        <textarea
                                            rows="5"
                                            placeholder="Tell us about your property requirements..."
                                            className="w-full px-4 py-3.5 border border-slate-200 rounded-xl outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-slate-800 placeholder-slate-400 bg-slate-50 resize-none"
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        />
                                    </div>

                                    {status === 'error' && (
                                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                            Something went wrong. Please try again or call us directly.
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B5952F] hover:from-[#B5952F] hover:to-[#917521] text-white font-bold rounded-xl transition-all shadow-[0_4px_20px_rgba(212,175,55,0.3)] hover:shadow-[0_4px_30px_rgba(212,175,55,0.5)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {status === 'loading' ? (
                                            <><Loader2 size={20} className="animate-spin" /> Sending...</>
                                        ) : (
                                            <><Send size={18} /> Send Message</>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
