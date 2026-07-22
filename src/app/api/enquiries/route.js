import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // GENERAL, PROPERTY, UPCOMING

        const where = type ? { type } : {}

        const enquiries = await prisma.enquiry.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(enquiries)
    } catch (error) {
        console.error('Error fetching enquiries:', error)
        return NextResponse.json({ error: 'Failed to fetch enquiries' }, { status: 500 })
    }
}
