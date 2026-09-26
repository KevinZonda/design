import { forwardRef, useEffect, useState, type HTMLAttributes } from 'react'
import type { LanguageRegistration } from 'shiki/core'
import type { SemanticStyling } from '../components/index'

export type CodeBoxLang = 'tsx' | 'typescript' | 'javascript' | 'json' | 'css' | 'html' | 'shellscript'

export interface CodeBoxProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, SemanticStyling<'root'> {
  code: string
  lang?: CodeBoxLang
  /** Pre-highlighted HTML (e.g. produced at build time with Shiki). When omitted the component highlights client-side on demand. */
  highlightedHtml?: string
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

async function highlight(code: string, lang: CodeBoxLang): Promise<string> {
  const instance = await highlighter()
  const name = languageNames[lang]
  if (!loadedLanguages.has(name)) {
    await instance.loadLanguage(...(await grammarLoaders[lang]()).default)
    loadedLanguages.add(name)
  }
  const html = instance.codeToHtml(code, { lang: name, theme: 'github-light' })
  return html.replace(/^<pre[^>]*><code>/, '').replace(/<\/code><\/pre>[\n]?$/, '')
}

export const CodeBox = forwardRef<HTMLDivElement, CodeBoxProps>(function CodeBox({ code, lang = 'tsx', highlightedHtml, className = '', classNames, style, styles, ...props }, ref) {
  const [html, setHtml] = useState<string | null>(highlightedHtml ?? null)
  useEffect(() => {
    if (highlightedHtml !== undefined) { setHtml(highlightedHtml); return }
    let cancelled = false
    highlight(code, lang).then((result) => { if (!cancelled) setHtml(result) }).catch(() => { if (!cancelled) setHtml(escapeHtml(code)) })
    return () => { cancelled = true }
  }, [code, lang, highlightedHtml])
  return <div {...props} ref={ref} className={`kvzd-design-code-box ${classNames?.root ?? ''} ${className}`.trim()} style={{ ...styles?.root, ...style }}>
    <pre className="kvzd-design-code-box__pre"><code dangerouslySetInnerHTML={{ __html: html ?? escapeHtml(code) }} /></pre>
  </div>
})
