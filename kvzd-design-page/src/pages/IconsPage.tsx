import { useEffect, useState, type ComponentType } from 'react'
import { H1, H2, Paragraph } from '@kevinzonda/design'
import { Table } from '@kevinzonda/design/components'
import { CodeBox } from '@kevinzonda/design/extraComponents'
import {
  ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowUpIcon, BellIcon, CalendarIcon, CaretDownIcon,
  CaretLeftIcon, CaretRightIcon, CaretUpIcon, CheckCircleIcon, CheckIcon, ChevronDownIcon,
  ChevronLeftIcon, ChevronRightIcon, ChevronUpIcon, ClearCircleIcon, ClockIcon, CloseIcon, CopyIcon,
  DeleteIcon, DownloadIcon, DragIcon, EditIcon, ErrorCircleIcon, ExclamationIcon, EyeIcon,
  EyeInvisibleIcon, FileIcon, FileTextIcon, FilterIcon, HomeIcon, ImageIcon, InfoCircleIcon, KeyIcon,
  LinkIcon, LockIcon, LogoutIcon, MailIcon, MenuIcon, MinusIcon, MoreIcon, PaperClipIcon,
  PaginationArrowNextIcon, PaginationArrowPrevIcon, PhoneIcon, PlusIcon, QuestionCircleIcon,
  ReloadIcon, Result404Icon, Result500Icon, ResultErrorIcon, ResultInfoIcon, ResultSuccessIcon,
  ResultWarningIcon, SafetyIcon, SearchIcon, ServiceLogoIcon, SettingIcon, SpinnerIcon,
  StartArrowIcon, ToTopIcon, UploadIcon, UserFilledIcon, UserIcon, WarningTriangleIcon,
  type IconProps,
} from '@kevinzonda/icons'
import { message, pageTitle, useLocale, type MessageKey } from './i18n'
import './IconsPage.css'

type IconComponent = ComponentType<IconProps>

interface IconEntry {
  name: string
  pathKey: string
  Component: IconComponent
}

interface IconGroup {
  id: string
  labelKey: MessageKey
  icons: IconEntry[]
}

const entry = (name: string, pathKey: string, Component: IconComponent): IconEntry => ({ name, pathKey, Component })

