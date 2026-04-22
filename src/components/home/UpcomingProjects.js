import { PrismaClient } from '@prisma/client'
import UpcomingProjectsClient from './UpcomingProjectsClient'

export default async function UpcomingProjects() {
    let projects = []
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/projects`, {
            cache: 'no-store',
        })
        if (res.ok) {
            const data = await res.json()
            projects = Array.isArray(data) ? data.slice(0, 3) : []
        }
    } catch (error) {
        console.error("Failed to fetch projects:", error)
    }
    return <UpcomingProjectsClient initialProjects={projects} />
}
