'use client'
import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Phone, MapPin } from 'lucide-react'
import styles from './Navbar.module.css'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className={styles.navbar}>
            <div className={`container ${styles.navContainer}`}>
                <Link href="/" className={styles.logo}>
                    Samyak Properties
                </Link>

                {/* Desktop Menu */}
                <div className={styles.desktopMenu}>
                    <Link href="/" className={styles.navLink}>Home</Link>
                    <Link href="/properties" className={styles.navLink}>Properties</Link>
                    <Link href="/about" className={styles.navLink}>About Us</Link>
                    <Link href="/contact" className={styles.btnContact}>
                        Contact Us
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button className={styles.mobileToggle} onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className={styles.mobileMenu}>
                    <Link href="/" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Home</Link>
                    <Link href="/properties" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Properties</Link>
                    <Link href="/about" className={styles.mobileLink} onClick={() => setIsOpen(false)}>About Us</Link>
                    <Link href="/contact" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Contact Us</Link>
                </div>
            )}
        </nav>
    )
}
