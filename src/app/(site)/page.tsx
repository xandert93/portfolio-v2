import Link from 'next/link'
import Image from 'next/image'

import {
  fetchSiteSettings,
  fetchFeaturedProjects,
  fetchAbout,
  fetchSkills,
  fetchTestimonials,
} from '@/sanity/lib/fetch'
import { urlFor } from '@/sanity/lib/image'
import { PortableText } from 'next-sanity'

// Toggle between 'photo' and 'code' to compare hero variants
const HERO_VARIANT: 'photo' | 'code' = 'code'

const techIcons: Record<string, { path: string; color: string }> = {
  React: {
    path: 'M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 100-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 001.363 3.578l.101.213-.101.213a23.307 23.307 0 00-1.363 3.578zm.247-8.198C3.51 8.853 1.235 10.156 1.235 12c0 1.844 2.276 3.147 5.02 3.943-.572-1.224-1.057-2.521-1.451-3.943.394-1.422.879-2.719 1.451-3.943zm5.745-8.198l.472.119c3.518.889 5.536 2.398 5.536 4.139s-2.018 3.25-5.536 4.139l-.472.12-.133-.469a23.31 23.31 0 00-1.363-3.578l-.101-.213.101-.213c.534-1.115.992-2.295 1.363-3.578zm-.247 8.198c1.522 1.224 2.276 2.521 1.451 3.943.572-1.224 1.057-2.521 1.451-3.943-.394-1.422-.879-2.719-1.451-3.943-1.522 1.224-2.276 2.521-1.451 3.943z',
    color: '#61DAFB',
  },
  'Next.js': {
    path: 'M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.25 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.179 2.977-.578 4.323-1.265.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.011 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.038-.14.045-.495.045h-.34l-.108-.068a.438.438 0 01-.157-.171l-.05-.107.005-4.704.007-4.706.073-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.328 10760.328 0 004.735 7.17l1.9 2.879.096-.063a12.318 12.318 0 002.073-1.94 11.876 11.876 0 002.553-5.385c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.86-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.573 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.246.288c.018.06.023 1.365.018 4.304l-.006 4.218-.766-1.176-.767-1.176v-3.044c0-1.966.008-3.06.02-3.107a.498.498 0 01.253-.298c.069-.032.12-.04.456-.05z',
    color: '#FFFFFF',
  },
  TypeScript: {
    path: 'M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm17.09 4.594H5.41l.213 2.531h12.487l-.232 2.83h-8.165l.227 2.412h7.715l-.683 5.92-3.84 1.05-3.86-1.06-.245-2.547H6.485l.464 4.5L12 21.516l6.116-1.62L19.412 4.594H18.59z',
    color: '#3178C6',
  },
  'Tailwind CSS': {
    path: 'M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.665,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.975,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.975,12,6.001,12z',
    color: '#06B6D4',
  },
  Sanity: {
    path: 'M3.34 17.087a3.66 3.66 0 01-.36-1.587c0-2.027 1.493-3.466 3.667-3.466 1.733 0 3 .787 3.493 2.067l-1.92.747c-.293-.587-.84-.92-1.573-.92-.787 0-1.32.4-1.32 1.013 0 .507.36.787 1.213 1.013l1.36.36c1.787.467 2.787 1.387 2.787 2.92 0 2.16-1.733 3.493-4.067 3.493-2.16 0-3.733-1.04-4.293-2.733l2-.733c.32.84 1.067 1.293 2.187 1.293.96 0 1.587-.4 1.587-1.04 0-.52-.36-.84-1.293-1.067l-1.387-.36c-1.493-.387-2.453-1.213-2.6-2.467zm9.213-9.32c0-2.4 1.84-4.054 4.387-4.054 2.467 0 4.213 1.467 4.36 3.787l-2.187.347c-.107-1.227-.92-1.973-2.147-1.973-1.187 0-2.027.747-2.027 1.84 0 1.067.787 1.547 2.04 1.92l1.013.293c2.04.587 3.387 1.733 3.387 3.787 0 2.4-1.84 3.96-4.493 3.96-2.667 0-4.52-1.547-4.733-4.054l2.227-.347c.16 1.36 1.067 2.187 2.467 2.187 1.32 0 2.187-.667 2.187-1.68 0-.96-.693-1.467-1.973-1.84l-1.04-.293c-1.973-.56-3.467-1.6-3.467-3.68z',
    color: '#F03E2F',
  },
  PostgreSQL: {
    path: 'M23.111 8.226c-.119-.36-.42-.61-.834-.667-.198-.028-.426-.024-.69.012-.466.064-1.045.063-1.748-.004.394-.65.717-1.32.964-1.991.39-1.045.62-2.044.654-2.871.034-.83-.124-1.55-.586-2.005C20.317.198 19.586.026 18.748.116c-.83.088-1.713.413-2.486.916-.586-.21-1.207-.36-1.851-.444C13.376.339 12.295.36 11.296.55c-.957-.5-1.857-.776-2.595-.776-.55 0-1.03.137-1.397.452-.485.413-.732 1.077-.69 1.871.026.49.165 1.063.402 1.673-.668.355-1.207.834-1.6 1.41-.392.575-.6 1.214-.6 1.847 0 .283.04.563.118.834-.69.222-1.255.563-1.66 1.005-.49.534-.752 1.214-.752 1.96 0 .613.183 1.275.522 1.91-.5.36-.86.84-1.04 1.41-.18.575-.16 1.214.07 1.847-.49.34-.838.78-1.005 1.275-.165.49-.16 1.005.03 1.5-.4.34-.667.752-.78 1.214-.114.46-.07.943.13 1.397-.327.34-.534.752-.6 1.197-.066.444.02.91.246 1.34-.246.296-.394.64-.42 1.005-.026.36.07.732.276 1.05.21.32.534.583.91.752.376.17.81.21 1.226.114.42-.096.81-.32 1.1-.63.29-.31.45-.71.45-1.13 0-.12-.014-.24-.04-.357.42-.06.81-.244 1.1-.524.29-.28.45-.652.45-1.045 0-.196-.04-.39-.117-.572.39-.143.71-.4.91-.736.196-.336.276-.732.226-1.13.31-.18.55-.45.69-.78.14-.327.166-.69.07-1.04.276-.218.476-.504.572-.83.096-.327.083-.677-.037-.99.243-.265.404-.6.452-.96.05-.36-.02-.73-.198-1.04.16-.31.22-.66.17-1.01-.05-.35-.21-.677-.46-.93.08-.36.06-.73-.06-1.07-.12-.34-.34-.63-.62-.84.04-.39-.04-.78-.226-1.12-.187-.34-.467-.62-.81-.79.14-1.107.05-2.07-.292-2.737z',
    color: '#4169E1',
  },
}

