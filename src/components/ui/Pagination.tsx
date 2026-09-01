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
  const buildHref = (page: number) => {
    return `${basePath}?page=${page}${hash ? `#${hash}` : ''}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className="mt-16 flex items-center justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="text-2xs border-faint text-ink hover:bg-warm rounded border px-4 py-2 tracking-widest uppercase transition-colors"
        >
          ← Prev
        </Link>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          className={`flex h-9 w-9 items-center justify-center rounded text-xs transition-colors ${
            page === currentPage
              ? 'bg-ink text-paper'
              : 'border-faint text-ink hover:bg-warm border'
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="text-2xs border-faint text-ink hover:bg-warm rounded border px-4 py-2 tracking-widest uppercase transition-colors"
        >
          Next →
        </Link>
      )}
    </nav>
  )
}
