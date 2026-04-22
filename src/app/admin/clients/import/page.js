'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function ImportClientsPage() {
    const router = useRouter();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            if (!selectedFile.name.endsWith('.csv')) {
                alert('Please select a CSV file');
                return;
            }
            setFile(selectedFile);
            setResults(null);
        }
    };

    const downloadTemplate = async () => {
        try {
            const response = await fetch('/api/clients/import');
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'client-import-template.csv';
            a.click();
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Failed to download template');
        }
    };

    const handleImport = async () => {
        if (!file) {
            alert('Please select a file first');
            return;
        }

        setLoading(true);
        setResults(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/clients/import', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data.results);
            } else {
                alert(data.error || 'Import failed');
            }
        } catch (error) {
            console.error('Error importing clients:', error);
            alert('Error importing clients');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Import Clients from CSV</h1>
                <button onClick={() => router.push('/admin/clients')} className={styles.btnBack}>
                    ← Back to Clients
                </button>
            </div>

            {/* Instructions Card */}
            <div className={styles.card}>
                <h2>📋 How to Import Clients</h2>
                <ol className={styles.instructionsList}>
                    <li>
                        <strong>Download the CSV template</strong> using the button below
                    </li>
                    <li>
                        <strong>Fill in your client data</strong> in the template:
                        <ul>
                            <li><code>name</code> - Client's full name (required)</li>
                            <li><code>phone</code> - Phone number (required, must be unique)</li>
                            <li><code>email</code> - Email address (optional)</li>
                            <li><code>type</code> - buyer, seller, or both (required)</li>
                            <li><code>source</code> - manual, contact_form, enquiry, etc.</li>
                            <li><code>tags</code> - Comma-separated tags (e.g., "plots, budget_50L+")</li>
                            <li><code>notes</code> - Any additional notes</li>
                        </ul>
                    </li>
                    <li>
                        <strong>Save the file</strong> as CSV format
                    </li>
                    <li>
                        <strong>Upload the file</strong> below and click Import
                    </li>
                </ol>

                <button onClick={downloadTemplate} className={styles.btnTemplate}>
                    📥 Download CSV Template
                </button>
            </div>

            {/* Upload Card */}
            <div className={styles.card}>
                <h2>Upload CSV File</h2>
                <div className={styles.uploadSection}>
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className={styles.fileInput}
                        id="csvFile"
                    />
                    <label htmlFor="csvFile" className={styles.fileLabel}>
                        {file ? `📄 ${file.name}` : '📁 Choose CSV file...'}
                    </label>

                    {file && (
                        <div className={styles.fileInfo}>
                            <p>File selected: <strong>{file.name}</strong></p>
                            <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    )}

                    <button
                        onClick={handleImport}
                        disabled={!file || loading}
                        className={styles.btnImport}
                    >
                        {loading ? '⏳ Importing...' : '🚀 Import Clients'}
                    </button>
                </div>
            </div>

            {/* Results Card */}
            {results && (
                <div className={styles.card}>
                    <h2>Import Results</h2>
                    <div className={styles.resultsGrid}>
                        <div className={styles.resultCard}>
                            <div className={styles.resultValue}>{results.total}</div>
                            <div className={styles.resultLabel}>Total Rows</div>
                        </div>
                        <div className={`${styles.resultCard} ${styles.success}`}>
                            <div className={styles.resultValue}>{results.created}</div>
                            <div className={styles.resultLabel}>Created</div>
                        </div>
                        <div className={`${styles.resultCard} ${styles.warning}`}>
                            <div className={styles.resultValue}>{results.updated}</div>
                            <div className={styles.resultLabel}>Updated</div>
                        </div>
                        <div className={`${styles.resultCard} ${styles.error}`}>
                            <div className={styles.resultValue}>{results.skipped}</div>
                            <div className={styles.resultLabel}>Skipped/Errors</div>
                        </div>
                    </div>

                    {results.errors && results.errors.length > 0 && (
                        <div className={styles.errorSection}>
                            <h3>❌ Errors ({results.errors.length})</h3>
                            <div className={styles.errorList}>
                                {results.errors.slice(0, 10).map((err, idx) => (
                                    <div key={idx} className={styles.errorItem}>
                                        <strong>Row {err.row}:</strong> {err.error}
                                        {err.data && <pre>{JSON.stringify(err.data, null, 2)}</pre>}
                                    </div>
                                ))}
                                {results.errors.length > 10 && (
                                    <p className={styles.moreErrors}>
                                        ... and {results.errors.length - 10} more errors
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <button onClick={() => router.push('/admin/clients')} className={styles.btnViewClients}>
                            ✓ View All Clients
                        </button>
                        <button
                            onClick={() => {
                                setFile(null);
                                setResults(null);
                            }}
                            className={styles.btnReset}
                        >
                            Import Another File
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
