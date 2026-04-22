import { PrismaClient } from '@prisma/client'
import AdminPropertiesClient from './AdminPropertiesClient'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

async function getProperties() {
    const properties = await prisma.property.findMany({
        orderBy: { createdAt: 'desc' }
    })
    return properties
}

export default async function AdminProperties() {
    const properties = await getProperties()
    return <AdminPropertiesClient initialProperties={properties} />
}
