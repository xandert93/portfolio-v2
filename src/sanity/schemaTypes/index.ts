import { type SchemaTypeDefinition } from 'sanity'
import { project } from './documents/project.schema'
import { post } from './documents/post.schema'
import { testimonial } from './documents/testimonial.schema'
import { experience } from './documents/experience.schema'
import { education } from './documents/education.schema'
import { skill } from './documents/skill.schema'
import { tag } from './documents/tag.schema'
import { about } from './documents/about.schema'
import { siteSettings } from './documents/siteSettings.schema'
import { enquiry } from './documents/enquiry.schema'
import { faq } from './documents/faq.schema'

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
    faq,
  ],
}
