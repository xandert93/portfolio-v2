// delete-projects.js
import { createClient } from '@sanity/client'
import { apiVersion, projectId } from '../env'

import { formatLabel } from '../seed/utils'

const dataset = 'production'

if (!process.env.SANITY_WRITE_TOKEN) throw new Error('Missing SANITY_WRITE_TOKEN')

const client = createClient({
  projectId,
  dataset,
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion,
  useCdn: false, // ensure the fetch gets the most current dataset
})

const type = ''
const label = formatLabel(type)

async function main() {
  const docs = await client.fetch<string[]>(
    `*[_type == "${type}" && !(_id in path("drafts.**"))]._id`,
  )

  if (!docs.length) {
    console.log(`🔎 No ${label} found`)
    process.exit(0)
  }

  console.log(`${dataset}: 🔎 Found ${docs.length} ${label}`)

  const batchSize = 100

  for (let i = 0; i < docs.length; i += batchSize) {
    const batch = docs.slice(i, i + batchSize)

    const transaction = client.transaction()

    batch.forEach((id) => {
      transaction.delete(id)
    })

    await transaction.commit()
  }

  console.log(`✅ Deleted ${docs.length} ${label}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

// run from root: npx dotenv -e .env.local -- tsx src/sanity/scripts/delete-documents.ts
