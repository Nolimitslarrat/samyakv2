/**
 * Generate HTML email template for new project alert
 */
export function generateProjectAlertEmail(project, clientName) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const projectUrl = `${appUrl}/upcoming/${project.id}`;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Project Launch - ${project.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Samyak Properties</h1>
              <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 18px; font-weight: 600; opacity: 0.95;">🎉 New Project Launch!</p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 30px 30px 20px 30px;">
              <p style="margin: 0; font-size: 16px; color: #333333;">Dear ${clientName},</p>
              <p style="margin: 15px 0 0 0; font-size: 16px; color: #555555; line-height: 1.6;">
                We're thrilled to announce an exciting new project that we think you'll love!
              </p>
            </td>
          </tr>

          <!-- Project Image -->
          <tr>
            <td style="padding: 0 30px;">
              <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 300px; object-fit: cover; border-radius: 8px; display: block;" />
            </td>
          </tr>

          <!-- Project Details -->
          <tr>
            <td style="padding: 25px 30px;">
              <h2 style="margin: 0 0 15px 0; font-size: 26px; color: #333333; font-weight: 700;">${project.title}</h2>
              
              <div style="margin-bottom: 20px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                      <span style="color: #888888; font-size: 14px;">📍 Location:</span>
                      <span style="color: #333333; font-size: 15px; font-weight: 600; margin-left: 10px;">${project.location}</span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                      <span style="color: #888888; font-size: 14px;">🏗️ Type:</span>
                      <span style="color: #333333; font-size: 15px; font-weight: 600; margin-left: 10px;">${project.type}</span>
                    </td>
                  </tr>
                  ${project.launchDate ? `
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e0e0e0;">
                      <span style="color: #888888; font-size: 14px;">🚀 Launch Date:</span>
                      <span style="color: #f5576c; font-size: 15px; font-weight: 700; margin-left: 10px;">${project.launchDate}</span>
                    </td>
                  </tr>
                  ` : ''}
                  ${project.possessionDate ? `
                  <tr>
                    <td style="padding: 8px 0;">
                      <span style="color: #888888; font-size: 14px;">🏡 Possession:</span>
                      <span style="color: #333333; font-size: 15px; font-weight: 600; margin-left: 10px;">${project.possessionDate}</span>
                    </td>
                  </tr>
                  ` : ''}
                </table>
              </div>

              <p style="margin: 20px 0; font-size: 15px; color: #555555; line-height: 1.6;">
                ${project.description.substring(0, 250)}${project.description.length > 250 ? '...' : ''}
              </p>

              <!-- Amenities (if available) -->
              ${(() => {
            try {
                const amenities = JSON.parse(project.amenities || '[]');
                if (amenities.length > 0) {
                    return `
                      <div style="margin: 25px 0; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border-left: 4px solid #f5576c;">
                        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333333;">✨ Premium Amenities:</h3>
                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.8;">
                          ${amenities.slice(0, 6).join(' • ')}${amenities.length > 6 ? ' • and more...' : ''}
                        </p>
                      </div>
                    `;
                }
            } catch (e) { }
            return '';
        })()}

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="${projectUrl}" style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 10px rgba(245, 87, 108, 0.4);">
                      Explore Project Details
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 25px 0 0 0; padding: 15px; background-color: #fff8e1; border-radius: 6px; font-size: 14px; color: #f57c00; text-align: center; font-weight: 600;">
                🎁 Early bird offers available! Contact us now to know more.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0; font-size: 14px; color: #888888;">
                Interested? Call us at <a href="tel:+919876543210" style="color: #f5576c; text-decoration: none; font-weight: 600;">+91 98765 43210</a>
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
 * Generate plain text version for project alert
 */
export function generateProjectAlertText(project, clientName) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const projectUrl = `${appUrl}/upcoming/${project.id}`;

    let amenitiesText = '';
    try {
        const amenities = JSON.parse(project.amenities || '[]');
        if (amenities.length > 0) {
            amenitiesText = `\n✨ Amenities: ${amenities.slice(0, 6).join(', ')}${amenities.length > 6 ? ', and more...' : ''}`;
        }
    } catch (e) { }

    return `
Dear ${clientName},

🎉 NEW PROJECT LAUNCH!

${project.title}
━━━━━━━━━━━━━━━━━━━━━━━━━━

📍 Location: ${project.location}
🏗️ Type: ${project.type}
${project.launchDate ? `🚀 Launch Date: ${project.launchDate}` : ''}
${project.possessionDate ? `🏡 Possession: ${project.possessionDate}` : ''}

${project.description}
${amenitiesText}

🎁 Early bird offers available! Contact us now to know more.

Explore full details: ${projectUrl}

Call us at +91 98765 43210

© ${new Date().getFullYear()} Samyak Properties. All rights reserved.
Unsubscribe: ${appUrl}/unsubscribe
  `.trim();
}
