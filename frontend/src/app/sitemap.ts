import { MetadataRoute } from 'next'

// Base URL for API requests
// In production, NEXT_PUBLIC_API_URL should be set to https://kcay.ca/api/v1
// For local development, it falls back to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === 'production' 
    ? 'https://kcay.ca/api/v1' 
    : 'http://localhost:3000/api/v1')
const baseUrl = 'https://kcay.ca'

// Helper function to fetch from API
async function fetchFromAPI(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      // Add cache revalidation - this ensures fresh data but allows caching
      next: { revalidate: 3600 }, // Revalidate every hour
    })
    
    if (!response.ok) {
      console.warn(`Failed to fetch ${endpoint}: ${response.status}`)
      return null
    }
    
    return await response.json()
  } catch (error) {
    console.warn(`Error fetching ${endpoint}:`, error)
    return null
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages (always included)
  const staticPages: MetadataRoute.Sitemap = [
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
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/podcast`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/notable-figures`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/learn`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/learn/kurdish-language`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/learn/kurdish-dance`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/learn/kurdish-heritage`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/get-involved`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Fetch dynamic content from API
  const [podcasts, notableFigures, events] = await Promise.all([
    fetchFromAPI('/podcast'),
    fetchFromAPI('/notable-figures'),
    fetchFromAPI('/events'),
  ])

  // Build dynamic pages
  const dynamicPages: MetadataRoute.Sitemap = []

  // Add all podcast episodes
  if (Array.isArray(podcasts)) {
    podcasts.forEach((podcast: any) => {
      if (podcast?.id) {
        dynamicPages.push({
          url: `${baseUrl}/podcast/${podcast.id}`,
          lastModified: podcast.updated_at ? new Date(podcast.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    })
  }

  // Add all notable figures
  if (Array.isArray(notableFigures)) {
    notableFigures.forEach((figure: any) => {
      if (figure?.id) {
        dynamicPages.push({
          url: `${baseUrl}/notable-figures/${figure.id}`,
          lastModified: figure.updated_at ? new Date(figure.updated_at) : new Date(),
          changeFrequency: 'monthly',
          priority: 0.6,
        })
      }
    })
  }

  // Add all events (both upcoming and past)
  if (events) {
    const allEvents = [
      ...(Array.isArray(events.upcoming) ? events.upcoming : []),
      ...(Array.isArray(events.past) ? events.past : []),
    ]
    
    allEvents.forEach((event: any) => {
      if (event?.id) {
        dynamicPages.push({
          url: `${baseUrl}/events/${event.id}`,
          lastModified: event.updated_at ? new Date(event.updated_at) : new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
        })
      }
    })
  }

  // Combine static and dynamic pages
  return [...staticPages, ...dynamicPages]
}


