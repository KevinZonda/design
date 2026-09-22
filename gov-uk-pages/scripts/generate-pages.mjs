import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const slugs = [
  'accordion', 'back-link', 'breadcrumbs', 'button', 'character-count',
  'checkboxes', 'cookie-banner', 'date-input', 'details', 'error-message',
  'error-summary', 'exit-this-page', 'feedback', 'fieldset', 'file-upload',
  'generic-header', 'footer', 'header', 'inset-text', 'language-navigation',
  'notification-banner', 'pagination', 'panel', 'password-input', 'phase-banner',
  'radios', 'select', 'service-navigation', 'skip-link', 'summary-list', 'table',
  'tabs', 'tag', 'task-list', 'text-input', 'textarea', 'warning-text',
]

const outputRoot = join(process.cwd(), 'dist')
const source = await readFile(join(outputRoot, 'index.html'), 'utf8')
const assetsRoot = join(outputRoot, 'assets')
const govukAssetsRoot = join(process.cwd(), '../gov-uk/node_modules/govuk-frontend/dist/govuk/assets')

// GOV.UK's distributed CSS references /assets, which breaks on a Pages project path.
// The built stylesheet lives in dist/assets, so relative URLs work at either base path.
await Promise.all(['fonts', 'images'].map((directory) =>
  cp(join(govukAssetsRoot, directory), join(assetsRoot, directory), { recursive: true }),
))
for (const file of await readdir(assetsRoot)) {
  if (!file.endsWith('.css')) continue
  const path = join(assetsRoot, file)
  const css = await readFile(path, 'utf8')
  await writeFile(path, css.replace(/url\((['"]?)\/assets\//g, 'url($1./'))
}

async function createEntry(path, title) {
  const directory = join(outputRoot, ...path.split('/').filter(Boolean))
  await mkdir(directory, { recursive: true })
  const html = source.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  await writeFile(join(directory, 'index.html'), html)
}

await createEntry('components', 'Components – KVZD GOV.UK React')
await createEntry('quick-review', 'Quick Review – KVZD GOV.UK React')
await Promise.all(slugs.map((slug) => createEntry(`components/${slug}`, `${slug.replaceAll('-', ' ')} – KVZD GOV.UK React`)))

await createEntry('extra-components', 'Extra Components – KVZD GOV.UK React')
await writeFile(join(outputRoot, '404.html'), source.replace(/<title>.*?<\/title>/, '<title>Page not found – KVZD GOV.UK React</title>'))

console.log(`Generated ${slugs.length + 3} documentation routes.`)
