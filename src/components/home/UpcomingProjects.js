import { PrismaClient } from '@prisma/client'
import UpcomingProjectsClient from './UpcomingProjectsClient'

const prisma = new PrismaClient()

async function getProjects() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { createdAt: 'desc' },
            take: 3
        })
        return projects
    } catch (error) {
        console.error("Failed to fetch projects:", error)
        return []
    }
}

export default async function UpcomingProjects() {
    const projects = await getProjects()
    return <UpcomingProjectsClient initialProjects={projects} />
}
