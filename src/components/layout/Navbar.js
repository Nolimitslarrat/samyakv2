'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, MapPin } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed w-full z-50 bg-[#0A192F]/90 backdrop-blur-md border-b border-white/10 shadow-sm transition-all duration-300">
            <div className="container mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                    <span className="w-8 h-8 bg-[#D4AF37] rounded-lg flex items-center justify-center text-[#0A192F] font-bold">S</span>
                    Samyak <span className="text-[#D4AF37] font-light">Properties</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link href="/" className="text-slate-300 hover:text-white font-medium text-sm tracking-wide transition-colors">Home</Link>
                    <Link href="/properties" className="text-slate-300 hover:text-white font-medium text-sm tracking-wide transition-colors">Properties</Link>
                    <Link href="/about" className="text-slate-300 hover:text-white font-medium text-sm tracking-wide transition-colors">About Us</Link>
                    <Link href="/contact" className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#B5952F] text-white font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_25px_rgba(212,175,55,0.5)]">
                        Contact Us
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className="md:hidden text-white p-2 focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-[#0A192F] border-b border-white/10 shadow-2xl flex flex-col p-6 space-y-4 animate-in slide-in-from-top-2">
                    <Link href="/" className="text-slate-300 hover:text-[#D4AF37] font-medium text-lg" onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/properties" className="text-slate-300 hover:text-[#D4AF37] font-medium text-lg" onClick={() => setIsOpen(false)}>Properties</Link>
                    <Link href="/about" className="text-slate-300 hover:text-[#D4AF37] font-medium text-lg" onClick={() => setIsOpen(false)}>About Us</Link>
                    <Link href="/contact" className="px-6 py-3 bg-[#D4AF37] text-white text-center font-bold rounded-xl mt-4" onClick={() => setIsOpen(false)}>Contact Us</Link>
                </div>
            )}
        </nav>
    )
}
