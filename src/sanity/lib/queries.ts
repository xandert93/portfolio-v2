import { defineQuery } from 'next-sanity'

/*
📚 GROQ spread (...) loses some guarantees

This:
*[_type == "experience"]{
  ...,
  "skills": coalesce(skills[]->{ _id, name }, [])
}

Means return whatever exists on this document, plus overwrite skills.
GROQ does not have a concept of "this field is guaranteed because validation says so". 
From GROQ's perspective `company.name` could still be missing.

So, avoid spreading! Instead, make the GROQ projection explicit and specify every field to be returned. This gives TypeGen much more information.
*/

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
  *[_type == "about"][0] {
    ...,
    "galleryImages": coalesce(galleryImages, []),
    "cv": *[_type == "siteSettings"][0].cv,
    "interests": coalesce(interests, []),
    "quickFacts": coalesce(quickFacts, [])
  }
`)

// Projects
export const PROJECTS_QUERY = defineQuery(`
  *[_type == "project"] | order(date desc){
    _id,
    title,
    'slug': slug.current,
    category,
    content{
      summary,
      problem,
      description,
      "technologies": coalesce(technologies[]->{ _id, name }, []),
      features,
      challenges
    },
    urls{
      repo,
      live
    },
    media{
      coverImage,
      "screenshots": coalesce(screenshots, []),
    },
    isFeatured,
    date
  }
`)

export const FEATURED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && isFeatured == true] | order(date desc){
    _id,
    title,
    'slug': slug.current,
    category,
    content{
      summary,
      problem,
      description,
      "technologies": coalesce(technologies[]->{ _id, name }, []),
      features,
      challenges
    },
    urls{
      repo,
      live
    },
    media{
      coverImage,
      "screenshots": coalesce(screenshots, []),
    },
    isFeatured,
    date
  }
`)

export const FEATURED_PROJECTS_CARDS_QUERY = defineQuery(`
  *[_type == "post" && isFeatured == true] | order(date desc){
    _id,
    'slug': slug.current,
    title,
    category,
    media{
      coverImage
    },
    content{
      summary,
      "technologies": technologies[]->{ _id, name }
    },
    date
  }
  `)

export const PROJECT_QUERY = defineQuery(`
  *[_type == "project" && slug.current == $slug][0]{
    _id,
    title,
    'slug': slug.current,
    category,
    content{
      summary,
      problem,
      description,
      "technologies": coalesce(technologies[]->{ _id, name }, []),
      features,
      challenges
    },
    urls{
      repo,
      live
    },
    media{
      coverImage,
      "screenshots": coalesce(screenshots, []),
    },
    date
  }
`)

export const PAGINATED_PROJECTS_QUERY = defineQuery(`
  *[_type == "project" && isFeatured != true] | order(date desc) [$start...$end]{
    _id,
    title,
    'slug': slug.current,
    category,
    content{
      summary,
      problem,
      description,
      "technologies": coalesce(technologies[]->{ _id, name }, []),
      features,
      challenges
    },
    urls{
      repo,
      live
    },
    media{
      coverImage,
      "screenshots": coalesce(screenshots, []),
    },
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
    tags[]->{ _id, name }, // 📚 Take the tags array and iterate over it. -> means resolve each reference i.e. join the related document using the reference (_ref) it holds
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
    "tags": coalesce(tags[]->{ _id, name }, []),
    publishedAt,
    updatedAt
  }
`)

// Experiences
export const EXPERIENCES_QUERY = defineQuery(`
    *[_type == "experience"] | order(employment.startDate desc) {
    _id,
    _type,
    _createdAt,
    _updatedAt,
    _rev,

    company {
      name,
      logo,
      website
    },

    employment {
      startDate,
      isCurrent,
      endDate,
      location
    },

    role {
      title,
      summary,
      "highlights": coalesce(highlights, []), // coalesce says, the result is null, return an empty array instead (good for frontend DX)
      impact
    },

    "skills": coalesce(skills[]->{ _id, name }, []), 

    slug
  }
`)

// Educations
export const EDUCATIONS_QUERY = defineQuery(`
  *[_type == "education"] | order(startYear desc){
    ...,
    "highlights": coalesce(highlights, [])
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
  *[_type == "skill"] | order(category asc, name asc)
`)

// Tech Skills
export const TECH_SKILLS_QUERY = defineQuery(`
  *[_type == "skill" && category != "Other"] | order(category asc, name asc)
`)

// Testimonials
export const TESTIMONIALS_QUERY = defineQuery(`
  *[_type == "testimonial"] | order(date desc)
`)
