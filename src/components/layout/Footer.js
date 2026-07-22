import Link from 'next/link'
import styles from './Footer.module.css'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-[#0A192F] text-slate-300 py-16 border-t border-white/10">
            <div className="container mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24 mb-16">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2 mb-6">
                            <span className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center text-[#0A192F] font-bold">S</span>
                            Samyak <span className="text-[#D4AF37] font-light">Properties</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-slate-400">Your trusted real estate partner in Pilkhuwa & Hapur. We help you find the best deals for plots, residential, and commercial properties with absolute transparency.</p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link href="/" className="hover:text-[#D4AF37] transition-colors text-sm">Home</Link></li>
                            <li><Link href="/properties" className="hover:text-[#D4AF37] transition-colors text-sm">Properties</Link></li>
                            <li><Link href="/about" className="hover:text-[#D4AF37] transition-colors text-sm">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-[#D4AF37] transition-colors text-sm">Contact</Link></li>
                            <li><Link href="/admin/login" className="hover:text-[#D4AF37] transition-colors text-sm">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start">
                                <MapPin size={18} className="text-[#D4AF37] mr-3 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">Pilkhuwa, Hapur, Uttar Pradesh - 245304</span>
                            </li>
                            <li className="flex items-center">
                                <Phone size={18} className="text-[#D4AF37] mr-3 flex-shrink-0" />
                                <span className="text-sm">+91 9548278205</span>
                            </li>
                            <li className="flex items-center">
                                <Mail size={18} className="text-[#D4AF37] mr-3 flex-shrink-0" />
                                <span className="text-sm">info@samyakproperties.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/10 text-center flex flex-col md:flex-row items-center justify-between">
                    <p className="text-sm text-slate-500 mb-4 md:mb-0">&copy; {new Date().getFullYear()} Samyak Properties. All rights reserved.</p>
                    <div className="flex items-center space-x-6 text-sm text-slate-500">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
