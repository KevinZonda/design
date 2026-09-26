// Static code samples for the Typography documentation page. Keep them in
// sync with the live examples in TypographyPage.tsx; highlight-code.mjs turns
// each entry into pre-highlighted HTML for CodeBox.
export const typographyCodeSamples: Record<string, string> = {
  'typography-headings': `import { Typography } from '@kevinzonda/design'

<Typography.Title level={1} variant="xl">Apply for a licence</Typography.Title>
<Typography.Title level={2} variant="l">Your personal details</Typography.Title>
<Typography.Title level={3} variant="m">Contact information</Typography.Title>
<Typography.Title level={4} variant="s">Get help with this question</Typography.Title>`,
  'typography-captions': `import { Typography } from '@kevinzonda/design'

<Typography.Title level={2} variant="l" caption="Section 2 of 5">Check your answers</Typography.Title>
<Typography.Title level={3} variant="m" caption="About your vehicle">Vehicle details</Typography.Title>
// Use captionInHeading when the caption is part of the page heading.
<Typography.Title level={1} variant="l" caption="Section 1 of 5" captionInHeading>Your account</Typography.Title>`,
  'typography-text': `import { Typography } from '@kevinzonda/design'

<Typography.Paragraph>
  Total due: <Typography.Text bold tabular>£1,234.56</Typography.Text>
</Typography.Paragraph>
<Typography.Text variant="s">Last updated 27 September 2026</Typography.Text>
// Any point from the GOV.UK type scale (16, 19, 24, 27, 36, 48, 80).
<Typography.Text size={48}>Over 2 million people use this service</Typography.Text>`,
  'typography-paragraph': `import { Typography } from '@kevinzonda/design'

<Typography.Paragraph variant="l">Use this service to apply for a licence, renew an existing one, or update your details.</Typography.Paragraph>
<Typography.Paragraph>It usually takes about 10 minutes to complete the application. You will need your reference number.</Typography.Paragraph>
<Typography.Paragraph variant="s">Available in England, Wales and Scotland.</Typography.Paragraph>`,
}
