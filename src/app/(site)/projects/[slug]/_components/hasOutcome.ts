import { Project } from '@/sanity/types'

type Outcome = NonNullable<Project['content']['outcome']>

/**
 * Narrows an (optional) outcome down to one that's actually worth rendering.
 * A project without a summary has nothing to show, regardless of whether
 * metrics or learnings happen to be populated.
 */
export function hasOutcome(outcome: Project['content']['outcome']): outcome is Outcome {
  return Boolean(outcome?.summary && outcome.summary.length > 0)
}
