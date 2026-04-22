/**
 * Generate HTML email template for new property alert
 */
export function generatePropertyAlertEmail(property, clientName) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const propertyUrl = `${appUrl}/properties/${property.id}`;

    // Parse images if stored as JSON string
    let imageUrl = '/placeholder-property.jpg';
    try {
        const images = JSON.parse(property.images || '[]');
        if (images.length > 0) {
            imageUrl = images[0];
        }
    } catch (e) {
        // Use default if parsing fails
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Property Alert - ${property.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Samyak Properties</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">New Property Alert</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0; font-size: 16px; color: #333333;">Dear ${clientName},</p>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #555555; line-height: 1.6;">
                We're excited to share a new property that matches your interests!
              </p>
            </td>
          </tr>

          <!-- Property Image -->
          <tr>
            <td style="padding: 0 30px;">
              <img src="${imageUrl}" alt="${property.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; display: block;" />
            </td>
          </tr>

          <!-- Property Details -->
          <tr>
            <td style="padding: 25px 30px;">
              <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #333333; font-weight: 700;">${property.title}</h2>
              
              <div style="margin-bottom: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                      <span style="color: #888888; font-size: 14px;">📍 Location:</span>
                      <span style="color: #333333; font-size: 15px; font-weight: 600; margin-left: 10px;">${property.location}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                      <span style="color: #888888; font-size: 14px;">💰 Price:</span>
                      <span style="color: #667eea; font-size: 18px; font-weight: 700; margin-left: 10px;">₹${Number(property.price).toLocaleString('en-IN')}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                      <span style="color: #888888; font-size: 14px;">📏 Area:</span>
                      <span style="color: #333333; font-size: 15px; font-weight: 600; margin-left: 10px;">${property.area} sq.ft.</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #888888; font-size: 14px;">🏢 Type:</span>
                      <span style="color: #333333; font-size: 15px; font-weight: 600; margin-left: 10px;">${property.type}</span>
                    </td>
                  </tr>
                </table>
              </div>

              <p style="margin: 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">
                ${property.description.substring(0, 200)}${property.description.length > 200 ? '...' : ''}
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${propertyUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 10px rgba(102, 126, 234, 0.4);">
                      View Property Details
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 14px; color: #888888;">
                Need more information? Contact us at <a href="tel:+919876543210" style="color: #667eea; text-decoration: none;">+91 98765 43210</a>
              </p>
              <p style="margin: 15px 0 0 0; font-size: 12px; color: #aaaaaa;">
                © ${new Date().getFullYear()} Samyak Properties. All rights reserved.
              </p>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #aaaaaa;">
                <a href="${appUrl}/unsubscribe" style="color: #aaaaaa; text-decoration: underline;">Unsubscribe from alerts</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Generate plain text version for property alert
 */
export function generatePropertyAlertText(property, clientName) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const propertyUrl = `${appUrl}/properties/${property.id}`;

    return `
Dear ${clientName},

We're excited to share a new property that matches your interests!

${property.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Location: ${property.location}
💰 Price: ₹${Number(property.price).toLocaleString('en-IN')}
📏 Area: ${property.area} sq.ft.
🏢 Type: ${property.type}

${property.description}

View full details: ${propertyUrl}

Need more information? Contact us at +91 98765 43210

© ${new Date().getFullYear()} Samyak Properties. All rights reserved.
Unsubscribe: ${appUrl}/unsubscribe
  `.trim();
}
