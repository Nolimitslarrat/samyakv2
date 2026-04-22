'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AddClientPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        type: 'buyer',
        source: 'manual',
        tags: '',
        notes: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Convert tags from comma-separated string to array
            const tagsArray = formData.tags
                .split(',')
                .map(tag => tag.trim())
                .filter(tag => tag);

            const response = await fetch('/api/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    tags: tagsArray.length > 0 ? tagsArray : null,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Client added successfully!');
                router.push('/admin/clients');
            } else if (response.status === 409) {
                alert(`Client with this phone number already exists: ${data.existingClient.name}`);
            } else {
                alert(data.error || 'Failed to add client');
            }
        } catch (error) {
            console.error('Error adding client:', error);
            alert('Error adding client');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Add New Client</h1>
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
                                placeholder="John Doe"
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
                                placeholder="9876543210"
                            />
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="email">Email (Optional)</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
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

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="source">Source</label>
                            <select
                                id="source"
                                name="source"
                                value={formData.source}
                                onChange={handleChange}
                            >
                                <option value="manual">Manual Entry</option>
                                <option value="contact_form">Contact Form</option>
                                <option value="enquiry">Enquiry</option>
                                <option value="referral">Referral</option>
                                <option value="walk_in">Walk-in</option>
                                <option value="social_media">Social Media</option>
                                <option value="advertisement">Advertisement</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="tags">Tags (comma-separated)</label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                placeholder="residential, budget_50L+, urgent"
                            />
                            <small className={styles.hint}>Examples: plots, commercial, budget_1Cr+</small>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Add any additional notes about this client..."
                        />
                    </div>

                    <div className={styles.actions}>
                        <button
                            type="button"
                            onClick={() => router.push('/admin/clients')}
                            className={styles.btnCancel}
                        >
                            Cancel
                        </button>
                        <button type="submit" disabled={loading} className={styles.btnSubmit}>
                            {loading ? 'Adding Client...' : 'Add Client'}
                        </button>
                    </div>
                </form>
            </div>

            <div className={styles.infoBox}>
                <h3>💡 Tips</h3>
                <ul>
                    <li><strong>Phone number is required</strong> and must be unique</li>
                    <li>Email is optional but recommended for email notifications</li>
                    <li>Tags help you categorize clients (e.g., "plots", "budget_50L+")</li>
                    <li>All active clients will receive notifications when you add new properties/projects</li>
                </ul>
            </div>
        </div>
    );
}
