"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";

import { apiVersion, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { codeInput } from "@sanity/code-input";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

export default defineConfig({
  name: mode,
  title: `Portfolio CMS - ${mode}`,
  projectId,
  dataset: mode,
  basePath: "/studio",

  schema,
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }), // // Enables GROQ queries in Studio
    codeInput(), // 📚 Sanity core does not ship a code block type. Studio only understands it if something has registered that type globally. codeInput() is what does that registration. The Studio editor UI then allows syntax-highlighted code editing.
  ],
});
