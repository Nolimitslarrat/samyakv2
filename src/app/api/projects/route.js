import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile } from 'fs/promises'
import path from 'path'


export async function POST(req) {
    try {
        const formData = await req.formData()

        // Extract fields
        const title = formData.get('title')
        const location = formData.get('location')
        const type = formData.get('type') // Township, Commercial, etc.
        const status = formData.get('status')
        const description = formData.get('description')
        const launchDate = formData.get('launchDate')
        const reraId = formData.get('reraId')
        const amenities = formData.get('amenities') // Expecting JSON string

        // File handling
        const uploadDir = path.join(process.cwd(), 'public/uploads')

        // Main Image (Required)
        const imageFile = formData.get('image')
        let imageUrl = ''
        if (imageFile instanceof File) {
            const buffer = Buffer.from(await imageFile.arrayBuffer())
            const filename = `proj-main-${Date.now()}-${imageFile.name.replace(/\s/g, '-')}`
            await writeFile(path.join(uploadDir, filename), buffer)
            imageUrl = `/uploads/${filename}`
        }

        // Brochure (Optional)
        const brochureFile = formData.get('brochure')
        let brochureUrl = null
        if (brochureFile instanceof File) {
            const buffer = Buffer.from(await brochureFile.arrayBuffer())
            const filename = `proj-brochure-${Date.now()}-${brochureFile.name.replace(/\s/g, '-')}`
            await writeFile(path.join(uploadDir, filename), buffer)
            brochureUrl = `/uploads/${filename}`
        }

        // Create Project
        const project = await prisma.project.create({
            data: {
                title, location, type, status, description,
                launchDate, reraId, amenities,
                image: imageUrl,
                brochure: brochureUrl
            }
        })

        // Trigger notifications to all active clients
        try {
            const { sendProjectNotifications } = await import('@/lib/notificationQueue');
            // Send notifications asynchronously (don't wait)
            sendProjectNotifications(project).catch(err => {
                console.error('Error sending project notifications:', err);
            });
        } catch (notifyError) {
            console.error('Error triggering notifications:', notifyError);
            // Don't fail the project creation if notifications fail
        }

        return NextResponse.json({ success: true, project })
    } catch (error) {
        console.error('Project Create Error:', error)
        return NextResponse.json({ error: 'Failed to create project' }, { status: 500 })
    }
}

export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(projects)
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 })
    }
}
