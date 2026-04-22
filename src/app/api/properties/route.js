import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

export async function POST(req) {
    try {
        const formData = await req.formData();

        const title = formData.get('title');
        const description = formData.get('description');
        const price = parseFloat(formData.get('price'));
        const location = formData.get('location');
        const area = parseFloat(formData.get('area'));
        const type = formData.get('type');
        const status = formData.get('status');

        // Handle Images
        const imageFiles = formData.getAll('images');
        const imageUrls = [];

        // Ensure upload directory exists
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        for (const file of imageFiles) {
            if (file instanceof File) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
                await writeFile(path.join(uploadDir, filename), buffer);
                imageUrls.push(`/uploads/${filename}`);
            }
        }

        // Handle Video
        const videoFile = formData.get('video');
        let videoUrl = null;
        if (videoFile instanceof File) {
            const buffer = Buffer.from(await videoFile.arrayBuffer());
            const filename = `vid-${Date.now()}-${videoFile.name.replace(/\s/g, '-')}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            videoUrl = `/uploads/${filename}`;
        }

        // Handle Brochure
        const brochureFile = formData.get('brochure');
        let brochureUrl = null;
        if (brochureFile instanceof File) {
            const buffer = Buffer.from(await brochureFile.arrayBuffer());
            const filename = `doc-${Date.now()}-${brochureFile.name.replace(/\s/g, '-')}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            brochureUrl = `/uploads/${filename}`;
        }

        // Handle Property Plan
        const planFile = formData.get('propertyPlan');
        let planUrl = null;
        if (planFile instanceof File) {
            const buffer = Buffer.from(await planFile.arrayBuffer());
            const filename = `plan-${Date.now()}-${planFile.name.replace(/\s/g, '-')}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            planUrl = `/uploads/${filename}`;
        }

        const property = await prisma.property.create({
            data: {
                title,
                description,
                price,
                location,
                area,
                type,
                status,
                images: JSON.stringify(imageUrls),
                video: videoUrl,
                brochure: brochureUrl,
                propertyPlan: planUrl
            }
        });

        // Trigger notifications to all active clients
        try {
            const { sendPropertyNotifications } = await import('@/lib/notificationQueue');
            // Send notifications asynchronously (don't wait)
            sendPropertyNotifications(property).catch(err => {
                console.error('Error sending property notifications:', err);
            });
        } catch (notifyError) {
            console.error('Error triggering notifications:', notifyError);
            // Don't fail the property creation if notifications fail
        }

        return NextResponse.json({ success: true, data: property });
    } catch (error) {
        console.error('Error creating property:', error);
        return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const formData = await req.formData();
        const id = parseInt(formData.get('id'));

        if (!id) {
            return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
        }

        const title = formData.get('title');
        const description = formData.get('description');
        const price = parseFloat(formData.get('price'));
        const location = formData.get('location');
        const area = parseFloat(formData.get('area'));
        const type = formData.get('type');
        const status = formData.get('status');

        // Get existing property to preserve old images if no new ones
        const existingProperty = await prisma.property.findUnique({ where: { id } });
        if (!existingProperty) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Get existing images from form data
        const existingImagesJson = formData.get('existingImages');
        let imageUrls = [];

        if (existingImagesJson) {
            try {
                imageUrls = JSON.parse(existingImagesJson);
            } catch {
                imageUrls = [];
            }
        }

        let videoUrl = existingProperty.video;
        let brochureUrl = existingProperty.brochure;
        let planUrl = existingProperty.propertyPlan;

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Handle new images - ADD to existing ones
        const imageFiles = formData.getAll('images');
        for (const file of imageFiles) {
            if (file instanceof File) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`;
                await writeFile(path.join(uploadDir, filename), buffer);
                imageUrls.push(`/uploads/${filename}`);
            }
        }

        // Handle new video
        const videoFile = formData.get('video');
        if (videoFile instanceof File) {
            const buffer = Buffer.from(await videoFile.arrayBuffer());
            const filename = `vid-${Date.now()}-${videoFile.name.replace(/\s/g, '-')}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            videoUrl = `/uploads/${filename}`;
        }

        // Handle new brochure
        const brochureFile = formData.get('brochure');
        if (brochureFile instanceof File) {
            const buffer = Buffer.from(await brochureFile.arrayBuffer());
            const filename = `doc-${Date.now()}-${brochureFile.name.replace(/\s/g, '-')}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            brochureUrl = `/uploads/${filename}`;
        }

        // Handle new property plan
        const planFile = formData.get('propertyPlan');
        if (planFile instanceof File) {
            const buffer = Buffer.from(await planFile.arrayBuffer());
            const filename = `plan-${Date.now()}-${planFile.name.replace(/\s/g, '-')}`;
            await writeFile(path.join(uploadDir, filename), buffer);
            planUrl = `/uploads/${filename}`;
        }

        const property = await prisma.property.update({
            where: { id },
            data: {
                title,
                description,
                price,
                location,
                area,
                type,
                status,
                images: JSON.stringify(imageUrls),
                video: videoUrl,
                brochure: brochureUrl,
                propertyPlan: planUrl
            }
        });

        return NextResponse.json({ success: true, data: property });
    } catch (error) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        const { searchParams } = new URL(req.url);
        const id = parseInt(searchParams.get('id'));

        if (!id) {
            return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
        }

        await prisma.property.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Property deleted successfully' });
    } catch (error) {
        console.error('Error deleting property:', error);
        return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
    }
}