const iconGroups: IconGroup[] = [
  {
    id: 'actions', labelKey: 'iconGroupActions', icons: [
      entry('CheckIcon', 'check', CheckIcon),
      entry('CloseIcon', 'close', CloseIcon),
      entry('SpinnerIcon', 'spinner', SpinnerIcon),
      entry('PlusIcon', 'plus', PlusIcon),
      entry('MinusIcon', 'minus', MinusIcon),
      entry('EditIcon', 'edit', EditIcon),
      entry('CopyIcon', 'copy', CopyIcon),
      entry('DeleteIcon', 'delete', DeleteIcon),
      entry('UploadIcon', 'upload', UploadIcon),
      entry('DownloadIcon', 'download', DownloadIcon),
      entry('ReloadIcon', 'reload', ReloadIcon),
      entry('SettingIcon', 'setting', SettingIcon),
      entry('DragIcon', 'drag', DragIcon),
    ],
  },
  {
    id: 'forms', labelKey: 'iconGroupForms', icons: [
      entry('SearchIcon', 'search', SearchIcon),
      entry('FilterIcon', 'filter', FilterIcon),
      entry('ClockIcon', 'clock', ClockIcon),
      entry('UserIcon', 'user', UserIcon),
      entry('UserFilledIcon', 'userFilled', UserFilledIcon),
      entry('LockIcon', 'lock', LockIcon),
      entry('EyeIcon', 'eye', EyeIcon),
      entry('EyeInvisibleIcon', 'eyeInvisible', EyeInvisibleIcon),
      entry('CalendarIcon', 'calendar', CalendarIcon),
      entry('KeyIcon', 'key', KeyIcon),
      entry('ClearCircleIcon', 'clearCircle', ClearCircleIcon),
    ],
  },
  {
    id: 'arrows', labelKey: 'iconGroupArrows', icons: [
      entry('CaretUpIcon', 'caretUp', CaretUpIcon),
      entry('CaretDownIcon', 'caretDown', CaretDownIcon),
      entry('CaretLeftIcon', 'caretLeft', CaretLeftIcon),
      entry('CaretRightIcon', 'caretRight', CaretRightIcon),
      entry('ChevronUpIcon', 'chevronUp', ChevronUpIcon),
      entry('ChevronDownIcon', 'chevronDown', ChevronDownIcon),
      entry('ChevronLeftIcon', 'chevronLeft', ChevronLeftIcon),
      entry('ChevronRightIcon', 'chevronRight', ChevronRightIcon),
      entry('ArrowUpIcon', 'arrowUp', ArrowUpIcon),
      entry('ArrowDownIcon', 'arrowDown', ArrowDownIcon),
      entry('ArrowLeftIcon', 'arrowLeft', ArrowLeftIcon),
      entry('ArrowRightIcon', 'arrowRight', ArrowRightIcon),
      entry('StartArrowIcon', 'startArrow', StartArrowIcon),
      entry('PaginationArrowPrevIcon', 'paginationArrowPrev', PaginationArrowPrevIcon),
      entry('PaginationArrowNextIcon', 'paginationArrowNext', PaginationArrowNextIcon),
    ],
  },
  {
    id: 'navigation', labelKey: 'iconGroupNavigation', icons: [
      entry('HomeIcon', 'home', HomeIcon),
      entry('MenuIcon', 'menu', MenuIcon),
      entry('MoreIcon', 'more', MoreIcon),
      entry('ToTopIcon', 'toTop', ToTopIcon),
      entry('LinkIcon', 'link', LinkIcon),
      entry('LogoutIcon', 'logout', LogoutIcon),
    ],
  },
  {
    id: 'feedback', labelKey: 'iconGroupFeedback', icons: [
      entry('QuestionCircleIcon', 'questionCircle', QuestionCircleIcon),
      entry('ExclamationIcon', 'exclamation', ExclamationIcon),
      entry('BellIcon', 'bell', BellIcon),
      entry('MailIcon', 'mail', MailIcon),
      entry('PhoneIcon', 'phone', PhoneIcon),
      entry('FileIcon', 'file', FileIcon),
      entry('FileTextIcon', 'fileText', FileTextIcon),
      entry('PaperClipIcon', 'paperClip', PaperClipIcon),
      entry('SafetyIcon', 'safety', SafetyIcon),
      entry('ImageIcon', 'image', ImageIcon),
    ],
  },
  {
    id: 'status', labelKey: 'iconGroupStatus', icons: [
      entry('CheckCircleIcon', 'checkCircle', CheckCircleIcon),
      entry('InfoCircleIcon', 'infoCircle', InfoCircleIcon),
      entry('WarningTriangleIcon', 'warningTriangle', WarningTriangleIcon),
      entry('ErrorCircleIcon', 'errorCircle', ErrorCircleIcon),
    ],
  },
  {
    id: 'result', labelKey: 'iconGroupResult', icons: [
      entry('ResultSuccessIcon', 'resultSuccess', ResultSuccessIcon),
      entry('ResultErrorIcon', 'resultError', ResultErrorIcon),
      entry('ResultInfoIcon', 'resultInfo', ResultInfoIcon),
      entry('ResultWarningIcon', 'resultWarning', ResultWarningIcon),
      entry('Result404Icon', 'result404', Result404Icon),
      entry('Result500Icon', 'result500', Result500Icon),
    ],
  },
  {
    id: 'brand', labelKey: 'iconGroupBrand', icons: [
      entry('ServiceLogoIcon', 'serviceLogo', ServiceLogoIcon),
    ],
  },
]

const usageCode = `import { SearchIcon, WarningTriangleIcon } from '@kevinzonda/icons'

<WarningTriangleIcon size={20} />
<SearchIcon size={16} strokeWidth={1.5} className="app-icon" aria-hidden />`

const rawPathCode = `import { iconPaths } from '@kevinzonda/icons'

// Each entry: { viewBox, body, filled }
const search = iconPaths.search

// Use it as a CSS mask when you cannot render React:
const css = \`.icon-search {
  width: 24px;
  height: 24px;
  background: currentColor;
  -webkit-mask: url("data:image/svg+xml,...")
    center / contain no-repeat;
  mask: url("data:image/svg+xml,...") center / contain no-repeat;
}\``

function IconTile({ icon }: { icon: IconEntry }) {
  const locale = useLocale()
  const [copied, setCopied] = useState(false)
  const copyName = async () => {
    try {
      await navigator.clipboard.writeText(icon.name)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1200)
    } catch {
      // Clipboard unavailable; the name stays visible for manual selection.
    }
  }
  const { Component } = icon
  const breakableName = icon.name.replace(/([a-z0-9])([A-Z])/g, '$1\u200B$2')
  return <button type="button" className="icon-tile" onClick={copyName} title={message(locale, 'iconsClickToCopy')}>
    <span className="icon-tile__glyph"><Component size={28} aria-hidden /></span>
    <span className="icon-tile__name">{breakableName}</span>
    <span className="icon-tile__key">{copied ? message(locale, 'iconsCopied') : icon.pathKey}</span>
  </button>
}

