import ProjectCard from '@/components/cards/ProjectCard'
import { StopPropagationAnchor } from '@/components/links/StopPropagationAnchor'
import { fetchFeaturedProjects } from '@/sanity/lib/fetch'
import { genImageBuilder } from '@/sanity/lib/image'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default async function FeaturedProjectsSection() {
  const projects = await fetchFeaturedProjects()

  return (
    <section className="section">
      <div className="container">
        <div className="ruled pl-0 md:pl-8">
          <span className="label">Selected work</span>
          <div className="flex justify-between items-baseline mb-10">
            <h2 className="section-heading">Featured projects</h2>
            <Link
              href="/projects"
              className="link-underline hidden sm:inline-flex"
            >
              All projects →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {projects.map((project) => (
              <ProjectCard key={project._id} {...project} isFeatured />
            ))}
          </div>

          <div className="mt-8 sm:hidden">
            <Link href="/projects" className="link-underline">
              All projects →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
