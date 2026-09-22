# GOV.UK React documentation

Private Vite documentation website for `@kvzd-design/gov-uk`.

The website consumes the sibling library package through the pnpm workspace. From the repository root:

```bash
pnpm dev
```

Create the static documentation build with:

```bash
pnpm build:pages
```

The existing routes are English. Chinese pages use the same slugs under `/zh/`,
for example `/zh/components/button/`. The language navigation keeps visitors on
the corresponding page. `src/pages/i18n.ts` contains shared interface text,
`zhDocs.ts` contains component summaries and guidance, and `zhApi.ts` contains
API descriptions. React identifiers, code samples and their live examples remain
in English so the preview matches the code.

When adding a component, add its Chinese documentation to `zhDocs.ts`, translate
new API descriptions in `zhApi.ts`, and add its slug to
`scripts/generate-pages.mjs` so both language routes are generated.
