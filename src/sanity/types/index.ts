import type {
  ABOUT_QUERY_RESULT,
  EDUCATIONS_QUERY_RESULT,
  EXPERIENCES_QUERY_RESULT,
  FEATURED_PROJECTS_QUERY_RESULT,
  POSTS_QUERY_RESULT,
  PROJECTS_QUERY_RESULT,
  SITE_SETTINGS_QUERY_RESULT,
  SKILLS_QUERY_RESULT,
  TESTIMONIALS_QUERY_RESULT,
} from '@/sanity/generated-types'

export type Posts = POSTS_QUERY_RESULT
export type Post = Posts[number]

export type Projects = PROJECTS_QUERY_RESULT
export type Project = Projects[number]
export type FeaturedProjects = FEATURED_PROJECTS_QUERY_RESULT

export type Experiences = EXPERIENCES_QUERY_RESULT
export type Experience = Experiences[number]

export type Educations = EDUCATIONS_QUERY_RESULT
export type Education = Educations[number]

export type Testimonials = TESTIMONIALS_QUERY_RESULT
export type Testimonial = Testimonials[number]

export type Skills = SKILLS_QUERY_RESULT
export type Skill = Skills[number]

export type About = ABOUT_QUERY_RESULT
export type SiteSettings = SITE_SETTINGS_QUERY_RESULT
