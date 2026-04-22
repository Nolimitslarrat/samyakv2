import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(req, { params }) {
    try {
        const { id } = await params
        const property = await prisma.property.findUnique({
            where: { id: parseInt(id) }
        })

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        return NextResponse.json(property)
    } catch (error) {
        console.error('Error fetching property:', error)
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
    }
}
