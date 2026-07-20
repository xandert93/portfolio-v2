import { formatLabel } from '../seed/utils'
import { writeClient } from './writeClient'

// 🧠 Types to wipe before reseeding
const TYPES_TO_RESET = [
  'project',
  'tag',
  'skill',
  'post',
  'testimonial',
  'enquiry',
  'experience',
  'education',
] as const

export async function clearDatabase() {
  await writeClient.delete({
    query: '*[_type in $types]',
    params: {
      types: TYPES_TO_RESET,
    },
  })

  console.log(`🧹 Cleared: ${TYPES_TO_RESET.map(formatLabel).join(', ')} ✨`)
}
