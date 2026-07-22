import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const [propertyCount, enquiryCount, recentProperties, recentEnquiries] = await Promise.all([
            prisma.property.count(),
            prisma.enquiry.count(),
            prisma.property.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
            prisma.enquiry.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
        ])

        return NextResponse.json({
            propertyCount,
            enquiryCount,
            revenue: '₹0',
            recentProperties,
            recentEnquiries,
        })
    } catch (error) {
        console.error('Dashboard API Error:', error)
        return NextResponse.json({
            propertyCount: 0,
            enquiryCount: 0,
            revenue: 'Error',
            recentProperties: [],
            recentEnquiries: [],
        }, { status: 500 })
    }
}
