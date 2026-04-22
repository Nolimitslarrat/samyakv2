'use client'

import { useState, useMemo } from 'react'
import PropertyCard from './PropertyCard'
import { SlidersHorizontal } from 'lucide-react'
import styles from './PropertyListing.module.css'

export default function PropertyListing({ initialProperties = [] }) {
    const [selectedTypes, setSelectedTypes] = useState([])
    const [priceRange, setPriceRange] = useState(50000000) // Max price default

    const PROPERTY_TYPES = ['Plot', 'Residential', 'Commercial', 'Agricultural', 'Industrial']

    const handleTypeChange = (type) => {
        setSelectedTypes(prev =>
            prev.includes(type)
                ? prev.filter(t => t !== type)
                : [...prev, type]
        )
    }

    const formatPrice = (price) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`
        if (price >= 100000) return `₹${(price / 100000).toFixed(1)} L`
        return `₹${price.toLocaleString()}`
    }

    const filteredProperties = useMemo(() => {
        return initialProperties.filter(property => {
            const matchesType = selectedTypes.length === 0 || selectedTypes.includes(property.type)
            const matchesPrice = property.price <= priceRange
            return matchesType && matchesPrice
        })
    }, [initialProperties, selectedTypes, priceRange])

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {/* Filters Sidebar */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterHeader}>
                        <SlidersHorizontal size={20} />
                        <h3>Filters</h3>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Property Type</label>
                        <div className={styles.checkboxGroup}>
                            {PROPERTY_TYPES.map(type => (
                                <label key={type} className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={selectedTypes.includes(type)}
                                        onChange={() => handleTypeChange(type)}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>Max Price</label>
                        <input
                            type="range"
                            min="0"
                            max="50000000"
                            step="500000"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className={styles.range}
                        />
                        <div className={styles.priceLabels}>
                            <span>₹0</span>
                            <span>{formatPrice(50000000)}+</span>
                        </div>
                        <div className={styles.priceDisplay}>
                            Up in {formatPrice(priceRange)}
                        </div>
                    </div>
                </aside>

                {/* Listings Grid */}
                <div className={styles.mainContent}>
                    <div className={styles.header}>
                        <h1>All Properties</h1>
                        <p>{filteredProperties.length} results found</p>
                    </div>

                    <div className={styles.grid}>
                        {filteredProperties.length === 0 ? (
                            <div className={styles.noResults}>
                                <h3>No properties found</h3>
                                <p>Try adjusting your filters to see more results.</p>
                            </div>
                        ) : (
                            filteredProperties.map(property => (
                                <PropertyCard key={property.id} property={property} />
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
