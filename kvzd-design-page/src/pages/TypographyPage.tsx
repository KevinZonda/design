import { useEffect, type ReactNode } from 'react'
import { Typography } from '@kevinzonda/design'
import { Table } from '@kevinzonda/design/components'
import { CodeBox } from '@kevinzonda/design/extraComponents'
import { message, pageTitle, useLocale } from './i18n'
import { typographyCodeSamples } from './typographyDoc'
import highlightedCode from '../generated/highlightedCode.json'
import './ComponentDocs.css'

const highlightedBySlug = highlightedCode as Record<string, string>

function Sample({ sampleKey, children }: { sampleKey: string; children: ReactNode }) {
  const locale = useLocale()
  return <section className="component-example" aria-labelledby={`${sampleKey}-title`}>
    <h2 className="govuk-heading-l" id={`${sampleKey}-title`}>{message(locale, 'example')}</h2>
    <div className="example-canvas">{children}</div>
    <CodeBox code={typographyCodeSamples[sampleKey]} highlightedHtml={highlightedBySlug[sampleKey]} />
  </section>
}

function ApiSection() {
  const locale = useLocale()
  const apiRow = (component: string, name: string, type: string, defaultValue: string | undefined, descriptionEn: string, descriptionZh: string) => ({ component, name, type, defaultValue, description: locale === 'zh' ? descriptionZh : descriptionEn })
  const rows = [
    apiRow('Title', 'children', 'ReactNode', undefined, 'Heading content.', '标题内容。'),
    apiRow('Title', 'level', '1 | 2 | 3 | 4 | 5 | 6', '1', 'Semantic heading level; also picks the default variant.', '语义化标题级别，同时决定默认视觉字号。'),
    apiRow('Title', 'variant', "'xl' | 'l' | 'm' | 's'", 'from level', "Visual style override ('l' renders govuk-heading-l, and so on).", "视觉字号覆盖（'l' 渲染为 govuk-heading-l，以此类推）。"),
    apiRow('Title', 'caption', 'ReactNode', undefined, 'Caption rendered above the heading.', '渲染在标题上方的说明文字。'),
    apiRow('Title', 'captionInHeading', 'boolean', 'false', 'Nest the caption inside the heading.', '将说明文字嵌入标题内部。'),
    apiRow('Text', 'variant', "'l' | 'm' | 's'", "'m'", "Body typography variant ('l' renders govuk-body-l, 's' renders govuk-body-s).", "正文排版变体（'l' 渲染为 govuk-body-l，'s' 渲染为 govuk-body-s）。"),
    apiRow('Text', 'size', '16 | 19 | 24 | 27 | 36 | 48 | 80', undefined, 'Font size override from the GOV.UK type scale.', '使用 GOV.UK 字体比例尺覆盖字号。'),
    apiRow('Text', 'bold', 'boolean', 'false', 'Bold weight.', '粗体。'),
    apiRow('Text', 'tabular', 'boolean', 'false', 'Tabular numbers.', '等宽数字。'),
    apiRow('Text', 'breakWord', 'boolean', 'false', 'Break long words.', '长单词断行。'),
    apiRow('Paragraph', 'variant', "'l' | 'm' | 's'", "'m'", "Body typography variant ('l' renders govuk-body-l, 's' renders govuk-body-s).", "正文排版变体（'l' 渲染为 govuk-body-l，'s' 渲染为 govuk-body-s）。"),
    apiRow('Paragraph', 'bold', 'boolean', 'false', 'Bold weight.', '粗体。'),
    apiRow('Paragraph', 'tabular', 'boolean', 'false', 'Tabular numbers.', '等宽数字。'),
    apiRow('Paragraph', 'breakWord', 'boolean', 'false', 'Break long words.', '长单词断行。'),
    apiRow('Title, Text, Paragraph', 'className / style', 'string / CSSProperties', undefined, 'Forwarded to the rendered element.', '透传到渲染出的元素上。'),
    apiRow('Title, Text, Paragraph', 'ref', 'Ref', undefined, 'Forwarded to the heading, span or paragraph.', '透传到标题、span 或段落元素。'),
  ]
  return <section className="component-api" aria-labelledby="api">
    <h2 className="govuk-heading-l" id="api">{message(locale, 'reactApi')}</h2>
    <p className="govuk-body">{message(locale, 'apiIntro')}</p>
    <div className="api-table-scroll"><Table rowKey={(row) => `${row.component}-${row.name}`} columns={[
      { title: message(locale, 'property'), dataIndex: 'name', rowHeader: true, render: (value) => <code>{String(value)}</code> },
      { title: message(locale, 'type'), dataIndex: 'type', render: (value) => <code>{String(value)}</code> },
      { title: message(locale, 'default'), dataIndex: 'defaultValue', render: (value) => value ? <code>{String(value)}</code> : '-' },
      { title: 'Component', dataIndex: 'component', render: (value) => <code>{String(value)}</code> },
      { title: message(locale, 'description'), dataIndex: 'description' },
    ]} dataSource={rows} /></div>
  </section>
}

