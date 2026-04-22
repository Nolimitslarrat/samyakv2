'use client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import styles from './CoverageMap.module.css'

// Fix for default marker icon in Next.js
const icon = L.icon({
    iconUrl: '/images/marker-icon.png', // We will need to ensure this exists or use a CDN
    shadowUrl: '/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

// Custom Gold Pin for premium feel
const goldIcon = L.divIcon({
    className: styles.customPin,
    html: `<div class="${styles.pinInner}"><div class="${styles.pinPulse}"></div></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 15]
})

const LOCATIONS = [
    { id: 1, name: 'Pilkhuwa Head Office', coords: [28.7077, 77.6534], type: 'Office' },
    { id: 2, name: 'Hapur Branch', coords: [28.7306, 77.7759], type: 'Branch' },
    { id: 3, name: 'Jewar Airport Project', coords: [28.2096, 77.5647], type: 'Project' },
    { id: 4, name: 'Vrindavan Enclave', coords: [27.5650, 77.6593], type: 'Project' },
    { id: 5, name: 'Delhi NCR Hub', coords: [28.6139, 77.2090], type: 'Hub' }
]

export default function CoverageMap() {
    return (
        <div className={styles.mapWrapper}>
            <MapContainer
                center={[28.5, 77.6]}
                zoom={9}
                scrollWheelZoom={false}
                className={styles.map}
            >
                {/* Dark Theme Tiles for Premium Look */}
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                />

                {LOCATIONS.map(loc => (
                    <Marker key={loc.id} position={loc.coords} icon={goldIcon}>
                        <Popup className={styles.popup}>
                            <div className={styles.popupContent}>
                                <h3>{loc.name}</h3>
                                <p>{loc.type}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}
