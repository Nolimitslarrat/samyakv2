'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './page.module.css';

export default function EditClientPage() {
    const router = useRouter();
    const params = useParams();
    const clientId = params.id;

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [client, setClient] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'buyer',
        tags: '',
        notes: '',
        isActive: true,
        optedOut: false,
    });

    useEffect(() => {
        fetchClient();
    }, [clientId]);

    const fetchClient = async () => {
        try {
            const response = await fetch(`/api/clients/${clientId}`);
            const data = await response.json();

            if (data.success) {
                const clientData = data.data;
                setClient(clientData);
                setFormData({
                    name: clientData.name,
                    email: clientData.email || '',
                    phone: clientData.phone,
                    type: clientData.type,
                    tags: Array.isArray(clientData.tags) ? clientData.tags.join(', ') : '',
                    notes: clientData.notes || '',
                    isActive: clientData.isActive,
                    optedOut: clientData.optedOut,
                });
            }
        } catch (error) {
            console.error('Error fetching client:', error);
            alert('Failed to load client');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag);

            const response = await fetch(`/api/clients/${clientId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: tagsArray.length > 0 ? tagsArray : null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Client updated successfully!');
                router.push('/admin/clients');
            } else {
                alert(data.error || 'Failed to update client');
            }
        } catch (error) {
            console.error('Error updating client:', error);
            alert('Error updating client');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className={styles.loading}>Loading client...</div>;
    }

    if (!client) {
        return <div className={styles.error}>Client not found</div>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Edit Client</h1>
                <button onClick={() => router.push('/admin/clients')} className={styles.btnBack}>
                    ← Back to Clients
                </button>
            </div>

            <div className={styles.card}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Full Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="phone">Phone Number *</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="type">Client Type *</label>
                            <select
                                id="type"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                required
                            >
                                <option value="buyer">Buyer</option>
                                <option value="seller">Seller</option>
                                <option value="both">Both</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="tags">Tags (comma-separated)</label>
                        <input
                            type="text"
                            id="tags"
                            name="tags"
                            value={formData.tags}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                        />
                    </div>

                    <div className={styles.checkboxGroup}>
                        <label>
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                            />
                            <span>Active</span>
                        </label>
                        <label>
                            <input
                                type="checkbox"
                                name="optedOut"
                                checked={formData.optedOut}
                                onChange={handleChange}
                            />
                            <span>Opted out of notifications</span>
                        </label>
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/clients')}
                            className={styles.btnCancel}
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={saving} className={styles.btnSubmit}>
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Notification History */}
            {client.notifications && client.notifications.length > 0 && (
                <div className={styles.card}>
                    <h2>Notification History</h2>
                    <div className={styles.notificationList}>
                        {client.notifications.map((notif) => (
                            <div key={notif.id} className={styles.notificationItem}>
                                <div className={styles.notifHeader}>
                                    <span className={`${styles.notifType} ${styles[notif.type]}`}>
                                        {notif.type === 'email' ? '📧' : '💬'} {notif.type}
                                    </span>
                                    <span className={`${styles.notifStatus} ${styles[notif.status]}`}>
                                        {notif.status}
                                    </span>
                                    <span className={styles.notifDate}>
                                        {new Date(notif.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className={styles.notifSubject}>{notif.subject}</div>
                                {notif.error && (
                                    <div className={styles.notifError}>Error: {notif.error}</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
