import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/clients/[id] - Get a single client
 */
export async function GET(request, { params }) {
    try {
        const id = parseInt(params.id);

        const client = await prisma.client.findUnique({
            where: { id },
            include: {
                notifications: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
                enquiries: {
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
            },
        });

        if (!client) {
            return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
            );
        }

        // Parse JSON fields
        if (client.tags) {
            try {
                client.tags = JSON.parse(client.tags);
            } catch (e) { }
        }

        if (client.preferences) {
            try {
                client.preferences = JSON.parse(client.preferences);
            } catch (e) { }
        }

        return NextResponse.json({ success: true, data: client });
    } catch (error) {
        console.error('Get client error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch client' },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/clients/[id] - Update a client
 */
export async function PUT(request, { params }) {
    try {
        const id = parseInt(params.id);
        const body = await request.json();
        const { name, email, phone, type, tags, notes, preferences, isActive, optedOut } = body;

        // Check if client exists
        const existingClient = await prisma.client.findUnique({
            where: { id },
        });

        if (!existingClient) {
            return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
            );
        }

        // If phone is being changed, check for duplicates
        if (phone && phone !== existingClient.phone) {
            const duplicatePhone = await prisma.client.findUnique({
                where: { phone },
            });

            if (duplicatePhone) {
                return NextResponse.json(
                    { error: 'A client with this phone number already exists' },
                    { status: 409 }
                );
            }
        }

        // Update client
        const updatedClient = await prisma.client.update({
            where: { id },
            data: {
                name: name || existingClient.name,
                email: email !== undefined ? email : existingClient.email,
                phone: phone || existingClient.phone,
                type: type || existingClient.type,
                tags: tags !== undefined ? JSON.stringify(tags) : existingClient.tags,
                notes: notes !== undefined ? notes : existingClient.notes,
                preferences: preferences !== undefined ? JSON.stringify(preferences) : existingClient.preferences,
                isActive: isActive !== undefined ? isActive : existingClient.isActive,
                optedOut: optedOut !== undefined ? optedOut : existingClient.optedOut,
            },
        });

        return NextResponse.json({ success: true, data: updatedClient });
    } catch (error) {
        console.error('Update client error:', error);
        return NextResponse.json(
            { error: 'Failed to update client' },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/clients/[id] - Delete a client
 */
export async function DELETE(request, { params }) {
    try {
        const id = parseInt(params.id);

        // Check if client exists
        const client = await prisma.client.findUnique({
            where: { id },
        });

        if (!client) {
            return NextResponse.json(
                { error: 'Client not found' },
                { status: 404 }
            );
        }

        // Delete client (this will cascade delete notifications)
        await prisma.client.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Client deleted successfully',
        });
    } catch (error) {
        console.error('Delete client error:', error);
        return NextResponse.json(
            { error: 'Failed to delete client' },
            { status: 500 }
        );
    }
}
