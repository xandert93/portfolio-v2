import {
  createImageUrlBuilder,
  type SanityImageSource,
} from '@sanity/image-url'

import { dataset, projectId } from '../env'

// https://www.sanity.io/docs/image-url
const builder = createImageUrlBuilder({ projectId, dataset })

export const genImageBuilder = (source: SanityImageSource) => {
  return builder.image(source)
}

export const genFaviconUrl = (source: SanityImageSource, size = 32) => {
  return builder.image(source).width(size).height(size).fit('crop').url()
}

/*
📚 So this:

urlFor(about.avatar)

gives you a chainable builder object, which lets you do:

urlFor(about.avatar)
  .width(300)
  .height(300)
  .fit("crop")
  .auto("format")

Only when you call:

.url()

do you get the final value:

string // actual image URL

*/
