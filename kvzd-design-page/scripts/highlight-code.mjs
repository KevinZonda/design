import { build } from 'esbuild'
import { mkdir, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { createHighlighter } from 'shiki'

const root = process.cwd()
const tmp = join(root, 'node_modules', '.cache', 'highlight-entry.mjs')

// Bundle the two registries (and nothing else) so we can read every static
// code sample in plain Node, without booting the app or a dev server.
await build({
  stdin: {
    contents: `
      import { componentDocs } from './src/pages/componentRegistry'
      import { extraComponentDocs } from './src/pages/extraComponentRegistry'
      export const codes = Object.fromEntries([...componentDocs, ...extraComponentDocs].map((c) => [c.slug, c.code]))
    `,
    resolveDir: root,
    loader: 'ts',
  },
  bundle: true,
  platform: 'node',
  format: 'esm',
  banner: { js: "import React from 'react'" },
  logLevel: 'silent',
  outfile: tmp,
})

const { codes } = await import(tmp)
const highlighter = await createHighlighter({ themes: ['github-light'], langs: ['tsx'] })

const highlighted = {}
for (const [slug, code] of Object.entries(codes)) {
  const html = highlighter.codeToHtml(code, { lang: 'tsx', theme: 'github-light' })
  highlighted[slug] = html.replace(/^<pre[^>]*><code>/, '').replace(/<\/code><\/pre>[\n]?$/, '')
}

await mkdir(join(root, 'src', 'generated'), { recursive: true })
await writeFile(join(root, 'src', 'generated', 'highlightedCode.json'), `${JSON.stringify(highlighted)}\n`)
await rm(tmp, { force: true })
console.log(`highlighted ${Object.keys(highlighted).length} code samples`)
