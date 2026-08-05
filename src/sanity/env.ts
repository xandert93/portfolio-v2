export const apiVersion = '2026-06-02'

export const dataset =
  process.env.SANITY_STUDIO_DATASET! || // injected only when deploying Sanity Studio
  process.env.NEXT_PUBLIC_SANITY_DATASET! // injected by Next.js (works for the embedded /studio route)

export const projectId = 'n791u6ea'
