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
} from './queries'

export const fetchSiteSettings = () => client.fetch(SITE_SETTINGS_QUERY)
export const fetchUserNames = () => client.fetch(USER_NAMES_QUERY)
export const fetchAbout = () => client.fetch(ABOUT_QUERY)

export const fetchProjects = () => client.fetch(PROJECTS_QUERY)
export const fetchProject = (slug: string) => client.fetch(PROJECT_QUERY, { slug })
export const fetchFeaturedProjects = () => client.fetch(FEATURED_PROJECTS_QUERY)

export async function fetchPaginatedProjects(page: number) {
  const PAGE_SIZE = 2

  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const [projects, total] = await Promise.all([
    client.fetch(PAGINATED_PROJECTS_QUERY, { start, end }),
    client.fetch(PROJECTS_COUNT_QUERY),
  ])
  return { projects, totalPages: Math.ceil(total / PAGE_SIZE) }
}

export const fetchPost = (slug: string) => client.fetch(POST_QUERY, { slug })
export const fetchPosts = () => client.fetch(POSTS_QUERY)

export async function fetchPaginatedPosts(page: number) {
  const PAGE_SIZE = 2

  const start = (page - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const [posts, total] = await Promise.all([
    client.fetch(PAGINATED_POSTS_QUERY, { start, end }),
    client.fetch(POSTS_COUNT_QUERY),
  ])

  return { posts, totalPages: Math.ceil(total / PAGE_SIZE) }
}

export const fetchCv = () => client.fetch(CV_QUERY)
export const fetchExperiences = () => client.fetch(EXPERIENCES_QUERY)
export const fetchEducations = () => client.fetch(EDUCATIONS_QUERY)

export const fetchSkills = () => client.fetch(SKILLS_QUERY)
export const fetchTechSkills = () => client.fetch(TECH_SKILLS_QUERY)

export const fetchTestimonials = () => client.fetch(TESTIMONIALS_QUERY)
