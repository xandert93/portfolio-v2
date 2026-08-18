import Image from 'next/image'

import { genImageBuilder } from '@/sanity/lib/image'
import type { Project } from '@/sanity/types'

type Props = {
  image: Project['media']['coverImage']
  alt: string
  width: number
  height: number
  sizes: string
  className?: string
}

/**
 * Cover image for a project card. Falls back to a placeholder
 * when no image is set in Sanity, so callers don't repeat that check.
 */
export default function ProjectCardThumbnail({
  image,
  alt,
  width,
  height,
  sizes,
  className = 'object-cover',
}: Props) {
  if (!image) {
    return (
      <div className="no-image">
        <span>No image</span>
      </div>
    )
  }

  return (
    <Image
      src={genImageBuilder(image)
        .width(width)
        .height(height)
        .fit('crop')
        .auto('format')
        .url()}
      alt={alt}
      fill
      sizes={sizes}
      className={className}
    />
  )
}
