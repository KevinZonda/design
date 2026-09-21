import { mkdir, readFile, writeFile } from 'node:fs/promises'
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

async function createEntry(path, title) {
  const directory = join(outputRoot, ...path.split('/').filter(Boolean))
  await mkdir(directory, { recursive: true })
  const html = source.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  await writeFile(join(directory, 'index.html'), html)
}

await createEntry('components', 'Components – KVZD GOV.UK React')
await createEntry('quick-review', 'Quick Review – KVZD GOV.UK React')
await Promise.all(slugs.map((slug) => createEntry(`components/${slug}`, `${slug.replaceAll('-', ' ')} – KVZD GOV.UK React`)))

console.log(`Generated ${slugs.length + 2} documentation routes.`)
