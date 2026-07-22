import { prisma } from '@/lib/prisma'

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://samyak.org'

  // Get all properties
  const properties = await prisma.property.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  })

  const propertyUrls = properties.map((property) => ({
    url: `${baseUrl}/properties/${property.id}`,
    lastModified: property.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Get all projects
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      updatedAt: true,
    },
  })

  const projectUrls = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: project.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/properties`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    ...propertyUrls,
    ...projectUrls,
  ]
}
