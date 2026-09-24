# KVZD Design System

This repository is a pnpm workspace containing the `@kevinzonda/design` React component library and its documentation website.

## Packages

- `kvzd-design` — publishable `@kevinzonda/design` package. Its `src/components` and `src/extraComponents` directories provide the two component groups.
- `kvzd-design-page` — private Vite documentation website that consumes the library through the workspace.

## Development

```bash
pnpm install
pnpm dev
```

Build and lint the complete workspace with:

```bash
pnpm build
pnpm lint
```

## GitHub Pages

The [deployment workflow](.github/workflows/deploy-pages.yml) builds `kvzd-design-page` and publishes its `dist` directory on pushes to `main` or when run manually. In the repository's **Settings → Pages**, select **GitHub Actions** as the build and deployment source and set the custom domain to `design.kevinzonda.com`. This domain serves the site at `/`, so the workflow builds with a root base path.

To check the custom-domain build locally:

```bash
pnpm install --frozen-lockfile
pnpm build:pages
pnpm --filter @kevinzonda/design-page preview
```

## npm releases

Publish the first version locally, because npm requires the package to exist
before a Trusted Publisher can be configured:

```bash
pnpm install --frozen-lockfile
pnpm build:lib
cd kvzd-design
npm pack --dry-run
npm publish --access public
```

Then configure the npm package's Trusted Publisher for GitHub Actions with
user `KevinZonda`, repository `design-system`, workflow `publish-npm.yml`, and
permission to publish directly. Later releases run from version tags such as
`v0.1.1`; the tag must match `kvzd-design/package.json`.
