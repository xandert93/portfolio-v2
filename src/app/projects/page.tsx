import { fetchProjects } from '@/sanity/lib/fetch'

export default async function ProjectsPage() {
  const projects = await fetchProjects()

  return (
    <main>
      <h1>Projects</h1>
      <ul>
        {projects.map((project) => (
          <li key={project._id}>
            <h2>
              <a href={`/projects/${project.slug?.current}`}>{project.title}</a>
            </h2>
            <p>{project.summary}</p>
            {project.date && (
              <time dateTime={project.date}>{project.date}</time>
            )}
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
    </main>
  )
}
