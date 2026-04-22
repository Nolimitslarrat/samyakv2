'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Building2, PlusCircle, LogOut, Settings, MessageSquare, TrendingUp, FolderPlus, Users } from 'lucide-react'
import styles from './AdminLayout.module.css'

export default function AdminLayout({ children }) {
    const pathname = usePathname()

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    const isActive = (path) => pathname === path

    return (
        <div className={styles.adminContainer}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    Samyak Admin
                </div>

                <nav className={styles.nav}>
                    <Link href="/admin/dashboard" className={`${styles.navItem} ${isActive('/admin/dashboard') ? styles.active : ''}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </Link>
                    <Link href="/admin/properties" className={`${styles.navItem} ${isActive('/admin/properties') ? styles.active : ''}`}>
                        <Building2 size={20} /> Properties
                    </Link>
                    <Link href="/admin/properties/add" className={`${styles.navItem} ${isActive('/admin/properties/add') ? styles.active : ''}`}>
                        <PlusCircle size={20} /> Add Property
                    </Link>
                    <Link href="/admin/clients" className={`${styles.navItem} ${isActive('/admin/clients') ? styles.active : ''}`}>
                        <Users size={20} /> Clients
                    </Link>
                    <Link href="/admin/enquiries" className={`${styles.navItem} ${isActive('/admin/enquiries') ? styles.active : ''}`}>
                        <MessageSquare size={20} /> Enquiries
                    </Link>
                    <Link href="/admin/upcoming-interests" className={`${styles.navItem} ${isActive('/admin/upcoming-interests') ? styles.active : ''}`}>
                        <TrendingUp size={20} /> Upcoming Leads
                    </Link>
                    <Link href="/admin/projects" className={`${styles.navItem} ${isActive('/admin/projects') ? styles.active : ''}`}>
                        <FolderPlus size={20} /> Manage Projects
                    </Link>
                    <Link href="/admin/settings" className={styles.navItem}>
                        <Settings size={20} /> Settings
                    </Link>
                </nav>

                <div className={styles.footer}>
                    <button className={styles.logoutBtn}>
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.main}>
                {children}
            </main>
        </div>
    )
}
