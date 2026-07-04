import { defineQuery } from 'next-sanity'

// Site Settings
export const SITE_SETTINGS_QUERY = defineQuery(`
  *[_type == "siteSettings"][0]{
    ..., // spreads all existing fields
    names{
      ...,
      "full": first + " " + last
    },
    'ogImage': *[_type == "about"][0].avatar,
    favicon{
      asset->{
        _id,
        url
      }
    },
    cv{
      asset->{
        _id,
        url,
        originalFilename,
        size
      }
    }
  }
`)

export const USER_NAMES_QUERY = defineQuery(`
  *[_type == "siteSettings"][0].names{
      ...,
      "full": first + " " + last
    }
`)

// About
export const ABOUT_QUERY = defineQuery(`
  *[_type == "about"][0]
`)

// Projects
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(date desc){
    _id,
    title,
    'slug': slug.current,
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
    'slug': slug.current,
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
    'slug': slug.current,
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
    'slug': slug.current,
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
    'slug': slug.current,
    excerpt,
    coverImage,
    tags[]->{ _id, name },
    publishedAt,
    updatedAt
  }
`)

export const PAGINATED_POSTS_QUERY = defineQuery(`
  *[_type == "post"] | order(publishedAt desc) [$start...$end]{
    _id,
    title,
    'slug': slug.current,
    excerpt,
    coverImage,
    tags[]->{ _id, name },
    publishedAt,
    updatedAt
  }
`)

export const POSTS_COUNT_QUERY = defineQuery(`
  count(*[_type == "post"])
`)

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    'slug': slug.current,
    excerpt,
    body,
    coverImage,
    tags[]->{ _id, name },
    publishedAt,
    updatedAt
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

// CV
export const CV_QUERY = defineQuery(`
  *[_type == "siteSettings"][0].cv{
    asset->{
      _id,
      url,
      originalFilename,
      size
    }
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
