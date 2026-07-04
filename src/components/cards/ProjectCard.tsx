'use client'

import { genImageBuilder } from '@/sanity/lib/image'
import Image from 'next/image'
import {
  PROJECT_QUERY_RESULT,
  PROJECTS_QUERY_RESULT,
} from '../../../sanity.types'
import { useRouter } from 'next/navigation'
import { StopPropagationAnchor } from '../links/StopPropagationAnchor'
import Link from 'next/link'

type Props = PROJECTS_QUERY_RESULT[0]

export default function ProjectCard({
  _id,
  slug,
  title,
  coverImage,
  summary,
  techStack,
  repoUrl,
  liveUrl,
}: Props) {
  const router = useRouter()

  const handleClick = () => router.push(`/projects/${slug}`)

  return (
    <div
      key={_id}
      onClick={handleClick}
      className="card p-6 group cursor-pointer"
    >
      <Link href={`/projects/${slug}`}>
        {coverImage && (
          <div className="relative aspect-video rounded-sm overflow-hidden mb-5 border border-faint">
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
        <p className="font-serif text-xl mb-2 group-hover:text-accent transition-colors">
          {title}
        </p>
        <p className="text-sm text-muted leading-relaxed mb-4 font-light">
          {summary}
        </p>
      </Link>
      {techStack && techStack.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {techStack.map(({ _id, name }) => (
            <span
              key={_id}
              className="text-[0.6rem] tracking-wide uppercase px-2.5 py-1 bg-faint rounded-sm text-muted"
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
      className="text-[0.65rem] tracking-widest uppercase text-muted hover:text-ink transition-colors"
      {...props}
    />
  )
}
