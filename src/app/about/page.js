import { ShieldCheck, Users, TrendingUp, Award, CheckCircle2, Star } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
    title: 'About Us | Samyak Properties – Trusted Real Estate in Pilkhuwa & Hapur',
    description: 'Learn about Samyak Properties – 10+ years of trusted real estate experience in Pilkhuwa and Hapur. 500+ happy families, 100% verified listings.',
}

export default function About() {
    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#0A192F] via-[#0d2040] to-[#172A46] pt-40 pb-24 overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-[#D4AF37] rounded-full blur-[120px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#D4AF37] rounded-full blur-[150px]" />
                </div>
                <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] text-sm font-semibold tracking-wider mb-6 border border-[#D4AF37]/30">
                        Our Story
                    </span>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                        Building Trust,<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-yellow-200">
                            Delivering Dreams
                        </span>
                    </h1>
                    <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                        Samyak Properties has been the most trusted name in real estate across Pilkhuwa and Hapur for over a decade.
                    </p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="bg-white shadow-sm border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <h3 className="text-4xl font-extrabold text-[#0A192F] mb-1">10+</h3>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Years of Excellence</p>
                        </div>
                        <div className="border-x border-slate-200">
                            <h3 className="text-4xl font-extrabold text-[#0A192F] mb-1">500+</h3>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Happy Families</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-extrabold text-[#0A192F] mb-1">50+</h3>
                            <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">Projects Delivered</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-4 block">Who We Are</span>
                            <h2 className="text-4xl font-bold text-[#0A192F] mb-6 leading-tight">
                                Your Trusted Partner in<br />Real Estate Since 2014
                            </h2>
                            <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                                <p>
                                    Founded with a vision to bring transparency and professionalism to the local real estate market, Samyak Properties has grown from a small consultancy to a full-service property firm.
                                </p>
                                <p>
                                    We understand that buying a property is not just a transaction; it's a life decision. Whether you are looking for a residential plot to build your dream home, or a commercial space to grow your business, we stand by you at every step.
                                </p>
                            </div>
                            <div className="mt-8 space-y-3">
                                {[
                                    '100% Verified and legally clear properties',
                                    'Direct deals — no hidden middlemen commissions',
                                    'Complete documentation assistance till final registry',
                                    'Serving Pilkhuwa, Hapur, and surrounding areas',
                                ].map((point) => (
                                    <div key={point} className="flex items-start gap-3">
                                        <CheckCircle2 className="text-[#D4AF37] flex-shrink-0 mt-0.5" size={20} />
                                        <span className="text-slate-600">{point}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-[#0A192F] to-[#172A46] rounded-3xl p-12 text-center shadow-2xl">
                                <div className="w-24 h-24 bg-[#D4AF37] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-[#D4AF37]/30">
                                    <Award size={48} className="text-[#0A192F]" />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-3">Excellence in Real Estate</h3>
                                <p className="text-slate-400">Pilkhuwa & Hapur's most recommended property consultancy</p>
                                <div className="flex items-center justify-center gap-1 mt-6">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={20} className="text-[#D4AF37] fill-[#D4AF37]" />
                                    ))}
                                </div>
                                <p className="text-slate-400 text-sm mt-2">Rated 5.0 by 200+ clients</p>
                            </div>
                            {/* Decorative card */}
                            <div className="absolute -bottom-6 -right-6 bg-[#D4AF37] text-white rounded-2xl p-6 shadow-xl">
                                <p className="text-3xl font-bold">₹0</p>
                                <p className="text-sm font-medium opacity-90">Hidden Charges</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="text-center mb-16">
                        <span className="text-[#D4AF37] text-sm font-bold uppercase tracking-widest mb-4 block">What We Stand For</span>
                        <h2 className="text-4xl font-bold text-[#0A192F] mb-4">Our Core Values</h2>
                        <p className="text-slate-500 text-lg max-w-2xl mx-auto">The principles that guide every deal we make and every client we serve.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: ShieldCheck,
                                color: 'blue',
                                title: 'Integrity',
                                desc: 'We believe in honest dealings. No hidden charges, no false promises. Just pure transparency at every step.',
                            },
                            {
                                icon: Users,
                                color: 'gold',
                                title: 'Customer First',
                                desc: 'Your satisfaction is our priority. We tailor our services to meet your specific needs and budget.',
                            },
                            {
                                icon: TrendingUp,
                                color: 'emerald',
                                title: 'Market Expertise',
                                desc: 'With deep local knowledge of Pilkhuwa and Hapur, we guide you to the best investment opportunities.',
                            },
                        ].map(({ icon: Icon, color, title, desc }) => (
                            <div key={title} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                                    color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                    color === 'gold' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' :
                                    'bg-emerald-50 text-emerald-600'
                                }`}>
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-[#0A192F] mb-3">{title}</h3>
                                <p className="text-slate-600 leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-[#0A192F] to-[#172A46] text-center">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-white mb-4">Ready to find your dream property?</h2>
                    <p className="text-slate-400 text-lg mb-8">Let us help you find the perfect home or investment in Pilkhuwa & Hapur.</p>
                    <Link href="/contact" className="inline-block px-10 py-4 bg-[#D4AF37] hover:bg-[#B5952F] text-white font-bold rounded-xl transition-all shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(212,175,55,0.5)] hover:-translate-y-1">
                        Talk to Our Experts
                    </Link>
                </div>
            </section>
        </main>
    )
}
