import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const slugs = [
  'accordion', 'back-link', 'breadcrumbs', 'button', 'character-count',
  'checkboxes', 'cookie-banner', 'date-input', 'details', 'error-message',
  'error-summary', 'exit-this-page', 'feedback', 'fieldset', 'file-upload',
  'generic-footer', 'generic-header', 'footer', 'header', 'inset-text', 'language-navigation',
  'notification-banner', 'pagination', 'panel', 'password-input', 'phase-banner',
  'radios', 'select', 'service-navigation', 'skip-link', 'summary-list', 'table',
  'tabs', 'tag', 'task-list', 'text-input', 'textarea', 'warning-text',
]
const extraSlugs = ['modal', 'empty', 'loading', 'menu', 'dropdown', 'fancy-table', 'fancy-tabs', 'divider', 'form', 'note', 'sidebar', 'showcase-box', 'tag-box', 'switch', 'tooltip', 'alert', 'steps', 'progress']
const displayNames = {
  footer: 'GOV.UK footer', header: 'GOV.UK header',
  'fancy-tabs': 'FancyTabs', 'fancy-table': 'FancyTable', 'showcase-box': 'ShowcaseBox', 'tag-box': 'TagBox',
}
const displayName = (slug) => displayNames[slug] ?? `${slug[0].toUpperCase()}${slug.slice(1).replaceAll('-', ' ')}`

const outputRoot = join(process.cwd(), 'dist')
const source = await readFile(join(outputRoot, 'index.html'), 'utf8')
let generatedRoutes = 0
const assetsRoot = join(outputRoot, 'assets')
const govukAssetsRoot = join(process.cwd(), '../kvzd-design/node_modules/govuk-frontend/dist/govuk/assets')

// GOV.UK image URLs need to resolve from the built stylesheet on a Pages project path.
await cp(join(govukAssetsRoot, 'images'), join(assetsRoot, 'images'), { recursive: true })
for (const file of await readdir(assetsRoot)) {
  if (!file.endsWith('.css')) continue
  const path = join(assetsRoot, file)
  const css = await readFile(path, 'utf8')
  await writeFile(path, css.replace(/url\((['"]?)\/assets\//g, 'url($1./'))
}

async function createEntry(path, title, language = 'en') {
  const directory = join(outputRoot, ...path.split('/').filter(Boolean))
  await mkdir(directory, { recursive: true })
  const html = source
    .replace(/<html lang="[^"]+">/, `<html lang="${language === 'zh' ? 'zh-CN' : 'en'}">`)
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${language === 'zh' ? '基于 GOV.UK Frontend 6.5.1 的无障碍 React 组件。' : 'Accessible React components based on GOV.UK Frontend 6.5.1.'}"`)
  await writeFile(join(directory, 'index.html'), html)
  generatedRoutes += 1
}

await createEntry('components', 'Components – KevinZonda Design System')
await createEntry('quick-review', 'Quick Review – KevinZonda Design System')
await createEntry('license', 'License – KevinZonda Design System')
await Promise.all(slugs.map((slug) => createEntry(`components/${slug}`, `${displayName(slug)} – KevinZonda Design System`)))

await createEntry('extra-components', 'Extra Components – KevinZonda Design System')
await Promise.all(extraSlugs.map((slug) => createEntry(`extra-components/${slug}`, `${displayName(slug)} – KevinZonda Design System`)))
await createEntry('en', 'Quick Review – KevinZonda Design System')
await createEntry('en/components', 'Components – KevinZonda Design System')
await createEntry('en/quick-review', 'Quick Review – KevinZonda Design System')
await createEntry('en/license', 'License – KevinZonda Design System')
await Promise.all(slugs.map((slug) => createEntry(`en/components/${slug}`, `${displayName(slug)} – KevinZonda Design System`)))
await createEntry('en/extra-components', 'Extra Components – KevinZonda Design System')
await Promise.all(extraSlugs.map((slug) => createEntry(`en/extra-components/${slug}`, `${displayName(slug)} – KevinZonda Design System`)))
await createEntry('zh', '快速总览｜KevinZonda 设计系统', 'zh')
await createEntry('zh/components', '组件｜KevinZonda 设计系统', 'zh')
await createEntry('zh/quick-review', '快速总览｜KevinZonda 设计系统', 'zh')
await createEntry('zh/license', '授权｜KevinZonda 设计系统', 'zh')
await Promise.all(slugs.map((slug) => createEntry(`zh/components/${slug}`, `${displayName(slug)}｜KevinZonda 设计系统`, 'zh')))
await createEntry('zh/extra-components', '扩展组件｜KevinZonda 设计系统', 'zh')
await Promise.all(extraSlugs.map((slug) => createEntry(`zh/extra-components/${slug}`, `${displayName(slug)}｜KevinZonda 设计系统`, 'zh')))
await writeFile(join(outputRoot, '404.html'), source.replace(/<title>.*?<\/title>/, '<title>页面未找到｜KevinZonda 设计系统</title>'))

console.log(`Generated ${generatedRoutes} documentation routes.`)
