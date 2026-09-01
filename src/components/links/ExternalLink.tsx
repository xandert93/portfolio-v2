import type { AnchorHTMLAttributes } from 'react'

type Props = AnchorHTMLAttributes<HTMLAnchorElement>

export default function ExternalLink({ href, children, ...props }: Props) {
  return (
    <a
      href={href}
      {...props} // this position ensures `target` and `rel` can't be overriden
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  )
}

/* 📚 What's the purpose of this link?
  
  - target="_blank" = "open it in a new tab."
  - rel="noopener noreferrer" = "don't give that new page access to my page + don't tell it where the user came from."
  */
