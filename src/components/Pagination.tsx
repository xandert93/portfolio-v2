import Link from 'next/link'

type PaginationProps = {
  currentPage: number
  totalPages: number
  basePath: string
  hash?: string
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath,
  hash,
}: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    return `${basePath}?page=${page}${hash ? `#${hash}` : ''}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="flex items-center justify-center gap-2 mt-16">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="text-2xs tracking-widest uppercase px-4 py-2 border border-faint rounded text-ink hover:bg-warm transition-colors"
        >
          ← Prev
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`text-xs w-9 h-9 flex items-center justify-center rounded transition-colors ${
            page === currentPage
              ? 'bg-ink text-paper'
              : 'border border-faint text-ink hover:bg-warm'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="text-2xs tracking-widest uppercase px-4 py-2 border border-faint rounded text-ink hover:bg-warm transition-colors"
        >
          Next →
        </Link>
      )}
    </nav>
  )
}
