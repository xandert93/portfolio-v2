import type { Project } from '@/sanity/types'

type Props = {
  category: Project['category']
  date: Project['date']
}

/** Category + year label shared by every project card variant. */
export default function ProjectCardMeta({ category, date }: Props) {
  return (
    <div className="text-muted text-2xs tracking-[0.16em] uppercase">
      <span className="text-accent-strong">{category}</span>
      {date && <> · {date.slice(0, 4)}</>}
    </div>
  )
}
