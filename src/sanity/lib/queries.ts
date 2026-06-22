import { defineQuery } from 'next-sanity'

// Site Settings
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]
`)

export const USER_NAMES_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
  firstName,
  surname
  }
`)

// About
export const ABOUT_QUERY = defineQuery(`
  *[_type == "about"][0]{
    headline,
    bio,
    avatar,
    location,
    isOpenToWork,
    resumeUrl
  }
`)

// Projects
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(date desc){
    _id,
    title,
    slug,
    summary,
    techStack[]->{ _id, name },
    repoUrl,
    liveUrl,
    coverImage,
    isFeatured,
    date
  }
`)

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && isFeatured == true] | order(date desc){
    _id,
    title,
    slug,
    summary,
    techStack[]->{ _id, name },
    repoUrl,
    liveUrl,
    coverImage,
    date
  }
`)

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    summary,
    description,
    techStack[]->{ _id, name },
    repoUrl,
    liveUrl,
    coverImage,
    date
  }
`)

export const PAGINATED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && isFeatured != true] | order(date desc) [$start...$end]{
    _id,
    title,
    slug,
    summary,
    techStack[]->{ _id, name },
    repoUrl,
    liveUrl,
    coverImage,
    isFeatured,
    date
  }
`)

export const PROJECTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "project" && isFeatured != true])
`)

// Blog Posts
export const POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc){
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    tags[]->{ _id, name }
  }
`)

export const PAGINATED_POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    slug,
    excerpt,
    coverImage,
    publishedAt,
    tags[]->{ _id, name }
  }
`)

export const POSTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "post"])
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    excerpt,
    body,
    coverImage,
    publishedAt,
    tags[]->{ _id, name }
  }
`)

// Experience
export const EXPERIENCE_QUERY = defineQuery(`
  *[_type == "experience"] | order(startDate desc){
    _id,
    company,
    role,
    startDate,
    endDate,
    isCurrent,
    description,
    logo,
    skills[]->{ _id, name }
  }
`)

// Education
export const EDUCATION_QUERY = defineQuery(`
  *[_type == "education"] | order(startYear desc){
    _id,
    institution,
    degree,
    startYear,
    endYear,
    description,
    logo
  }
`)

// Skills
export const SKILLS_QUERY = defineQuery(`
  *[_type == "skill"] | order(category asc, name asc){
    _id,
    name,
    category,
    proficiency
  }
`)

// Testimonials
export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(date desc){
    _id,
    authorName,
    role,
    company,
    quote,
    avatar,
    date,
    isFeatured
  }
`)
