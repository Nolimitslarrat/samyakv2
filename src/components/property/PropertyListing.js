'use client'

import { useState, useMemo } from 'react'
import PropertyCard from './PropertyCard'
import { SlidersHorizontal, X, ChevronDown, Home, Building2, Tractor, Factory, LayoutGrid } from 'lucide-react'

export default function PropertyListing({ initialProperties = [] }) {
    const [selectedTypes, setSelectedTypes] = useState([])
    const [priceRange, setPriceRange] = useState(50000000)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const PROPERTY_TYPES = [
        { label: 'Plot', icon: LayoutGrid },
        { label: 'Residential', icon: Home },
        { label: 'Commercial', icon: Building2 },
        { label: 'Agricultural', icon: Tractor },
        { label: 'Industrial', icon: Factory },
    ]

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

    const SidebarContent = () => (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2 text-[#0A192F] font-bold text-lg">
                    <SlidersHorizontal size={20} className="text-[#D4AF37]" />
                    <span>Filters</span>
                </div>
                {(selectedTypes.length > 0 || priceRange < 50000000) && (
                    <button
                        onClick={() => { setSelectedTypes([]); setPriceRange(50000000) }}
                        className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Property Type */}
            <div>
                <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-wider mb-4">Property Type</h3>
                <div className="space-y-2">
                    {PROPERTY_TYPES.map(({ label, icon: Icon }) => (
                        <label
                            key={label}
                            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 border ${
                                selectedTypes.includes(label)
                                    ? 'bg-[#D4AF37]/10 border-[#D4AF37]/50 text-[#0A192F]'
                                    : 'border-transparent hover:bg-slate-50 text-slate-600'
                            }`}
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                                selectedTypes.includes(label) ? 'bg-[#D4AF37] text-white' : 'bg-slate-100 text-slate-500'
                            }`}>
                                <Icon size={16} />
                            </div>
                            <span className="font-medium text-sm flex-1">{label}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                                selectedTypes.includes(label) ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-slate-300'
                            }`}>
                                {selectedTypes.includes(label) && (
                                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                )}
                            </div>
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={selectedTypes.includes(label)}
                                onChange={() => handleTypeChange(label)}
                            />
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold text-[#0A192F] uppercase tracking-wider">Max Budget</h3>
                    <span className="text-sm font-bold text-[#D4AF37] bg-[#D4AF37]/10 px-3 py-1 rounded-full">
                        {formatPrice(priceRange)}
                    </span>
                </div>
                <div className="relative">
                    <input
                        type="range"
                        min="0"
                        max="50000000"
                        step="500000"
                        value={priceRange}
                        onChange={(e) => setPriceRange(Number(e.target.value))}
                        className="w-full h-2 rounded-full appearance-none cursor-pointer"
                        style={{
                            background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${(priceRange / 50000000) * 100}%, #e2e8f0 ${(priceRange / 50000000) * 100}%, #e2e8f0 100%)`
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-slate-400 mt-2">
                    <span>₹0</span>
                    <span>{formatPrice(50000000)}+</span>
                </div>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-16">
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-[#0A192F] to-[#172A46] py-12 mb-10">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    <p className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase mb-2">Browse Listings</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">All Properties</h1>
                    <p className="text-slate-400 text-lg">Explore premium verified listings in Pilkhuwa & Hapur</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                {/* Mobile Filter Toggle */}
                <div className="flex items-center justify-between mb-6 md:hidden">
                    <p className="text-slate-600 font-medium">{filteredProperties.length} results</p>
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#0A192F] text-white rounded-xl text-sm font-semibold"
                    >
                        <SlidersHorizontal size={16} />
                        Filters
                        {selectedTypes.length > 0 && (
                            <span className="w-5 h-5 bg-[#D4AF37] rounded-full text-xs flex items-center justify-center">
                                {selectedTypes.length}
                            </span>
                        )}
                    </button>
                </div>

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
                        <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-2xl overflow-y-auto">
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
                            >
                                <X size={20} />
                            </button>
                            <SidebarContent />
                        </div>
                    </div>
                )}

                <div className="flex gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-72 flex-shrink-0">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-28">
                            <SidebarContent />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Results Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[#0A192F]">
                                    {filteredProperties.length > 0
                                        ? `${filteredProperties.length} Properties Found`
                                        : 'No Properties Found'}
                                </h2>
                                {selectedTypes.length > 0 && (
                                    <p className="text-slate-500 text-sm mt-1">
                                        Filtered by: {selectedTypes.join(', ')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Properties Grid */}
                        {filteredProperties.length === 0 ? (
                            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center py-24 px-8 text-center">
                                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                    <Building2 size={40} className="text-slate-400" />
                                </div>
                                <h3 className="text-xl font-bold text-[#0A192F] mb-2">No properties found</h3>
                                <p className="text-slate-500 mb-6 max-w-sm">
                                    {initialProperties.length === 0
                                        ? 'No listings have been added yet. Check back soon!'
                                        : 'Try adjusting your filters to see more results.'}
                                </p>
                                {selectedTypes.length > 0 && (
                                    <button
                                        onClick={() => setSelectedTypes([])}
                                        className="px-6 py-2.5 bg-[#D4AF37] text-white font-semibold rounded-xl hover:bg-[#B5952F] transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredProperties.map(property => (
                                    <PropertyCard key={property.id} property={property} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
