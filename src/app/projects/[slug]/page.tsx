import { fetchProject } from '@/sanity/lib/fetch'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params
  const project = await fetchProject(slug)

  if (!project) return 'Project doesnt existo'

  return (
    <main>
      <h1>{project.title}</h1>
      <p>Slug: {project.slug?.current}</p>
      <p>{project.summary}</p>
      <pre>{JSON.stringify(project.description, null, 2)}</pre>
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
      <pre>{JSON.stringify(project.coverImage, null, 2)}</pre>
      {project.date && <time dateTime={project.date}>{project.date}</time>}
    </main>
  )
}
