import { useLocation } from 'react-router-dom'

export type Locale = 'en' | 'zh'

const english = {
  brand: 'KevinZonda Design System', basedOn: 'Based On GOV.UK D.S.',
  components: 'Components', extraComponents: 'Extra Components', quickReview: 'Quick Review', source: 'Source', typography: 'Typography',
  documentation: 'Documentation', chooseLanguage: 'Choose language', skipToContent: 'Skip to main content', menu: 'Menu', serviceInformation: 'Service information',
  search: 'Search KevinZonda Design System', noComponents: 'No components found',
  componentsIntro: 'Reusable React components for building consistent, accessible public services.',
  componentsDetail: 'Each page includes a working example, a compact React API and implementation guidance aligned with GOV.UK Frontend 6.5.1.',
  openQuickReview: 'Open Quick Review', quickReviewHint: 'Explore multiple components together in one interactive page.',
  extraIntro: 'Optional components for documentation, developer tools and other interfaces outside the official GOV.UK component set.',
  extraDetail: 'Each component has a live example, React code and its own API reference.',
  trial: 'Trial', example: 'Example', guidance: 'View GOV.UK guidance', preview: 'Preview', reactApi: 'React API',
  apiIntro: 'Props accepted by this React component.', property: 'Property', type: 'Type', default: 'Default', description: 'Description',
  whenToUse: 'When to use this component', howItWorks: 'How it works', implementation: 'React implementation',
  implementationDetail: 'State changes stay inside React. The rendered markup uses GOV.UK classes and semantic HTML, without initialising DOM-mutating GOV.UK JavaScript.',
  componentPages: 'Component pages', extraComponentPages: 'Extra component pages', previousComponent: 'Previous component', nextComponent: 'Next component',
  notFound: 'Page not found', notFoundDetail: 'The component page you requested does not exist.', returnTo: 'Return to',
  footerDescription: 'A usability-focused design system based on GOV.UK Design System.', govukLicense: 'License',
  typographyIntro: 'Semantic headings, body text and captions aligned with the GOV.UK type scale.',
  typographyDetail: 'Title renders a real h1–h6 with a GOV.UK heading class, Text is an inline span for body typography, and Paragraph renders block body text. Spacing between adjacent body text and headings is handled by GOV.UK Frontend.',
  typographyHeadings: 'Headings', typographyHeadingsDetail: 'Use the level for document structure and the variant for visual size. Write headings in sentence case and keep the level-to-size hierarchy consistent.',
  typographyCaptions: 'Headings with captions', typographyCaptionsDetail: 'Use a caption when a heading belongs to a larger section or group. Set captionInHeading when the caption should be announced as part of the page heading.',
  typographyInlineText: 'Inline text', typographyInlineTextDetail: 'Use Text inside sentences for emphasis, tabular numbers or a one-off size from the GOV.UK type scale. Points 27 and 80 are for exceptional circumstances only.',
  typographyParagraphs: 'Paragraphs', typographyParagraphsDetail: 'Use Paragraph for blocks of body text. The large variant works well for lead paragraphs, and the small variant for metadata.',
  licenseIntro: 'This site uses GOV.UK Frontend 6.5.1. Its software is released under the MIT License. The original copyright and license notice is reproduced below.',
  licenseSource: 'View the GOV.UK Frontend source and license',
  reviewIntro: 'Review every component in one place. Examples are interactive and use the same source as the individual documentation pages.',
  baseline: 'Baseline', lockedTo: 'Based on GOV.UK Frontend 6.5.1', componentsCovered: 'components covered',
  filterComponents: 'Filter components', showing: 'Showing', of: 'of', componentIndex: 'Component index',
  allComponents: 'All components', shown: 'shown', viewDocumentation: 'View documentation',
  backToTop: 'Back to top', tryDifferent: 'Try a different component name or description.',
} as const

