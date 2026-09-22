import { useLocation } from 'react-router-dom'

export type Locale = 'en' | 'zh'

const english = {
  brand: 'KevinZonda Design System', basedOn: 'Based On GOV.UK D.S.',
  components: 'Components', extraComponents: 'Extra Components', quickReview: 'Quick Review', source: 'Source',
  documentation: 'Documentation', chooseLanguage: 'Choose language', skipToContent: 'Skip to main content', menu: 'Menu', serviceInformation: 'Service information',
  search: 'Search KevinZonda Design System', noComponents: 'No components found',
  componentsIntro: 'Reusable React components for building consistent, accessible public services.',
  componentsDetail: 'Each page includes a working example, a compact React API and implementation guidance aligned with GOV.UK Frontend 6.5.1.',
  openQuickReview: 'Open Quick Review', quickReviewHint: 'Explore multiple components together in one interactive page.',
  extraIntro: 'Optional components for documentation, developer tools and other interfaces outside the official GOV.UK component set.',
  extraDetail: 'Each component has a live example, React code and its own API reference.',
  trial: 'Trial', example: 'Example', guidance: 'View GOV.UK guidance', preview: 'Preview',
  apiIntro: 'Props accepted by this React component.', property: 'Property', type: 'Type', default: 'Default', description: 'Description',
  whenToUse: 'When to use this component', howItWorks: 'How it works', implementation: 'React implementation',
  implementationDetail: 'State changes stay inside React. The rendered markup uses GOV.UK classes and semantic HTML, without initialising DOM-mutating GOV.UK JavaScript.',
  componentPages: 'Component pages', extraComponentPages: 'Extra component pages', previousComponent: 'Previous component', nextComponent: 'Next component',
  notFound: 'Page not found', notFoundDetail: 'The component page you requested does not exist.', returnTo: 'Return to',
  footerDescription: 'React components based on GOV.UK Frontend 6.5.1', govukLicense: 'License',
  licenseIntro: 'This site uses GOV.UK Frontend 6.5.1. Its software is released under the MIT License. The original copyright and license notice is reproduced below.',
  licenseSource: 'View the GOV.UK Frontend source and license',
  reviewIntro: 'Review every component in one place. Examples are interactive and use the same source as the individual documentation pages.',
  baseline: 'Baseline', lockedTo: 'Locked to GOV.UK Frontend 6.5.1', componentsCovered: 'components covered',
  filterComponents: 'Filter components', showing: 'Showing', of: 'of', componentIndex: 'Component index',
  allComponents: 'All components', shown: 'shown', viewDocumentation: 'View documentation',
  backToTop: 'Back to top', tryDifferent: 'Try a different component name or description.',
} as const

const chinese: Record<keyof typeof english, string> = {
  brand: 'KevinZonda 设计系统', basedOn: '基于GOV.UK设计系统',
  components: '组件', extraComponents: '扩展组件', quickReview: '快速总览', source: '源码',
  documentation: '文档', chooseLanguage: '选择语言', skipToContent: '跳转到主要内容', menu: '菜单', serviceInformation: '服务信息',
  search: '搜索 KevinZonda 设计系统', noComponents: '未找到组件',
  componentsIntro: '用于构建一致、易用的公共服务的可复用 React 组件。',
  componentsDetail: '每个页面都包含可交互示例、简明的 React API 以及与 GOV.UK Frontend 6.5.1 对齐的实现说明。',
  openQuickReview: '打开快速总览', quickReviewHint: '在一个交互页面中浏览多个组件。',
  extraIntro: '适用于文档、开发工具和其他界面的可选组件，不属于 GOV.UK 官方组件集。',
  extraDetail: '每个组件都有实时示例、React 代码和独立的 API 参考。',
  trial: '试用', example: '示例', guidance: '查看 GOV.UK 使用指南', preview: '预览',
  apiIntro: '此 React 组件接受的属性。', property: '属性', type: '类型', default: '默认值', description: '说明',
  whenToUse: '何时使用此组件', howItWorks: '工作原理', implementation: 'React 实现',
  implementationDetail: '状态变化由 React 管理。渲染结果使用 GOV.UK 类名和语义化 HTML，无需初始化会修改 DOM 的 GOV.UK JavaScript。',
  componentPages: '组件页面', extraComponentPages: '扩展组件页面', previousComponent: '上一个组件', nextComponent: '下一个组件',
  notFound: '找不到页面', notFoundDetail: '你请求的组件页面不存在。', returnTo: '返回',
  footerDescription: '基于 GOV.UK Frontend 6.5.1 的 React 组件', govukLicense: '授权',
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
  return pathname === '/zh' || pathname.startsWith('/zh/') ? 'zh' : 'en'
}

export function useLocale(): Locale {
  return localeFromPath(useLocation().pathname)
}

export function localizedPath(path: string, locale: Locale): string {
  const normalized = path.startsWith('/') ? path : `/${path}`
  return locale === 'zh' ? `/zh${normalized}` : normalized
}

export function pathInLocale(pathname: string, locale: Locale): string {
  const unprefixed = pathname.replace(/^\/zh(?=\/|$)/, '') || '/'
  return localizedPath(unprefixed, locale)
}

export function pageTitle(title: string, locale: Locale): string {
  return locale === 'zh' ? `${title}｜${message(locale, 'brand')}` : `${title} – ${message(locale, 'brand')}`
}
