'use client'

import { Projects } from '@/sanity/types'

import { motion } from 'framer-motion'

import { fadeUp } from '@/lib/motion'
import FeaturedProjectCard from './FeaturedProjectCard'

type Props = {
  projects: Projects
}

export default function FeaturedProjectList({ projects }: Props) {
  return (
    <div className="flex flex-col gap-6 md:gap-8">
      {projects.map((project, i) => {
        const isEven = i % 2 === 1

        return (
          <motion.div
            key={project._id}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.7 }}
          >
            <FeaturedProjectCard project={project} isAlternated={isEven} />
          </motion.div>
        )
      })}
    </div>
  )
}
