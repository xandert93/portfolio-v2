import { Project } from '@/sanity/types'

type Props = {
  summary: Project['content']['summary']
}

export default function ProjectCardSummary({ summary }: Props) {
  return (
    <p className="text-muted max-w-md text-sm leading-relaxed font-light">{summary}</p>
  )
}
