import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { queueNotifications } from '@/lib/notificationQueue';

/**
 * GET /api/notifications - Get notification history
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get('clientId');
        const type = searchParams.get('type'); // email, whatsapp
        const status = searchParams.get('status'); // pending, sent, failed
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        const skip = (page - 1) * limit;

        const where = {};

        if (clientId) {
            where.clientId = parseInt(clientId);
        }

        if (type) {
            where.type = type;
        }

        if (status) {
            where.status = status;
        }

        const [notifications, total] = await Promise.all([
            prisma.notification.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    client: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                        },
                    },
                },
            }),
            prisma.notification.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: notifications,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch notifications' },
            { status: 500 }
        );
    }
}

/**
 * POST /api/notifications - Send manual notifications
 */
export async function POST(request) {
    try {
        const body = await request.json();
        const { clientIds, subject, message, type } = body;

        if (!subject || !message) {
            return NextResponse.json(
                { error: 'Subject and message are required' },
                { status: 400 }
            );
        }

        // Get clients
        let clients;
        if (clientIds && clientIds.length > 0) {
            clients = await prisma.client.findMany({
                where: {
                    id: { in: clientIds },
                    isActive: true,
                    optedOut: false,
                },
            });
        } else {
            // Send to all active clients
            clients = await prisma.client.findMany({
                where: {
                    isActive: true,
                    optedOut: false,
                },
            });
        }

        if (clients.length === 0) {
            return NextResponse.json(
                { error: 'No eligible clients found' },
                { status: 404 }
            );
        }

        // Queue notifications
        const results = await queueNotifications({
            clients,
            subject,
            emailHtml: `
        <html>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #333;">${subject}</h2>
            <p style="color: #555; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="font-size: 12px; color: #888;">
              © ${new Date().getFullYear()} Samyak Properties
            </p>
          </body>
        </html>
      `,
            emailText: message,
            whatsappMessage: type === 'both' || type === 'whatsapp' ? message : null,
            channel: 'manual',
            entityType: null,
            entityId: null,
        });

        return NextResponse.json({
            success: true,
            results,
            message: `Notifications queued: ${results.emailSent} emails sent, ${results.whatsappSent} WhatsApp sent`,
        });
    } catch (error) {
        console.error('Send notifications error:', error);
        return NextResponse.json(
            { error: 'Failed to send notifications' },
            { status: 500 }
        );
    }
}