export default async function Home() {
  const [settings, featuredProjects, about, skills, testimonials] =
    await Promise.all([
      fetchSiteSettings(),
      fetchFeaturedProjects(),
      fetchAbout(),
      fetchSkills(),
      fetchTestimonials(),
    ])

  const mainTestimonial = testimonials[0]
  const sideTestimonials = testimonials.slice(1, 3)

  return (
    <main className="bg-paper text-ink font-sans min-h-screen overflow-hidden">
      {/* Hero */}
      <div className="relative min-h-[calc(100vh-89px)] flex items-center">
        <div className="absolute -top-32 -right-32 w-[700px] h-[700px] rounded-full bg-accent/[0.18] blur-[80px] pointer-events-none" />
        <div className="absolute top-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/[0.08] blur-[100px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-16 px-8 md:px-20 py-16 items-center w-full">
          <div>
            {about.isOpenToWork && (
              <div className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-accent border border-accent/40 bg-accent-light px-4 py-1.5 rounded-full mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Open to work
              </div>
            )}
            <h1 className="font-serif text-5xl md:text-6xl leading-[1.04] mb-6">
              Code with{' '}
              <em className="italic text-accent font-medium">craft</em>.<br />
              Built to <em className="italic text-accent font-medium">last</em>.
            </h1>
            <p className="text-base text-muted leading-relaxed max-w-md mb-10 font-light">
              {settings.tagline}
            </p>
            <div className="flex gap-3">
              <Link
                href="/projects"
                className="text-sm px-8 py-3.5 bg-accent text-paper rounded hover:opacity-90 transition-opacity"
              >
                View my work
              </Link>
              <Link
                href="/contact"
                className="text-sm px-8 py-3.5 border border-faint text-ink rounded hover:bg-warm transition-colors"
              >
                Get in touch
              </Link>
            </div>
          </div>

          {HERO_VARIANT === 'photo' ? (
            <div className="relative aspect-[4/5] max-h-[520px] rounded-2xl overflow-hidden border border-faint">
              {about.avatar ? (
                <Image
                  src={urlFor(about.avatar)
                    .width(1000)
                    .height(1250)
                    .fit('crop')
                    .auto('format')
                    .quality(95)
                    .url()}
                  alt={settings.name ?? 'Profile photo'}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="absolute inset-0 bg-warm flex items-center justify-center text-muted text-sm">
                  No photo set
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[4/5] max-h-[520px] rounded-2xl overflow-hidden border border-faint bg-[#15141a] font-mono text-[13px]">
              <div className="flex gap-1.5 px-4 py-3.5 border-b border-faint">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
              </div>
              <div className="p-5 leading-[1.9] text-[#cdcac1]">
                <div>
                  <span className="text-accent">export</span>{' '}
                  <span className="text-accent">async</span>{' '}
                  <span className="text-accent">function</span>{' '}
                  <span className="text-blue-300">build</span>() {'{'}
                </div>
                <div>
                  &nbsp;&nbsp;<span className="text-accent">const</span> idea ={' '}
                  <span className="text-green-300">
                    &apos;something useful&apos;
                  </span>
                </div>
                <div>
                  &nbsp;&nbsp;
                  <span className="text-muted">// design, build, ship</span>
                </div>
                <div>
                  &nbsp;&nbsp;<span className="text-accent">return</span>{' '}
                  <span className="text-blue-300">deploy</span>(idea)
                </div>
                <div>
                  &nbsp;&nbsp;&nbsp;&nbsp;.
                  <span className="text-blue-300">then</span>(impact =&gt;
                  impact + <span className="text-green-300">1</span>)
                </div>
                <div>{'}'}</div>
                <div className="mt-3 text-muted">
                  // currently:{' '}
                  {about.isOpenToWork ? 'open to work' : 'heads down building'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Featured Projects */}

      <section className="relative px-8 md:px-20 py-24 border-t border-faint">
        <p className="text-2xs tracking-widest uppercase text-accent mb-2">
          Selected work
        </p>
        <div className="flex justify-between items-baseline mb-12">
          <h2 className="font-serif italic text-3xl md:text-4xl">
            Featured projects
          </h2>
          <Link
            href="/projects"
            className="text-2xs tracking-widest uppercase text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
          >
            All projects →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
          {featuredProjects.map((project) => (
            <Link
              key={project._id}
              href={`/projects/${project.slug?.current}`}
              className="relative bg-warm border border-faint rounded-2xl p-7 hover:border-accent/30 transition-colors group cursor-pointer block"
            >
              {project.coverImage && (
                <div className="relative aspect-video rounded-lg overflow-hidden mb-6 border border-faint">
                  <Image
                    src={urlFor(project.coverImage)
                      .width(640)
                      .height(360)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={project.title ?? ''}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="font-serif text-2xl mb-3 group-hover:text-accent transition-colors">
                {project.title}
              </p>
              <p className="text-sm text-muted leading-relaxed mb-5 font-light">
                {project.summary}
              </p>
              {project.techStack && project.techStack.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech._id}
                      className="text-2xs px-2.5 py-1 bg-faint rounded-full text-muted"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              )}
              <div className="relative z-10 flex gap-6">
                {project.repoUrl && (
                  <a
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    // onClick={(e) => e.stopPropagation()}
                    className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
                  >
                    Repository ↗
                  </a>
                )}
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    // onClick={(e) => e.stopPropagation()}
                    className="text-2xs tracking-widest uppercase text-muted hover:text-ink transition-colors"
                  >
                    Live site ↗
                  </a>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Skills */}
      {skills.length > 0 && (
        <section className="relative px-8 md:px-20 py-24 border-t border-faint">
          <p className="text-2xs tracking-widest uppercase text-accent mb-2">
            Toolkit
          </p>
          <h2 className="font-serif italic text-3xl md:text-4xl mb-12">
            What I work with
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            {skills.map((skill) => {
              const icon = skill.name ? techIcons[skill.name] : undefined
              return (
                <div
                  key={skill._id}
                  className="flex items-center gap-3 px-6 py-5 bg-warm border border-faint rounded-xl hover:border-accent/30 transition-colors"
                >
                  {icon ? (
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill={icon.color}
                      className="flex-shrink-0"
                    >
                      <path d={icon.path} />
                    </svg>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-faint flex-shrink-0" />
                  )}
                  <span className="text-sm font-medium">{skill.name}</span>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {mainTestimonial && (
        <section className="relative px-6 md:px-12 py-20 border-t border-faint">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] rounded-full bg-accent/[0.08] blur-[80px] pointer-events-none" />
          <p className="text-2xs tracking-widest uppercase text-accent mb-2 relative z-10">
            What people say
          </p>
          <h2 className="font-serif italic text-3xl md:text-4xl mb-10 relative z-10">
            Kind words
          </h2>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.3fr_1fr] gap-5">
            <div className="relative overflow-hidden bg-warm border border-accent/20 rounded-2xl p-10 flex flex-col">
              <p className="absolute -top-4 right-4 font-serif italic text-[9rem] text-accent/[0.08] leading-none select-none">
                &rdquo;
              </p>
              <p className="relative z-10 font-serif text-2xl font-light leading-snug mb-8">
                {mainTestimonial.quote}
              </p>
              <div className="relative z-10 flex items-center gap-4 mt-auto">
                {mainTestimonial.avatar ? (
                  <Image
                    src={urlFor(mainTestimonial.avatar)
                      .width(116)
                      .height(116)
                      .fit('crop')
                      .auto('format')
                      .url()}
                    alt={mainTestimonial.authorName ?? ''}
                    width={58}
                    height={58}
                    className="rounded-full border border-accent/40"
                  />
                ) : (
                  <div className="w-[58px] h-[58px] rounded-full bg-faint border border-accent/40 flex items-center justify-center font-serif text-accent">
                    {mainTestimonial.authorName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold">
                    {mainTestimonial.authorName}
                  </p>
                  <p className="text-sm text-muted mt-0.5">
                    {mainTestimonial.role}
                    {mainTestimonial.company
                      ? `, ${mainTestimonial.company}`
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {sideTestimonials.map((t) => (
                <div
                  key={t._id}
                  className="bg-warm border border-faint rounded-2xl p-6 flex gap-3.5 items-start flex-1"
                >
                  {t.avatar ? (
                    <Image
                      src={urlFor(t.avatar)
                        .width(76)
                        .height(76)
                        .fit('crop')
                        .auto('format')
                        .url()}
                      alt={t.authorName ?? ''}
                      width={38}
                      height={38}
                      className="rounded-full border border-faint flex-shrink-0"
                    />
                  ) : (
                    <div className="w-[38px] h-[38px] rounded-full bg-faint border border-faint flex items-center justify-center font-serif text-xs text-muted flex-shrink-0">
                      {t.authorName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted leading-relaxed font-light mb-2">
                      {t.quote}
                    </p>
                    <p className="text-sm font-semibold">{t.authorName}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {t.role}
                      {t.company ? `, ${t.company}` : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About teaser */}
      <section className="px-8 md:px-20 py-24 border-t border-faint">
        <p className="text-2xs tracking-widest uppercase text-accent mb-2">
          About me
        </p>
        <h2 className="font-serif italic text-3xl md:text-4xl mb-12">
          {about.headline}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-12 items-start">
          {about.avatar ? (
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-faint">
              <Image
                src={urlFor(about.avatar)
                  .width(600)
                  .height(600)
                  .fit('crop')
                  .auto('format')
                  .quality(95)
                  .url()}
                alt={settings.name ?? ''}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="aspect-square rounded-2xl bg-warm border border-faint flex items-center justify-center text-muted text-sm">
              No photo set
            </div>
          )}
          <div>
            <div className="text-base text-muted leading-loose font-light mb-6 [&_strong]:text-accent [&_strong]:font-medium">
              <PortableText value={about.bio} />
            </div>
            <div className="flex gap-2 flex-wrap mb-6">
              {['Sport', 'Music', 'Cooking', 'Travel'].map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3.5 py-1.5 bg-accent-light border border-accent/25 rounded-full text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-2xs tracking-widest uppercase text-ink border-b border-ink pb-0.5 hover:text-accent hover:border-accent transition-colors"
            >
              More about me →
            </Link>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative px-6 md:px-12 py-24 border-t border-faint text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-accent/[0.1] blur-[80px] pointer-events-none" />
        <h2 className="relative z-10 font-serif text-4xl md:text-5xl mb-4">
          Got a project in{' '}
          <em className="italic text-accent font-medium">mind</em>?
        </h2>
        <p className="relative z-10 text-base text-muted mb-8 font-light">
          I&apos;m currently{' '}
          {about.isOpenToWork
            ? 'open to freelance work and new opportunities'
            : 'taking on select projects'}
          .
        </p>
        <Link
          href="/contact"
          className="relative z-10 inline-block text-sm px-10 py-4 bg-accent text-paper rounded hover:opacity-90 transition-opacity"
        >
          Let&apos;s talk →
        </Link>
      </section>
    </main>
  )
}