const chinese: Record<keyof typeof english, string> = {
  brand: 'KevinZonda 设计系统', basedOn: '基于 GOV.UK 设计系统',
  components: '组件', extraComponents: '扩展组件', quickReview: '快速总览', source: '源码', typography: '排版',
  documentation: '文档', chooseLanguage: '选择语言', skipToContent: '跳转到主要内容', menu: '菜单', serviceInformation: '服务信息',
  search: '搜索 KevinZonda 设计系统', noComponents: '未找到组件',
  componentsIntro: '用于构建一致、易用的公共服务的可复用 React 组件。',
  componentsDetail: '每个页面都包含可交互示例、简明的 React API 以及与 GOV.UK Frontend 6.5.1 对齐的实现说明。',
  openQuickReview: '打开快速总览', quickReviewHint: '在一个交互页面中浏览多个组件。',
  extraIntro: '适用于文档、开发工具和其他界面的可选组件，不属于 GOV.UK 官方组件集。',
  extraDetail: '每个组件都有实时示例、React 代码和独立的 API 参考。',
  trial: '试用', example: '示例', guidance: '查看 GOV.UK 使用指南', preview: '预览', reactApi: 'React API',
  apiIntro: '此 React 组件接受的属性。', property: '属性', type: '类型', default: '默认值', description: '说明',
  whenToUse: '何时使用此组件', howItWorks: '工作原理', implementation: 'React 实现',
  implementationDetail: '状态变化由 React 管理。渲染结果使用 GOV.UK 类名和语义化 HTML，无需初始化会修改 DOM 的 GOV.UK JavaScript。',
  componentPages: '组件页面', extraComponentPages: '扩展组件页面', previousComponent: '上一个组件', nextComponent: '下一个组件',
  notFound: '找不到页面', notFoundDetail: '你请求的组件页面不存在。', returnTo: '返回',
  footerDescription: '一个可用性优先的设计系统，基于 GOV.UK 设计系统。', govukLicense: '授权',
  typographyIntro: '与 GOV.UK 字体比例尺对齐的语义化标题、正文与说明文字。',
  typographyDetail: 'Title 渲染真正的 h1–h6 并套用 GOV.UK 标题类；Text 是承载正文排版的行内 span；Paragraph 渲染块级正文。相邻正文与标题之间的间距由 GOV.UK Frontend 处理。',
  typographyHeadings: '标题', typographyHeadingsDetail: '用 level 表达文档结构，用 variant 控制视觉字号。标题使用句首大写（sentence case），并保持层级与字号对应关系一致。',
  typographyCaptions: '带说明文字的标题', typographyCaptionsDetail: '当标题属于更大的章节或分组时，可以配上说明文字。当说明文字应作为页面标题的一部分被朗读时，设置 captionInHeading。',
  typographyInlineText: '行内文本', typographyInlineTextDetail: '在句子内部需要强调、使用等宽数字或一次性调整字号时使用 Text。比例尺上的 27 和 80 两个点仅用于特殊场合。',
  typographyParagraphs: '段落', typographyParagraphsDetail: '使用 Paragraph 渲染成段的正文。大字号变体适合导语段，小字号变体适合元信息。',
  licenseIntro: '本站使用 GOV.UK Frontend 6.5.1。其软件采用 MIT 许可证。以下为原始版权及许可声明。',
  licenseSource: '查看 GOV.UK Frontend 源码及许可证',
  reviewIntro: '在同一页面浏览所有组件。示例可以交互，与各组件文档页面使用相同的源码。',
  baseline: '基准版本', lockedTo: '基于 GOV.UK Frontend 6.5.1', componentsCovered: '个组件',
  filterComponents: '筛选组件', showing: '显示', of: '共', componentIndex: '组件目录',
  allComponents: '所有组件', shown: '个结果', viewDocumentation: '查看文档',
  backToTop: '返回顶部', tryDifferent: '请尝试其他组件名称或说明。',
}

export type MessageKey = keyof typeof english
export const message = (locale: Locale, key: MessageKey) => locale === 'zh' ? chinese[key] : english[key]

export function localeFromPath(pathname: string): Locale {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh'
}

export function useLocale(): Locale {
  return localeFromPath(useLocation().pathname)
}

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  const unprefixed = normalized.replace(/^\/(?:zh|en)(?=\/|$)/, '') || '/'
  return `/${locale}${unprefixed}`
}

export function pathInLocale(pathname: string, locale: Locale): string {
  return localizedPath(pathname, locale)
}

export function pageTitle(title: string, locale: Locale): string {
  return locale === 'zh' ? `${title}｜${message(locale, 'brand')}` : `${title} – ${message(locale, 'brand')}`
}
