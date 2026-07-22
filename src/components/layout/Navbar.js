'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navLinks = [
        { href: '/', label: 'Home' },
        { href: '/properties', label: 'Properties' },
        { href: '/about', label: 'About Us' },
    ]

    const isActive = (href) => {
        if (href === '/') return pathname === '/'
        return pathname.startsWith(href)
    }

    return (
        <nav className="fixed w-full z-50 bg-[#0A192F]/95 backdrop-blur-md border-b border-white/10 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                    <span className="w-9 h-9 bg-[#D4AF37] rounded-lg flex items-center justify-center text-[#0A192F] font-black text-lg shadow-md">
                        S
                    </span>
                    <span className="text-xl font-black text-white tracking-tight">
                        Samyak <span className="text-[#D4AF37] font-light">Properties</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`font-semibold text-sm tracking-wide transition-colors duration-200 ${
                                isActive(href)
                                    ? 'text-[#D4AF37]'
                                    : 'text-slate-200 hover:text-white'
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="ml-2 px-6 py-2.5 bg-[#D4AF37] hover:bg-[#B5952F] text-white font-bold rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_28px_rgba(212,175,55,0.45)] hover:-translate-y-px"
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button
                    className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div className="md:hidden absolute top-20 left-0 w-full bg-[#0A192F] border-t border-white/10 shadow-2xl">
                    <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
                        {navLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={`text-lg font-semibold transition-colors py-2 border-b border-white/5 ${
                                    isActive(href) ? 'text-[#D4AF37]' : 'text-slate-300 hover:text-[#D4AF37]'
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {label}
                            </Link>
                        ))}
                        <Link
                            href="/contact"
                            className="mt-2 px-6 py-3.5 bg-[#D4AF37] text-white text-center font-bold rounded-xl hover:bg-[#B5952F] transition-colors"
                            onClick={() => setIsOpen(false)}
                        >
                            Contact Us
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
