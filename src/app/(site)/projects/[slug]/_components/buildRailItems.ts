import type { RailItem } from './ProjectContentsRail'
import type { Project } from '@/sanity/types'

type BuildRailItemsInput = {
  problem: Project['content']['problem']
  solution: Project['content']['solution']
  role: Project['content']['role']
  features: Project['content']['features']
  technicalDecisions: Project['content']['technicalDecisions']
  challenges: Project['content']['challenges']
  hasScreenshots: boolean
  hasOutcome: boolean
}

/**
 * The rail only lists blocks a project actually has, in the order they
 * appear — a real reading sequence, not decoration. Section indices are
 * derived from this list elsewhere so the headers and the rail stay in sync.
 */
export function buildRailItems({
  problem,
  solution,
  role,
  features,
  technicalDecisions,
  challenges,
  hasScreenshots,
  hasOutcome,
}: BuildRailItemsInput): RailItem[] {
  return [
    problem && problem.length > 0 && { id: 'problem', label: 'The problem' },
    solution && solution.length > 0 && { id: 'solution', label: 'The solution' },
    role && role.length > 0 && { id: 'role', label: 'My role' },
    features && features.length > 0 && { id: 'features', label: 'Key features' },
    technicalDecisions &&
      technicalDecisions.length > 0 && {
        id: 'technical-decisions',
        label: 'Technical decisions',
      },
    challenges &&
      challenges.length > 0 && { id: 'challenges', label: 'Challenges & Solutions' },
    hasScreenshots && { id: 'screens', label: 'Screens' },
    hasOutcome && { id: 'outcome', label: 'Outcome' },
  ].filter(Boolean) as RailItem[]
}
