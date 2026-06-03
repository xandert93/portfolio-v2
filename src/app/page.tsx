import {
  fetchSiteSettings,
  fetchFeaturedProjects,
  fetchAbout,
} from '@/sanity/lib/fetch'

export default async function Home() {
  const [settings, featuredProjects, about] = await Promise.all([
    fetchSiteSettings(),
    fetchFeaturedProjects(),
    fetchAbout(),
  ])

  return (
    <main>
      <h1>{settings.name}</h1>
      <p>{settings.tagline}</p>
      <p>Open to work: {about.isOpenToWork ? 'Yes' : 'No'}</p>

      <section>
        <h2>Featured Projects</h2>
        <ul>
          {featuredProjects.map((project) => (
            <li key={project._id}>
              <h3>
                <a href={`/projects/${project.slug?.isCurrent}`}>
                  {project.title}
                </a>
              </h3>
              <p>{project.summary}</p>
              {project.techStack && project.techStack.length > 0 && (
                <ul>
                  {project.techStack.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>
              )}
              <p>
                {project.repoUrl && <a href={project.repoUrl}>Repository</a>}
                {project.repoUrl && project.liveUrl && ' · '}
                {project.liveUrl && <a href={project.liveUrl}>Live site</a>}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
