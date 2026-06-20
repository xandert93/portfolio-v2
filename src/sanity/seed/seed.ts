import { testimonials } from './data/testimonials'
import { posts } from './data/posts'
import { tags } from './data/tags'
import { formatLabel, uploadImage } from './utils'
import { writeClient } from '../lib/writeClient'

import path from 'path'
import fs from 'fs'

// // 🚨 Safety guard: never run against production accidentally
// if (process.env.SANITY_DATASET === 'production') {
//   throw new Error('🚫 Refusing to run seed script on production dataset')
// }

// 🧠 Types to wipe before reseeding
const TYPES_TO_RESET = ['tag', 'post', 'testimonial', 'enquiry'] as const

// /**
//  * 🚀 Main seed runner
//  * - wipes known types
//  * - reseeds in deterministic order
//  */

const seed = async () => {
  try {
    console.log('⌛ Starting seeding...\n')

    // 1. Wipe existing data
    await clearDatabase()

    // 2. Reseed in dependency order
    await seedCollection('tags', tags)
    await seedPosts()
    await seedTestimonials()
    // await seedCollection('posts', posts)
    // await seedCollection('testimonials', testimonials)

    console.log('\n🎉 Seeding complete — all done!')
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seed()

async function clearDatabase() {
  await writeClient.delete({
    query: '*[_type in $types]',
    params: {
      types: TYPES_TO_RESET,
    },
  })

  console.log(`🧹 Cleared: ${TYPES_TO_RESET.map(formatLabel).join(', ')} ✨`)
}

async function seedCollection<T>(label: string, items: T[]): Promise<void> {
  console.log(`🌱 Seeding ${label}...`)

  const savedItems = await Promise.all(
    items.map((item: any) => writeClient.create(item)), // 🚧 #any
  )

  console.log(`✅ Created ${savedItems.length} ${label}`)
}

async function hydrate(
  _type: string,
  filename: string,
  data: any,
  imageKey: string,
) {
  const filePath = path.join(
    process.cwd(),
    `src/sanity/seed/assets/${_type}s`,
    filename,
  )

  const buffer = fs.readFileSync(filePath)

  const asset = await writeClient.assets.upload('image', buffer, { filename })

  return {
    _type,
    ...data,
    [imageKey]: {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    },
  }
}

async function seedPosts() {
  console.log(`🌱 Seeding posts...`)

  const savedPosts = await Promise.all(
    posts.map((p) =>
      hydrate('post', p.coverImageFilename, p, 'coverImage').then(
        (hydratedPost) => writeClient.create(hydratedPost),
      ),
    ),
  )

  console.log(`✅ Created ${savedPosts.length} ${'posts'}`)
}

async function seedTestimonials() {
  console.log(`🌱 Seeding testimonials...`)

  const savedTestimonials = await Promise.all(
    testimonials.map((t) =>
      hydrate('testimonial', t.avatarFilename, t, 'avatar').then(
        (hydratedTestimonial) => writeClient.create(hydratedTestimonial),
      ),
    ),
  )

  console.log(`✅ Created ${savedTestimonials.length} ${'testimonials'}`)
}
