import { prisma } from './prisma';
import { sendEmail } from './email';
import { sendWhatsApp, formatWhatsAppNumber } from './whatsapp';

/**
 * Queue and send notifications to clients
 * @param {Object} params - Notification parameters
 * @param {Array} params.clients - Array of client objects
 * @param {string} params.subject - Email subject
 * @param {string} params.emailHtml - HTML email content
 * @param {string} params.emailText - Plain text email content
 * @param {string} params.whatsappMessage - WhatsApp message
 * @param {string} params.channel - Channel type (property_alert, project_alert, manual)
 * @param {string} params.entityType - Entity type (property, project)
 * @param {number} params.entityId - Entity ID
 * @returns {Promise<Object>} - Results summary
 */
export async function queueNotifications({
    clients,
    subject,
    emailHtml,
    emailText,
    whatsappMessage,
    channel,
    entityType,
    entityId,
}) {
    const results = {
        total: clients.length,
        emailSent: 0,
        emailFailed: 0,
        whatsappSent: 0,
        whatsappFailed: 0,
        skipped: 0,
    };

    for (const client of clients) {
        // Skip if client has opted out
        if (client.optedOut || !client.isActive) {
            results.skipped++;
            continue;
        }

        // Send email if client has email
        if (client.email) {
            const emailResult = await sendEmail({
                to: client.email,
                subject,
                html: emailHtml,
                text: emailText,
            });

            // Log notification
            await prisma.notification.create({
                data: {
                    clientId: client.id,
                    type: 'email',
                    subject,
                    content: emailText,
                    channel,
                    entityType,
                    entityId,
                    status: emailResult.success ? 'sent' : 'failed',
                    sentAt: emailResult.success ? new Date() : null,
                    error: emailResult.error || null,
                },
            });

            if (emailResult.success) {
                results.emailSent++;
            } else {
                results.emailFailed++;
            }

            // Add delay to prevent rate limiting (500ms between emails)
            await delay(500);
        }

        // Send WhatsApp if client has phone
        if (client.phone && whatsappMessage) {
            const formattedPhone = formatWhatsAppNumber(client.phone);

            const whatsappResult = await sendWhatsApp({
                to: formattedPhone,
                message: whatsappMessage,
            });

            // Log notification
            await prisma.notification.create({
                data: {
                    clientId: client.id,
                    type: 'whatsapp',
                    subject: 'WhatsApp Alert',
                    content: whatsappMessage,
                    channel,
                    entityType,
                    entityId,
                    status: whatsappResult.success ? 'sent' : 'failed',
                    sentAt: whatsappResult.success ? new Date() : null,
                    error: whatsappResult.error || null,
                },
            });

            if (whatsappResult.success) {
                results.whatsappSent++;
            } else {
                results.whatsappFailed++;
            }

            // Add delay to prevent rate limiting (1s between WhatsApp messages)
            await delay(1000);
        }
    }

    return results;
}

/**
 * Send notifications for a new property
 */
export async function sendPropertyNotifications(property) {
    const { generatePropertyAlertEmail, generatePropertyAlertText } = await import('./templates/email-property-alert');
    const { generatePropertyWhatsAppMessage } = await import('./templates/whatsapp-alerts');

    // Get all active, opted-in clients
    const clients = await prisma.client.findMany({
        where: {
            isActive: true,
            optedOut: false,
        },
    });

    if (clients.length === 0) {
        return { success: true, message: 'No active clients to notify' };
    }

    const results = await queueNotifications({
        clients,
        subject: `New Property: ${property.title}`,
        emailHtml: generatePropertyAlertEmail(property, 'Valued Client'),
        emailText: generatePropertyAlertText(property, 'Valued Client'),
        whatsappMessage: generatePropertyWhatsAppMessage(property),
        channel: 'property_alert',
        entityType: 'property',
        entityId: property.id,
    });

    return {
        success: true,
        results,
    };
}

/**
 * Send notifications for a new project
 */
export async function sendProjectNotifications(project) {
    const { generateProjectAlertEmail, generateProjectAlertText } = await import('./templates/email-project-alert');
    const { generateProjectWhatsAppMessage } = await import('./templates/whatsapp-alerts');

    // Get all active, opted-in clients
    const clients = await prisma.client.findMany({
        where: {
            isActive: true,
            optedOut: false,
        },
    });

    if (clients.length === 0) {
        return { success: true, message: 'No active clients to notify' };
    }

    const results = await queueNotifications({
        clients,
        subject: `New Project Launch: ${project.title}`,
        emailHtml: generateProjectAlertEmail(project, 'Valued Client'),
        emailText: generateProjectAlertText(project, 'Valued Client'),
        whatsappMessage: generateProjectWhatsAppMessage(project),
        channel: 'project_alert',
        entityType: 'project',
        entityId: project.id,
    });

    return {
        success: true,
        results,
    };
}

/**
 * Retry failed notifications
 */
export async function retryFailedNotifications(maxRetries = 3) {
    const failedNotifications = await prisma.notification.findMany({
        where: {
            status: 'failed',
        },
        include: {
            client: true,
        },
        take: 50, // Process 50 at a time
    });

    const results = {
        retried: 0,
        succeeded: 0,
        failed: 0,
    };

    for (const notification of failedNotifications) {
        results.retried++;

        if (notification.type === 'email' && notification.client.email) {
            const emailResult = await sendEmail({
                to: notification.client.email,
                subject: notification.subject,
                html: notification.content,
                text: notification.content,
            });

            await prisma.notification.update({
                where: { id: notification.id },
                data: {
                    status: emailResult.success ? 'sent' : 'failed',
                    sentAt: emailResult.success ? new Date() : notification.sentAt,
                    error: emailResult.error || notification.error,
                },
            });

            emailResult.success ? results.succeeded++ : results.failed++;
            await delay(500);
        } else if (notification.type === 'whatsapp' && notification.client.phone) {
            const formattedPhone = formatWhatsAppNumber(notification.client.phone);

            const whatsappResult = await sendWhatsApp({
                to: formattedPhone,
                message: notification.content,
            });

            await prisma.notification.update({
                where: { id: notification.id },
                data: {
                    status: whatsappResult.success ? 'sent' : 'failed',
                    sentAt: whatsappResult.success ? new Date() : notification.sentAt,
                    error: whatsappResult.error || notification.error,
                },
            });

            whatsappResult.success ? results.succeeded++ : results.failed++;
            await delay(1000);
        }
    }

    return results;
}

/**
 * Helper function for delay
 */
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
