/**
 * This configuration file lets you run `$ sanity [command]` in this folder
 * Go to https://www.sanity.io/docs/cli to learn more.
 **/
import { defineCliConfig } from 'sanity/cli'
import { projectId, dataset } from '@/sanity/env'

export default defineCliConfig({
  api: { projectId, dataset },
  typegen: {
    enabled: true,
    path: './src/**/*.{ts,tsx}',
    schema: './src/sanity/schema.json',
    generates: './src/sanity/generated-types.ts',
  },
  deployment: {
    appId: 'kd4mocbddc5mznlaacgovtpj',
  },
})