export function TypographyPage() {
  const locale = useLocale()
  useEffect(() => { document.title = pageTitle(message(locale, 'typography'), locale) }, [locale])
  return <article className="component-doc">
    <h1 className="govuk-heading-xl">Typography</h1>
    <p className="govuk-body-l component-summary">{message(locale, 'typographyIntro')}</p>
    <p className="govuk-body">{message(locale, 'typographyDetail')}</p>

    <section className="guidance-section"><h2 className="govuk-heading-l" id="headings">{message(locale, 'typographyHeadings')}</h2><p className="govuk-body">{message(locale, 'typographyHeadingsDetail')}</p></section>
    <Sample sampleKey="typography-headings">
      <Typography.Title level={1} variant="xl">Apply for a licence</Typography.Title>
      <Typography.Title level={2} variant="l">Your personal details</Typography.Title>
      <Typography.Title level={3} variant="m">Contact information</Typography.Title>
      <Typography.Title level={4} variant="s">Get help with this question</Typography.Title>
    </Sample>

    <section className="guidance-section"><h2 className="govuk-heading-l" id="captions">{message(locale, 'typographyCaptions')}</h2><p className="govuk-body">{message(locale, 'typographyCaptionsDetail')}</p></section>
    <Sample sampleKey="typography-captions">
      <Typography.Title level={2} variant="l" caption="Section 2 of 5">Check your answers</Typography.Title>
      <Typography.Title level={3} variant="m" caption="About your vehicle">Vehicle details</Typography.Title>
      <Typography.Title level={1} variant="l" caption="Section 1 of 5" captionInHeading>Your account</Typography.Title>
    </Sample>

    <section className="guidance-section"><h2 className="govuk-heading-l" id="inline-text">{message(locale, 'typographyInlineText')}</h2><p className="govuk-body">{message(locale, 'typographyInlineTextDetail')}</p></section>
    <Sample sampleKey="typography-text">
      <Typography.Paragraph>Total due: <Typography.Text bold tabular>£1,234.56</Typography.Text></Typography.Paragraph>
      <Typography.Text variant="s">Last updated 27 September 2026</Typography.Text>
      <Typography.Text size={48}>Over 2 million people use this service</Typography.Text>
    </Sample>

    <section className="guidance-section"><h2 className="govuk-heading-l" id="paragraphs">{message(locale, 'typographyParagraphs')}</h2><p className="govuk-body">{message(locale, 'typographyParagraphsDetail')}</p></section>
    <Sample sampleKey="typography-paragraph">
      <Typography.Paragraph variant="l">Use this service to apply for a licence, renew an existing one, or update your details.</Typography.Paragraph>
      <Typography.Paragraph>It usually takes about 10 minutes to complete the application. You will need your reference number.</Typography.Paragraph>
      <Typography.Paragraph variant="s">Available in England, Wales and Scotland.</Typography.Paragraph>
    </Sample>

    <ApiSection />
  </article>
}
