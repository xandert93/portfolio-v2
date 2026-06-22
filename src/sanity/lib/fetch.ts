import { client } from './client'
import {
  SITE_SETTINGS_QUERY,
  ABOUT_QUERY,
  PROJECTS_QUERY,
  FEATURED_PROJECTS_QUERY,
  PROJECT_QUERY,
  POSTS_QUERY,
  POST_QUERY,
  EXPERIENCE_QUERY,
  EDUCATION_QUERY,
  SKILLS_QUERY,
  TESTIMONIALS_QUERY,
  POSTS_COUNT_QUERY,
  PAGINATED_POSTS_QUERY,
  PROJECTS_COUNT_QUERY,
  PAGINATED_PROJECTS_QUERY,
  USER_NAMES_QUERY,
} from './queries'

import type {
  PROJECTS_QUERY_RESULT,
  FEATURED_PROJECTS_QUERY_RESULT,
  PROJECT_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  POST_QUERY_RESULT,
  EXPERIENCE_QUERY_RESULT,
  EDUCATION_QUERY_RESULT,
  SKILLS_QUERY_RESULT,
  TESTIMONIALS_QUERY_RESULT,
  USER_NAMES_QUERY_RESULT,
} from '../../../sanity.types'

export async function fetchSiteSettings() {
  const settings = await client.fetch(SITE_SETTINGS_QUERY)
  if (!settings) throw new Error('Site settings not found in Sanity')

  /*  TSC knows `settings` is non-null via control flow narrowing i.e. if you reached the return line, settings can't be null — because the only way to get past the if is if it wasn't. Else, execution would stop at the if statement. */
  return settings
}

export const fetchUsersNames = (): Promise<USER_NAMES_QUERY_RESULT> => {
  return client.fetch(USER_NAMES_QUERY)
}

export async function fetchAbout() {
  const about = await client.fetch(ABOUT_QUERY)
  if (!about) throw new Error('About not found in Sanity')
  return about
}

export async function fetchProjects(): Promise<PROJECTS_QUERY_RESULT> {
  return client.fetch(PROJECTS_QUERY)
}

export async function fetchFeaturedProjects(): Promise<FEATURED_PROJECTS_QUERY_RESULT> {
  return client.fetch(FEATURED_PROJECTS_QUERY)
}

export async function fetchProject(
  slug: string,
): Promise<PROJECT_QUERY_RESULT> {
  const project = await client.fetch(PROJECT_QUERY, { slug })
  return project
}

export async function fetchPosts(): Promise<POSTS_QUERY_RESULT> {
  return client.fetch(POSTS_QUERY)
}

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

export async function fetchPost(slug: string): Promise<POST_QUERY_RESULT> {
  const post = await client.fetch(POST_QUERY, { slug })
  return post
}

export async function fetchExperience(): Promise<EXPERIENCE_QUERY_RESULT> {
  return client.fetch(EXPERIENCE_QUERY)
}

export async function fetchEducation(): Promise<EDUCATION_QUERY_RESULT> {
  return client.fetch(EDUCATION_QUERY)
}

export async function fetchSkills(): Promise<SKILLS_QUERY_RESULT> {
  return client.fetch(SKILLS_QUERY)
}

export async function fetchTestimonials(): Promise<TESTIMONIALS_QUERY_RESULT> {
  return client.fetch(TESTIMONIALS_QUERY)
}
