// Twilio WhatsApp integration
let twilioClient = null;

function getTwilioClient() {
    if (!twilioClient && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
        try {
            const twilio = require('twilio');
            twilioClient = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );
        } catch (error) {
            console.error('Twilio initialization error:', error);
        }
    }
    return twilioClient;
}

/**
 * Send a WhatsApp message
 * @param {Object} options - Message options
 * @param {string} options.to - Recipient phone number (with country code, e.g., +919876543210)
 * @param {string} options.message - Message content
 * @returns {Promise<Object>} - Send result
 */
export async function sendWhatsApp({ to, message }) {
    try {
        const client = getTwilioClient();

        if (!client) {
            console.warn('WhatsApp not configured. Skipping WhatsApp send.');
            return { success: false, error: 'WhatsApp not configured' };
        }

        if (!process.env.TWILIO_WHATSAPP_NUMBER) {
            return { success: false, error: 'Twilio WhatsApp number not configured' };
        }

        // Ensure phone number has whatsapp: prefix
        const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;

        const result = await client.messages.create({
            from: process.env.TWILIO_WHATSAPP_NUMBER,
            to: toNumber,
            body: message,
        });

        console.log('WhatsApp sent:', result.sid);
        return { success: true, messageId: result.sid };
    } catch (error) {
        console.error('WhatsApp send error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send bulk WhatsApp messages with delay
 * @param {Array} messages - Array of message objects {to, message}
 * @param {number} delayMs - Delay between sends (default 1000ms for WhatsApp)
 * @returns {Promise<Array>} - Array of results
 */
export async function sendBulkWhatsApp(messages, delayMs = 1000) {
    const results = [];

    for (const msg of messages) {
        const result = await sendWhatsApp(msg);
        results.push({ ...msg, result });

        // Add delay between sends to avoid rate limiting
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return results;
}

/**
 * Format phone number for WhatsApp (add country code if missing)
 * @param {string} phone - Phone number
 * @param {string} defaultCountryCode - Default country code (e.g., '+91' for India)
 * @returns {string} - Formatted phone number
 */
export function formatWhatsAppNumber(phone, defaultCountryCode = '+91') {
    // Remove all non-digit characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Add country code if not present
    if (!cleaned.startsWith('+')) {
        cleaned = defaultCountryCode + cleaned;
    }

    return cleaned;
}

/**
 * Verify WhatsApp configuration
 */
export function verifyWhatsAppConfig() {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
        return { success: false, error: 'Twilio credentials not configured' };
    }

    if (!process.env.TWILIO_WHATSAPP_NUMBER) {
        return { success: false, error: 'Twilio WhatsApp number not configured' };
    }

    return { success: true };
}
