import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request) {
    try {
        const body = await request.json()
        const { name, phone, email, message, propertyId, type, projectName } = body

        console.log('Contact Request Received:', body);

        if (!name || !phone) {
            console.log('Validation Error: Missing name or phone');
            return NextResponse.json(
                { error: 'Name and Phone are required' },
                { status: 400 }
            )
        }

        // Auto-create or update client record
        let client = null;
        let isExisting = false;
        try {
            // Check if client exists
            const existingClient = await prisma.client.findUnique({
                where: { phone },
            });

            if (existingClient) {
                isExisting = true;
                // Update existing client (add email if provided and not already set)
                client = await prisma.client.update({
                    where: { phone },
                    data: {
                        name, // Update name in case it changed
                        email: email || existingClient.email, // Add email if provided
                    },
                });
            } else {
                // Create new client from enquiry
                // Determine type based on context
                let clientType = 'buyer'; // Default
                if (type === 'PROPERTY' || propertyId) {
                    clientType = 'buyer';
                }

                client = await prisma.client.create({
                    data: {
                        name,
                        phone,
                        email: email || null,
                        type: clientType,
                        source: 'contact_form',
                    },
                });
            }
        } catch (clientError) {
            console.error('Client creation/update error:', clientError);
            // Continue even if client creation fails
        }

        // Create enquiry
        const enquiry = await prisma.enquiry.create({
            data: {
                name,
                phone,
                message,
                propertyId: propertyId ? parseInt(propertyId) : null,
                type: type || 'GENERAL',
                projectName,
                emailCaptured: email || null,
                clientId: client?.id || null,
            },
        })

        return NextResponse.json({
            success: true,
            data: enquiry,
            clientCreated: client && !isExisting,
            clientUpdated: client && isExisting,
        }, { status: 201 })
    } catch (error) {
        console.error('Contact API Error:', error)
        return NextResponse.json(
            { error: 'Failed to submit enquiry. Please check database connection.' },
            { status: 500 }
        )
    }
}
