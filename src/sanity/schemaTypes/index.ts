import { type SchemaTypeDefinition } from 'sanity'
import { project } from './documents/project'
import { post } from './documents/post'
import { testimonial } from './documents/testimonial'
import { experience } from './documents/experience'
import { education } from './documents/education'
import { skill } from './documents/skill'
import { tag } from './documents/tag'
import { about } from './documents/about'
import { siteSettings } from './documents/siteSettings'
import { enquiry } from './documents/enquiry'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    project,
    post,
    testimonial,
    experience,
    education,
    skill,
    tag,
    about,
    siteSettings,
    enquiry,
  ],
}
