import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import { testimonials as seedTestimonials } from './data/testimonials'

dotenv.config({ path: '.env.local' })

// A secondary client, for CUD (write ops e.g. seeding mock data)
const client = createClient({
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-06-02',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

// 📚 Achieve idempotent seeding by resetting state + reseeding (simple)
async function seed() {
  // 1. delete all
  const testimonials = await client.fetch(`*[_type == "testimonial"]{_id}`)
  await Promise.all(testimonials.map((t: any) => client.delete(t._id)))

  console.log(`Deleted: ${testimonials.length} Testimonials ✅`)

  // 2. reseed
  const savedTestimonials = await Promise.all(
    seedTestimonials.map((t: any) =>
      client.create({ _type: 'testimonial', ...t }),
    ),
  )

  console.log(`Created: ${savedTestimonials.length} Testimonials ✅`)
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
