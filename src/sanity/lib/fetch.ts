import { client } from './client'
import {
  SITE_SETTINGS_QUERY,
  ABOUT_QUERY,
  PROJECTS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PROJECT_QUERY,
  POSTS_QUERY,
  POST_QUERY,
  EXPERIENCES_QUERY,
  EDUCATIONS_QUERY,
  SKILLS_QUERY,
  TESTIMONIALS_QUERY,
  POSTS_COUNT_QUERY,
  PAGINATED_POSTS_QUERY,
  PROJECTS_COUNT_QUERY,
  PAGINATED_PROJECTS_QUERY,
  USER_NAMES_QUERY,
  CV_QUERY,
  TECH_SKILLS_QUERY,
  FAQ_QUERY,
} from './queries'

export const fetchSiteSettings = () =>
  client.fetch(SITE_SETTINGS_QUERY, {}, { next: { tags: ['siteSettings'] } })

export const fetchUserNames = () =>
  client.fetch(USER_NAMES_QUERY, {}, { next: { tags: ['siteSettings'] } })

export const fetchCv = () =>
  client.fetch(CV_QUERY, {}, { next: { tags: ['siteSettings'] } })

export const fetchAbout = () =>
  client.fetch(ABOUT_QUERY, {}, { next: { tags: ['about'] } })

export const fetchFaq = () => client.fetch(FAQ_QUERY, {}, { next: { tags: ['faq'] } })

export const fetchProjects = () =>
  client.fetch(PROJECTS_QUERY, {}, { next: { tags: ['project'] } })

export const fetchProject = (slug: string) =>
  client.fetch(PROJECT_QUERY, { slug }, { next: { tags: ['project'] } })

export const fetchFeaturedProjects = () =>
  client.fetch(FEATURED_PROJECTS_QUERY, {}, { next: { tags: ['project'] } })

export async function fetchPaginatedProjects(page: number) {
  const PAGE_SIZE = 2
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [projects, total] = await Promise.all([
    client.fetch(
      PAGINATED_PROJECTS_QUERY,
      { start, end },
      { next: { tags: ['project'] } },
    ),
    client.fetch(PROJECTS_COUNT_QUERY, {}, { next: { tags: ['project'] } }),
  ])

  return { projects, totalPages: Math.ceil(total / PAGE_SIZE) }
}

export const fetchPost = (slug: string) =>
  client.fetch(POST_QUERY, { slug }, { next: { tags: ['post'] } })

export const fetchPosts = () =>
  client.fetch(POSTS_QUERY, {}, { next: { tags: ['post'] } })

export async function fetchPaginatedPosts(page: number) {
  const PAGE_SIZE = 2
  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE

  const [posts, total] = await Promise.all([
    client.fetch(PAGINATED_POSTS_QUERY, { start, end }, { next: { tags: ['post'] } }),
    client.fetch(POSTS_COUNT_QUERY, {}, { next: { tags: ['post'] } }),
  ])

  return { posts, totalPages: Math.ceil(total / PAGE_SIZE) }
}

export const fetchExperiences = () =>
  client.fetch(EXPERIENCES_QUERY, {}, { next: { tags: ['experience'] } })

export const fetchEducations = () =>
  client.fetch(EDUCATIONS_QUERY, {}, { next: { tags: ['education'] } })

export const fetchSkills = () =>
  client.fetch(SKILLS_QUERY, {}, { next: { tags: ['skill'] } })

export const fetchTechSkills = () =>
  client.fetch(TECH_SKILLS_QUERY, {}, { next: { tags: ['skill'] } })

export const fetchTestimonials = () =>
  client.fetch(TESTIMONIALS_QUERY, {}, { next: { tags: ['testimonial'] } })
