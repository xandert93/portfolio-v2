// Optional: helpers for generating IDs, slugs, etc.
import fs from 'fs'
import path from 'path'

import { SanityAssetDocument } from 'next-sanity'
import { SanityClient } from 'sanity'

import pluralize from 'pluralize'

export const formatLabel = (label: string): string =>
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
