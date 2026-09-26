import { forwardRef, useEffect, useState, type HTMLAttributes, type ReactNode } from 'react'
import type { LanguageRegistration } from 'shiki/core'
import type { SemanticStyling } from '../components/index'

export type CodeBoxLang = 'tsx' | 'typescript' | 'javascript' | 'json' | 'css' | 'html' | 'shellscript'

export interface CodeBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'>, SemanticStyling<'root'> {
  code: string
  lang?: CodeBoxLang
  /** Pre-highlighted HTML (e.g. produced at build time with Shiki). When omitted the component highlights client-side on demand. */
  highlightedHtml?: string
  /** Shiki theme used for client-side highlighting; defaults to 'github-light'. Unknown names fall back to the default. */
  theme?: string
  /** Show a line number gutter. Works with Shiki output where each line is wrapped in a `line` span. */
  showLineNumbers?: boolean
  /** Optional heading rendered above the code block. */
  title?: ReactNode
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const grammarLoaders: Record<CodeBoxLang, () => Promise<{ default: LanguageRegistration[] }>> = {
  tsx: () => import('shiki/langs/tsx.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  css: () => import('shiki/langs/css.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  shellscript: () => import('shiki/langs/shellscript.mjs'),
}

const languageNames: Record<CodeBoxLang, string> = {
  tsx: 'tsx',
  typescript: 'typescript',
  javascript: 'javascript',
  json: 'json',
  css: 'css',
  html: 'html',
  shellscript: 'shellscript',
}

// Lazily loaded Shiki themes available for client-side highlighting.
const themeLoaders: Record<string, () => Promise<{ default: object }>> = {
  'github-light': () => import('shiki/themes/github-light.mjs'),
  'github-dark': () => import('shiki/themes/github-dark.mjs'),
  'github-dark-dimmed': () => import('shiki/themes/github-dark-dimmed.mjs'),
  dracula: () => import('shiki/themes/dracula.mjs'),
  nord: () => import('shiki/themes/nord.mjs'),
}

type Highlighter = Awaited<ReturnType<typeof createHighlighter>>

async function createHighlighter() {
  const [{ createHighlighterCore }, { createOnigurumaEngine }, githubLight] = await Promise.all([
    import('shiki/core'),
    import('shiki/engine/oniguruma'),
    import('shiki/themes/github-light.mjs'),
  ])
  return createHighlighterCore({
    engine: createOnigurumaEngine(import('shiki/wasm')),
    themes: [githubLight.default],
    langs: [],
  })
}

let highlighterPromise: Promise<Highlighter> | null = null
const highlighter = () => { highlighterPromise ??= createHighlighter(); return highlighterPromise }

const loadedLanguages = new Set<string>()
const loadedThemes = new Set<string>(['github-light'])

async function highlight(code: string, lang: CodeBoxLang, theme: string): Promise<string> {
  const instance = await highlighter()
  const name = languageNames[lang]
  const themeName = themeLoaders[theme] ? theme : 'github-light'
  if (!loadedLanguages.has(name)) {
    await instance.loadLanguage(...(await grammarLoaders[lang]()).default)
    loadedLanguages.add(name)
  }
  if (!loadedThemes.has(themeName)) {
    await instance.loadTheme((await themeLoaders[themeName]()).default)
    loadedThemes.add(themeName)
  }
  const html = instance.codeToHtml(code, { lang: name, theme: themeName })
  return html.replace(/^<pre[^>]*><code>/, '').replace(/<\/code><\/pre>[\n]?$/, '')
}

/** Prefix every Shiki `line` span with a line-number gutter cell. */
const addLineNumbers = (html: string): string => {
  let line = 0
  return html.replaceAll('<span class="line">', () => `<span class="line kvzd-design-code-box__line"><span class="kvzd-design-code-box__line-number" aria-hidden="true">${++line}</span>`)
}

export const CodeBox = forwardRef<HTMLDivElement, CodeBoxProps>(function CodeBox({ code, lang = 'tsx', highlightedHtml, theme = 'github-light', showLineNumbers = false, title, className = '', classNames, style, styles, ...props }, ref) {
  const [html, setHtml] = useState<string | null>(highlightedHtml ?? null)
  useEffect(() => {
    if (highlightedHtml !== undefined) { setHtml(highlightedHtml); return }
    let cancelled = false
    highlight(code, lang, theme).then((result) => { if (!cancelled) setHtml(result) }).catch(() => { if (!cancelled) setHtml(escapeHtml(code)) })
    return () => { cancelled = true }
  }, [code, lang, highlightedHtml, theme])
  const content = showLineNumbers && html !== null ? addLineNumbers(html) : (html ?? escapeHtml(code))
  return <div {...props} ref={ref} className={`kvzd-design-code-box ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    {title !== undefined && <div className="kvzd-design-code-box__title">{title}</div>}
    <pre className="kvzd-design-code-box__pre"><code dangerouslySetInnerHTML={{ __html: content }} /></pre>
  </div>
})
