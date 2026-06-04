import { fetchExperience, fetchEducation } from '@/sanity/lib/fetch'

export default async function ExperiencePage() {
  const [experience, education] = await Promise.all([
    fetchExperience(),
    fetchEducation(),
  ])

  return (
    <main>
      <h1>Experience</h1>

      <section>
        <h2>Work</h2>
        <ul>
          {experience.map((entry) => (
            <li key={entry._id}>
              <h3>
                {entry.role} at {entry.company}
              </h3>
              <p>
                <time dateTime={entry.startDate ?? undefined}>
                  {entry.startDate}
                </time>
                {' – '}
                {entry.isCurrent
                  ? 'Present'
                  : entry.endDate && (
                      <time dateTime={entry.endDate}>{entry.endDate}</time>
                    )}
              </p>
              <pre>{JSON.stringify(entry.description, null, 2)}</pre>
              <pre>{JSON.stringify(entry.logo, null, 2)}</pre>
              {entry.skills && entry.skills.length > 0 && (
                <ul>
                  {entry.skills.map((skill) => (
                    <li key={skill._id}>{skill.name}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Education</h2>
        <ul>
          {education.map((entry) => (
            <li key={entry._id}>
              <h3>{entry.institution}</h3>
              {entry.degree && <p>{entry.degree}</p>}
              <p>
                {entry.startYear}
                {entry.endYear != null && ` – ${entry.endYear}`}
              </p>
              <p>{entry.description}</p>
              <pre>{JSON.stringify(entry.logo, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
