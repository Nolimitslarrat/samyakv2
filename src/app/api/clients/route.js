import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * GET /api/clients - List all clients with filtering and search
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search') || '';
        const type = searchParams.get('type'); // buyer, seller, both
        const isActive = searchParams.get('isActive');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const skip = (page - 1) * limit;

        // Build where clause
        const where = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search } },
            ];
        }

        if (type) {
            where.type = type;
        }

        if (isActive !== null && isActive !== undefined) {
            where.isActive = isActive === 'true';
        }

        // Get clients with pagination
        const [clients, total] = await Promise.all([
            prisma.client.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    _count: {
                        select: {
                            notifications: true,
                            enquiries: true,
                        },
                    },
                },
            }),
            prisma.client.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: clients,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get clients error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clients' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/clients - Create a new client
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { name, email, phone, type, source, tags, notes, preferences } = body;

        // Validation
        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Name and phone are required' },
                { status: 400 }
            );
        }

        if (!type || !['buyer', 'seller', 'both'].includes(type)) {
            return NextResponse.json(
                { error: 'Valid type is required (buyer, seller, or both)' },
                { status: 400 }
            );
        }

        // Check for duplicate phone number
        const existingClient = await prisma.client.findUnique({
            where: { phone },
        });

        if (existingClient) {
            return NextResponse.json(
                { error: 'A client with this phone number already exists', existingClient },
                { status: 409 }
            );
        }

        // Create client
        const client = await prisma.client.create({
            data: {
                name,
                email: email || null,
                phone,
                type,
                source: source || 'manual',
                tags: tags ? JSON.stringify(tags) : null,
                notes: notes || null,
                preferences: preferences ? JSON.stringify(preferences) : null,
            },
        });

        return NextResponse.json(
            { success: true, data: client },
            { status: 201 }
        );
    } catch (error) {
        console.error('Create client error:', error);
        return NextResponse.json(
            { error: 'Failed to create client' },
            { status: 500 }
        );
    }
}
