import type { Project } from '@/sanity/types'

import { FolderGit2 } from 'lucide-react'

import ProjectCardLink from './ProjectCardLink'
import StatusDot from '../ui/StatusDot'

type Props = {
  urls: Project['urls']
}

/** Repository / live-site link row, shown at the base of a project card. */
export default function ProjectCardUrls({ urls }: Props) {
  return (
    <div className="relative z-10 flex flex-wrap gap-5">
      {urls.repo && (
        <ProjectCardLink href={urls.repo}>
          <FolderGit2 className="mb-0.5 size-3" />
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
