import { fetchAbout, fetchSkills, fetchTestimonials } from '@/sanity/lib/fetch'

export default async function AboutPage() {
  const [about, skills, testimonials] = await Promise.all([
    fetchAbout(),
    fetchSkills(),
    fetchTestimonials(),
  ])

  const skillsByCategory = skills.reduce<Record<string, typeof skills>>(
    (groups, skill) => {
      const category = skill.category ?? 'Other'
      if (!groups[category]) {
        groups[category] = []
      }
      groups[category].push(skill)
      return groups
    },
    {},
  )

  return (
    <main>
      <h1>About</h1>
      <p>{about.headline}</p>
      <pre>{JSON.stringify(about.bio, null, 2)}</pre>
      <pre>{JSON.stringify(about.avatar, null, 2)}</pre>
      <p>{about.location}</p>
      <p>Open to work: {about.isOpenToWork ? 'Yes' : 'No'}</p>
      {about.resumeUrl && <a href={about.resumeUrl}>Résumé</a>}

      <section>
        <h2>Skills</h2>
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <section key={category}>
            <h3>{category}</h3>
            <ul>
              {categorySkills.map((skill) => (
                <li key={skill._id}>
                  {skill.name}
                  {skill.proficiency && ` (${skill.proficiency})`}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </section>

      <section>
        <h2>Testimonials</h2>
        <ul>
          {testimonials.map((testimonial) => (
            <li key={testimonial._id}>
              <blockquote>{testimonial.quote}</blockquote>
              <p>
                — {testimonial.authorName}
                {testimonial.role && `, ${testimonial.role}`}
                {testimonial.company && ` at ${testimonial.company}`}
              </p>
              <pre>{JSON.stringify(testimonial.avatar, null, 2)}</pre>
              {testimonial.date && (
                <time dateTime={testimonial.date}>{testimonial.date}</time>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
