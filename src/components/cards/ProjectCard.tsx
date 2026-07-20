'use client'

import { genImageBuilder } from '@/sanity/lib/image'
import Image from 'next/image'
import { PROJECT_QUERY_RESULT, PROJECTS_QUERY_RESULT } from '../../../sanity.types'
import { useRouter } from 'next/navigation'
import { StopPropagationAnchor } from '../links/StopPropagationAnchor'
import Link from 'next/link'
import { Project } from '@/sanity/types'

type Props = { project: Project }

export default function ProjectCard({ project }: Props) {
  const { _id, slug, title, coverImage, summary, technologies, repoUrl, liveUrl } =
    project

  const router = useRouter()

  const handleClick = () => router.push(`/projects/${slug}`)

  return (
    <div key={_id} onClick={handleClick} className="card group p-6">
      <Link href={`/projects/${slug}`}>
        {coverImage && (
          <div className="border-faint relative mb-5 aspect-video overflow-hidden rounded-sm border">
            <Image
              src={genImageBuilder(coverImage)
                .width(640)
                .height(360)
                .fit('crop')
                .auto('format')
                .url()}
              alt={title ?? ''}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        )}
        <p className="group-hover:text-accent mb-2 font-serif text-xl transition-colors">
          {title}
        </p>
        <p className="text-muted mb-4 text-sm leading-relaxed font-light">{summary}</p>
      </Link>
      {technologies && technologies.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {technologies.map(({ _id, name }) => (
            <span
              key={_id}
              className="bg-faint text-muted rounded-sm px-2.5 py-1 text-[0.6rem] tracking-wide uppercase"
            >
              {name}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-5">
        {repoUrl && <ProjectLink href={repoUrl} children="Repository ↗" />}
        {liveUrl && <ProjectLink href={liveUrl} children="Live site ↗" />}
      </div>
    </div>
  )
}

type ProjectLinkProps = { href: string; children: React.ReactNode }

function ProjectLink(props: ProjectLinkProps) {
  return (
    <StopPropagationAnchor
      target="_blank"
      rel="noopener noreferrer"
      className="text-muted hover:text-ink text-[0.65rem] tracking-widest uppercase transition-colors"
      {...props}
    />
  )
}
