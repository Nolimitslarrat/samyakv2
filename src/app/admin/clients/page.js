'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ClientsPage() {
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [stats, setStats] = useState({ total: 0, buyers: 0, sellers: 0, both: 0 });

    useEffect(() => {
        fetchClients();
    }, [search, typeFilter]);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (typeFilter) params.append('type', typeFilter);

            const response = await fetch(`/api/clients?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setClients(data.data);

                // Calculate stats
                const total = data.pagination.total;
                const buyers = data.data.filter(c => c.type === 'buyer').length;
                const sellers = data.data.filter(c => c.type === 'seller').length;
                const both = data.data.filter(c => c.type === 'both').length;
                setStats({ total, buyers, sellers, both });
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this client?')) return;

        try {
            const response = await fetch(`/api/clients/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Client deleted successfully');
                fetchClients();
            } else {
                alert('Failed to delete client');
            }
        } catch (error) {
            console.error('Error deleting client:', error);
            alert('Error deleting client');
        }
    };

    const exportToCSV = () => {
        const headers = ['Name', 'Phone', 'Email', 'Type', 'Source', 'Created'];
        const rows = clients.map(c => [
            c.name,
            c.phone,
            c.email || 'N/A',
            c.type,
            c.source,
            new Date(c.createdAt).toLocaleDateString(),
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
        ].join('\\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `clients-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Client Management</h1>
                <div className={styles.actions}>
                    <button onClick={() => router.push('/admin/clients/add')} className={styles.btnPrimary}>
                        + Add Client
                    </button>
                    <button onClick={() => router.push('/admin/clients/import')} className={styles.btnSecondary}>
                        📥 Import CSV
                    </button>
                    <button onClick={exportToCSV} className={styles.btnSecondary}>
                        📤 Export CSV
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.total}</div>
                    <div className={styles.statLabel}>Total Clients</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.buyers}</div>
                    <div className={styles.statLabel}>Buyers</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.sellers}</div>
                    <div className={styles.statLabel}>Sellers</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{stats.both}</div>
                    <div className={styles.statLabel}>Both</div>
                </div>
            </div>

            {/* Filters */}
            <div className={styles.filters}>
                <input
                    type="text"
                    placeholder="Search by name, phone, or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className={styles.searchInput}
                />
                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className={styles.filterSelect}>
                    <option value="">All Types</option>
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller</option>
                    <option value="both">Both</option>
                </select>
            </div>

            {/* Clients Table */}
            {loading ? (
                <div className={styles.loading}>Loading clients...</div>
            ) : clients.length === 0 ? (
                <div className={styles.empty}>
                    <p>No clients found. Start by adding your first client or importing from CSV.</p>
                    <button onClick={() => router.push('/admin/clients/add')} className={styles.btnPrimary}>
                        Add First Client
                    </button>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Email</th>
                                <th>Type</th>
                                <th>Source</th>
                                <th>Notifications</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((client) => (
                                <tr key={client.id}>
                                    <td className={styles.nameCell}>{client.name}</td>
                                    <td>{client.phone}</td>
                                    <td>{client.email || '-'}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[`badge${client.type}`]}`}>
                                            {client.type}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={styles.sourceText}>{client.source}</span>
                                    </td>
                                    <td className={styles.centered}>{client._count?.notifications || 0}</td>
                                    <td>
                                        {client.optedOut ? (
                                            <span className={styles.badgeInactive}>Opted Out</span>
                                        ) : client.isActive ? (
                                            <span className={styles.badgeActive}>Active</span>
                                        ) : (
                                            <span className={styles.badgeInactive}>Inactive</span>
                                        )}
                                    </td>
                                    <td className={styles.actionsCell}>
                                        <button
                                            onClick={() => router.push(`/admin/clients/${client.id}`)}
                                            className={styles.btnEdit}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            className={styles.btnDelete}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
