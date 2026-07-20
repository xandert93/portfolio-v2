import clsx from 'clsx'
import Link from 'next/link'

type Props = {
  href: string
  label: string
  isActive: boolean
  onClick?: () => void
  variant?: 'desktop' | 'mobile'
}

const NavLink = ({ href, label, isActive, onClick, variant = 'desktop' }: Props) => {
  const isMobile = variant === 'mobile'

  return (
    <Link
      href={href}
      aria-current={isActive ? 'page' : undefined}
      onClick={onClick}
      className={clsx(
        'tracking-[0.16em] uppercase transition-colors',
        isActive ? 'text-ink' : 'text-muted hover:text-ink',
        isMobile
          ? 'border-faint border-b py-4 text-[0.72rem]'
          : 'group relative duration-200',
      )}
    >
      {label}

      {!isMobile && (
        <span
          className={clsx(
            'bg-accent absolute -bottom-1.5 left-0 h-px w-full origin-left transition-transform duration-300',
            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
          )}
        />
      )}
    </Link>
  )
}

export default NavLink
