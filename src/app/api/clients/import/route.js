import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Papa from 'papaparse';

/**
 * POST /api/clients/import - Bulk import clients from CSV
 */
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file) {
            return NextResponse.json(
                { error: 'No file provided' },
                { status: 400 }
            );
        }

        // Read file content
        const fileContent = await file.text();

        // Parse CSV
        const parseResult = Papa.parse(fileContent, {
            header: true,
            skipEmptyLines: true,
            transformHeader: (header) => header.trim().toLowerCase(),
        });

        if (parseResult.errors.length > 0) {
            return NextResponse.json(
                { error: 'CSV parsing error', details: parseResult.errors },
                { status: 400 }
            );
        }

        const rows = parseResult.data;

        if (rows.length === 0) {
            return NextResponse.json(
                { error: 'No data found in CSV file' },
                { status: 400 }
            );
        }

        // Validate and process rows
        const results = {
            total: rows.length,
            created: 0,
            updated: 0,
            skipped: 0,
            errors: [],
        };

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const rowNumber = i + 2; // +2 for header and 0-index

            try {
                // Required fields
                const name = row.name?.trim();
                const phone = row.phone?.trim();
                const type = row.type?.trim().toLowerCase();

                if (!name || !phone) {
                    results.errors.push({
                        row: rowNumber,
                        error: 'Missing name or phone',
                        data: row,
                    });
                    results.skipped++;
                    continue;
                }

                if (!type || !['buyer', 'seller', 'both'].includes(type)) {
                    results.errors.push({
                        row: rowNumber,
                        error: 'Invalid type (must be buyer, seller, or both)',
                        data: row,
                    });
                    results.skipped++;
                    continue;
                }

                // Optional fields
                const email = row.email?.trim() || null;
                const source = row.source?.trim() || 'import';
                const notes = row.notes?.trim() || null;

                // Parse tags if present (comma-separated or JSON)
                let tags = null;
                if (row.tags) {
                    try {
                        // Try parsing as JSON first
                        tags = JSON.stringify(JSON.parse(row.tags));
                    } catch {
                        // If not JSON, treat as comma-separated
                        const tagArray = row.tags.split(',').map(t => t.trim()).filter(t => t);
                        tags = JSON.stringify(tagArray);
                    }
                }

                // Check if client exists
                const existingClient = await prisma.client.findUnique({
                    where: { phone },
                });

                if (existingClient) {
                    // Update existing client
                    await prisma.client.update({
                        where: { phone },
                        data: {
                            name,
                            email,
                            type,
                            source,
                            tags,
                            notes,
                        },
                    });
                    results.updated++;
                } else {
                    // Create new client
                    await prisma.client.create({
                        data: {
                            name,
                            email,
                            phone,
                            type,
                            source,
                            tags,
                            notes,
                        },
                    });
                    results.created++;
                }
            } catch (error) {
                console.error(`Error processing row ${rowNumber}:`, error);
                results.errors.push({
                    row: rowNumber,
                    error: error.message,
                    data: row,
                });
                results.skipped++;
            }
        }

        return NextResponse.json({
            success: true,
            results,
            message: `Import complete: ${results.created} created, ${results.updated} updated, ${results.skipped} skipped`,
        });
    } catch (error) {
        console.error('Import clients error:', error);
        return NextResponse.json(
            { error: 'Failed to import clients', details: error.message },
            { status: 500 }
        );
    }
}

/**
 * GET /api/clients/import - Download sample CSV template
 */
export async function GET() {
    const sampleCSV = `name,email,phone,type,source,tags,notes
John Doe,john@example.com,9876543210,buyer,manual,"plots,budget_50L+",Interested in residential plots
Jane Smith,jane@example.com,9876543211,seller,contact_form,"commercial",Has property to sell in downtown
Bob Wilson,,9876543212,both,enquiry,"residential,urgent",Looking for 2BHK apartment`;

    return new NextResponse(sampleCSV, {
        headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': 'attachment; filename="client-import-template.csv"',
        },
    });
}
