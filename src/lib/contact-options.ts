/* ── Options ─────────────────────────────────────────────────
   Values are intentionally kept as slugs so they can be stored
   verbatim on the `enquiry` document in Sanity.
   ─────────────────────────────────────────────────────────── */
// Mirrors the `projectType` option list in enquiry.ts exactly. If you add
// `web-app` / `cms-setup` to the schema (see README), add them here too.
export const PROJECT_TYPES = [
  { value: 'new-website', label: 'New website' },
  { value: 'site-update', label: 'Existing site update' },
  { value: 'freelance', label: 'Freelance enquiry' },
  { value: 'job', label: 'Job opportunity' },
  { value: 'other', label: 'Other' },
] as const

export const BUDGETS = [
  { value: 'under-2k', label: 'Under £2k' },
  { value: '2k-5k', label: '£2k – £5k' },
  { value: '5k-10k', label: '£5k – £10k' },
  { value: '10k-plus', label: '£10k+' },
  { value: 'not-sure', label: 'Not sure yet' },
] as const

export const TIMELINES = [
  { value: 'asap', label: 'As soon as possible' },
  { value: '1-3-months', label: 'In 1 – 3 months' },
  { value: '3-plus-months', label: '3+ months out' },
  { value: 'exploring', label: 'Just exploring' },
] as const

export const REFERRALS = [
  { value: 'search', label: 'Search engine' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'github', label: 'GitHub' },
  { value: 'referral', label: 'A recommendation' },
  { value: 'other', label: 'Somewhere else' },
] as const
