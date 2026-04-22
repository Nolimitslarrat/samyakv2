/**
 * Generate WhatsApp message for new property alert
 */
export function generatePropertyWhatsAppMessage(property) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const propertyUrl = `${appUrl}/properties/${property.id}`;

    return `
🏘️ *New Property Alert - Samyak Properties*

*${property.title}*

📍 ${property.location}
💰 ₹${Number(property.price).toLocaleString('en-IN')}
📏 ${property.area} sq.ft.
🏢 ${property.type}

${property.description.substring(0, 120)}${property.description.length > 120 ? '...' : ''}

🔗 View Details: ${propertyUrl}

📞 Call: +91 98765 43210

_Reply STOP to unsubscribe_
  `.trim();
}

/**
 * Generate WhatsApp message for new project alert
 */
export function generateProjectWhatsAppMessage(project) {
    const appUrl = process.env.APP_URL || 'http://localhost:3000';
    const projectUrl = `${appUrl}/upcoming/${project.id}`;

    let launchInfo = '';
    if (project.launchDate) {
        launchInfo = `🚀 Launch: ${project.launchDate}\n`;
    }

    return `
🎉 *NEW PROJECT LAUNCH - Samyak Properties*

*${project.title}*

📍 ${project.location}
🏗️ ${project.type}
${launchInfo}
${project.description.substring(0, 100)}${project.description.length > 100 ? '...' : ''}

🎁 *Early bird offers available!*

🔗 Explore: ${projectUrl}

📞 Call Now: +91 98765 43210

_Reply STOP to unsubscribe_
  `.trim();
}
