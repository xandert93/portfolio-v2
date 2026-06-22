import { fetchSiteSettings } from '@/sanity/lib/fetch'
import { genFirstNameAndSurnameInitial } from '@/utils/string'

export default async function Footer() {
  const {
    name,
    githubUrl,
    linkedinUrl,
    twitterUrl,
    phone,
    hasWhatsApp,
    email,
  } = await fetchSiteSettings()

  const year = new Date().getFullYear()

  return (
    <footer className="px-6 md:px-12 py-10 border-t border-faint flex flex-col gap-6">
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <span className="font-serif italic text-base text-ink">
          {genFirstNameAndSurnameInitial(name!)}
        </span>
        <div className="flex gap-6">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted hover:text-accent transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.42 7.89 10.96.58.1.79-.25.79-.56 0-.27-.01-1.18-.02-2.13-3.21.7-3.89-1.36-3.89-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.7.08-.7 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.74.4-1.26.72-1.55-2.56-.29-5.26-1.28-5.26-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.21-1.49 3.18-1.18 3.18-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.84 1.19 3.1 0 4.43-2.71 5.41-5.28 5.69.42.36.78 1.07.78 2.17 0 1.57-.01 2.83-.01 3.22 0 .31.21.67.8.56C20.21 21.4 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
              </svg>
            </a>
          )}
          {linkedinUrl && (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-muted hover:text-accent transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z" />
              </svg>
            </a>
          )}
          {phone && hasWhatsApp && (
            <a
              href={`https://wa.me/${phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-muted hover:text-accent transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771 1.034-.943 1.234-.171.2-.346.226-.642.075-1.738-.868-2.876-1.55-4.018-3.516-.301-.518.301-.482.871-1.604.146-.296.073-.563-.075-.762-.151-.2-.6-1.45-.82-1.95-.227-.5-.453-.428-.673-.428-.224 0-.602.075-.92.422-.317.346-1.219 1.198-1.219 2.92 0 1.722 1.247 3.392 1.42 3.629.174.236 2.296 3.522 5.604 4.819 2.737 1.07 3.292.862 3.889.793.601-.07 1.96-.802 2.234-1.602.273-.802.273-1.46.197-1.602-.075-.146-.273-.225-.573-.375zM12.046 21.78h-.005a9.738 9.738 0 01-4.964-1.36l-.357-.213-3.696.97.989-3.605-.233-.37a9.731 9.731 0 01-1.49-5.183c.001-5.382 4.385-9.766 9.769-9.766 2.61.001 5.058 1.018 6.9 2.86a9.7 9.7 0 012.857 6.91c-.003 5.382-4.385 9.764-9.77 9.757zM20.49 3.488A11.815 11.815 0 0012.05 0C5.495 0 .161 5.335.16 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.741 1.466h.005c6.554 0 11.89-5.336 11.892-11.893a11.821 11.821 0 00-3.453-8.432z" />
              </svg>
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="Email"
              className="text-muted hover:text-accent transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  d="M3 6.5l9 6 9-6M3 6.5v11h18v-11M3 6.5h18"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          )}
          {twitterUrl && (
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="text-muted hover:text-accent transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2H21.5l-7.11 8.13L22.75 22h-6.55l-5.13-6.71L5.2 22H1.94l7.61-8.7L1.5 2h6.72l4.64 6.13L18.244 2zm-1.15 18h1.8L7.25 3.9H5.32L17.094 20z" />
              </svg>
            </a>
          )}
        </div>
      </div>
      <p className="text-xs text-muted text-center md:text-left">
        © {year} {name}. All rights reserved.
      </p>
    </footer>
  )
}
