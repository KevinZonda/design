import { writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const distLib = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist-lib')

// Vite emits the components.js and extraComponents.js entry chunks next to the
// per-source declaration directories. Without sibling entry declarations,
// `export * from './components'` in index.d.ts resolves to the chunk with no
// types and the root entry loses every component export for TS consumers.
await writeFile(join(distLib, 'components.d.ts'), "export * from './components/index'\n")
await writeFile(join(distLib, 'extraComponents.d.ts'), "export * from './extraComponents/index'\n")
console.log('wrote entry declarations for components and extraComponents')
