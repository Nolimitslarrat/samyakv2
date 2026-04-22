'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import styles from './page.module.css'

export default function AdminPropertiesClient({ initialProperties }) {
    const router = useRouter()
    const [properties, setProperties] = useState(initialProperties)
    const [deleting, setDeleting] = useState(null)

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
            return
        }

        setDeleting(id)
        try {
            const res = await fetch(`/api/properties?id=${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                setProperties(prev => prev.filter(p => p.id !== id))
                alert('Property deleted successfully')
            } else {
                alert('Failed to delete property')
            }
        } catch (err) {
            console.error(err)
            alert('Error deleting property')
        } finally {
            setDeleting(null)
        }
    }

    return (
        <div>
            <div className={styles.header}>
                <h1 className={styles.title}>Property Management</h1>
                <Link href="/admin/properties/add" className={styles.addBtn}>
                    <Plus size={20} /> Add New Property
                </Link>
            </div>

            <div className={styles.toolbar}>
                <div className={styles.search}>
                    <Search size={18} className={styles.searchIcon} />
                    <input type="text" placeholder="Search properties..." className={styles.searchInput} />
                </div>
                <select className={styles.filter}>
                    <option>All Status</option>
                    <option>Available</option>
                    <option>Sold</option>
                </select>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Property</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>
                                    No properties found. Add your first property!
                                </td>
                            </tr>
                        ) : (
                            properties.map((property) => (
                                <tr key={property.id}>
                                    <td>#{property.id}</td>
                                    <td>
                                        <div className={styles.propertyName}>{property.title}</div>
                                    </td>
                                    <td>{property.type}</td>
                                    <td>{property.location}</td>
                                    <td>₹{property.price.toLocaleString()}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[property.status.toLowerCase().replace(/ /g, '-')]}`}>
                                            {property.status}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <Link
                                                href={`/admin/properties/${property.id}`}
                                                className={`${styles.iconBtn} ${styles.editBtn}`}
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                                                title="Delete"
                                                onClick={() => handleDelete(property.id)}
                                                disabled={deleting === property.id}
                                            >
                                                {deleting === property.id ? '...' : <Trash2 size={18} />}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
