import Link from 'next/link'
import styles from './Footer.module.css'
import { Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.container}`}>
                <div className={styles.grid}>
                    {/* Brand */}
                    <div className={styles.brand}>
                        <h3>Samyak Properties</h3>
                        <p>Your trusted real estate partner in Pilkhuwa & Hapur. We help you find the best deals for plots, residential, and commercial properties.</p>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.links}>
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/properties">Properties</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/contact">Contact</Link></li>
                            <li><Link href="/admin/login">Admin Login</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className={styles.contact}>
                        <h4>Contact Us</h4>
                        <ul>
                            <li>
                                <MapPin size={18} />
                                <span>Pilkhuwa, Hapur, Uttar Pradesh - 245304</span>
                            </li>
                            <li>
                                <Phone size={18} />
                                <span>+91 9548278205</span>
                            </li>
                            <li>
                                <Mail size={18} />
                                <span>info@samyakproperties.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className={styles.copyright}>
                    <p>&copy; {new Date().getFullYear()} Samyak Properties. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
