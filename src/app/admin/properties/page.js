import AdminPropertiesClient from './AdminPropertiesClient'

export const dynamic = 'force-dynamic'

async function getProperties() {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/properties`, {
            cache: 'no-store',
        })
        if (!res.ok) return []
        const data = await res.json()
        return Array.isArray(data) ? data : []
    } catch (err) {
        console.error('Failed to fetch properties:', err)
        return []
    }
}

export default async function AdminProperties() {
    const properties = await getProperties()
    return <AdminPropertiesClient initialProperties={properties} />
}
