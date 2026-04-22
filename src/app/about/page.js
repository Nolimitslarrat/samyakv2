import Image from 'next/image'
import styles from './page.module.css'
import { ShieldCheck, Users, TrendingUp, Award } from 'lucide-react'

export default function About() {
    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className="container">
                    <h1 className={styles.heroTitle}>Building Trust, <br /><span className={styles.highlight}>Delivering Dreams</span></h1>
                    <p className={styles.heroSubtitle}>Samyak Properties has been the most trusted name in real estate across Pilkhuwa and Hapur for over a decade.</p>
                </div>
            </section>

            {/* Story Section */}
            <section className={styles.storySection}>
                <div className={`container ${styles.storyContainer}`}>
                    <div className={styles.storyContent}>
                        <h2 className={styles.sectionTitle}>Our Story</h2>
                        <p>Founded with a vision to bring transparency and professionalism to the local real estate market, Samyak Properties has grown from a small consultancy to a full-service property firm.</p>
                        <p>We understand that buying a property is not just a transaction; it's a life decision. Whether you are looking for a residential plot to build your dream home, or a commercial space to grow your business, we stand by you at every step.</p>
                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <h3>10+</h3>
                                <p>Years of Excellence</p>
                            </div>
                            <div className={styles.stat}>
                                <h3>500+</h3>
                                <p>Happy Families</p>
                            </div>
                            <div className={styles.stat}>
                                <h3>50+</h3>
                                <p>Projects Delivered</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.storyImage}>
                        {/* Placeholder for About Image */}
                        <div className={styles.imagePlaceholder}>
                            <Award size={64} color="#D4AF37" />
                            <span>Excellence in Real Estate</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className={styles.valuesSection}>
                <div className="container">
                    <h2 className={styles.textCenter}>Our Core Values</h2>
                    <div className={styles.valuesGrid}>
                        <div className={styles.valueCard}>
                            <ShieldCheck size={40} className={styles.icon} />
                            <h3>Integrity</h3>
                            <p>We believe in honest dealings. No hidden charges, no false promises. Just pure transparency.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <Users size={40} className={styles.icon} />
                            <h3>Customer First</h3>
                            <p>Your satisfaction is our priority. We tailor our services to meet your specific needs and budget.</p>
                        </div>
                        <div className={styles.valueCard}>
                            <TrendingUp size={40} className={styles.icon} />
                            <h3>Market Expertise</h3>
                            <p>With deep local knowledge of Pilkhuwa and Hapur, we guide you to the best investment opportunities.</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
