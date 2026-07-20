import * as SEED from './data'

import { writeClient } from '../lib/writeClient'
import { clearDatabase } from '../lib/clearDatabase'

import path from 'path'
import fs from 'fs'
import { formatLabel } from './utils'

// // 🚨 Safety guard: never run against production accidentally
// if (process.env.SANITY_DATASET === 'production') {
//   throw new Error('🚫 Refusing to run seed script on production dataset')
// }

// Declarative config for every collection that needs an image hydrated
// (filename on disk -> uploaded Sanity asset reference) before creation.
const DEHYDRATED_COLLECTIONS = [
  {
    _type: 'project',
    items: SEED.PROJECTS,
    imageKey: 'media.coverImageFilename',
    newImageKey: 'media.coverImage',
  },
  {
    _type: 'post',
    items: SEED.POSTS,
    imageKey: 'coverImageFilename',
    newImageKey: 'coverImage',
  },
  {
    _type: 'testimonial',
    items: SEED.TESTIMONIALS,
    imageKey: 'author.avatarFilename',
    newImageKey: 'author.avatar',
  },
  {
    _type: 'experience',
    items: SEED.EXPERIENCES,
    imageKey: 'company.logoFilename',
    newImageKey: 'company.logo',
  },
  {
    _type: 'education',
    items: SEED.EDUCATIONS,
    imageKey: 'institution.logoFilename',
    newImageKey: 'institution.logo',
  },
] as const

/**
 * 🚀 Main seed runner
 * - wipes known types
 * - reseeds in deterministic order
 */

/* 📚 What if the seed errors out, though?

This seed is not atomic (aka transaction i.e. the entire indivisible unit must not error out for it to be saved and overwrite the current dataset).

Here, database changes are committed incrementally and failure midway can leave a partially seeded dataset.

Wrapping the seed in a transaction is complicated because image asset creation is an external side effect. Database transactions generally only cover the database. If this:

uploads image asset ✅
creates document ✅
uploads another image ❌
creates document ❌

happens inside a DB transaction, the database can roll back, but the uploaded image asset may still exist. That is a classic distributed transaction / side-effect consistency problem.

The most common solutions is to:

- Pre-create assets, then transactionally insert documents
- Upload all assets first.
- If successful, start DB transaction.
- Insert documents referencing assets.
- Clean up orphaned assets if the DB transaction fails.

But, I'm avoiding this since it creates more complexity - a dictionary-like reconciliation step to map each uploaded asset ID back onto the seed documents it belongs to, maybe by attaching a temporary `seedId` onto each seed document. #seeuuuu
*/

const seedDatabase = async () => {
  try {
    console.log('⌛ Starting seeding...\n')

    // 1. Wipe existing data
    await clearDatabase()

    // // 2. Reseed in dependency order
    await seedCollection('tags', SEED.TAGS)
    await seedCollection('skills', SEED.SKILLS)

    for (const collection of DEHYDRATED_COLLECTIONS) {
      await seedDehydratedCollection(collection)
    }

    console.log('\n🎉 Seeding complete — all done!')
  } catch (err) {
    console.error('❌ Seeding failed:', err)
    process.exit(1)
  }
}

seedDatabase()

async function seedCollection<T>(_type: string, items: T[]): Promise<void> {
  const label = formatLabel(_type)

  console.log(`🌱 Seeding ${label}...`)

  const savedItems = await Promise.all(
    items.map((item: any) => writeClient.create(item)), // 🚧 #any
  )

  console.log(`✅ Created ${savedItems.length} ${label}`)
}

async function seedDehydratedCollection({
  _type,
  items,
  imageKey,
  newImageKey,
}: {
  _type: string
  items: readonly any[]
  imageKey: string
  newImageKey: string
}): Promise<void> {
  const label = formatLabel(_type)

  console.log(`🌱 Seeding ${label}...`)

  const savedItems = await Promise.all(
    items.map(async (data) => {
      const hydrated = await hydrate({ _type, imageKey, data, newImageKey })
      const saved = await writeClient.create(hydrated)
      return saved
    }),
  )

  console.log(`✅ Created ${savedItems.length} ${label}`)
}

async function hydrate({
  _type,
  imageKey,
  data,
  newImageKey,
}: {
  _type: string
  imageKey: string
  data: any
  newImageKey: string
}) {
  const filename = getByPath(data, imageKey)

  const filePath = path.join(process.cwd(), `src/sanity/seed/assets/${_type}s`, filename)

  let buffer: Buffer
  try {
    buffer = fs.readFileSync(filePath)
  } catch {
    throw new Error(`❌ Missing seed image for ${_type} at "${imageKey}": ${filePath}`)
  }

  const asset = await writeClient.assets.upload('image', buffer, { filename })

  const dataWithoutImageKey = deleteByPath(data, imageKey)

  const imageFieldValue = {
    _type: 'image',
    asset: {
      _type: 'reference',
      _ref: asset._id,
    },
  }

  return setByPath({ _type, ...dataWithoutImageKey }, newImageKey, imageFieldValue)
}

function getByPath(obj: any, path: string) {
  return path.split('.').reduce((curr, key) => curr?.[key], obj)
}

function setByPath(obj: any, path: string, value: any) {
  const result = structuredClone(obj) // clone so we don't mutate the original
  const keys = path.split('.')
  const last = keys.pop()!

  const target = keys.reduce((acc, key) => {
    acc[key] ??= {}
    return acc[key]
  }, result)

  target[last] = value
  return result
}

function deleteByPath(obj: any, path: string) {
  const result = structuredClone(obj)
  const keys = path.split('.')
  const last = keys.pop()!

  const target = keys.reduce((acc, key) => acc?.[key], result)
  if (target) delete target[last]

  return result
}
