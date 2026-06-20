import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

// 🔌 Write client (CUD operations)
export const writeClient = createClient({
  apiVersion,
  projectId,
  dataset,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
