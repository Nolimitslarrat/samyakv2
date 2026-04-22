'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function NotificationsPage() {
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [clients, setClients] = useState([]);
    const [selectedClients, setSelectedClients] = useState([]);
    const [formData, setFormData] = useState({
        subject: '',
        message: '',
        type: 'both', // email, whatsapp, both
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [notifRes, clientRes] = await Promise.all([
                fetch('/api/notifications?limit=20'),
                fetch('/api/clients?limit=1000') // Get all for selection
            ]);

            const notifData = await notifRes.json();
            const clientData = await clientRes.json();

            if (notifData.success) setNotifications(notifData.data);
            if (clientData.success) setClients(clientData.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClientToggle = (clientId) => {
        setSelectedClients(prev =>
            prev.includes(clientId)
                ? prev.filter(id => id !== clientId)
                : [...prev, clientId]
        );
    };

    const handleSelectAll = () => {
        if (selectedClients.length === clients.length) {
            setSelectedClients([]);
        } else {
            setSelectedClients(clients.map(c => c.id));
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (selectedClients.length === 0) {
            alert('Please select at least one client');
            return;
        }

        setSending(true);
        try {
            const response = await fetch('/api/notifications', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientIds: selectedClients,
                    ...formData
                }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Notifications queued successfully!');
                setFormData({ subject: '', message: '', type: 'both' });
                setSelectedClients([]);
                fetchData();
            } else {
                alert(data.error || 'Failed to send notifications');
            }
        } catch (error) {
            console.error('Error sending:', error);
            alert('Error sending notifications');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Manual Notifications</h1>
            </header>

            <div className={styles.grid}>
                {/* Send Section */}
                <div className={styles.sendSection}>
                    <div className={styles.card}>
                        <h2>Compose Message</h2>
                        <form onSubmit={handleSend} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Recipients: {selectedClients.length} clients selected</label>
                                <div className={styles.clientSelector}>
                                    <button type="button" onClick={handleSelectAll} className={styles.btnMini}>
                                        {selectedClients.length === clients.length ? 'Deselect All' : 'Select All Active'}
                                    </button>
                                    <div className={styles.clientList}>
                                        {clients.map(client => (
                                            <label key={client.id} className={styles.clientItem}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedClients.includes(client.id)}
                                                    onChange={() => handleClientToggle(client.id)}
                                                />
                                                <span>{client.name} ({client.phone})</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Notification Channel</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="both">Both Email & WhatsApp</option>
                                    <option value="email">Email Only</option>
                                    <option value="whatsapp">WhatsApp Only</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Subject (for Email)</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    required
                                    placeholder="New property update..."
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Message Content</label>
                                <textarea
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                    rows="6"
                                    placeholder="Type your message here..."
                                />
                            </div>

                            <button type="submit" disabled={sending} className={styles.btnSubmit}>
                                {sending ? 'Sending...' : '🚀 Send Notifications'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* History Section */}
                <div className={styles.historySection}>
                    <div className={styles.card}>
                        <h2>Recent History</h2>
                        {loading ? (
                            <p>Loading history...</p>
                        ) : notifications.length === 0 ? (
                            <p className={styles.empty}>No notification history found.</p>
                        ) : (
                            <div className={styles.historyList}>
                                {notifications.map(notif => (
                                    <div key={notif.id} className={styles.historyItem}>
                                        <div className={styles.notifMeta}>
                                            <span className={styles.notifType}>
                                                {notif.type === 'email' ? '📧' : '💬'} {notif.type}
                                            </span>
                                            <span className={`${styles.status} ${styles[notif.status]}`}>
                                                {notif.status}
                                            </span>
                                            <span className={styles.date}>
                                                {new Date(notif.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <strong>To: {notif.client?.name}</strong>
                                        <div className={styles.subject}>{notif.subject}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
