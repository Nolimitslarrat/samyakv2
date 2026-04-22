'use client'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet map to avoid window is not defined error
const CoverageMap = dynamic(() => import('./CoverageMap'), {
    ssr: false,
    loading: () => <div style={{ height: '500px', background: '#e2e8f0', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Map...</div>
})

export default function MapSection() {
    return <CoverageMap />
}
