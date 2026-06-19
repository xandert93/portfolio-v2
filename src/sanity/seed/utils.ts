// Optional: helpers for generating IDs, slugs, etc.
import fs from 'fs'
import path from 'path'

import { SanityAssetDocument } from 'next-sanity'
import { SanityClient } from 'sanity'

import pluralize from 'pluralize'
import { nanoid } from 'nanoid'

export const formatLabel = (label: string) =>
  pluralize(label[0].toUpperCase() + label.slice(1))

export const uploadImage = async (
  client: SanityClient,
  filePath: string,
): Promise<SanityAssetDocument> => {
  // 📚 Read image file from disk synchronously and returns its raw contents as a Buffer (binary data).
  const buffer = fs.readFileSync(filePath)

  const asset = await client.assets.upload('image', buffer, {
    // 📚 Extract the final part of a file path — i.e. the actual file name e.g. 'priya-shah.jpg'
    filename: path.basename(filePath),
  })

  return asset // => { _id: "image-abc123...", url: "..." }
}

/*
📚 pluralize is a small JavaScript utility that converts words between singular and plural forms correctly. It's used for production and shared code since English pluralization is not a simple “add s” rule, and edge cases are common in UI labels, logs, CMS systems, etc.

Instead of just doing:
"cat" + "s" // cats

It handles real English rules:
pluralize("cat")        // => "cats"
pluralize("box")        // => "boxes"
pluralize("baby")       // => "babies"
pluralize("person")     // => "people"
pluralize("analysis")   // => "analyses"
pluralize("sheep")      // => "sheep"

It can also go the other way:
pluralize.singular("cars") // "car"

And count-aware:
pluralize("apple", 1) // "apple"
pluralize("apple", 3) // "apples"

To get started, install package and its types:
npm i pluralize
npm i -D @types/pluralize

Import into script:
import pluralize from 'pluralize'
*/

export const genTag = (id: string) => ({
  _key: id,
  _type: 'reference',
  _ref: id,
})

const genSpan = (text: string) => ({
  _key: nanoid(),
  _type: 'span',
  text,
})

const genBlock = ({ style = 'normal', text, children, listItem } = {}) => ({
  _key: nanoid(),
  _type: 'block',
  style,
  ...(listItem ? { listItem } : {}),
  children: children ?? [genSpan(text)],
})

const genCode = (code, language = 'bash') => ({
  _key: nanoid(),
  _type: 'code',
  code,
  language,
})

export const pt = {
  h2: (text: string) => {
    return genBlock({
      style: 'h2',
      children: [genSpan(text)],
    })
  },
  p: (text: string) => genBlock({ text }),
  bullet: (text: string) => {
    return genBlock({
      listItem: 'bullet',
      text,
    })
  },
  code: genCode,
}
