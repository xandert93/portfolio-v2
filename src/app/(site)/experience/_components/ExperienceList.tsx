import { Experiences } from '@/sanity/types'
import ExperienceCard from './ExperienceCard'

export function ExperienceList({ experiences }: { experiences: Experiences }) {
  return (
    <ol className="relative">
      {experiences.map((experience, i) => {
        const isLast = i === experiences.length - 1

        return (
          <ExperienceCard
            key={experience._id}
            experience={experience}
            index={i}
            isLast={isLast}
          />
        )
      })}
    </ol>
  )
}
