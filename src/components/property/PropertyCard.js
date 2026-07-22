import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Scaling, ArrowRight, IndianRupee, Ruler } from 'lucide-react'

const getFallbackImage = (type) => {
    if (type === 'Plot') return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    if (type === 'Commercial') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80'
}

const formatPrice = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

const formatPriceShort = (amount) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`
    if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`
    return `₹${amount}`
}

export default function PropertyCard({ property }) {
    let images = []
    try {
        images = typeof property.images === 'string' ? JSON.parse(property.images) : []
    } catch { images = [] }

    const imageUrl = images.length > 0 ? images[0] : getFallbackImage(property.type)

    const statusColors = {
        Available: 'bg-emerald-500/90 text-white border-emerald-400',
        Sold: 'bg-red-500/90 text-white border-red-400',
        'Under Negotiation': 'bg-amber-500/90 text-white border-amber-400'
    }

    return (
        <Link href={`/properties/${property.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.06)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.14)] transition-all duration-300 border border-slate-100 h-full hover:-translate-y-1">
            {/* Image */}
            <div className="relative w-full h-56 overflow-hidden">
                {/* Status Badge */}
                <div className={`absolute top-3 left-3 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${statusColors[property.status] || statusColors.Available}`}>
                    {property.status}
                </div>

                {/* On-Road Badge */}
                {property.isOnRoad && (
                    <div className="absolute top-3 right-3 z-10 px-2.5 py-1 rounded-full bg-blue-600/90 text-white text-xs font-bold backdrop-blur-md border border-blue-400">
                        🛣️ On Road
                    </div>
                )}

                <Image
                    src={imageUrl}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    unoptimized={imageUrl.startsWith('/uploads/')}
                />

                {/* Price overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
                    <div className="text-white font-extrabold text-xl drop-shadow-md">
                        {formatPrice(property.price)}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-5 flex flex-col flex-grow">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1.5 block">{property.type}</span>
                <h3 className="text-[#0A192F] text-base font-bold mb-2 line-clamp-2 leading-snug group-hover:text-[#D4AF37] transition-colors">
                    {property.title}
                </h3>

                <div className="flex items-start text-slate-500 text-sm mb-4">
                    <MapPin size={14} className="text-slate-400 mr-1.5 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1 leading-snug">{property.location}</span>
                </div>

                {/* Key Stats — the most important buyer info */}
                <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                        <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5">
                            <Scaling size={12} />
                        </div>
                        <div className="text-[#0A192F] font-bold text-sm">{property.area}</div>
                        <div className="text-slate-400 text-[10px] uppercase tracking-wide">Sq. Yards</div>
                    </div>

                    <div className="bg-[#D4AF37]/5 rounded-xl p-2.5 text-center border border-[#D4AF37]/20">
                        <div className="flex items-center justify-center gap-0.5 text-[#D4AF37] mb-0.5">
                            <IndianRupee size={12} />
                        </div>
                        <div className="text-[#0A192F] font-bold text-sm">
                            {property.pricePerUnit
                                ? `${(property.pricePerUnit / 1000).toFixed(0)}K`
                                : property.area > 0 ? `${((property.price / property.area) / 1000).toFixed(0)}K` : '—'}
                        </div>
                        <div className="text-slate-400 text-[10px] uppercase tracking-wide">₹/gaj</div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-2.5 text-center border border-slate-100">
                        <div className="flex items-center justify-center gap-0.5 text-slate-400 mb-0.5">
                            <Ruler size={12} />
                        </div>
                        <div className="text-[#0A192F] font-bold text-sm">
                            {property.frontWidth ? `${property.frontWidth}ft` : '—'}
                        </div>
                        <div className="text-slate-400 text-[10px] uppercase tracking-wide">Front</div>
                    </div>
                </div>

                {/* Dimensions if available */}
                {property.dimensions && (
                    <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                        <span className="font-medium">📐 Dimensions:</span>
                        <span>{property.dimensions}</span>
                    </div>
                )}

                {/* CTA */}
                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs text-slate-400">
                        {new Date(property.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-[#D4AF37] group-hover:gap-2 transition-all">
                        View Details <ArrowRight size={14} />
                    </span>
                </div>
            </div>
        </Link>
    )
}
