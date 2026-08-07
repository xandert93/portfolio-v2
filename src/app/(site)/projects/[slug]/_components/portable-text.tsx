import type { PortableTextComponents } from '@portabletext/react'

/* Two variants: the main description reads as an article; challenges
   read one notch smaller, inside a card, since it's supporting detail. */
export function makePortableTextComponents(
  variant: 'article' | 'compact',
): PortableTextComponents {
  const heading =
    variant === 'article'
      ? 'font-serif text-ink text-2xl md:text-3xl italic mt-12 mb-4 first:mt-0'
      : 'font-serif text-ink text-xl italic mt-8 mb-3 first:mt-0'

  const paragraph =
    variant === 'article'
      ? 'text-[0.9375rem] leading-[1.8] text-ink/80 mb-5 last:mb-0'
      : 'text-sm leading-[1.75] text-ink/75 mb-4 last:mb-0'

  return {
    block: {
      h1: ({ children }) => <h3 className={heading}>{children}</h3>,
      h2: ({ children }) => <h3 className={heading}>{children}</h3>,
      h3: ({ children }) => <h3 className={heading}>{children}</h3>,
      h4: ({ children }) => <h4 className={heading}>{children}</h4>,
      h5: ({ children }) => <h5 className={heading}>{children}</h5>,
      h6: ({ children }) => <h6 className={heading}>{children}</h6>,
      normal: ({ children }) => <p className={paragraph}>{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="border-accent/40 my-8 border-l-2 pl-6">
          <p className="text-ink font-serif text-xl leading-snug italic md:text-2xl">
            {children}
          </p>
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="mb-5 space-y-2.5">{children}</ul>,
      number: ({ children }) => (
        <ol className="marker:text-accent mb-5 list-inside list-decimal space-y-2.5">
          {children}
        </ol>
      ),
    },
    listItem: {
      bullet: ({ children }) => (
        <li className="text-ink/80 flex gap-3 text-[0.9375rem] leading-[1.75]">
          <span className="bg-accent mt-[0.65em] size-1 shrink-0 rounded-full" />
          <span>{children}</span>
        </li>
      ),
      number: ({ children }) => (
        <li className="text-ink/80 pl-1 text-[0.9375rem] leading-[1.75]">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }) => (
        <strong className="text-ink font-medium">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      code: ({ children }) => (
        <code className="bg-warm border-faint text-accent rounded border px-1.5 py-0.5 font-mono text-[0.85em]">
          {children}
        </code>
      ),
      link: ({ children, value }) => (
        <a
          href={value?.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink decoration-accent/50 hover:decoration-accent hover:text-accent underline underline-offset-2 transition-colors"
        >
          {children}
        </a>
      ),
    },
  }
}

export const articleComponents = makePortableTextComponents('article')
export const compactComponents = makePortableTextComponents('compact')
