'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, MapPin, X } from 'lucide-react'

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
        return null
    }

    return (
        <section className="py-24 bg-white border-t border-slate-100">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl font-bold text-[#0A192F] mb-4">Coming Soon</h2>
                        <p className="text-slate-600 text-lg">Be the first to know about our next big landmarks in Pilkhuwa and Hapur.</p>
                    </div>
                    <button 
                        onClick={() => handleOpenModal(null)} 
                        className="px-6 py-3 bg-[#172A46] text-white rounded-xl font-bold hover:bg-[#0A192F] transition-colors shadow-md"
                    >
                        Notify Me on Launch
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {initialProjects.map(project => (
                        <div key={project.id} className="group relative bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                            <div className="relative h-64 w-full overflow-hidden">
                                <div className="absolute top-4 left-4 z-10 px-4 py-1.5 bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    Launching {project.launchDate}
                                </div>
                                <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                
                                {/* Overlay overlay shown on hover */}
                                <div className="absolute inset-0 bg-[#0A192F]/80 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 gap-4">
                                    <Link href={`/projects/${project.id}`} className="px-6 py-2.5 bg-white text-[#0A192F] font-bold rounded-xl hover:bg-slate-100 transition-colors">
                                        View Details
                                    </Link>
                                    <button onClick={() => handleOpenModal(project)} className="px-6 py-2.5 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] font-bold rounded-xl hover:bg-[#D4AF37] hover:text-white transition-all flex items-center">
                                        Notify Me <ArrowRight size={16} className="ml-2" />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <span className="text-emerald-600 text-xs font-bold uppercase tracking-widest mb-2 block">{project.type}</span>
                                <h3 className="text-xl font-bold text-[#0A192F] mb-2">{project.title}</h3>
                                <div className="flex items-center text-slate-500 text-sm mb-4">
                                    <MapPin size={16} className="mr-2" />
                                    {project.location}
                                </div>
                                <p className="text-slate-600 text-sm line-clamp-2">{project.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A192F]/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl p-8 max-w-md w-full relative shadow-2xl animate-in fade-in zoom-in duration-200">
                        <button 
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            <X size={20} />
                        </button>

                        {status === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ArrowRight size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-[#0A192F] mb-2">Thank You!</h3>
                                <p className="text-slate-600">We have recorded your interest. We will update you via WhatsApp when we launch.</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-2xl font-bold text-[#0A192F] mb-2">Get Launch Updates</h3>
                                <p className="text-slate-600 mb-6">
                                    {selectedProject ? `Interested in ${selectedProject.title}?` : "Be the first to know about new launches."}
                                </p>

                                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                    <input
                                        type="text"
                                        placeholder="Your Name"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                    <input
                                        type="tel"
                                        placeholder="WhatsApp Number"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                    <input
                                        type="email"
                                        placeholder="Email Address"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition-all"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                    />
                                    <button 
                                        type="submit" 
                                        disabled={status === 'submitting'}
                                        className="w-full py-4 mt-2 bg-[#D4AF37] hover:bg-[#B5952F] text-white font-bold rounded-xl transition-all shadow-lg disabled:opacity-70"
                                    >
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
