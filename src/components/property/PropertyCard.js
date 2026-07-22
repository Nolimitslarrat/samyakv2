import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Scaling, CalendarDays, ArrowRight } from 'lucide-react'

// Helper to determine image based on type if missing (Mock Logic)
const getFallbackImage = (type) => {
    if (type === 'Plot') return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
    if (type === 'Commercial') return 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    return 'https://images.unsplash.com/photo-1580587771525-78b9dba3b91d?auto=format&fit=crop&w=800&q=80'
}

export default function PropertyCard({ property }) {
    let images = []
    try {
        images = typeof property.images === 'string' ? JSON.parse(property.images) : []
    } catch (e) {
        images = []
    }

    const imageUrl = images.length > 0 ? images[0] : getFallbackImage(property.type)

    // Helper for formatting INR currency
    const formatPrice = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount)
    }

    return (
        <div className="group bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgb(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 flex flex-col border border-slate-100 h-full">
            <div className="relative w-full h-60 overflow-hidden">
                <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm border ${property.status === 'Available' ? 'bg-emerald-500/90 text-white border-emerald-400' : property.status === 'Sold' ? 'bg-red-500/90 text-white border-red-400' : 'bg-amber-500/90 text-white border-amber-400'}`}>
                    {property.status}
                </div>
                
                <Image
                    src={imageUrl}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient overlay for text readability at bottom of image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent"></div>
                
                <div className="absolute bottom-4 left-4 z-10">
                    <div className="text-white font-extrabold text-2xl drop-shadow-md">
                        {formatPrice(property.price)}
                    </div>
                </div>
            </div>

            <div className="p-6 flex flex-col flex-grow">
                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-2 block">{property.type}</span>
                <h3 className="text-[#0A192F] text-xl font-bold mb-3 line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                    <Link href={`/properties/${property.id}`} className="focus:outline-none">
                        <span className="absolute inset-0" aria-hidden="true"></span>
                        {property.title}
                    </Link>
                </h3>

                <div className="flex items-start text-slate-500 text-sm mb-4">
                    <MapPin size={16} className="text-slate-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2 leading-snug">{property.location}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-sm">
                    <div className="flex items-center">
                        <Scaling size={16} className="mr-2 text-slate-400" />
                        <span className="font-medium">{property.area}</span>
                    </div>
                    <div className="flex items-center text-[#D4AF37] font-semibold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        View Details <ArrowRight size={16} className="ml-1" />
                    </div>
                </div>
            </div>
        </div>
    )
}
