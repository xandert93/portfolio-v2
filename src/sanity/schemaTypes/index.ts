import { type SchemaTypeDefinition } from 'sanity'
import { project } from './documents/project'
import { post } from './documents/post'
import { testimonial } from './documents/testimonial'
import { experience } from './documents/experience'
import { education } from './documents/education'
import { skill } from './documents/skill'
import { about } from './documents/about'
import { siteSettings } from './documents/siteSettings'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, post, testimonial, experience, education, skill, about, siteSettings],
}
