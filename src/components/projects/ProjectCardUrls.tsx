import type { Project } from '@/sanity/types'

import { Code2Icon } from 'lucide-react'

import ProjectCardLink from './ProjectCardLink'
import StatusDot from '../ui/StatusDot'

type Props = {
  urls: Project['urls']
}

/** Repository / live-site link row, shown at the base of a project card. */
export default function ProjectCardUrls({ urls }: Props) {
  if (!urls.repo && !urls.live) return null

  return (
    <div className="relative z-10 flex flex-wrap gap-5">
      {urls.repo && (
        <ProjectCardLink href={urls.repo}>
          <Code2Icon className="size-3" />
          <span>Repository ↗</span>
        </ProjectCardLink>
      )}

      {urls.live && (
        <ProjectCardLink href={urls.live}>
          <StatusDot />
          <span>Live Site ↗</span>
        </ProjectCardLink>
      )}
    </div>
  )
}
