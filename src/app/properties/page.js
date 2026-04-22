import PropertyListing from '@/components/property/PropertyListing'
import { PrismaClient } from '@prisma/client'

export const dynamic = 'force-dynamic'
const prisma = new PrismaClient()

async function getAllProperties() {
    const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' }
    })
    return properties
}

export default async function PropertiesPage() {
    const properties = await getAllProperties()

    return (
        <main>
            <PropertyListing initialProperties={properties} />
        </main>
    )
}
