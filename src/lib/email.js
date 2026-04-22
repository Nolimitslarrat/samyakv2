import nodemailer from 'nodemailer';

// Create reusable transporter
let transporter = null;

function getTransporter() {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }
    return transporter;
}

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - HTML content
 * @param {string} options.text - Plain text content (optional)
 * @returns {Promise<Object>} - Send result
 */
export async function sendEmail({ to, subject, html, text }) {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.warn('Email not configured. Skipping email send.');
            return { success: false, error: 'Email not configured' };
        }

        const mailOptions = {
            from: process.env.EMAIL_FROM || process.env.SMTP_USER,
            to,
            subject,
            html,
            text: text || stripHtml(html),
        };

        const info = await getTransporter().sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Send bulk emails with delay to prevent rate limiting
 * @param {Array} emails - Array of email objects {to, subject, html}
 * @param {number} delayMs - Delay between sends (default 500ms)
 * @returns {Promise<Array>} - Array of results
 */
export async function sendBulkEmails(emails, delayMs = 500) {
    const results = [];

    for (const email of emails) {
        const result = await sendEmail(email);
        results.push({ ...email, result });

        // Add delay between sends to avoid rate limiting
        if (delayMs > 0) {
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }

    return results;
}

/**
 * Strip HTML tags for plain text version
 */
function stripHtml(html) {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/**
 * Verify email configuration
 */
export async function verifyEmailConfig() {
    try {
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            return { success: false, error: 'Email credentials not configured' };
        }

        await getTransporter().verify();
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