function ApiSection() {
  const locale = useLocale()
  const rows = [
    { name: 'size', type: 'number | string', defaultValue: '24', description: message(locale, 'iconsApiSize') },
    { name: 'strokeWidth', type: 'number', defaultValue: '2', description: message(locale, 'iconsApiStroke') },
    { name: '…', type: 'SVGProps<SVGSVGElement>', defaultValue: undefined, description: message(locale, 'iconsApiRest') },
  ]
  return <section className="component-api" aria-labelledby="icons-api">
    <H2 variant="l" id="api">{message(locale, 'reactApi')}</H2>
    <Paragraph>{message(locale, 'apiIntro')}</Paragraph>
    <div className="api-table-scroll"><Table styles={{ root: { minWidth: 680 } }} rowKey="name" columns={[
      { title: message(locale, 'property'), dataIndex: 'name', rowHeader: true, render: (value) => <code>{String(value)}</code> },
      { title: message(locale, 'type'), dataIndex: 'type', render: (value) => <code>{String(value)}</code> },
      { title: message(locale, 'default'), dataIndex: 'defaultValue', render: (value) => value ? <code>{String(value)}</code> : '-' },
      { title: message(locale, 'description'), dataIndex: 'description' },
    ]} dataSource={rows} /></div>
  </section>
}

export function IconsPage() {
  const locale = useLocale()
  useEffect(() => { document.title = pageTitle(message(locale, 'icons'), locale) }, [locale])
  const sizeSamples = [16, 20, 24, 32, 40]
  const strokeSamples = [1, 1.5, 2, 3]
  return <article className="component-doc icons-page">
    <H1 variant="xl">{message(locale, 'icons')}</H1>
    <Paragraph variant="l" className="component-summary">{message(locale, 'iconsIntro')}</Paragraph>
    <Paragraph>{message(locale, 'iconsDetail')}</Paragraph>

    <section className="guidance-section"><H2 variant="l" id="usage">{message(locale, 'iconsUsage')}</H2>
      <div className="example-canvas"><p style={{ display: 'flex', alignItems: 'center', gap: 12 }}><WarningTriangleIcon size={20} aria-hidden /> <SearchIcon size={20} aria-hidden /> <CheckCircleIcon size={20} aria-hidden /></p></div>
      <CodeBox code={usageCode} />
    </section>

    {iconGroups.map((group) => <section key={group.id} className="guidance-section" aria-labelledby={`icons-${group.id}`}>
      <H2 variant="l" id={group.id}>{message(locale, group.labelKey)}</H2>
      <div className="icon-grid">{group.icons.map((icon) => <IconTile key={icon.name} icon={icon} />)}</div>
    </section>)}

    <section className="guidance-section" aria-labelledby="icons-sizes"><H2 variant="l" id="sizes">{message(locale, 'iconsSizes')}</H2>
      <div className="example-canvas"><div className="icon-scale-demo">{sizeSamples.map((size) => <div key={size} className="icon-scale-demo__item">
        <span className="icon-scale-demo__glyphs"><SearchIcon size={size} aria-hidden /><CheckCircleIcon size={size} aria-hidden /></span>
        <span className="icon-scale-demo__label">{size}px</span>
      </div>)}</div></div>
    </section>

    <section className="guidance-section" aria-labelledby="icons-stroke"><H2 variant="l" id="stroke">{message(locale, 'iconsStroke')}</H2>
      <div className="example-canvas"><div className="icon-scale-demo">{strokeSamples.map((width) => <div key={width} className="icon-scale-demo__item">
        <span className="icon-scale-demo__glyphs"><SearchIcon size={32} strokeWidth={width} aria-hidden /><UserIcon size={32} strokeWidth={width} aria-hidden /></span>
        <span className="icon-scale-demo__label">{width}px</span>
      </div>)}</div></div>
    </section>

    <section className="guidance-section"><H2 variant="l" id="raw">{message(locale, 'iconsRaw')}</H2>
      <Paragraph>{message(locale, 'iconsRawDetail')}</Paragraph>
      <CodeBox code={rawPathCode} />
    </section>

    <ApiSection />
  </article>
}
