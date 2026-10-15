# Christian Oller — Developer Portfolio

A bilingual (ES/EN) personal portfolio built with Astro 5, featuring static site generation, native i18n routing, View Transitions, and a class-based dark mode system.

[![Astro](https://img.shields.io/badge/Astro-5.16-FF5D01?logo=astro&logoColor=white)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-45ba4b?logo=playwright&logoColor=white)](https://playwright.dev)

---

## Overview

Static portfolio site with no server-side runtime. Every page is pre-rendered at build time. The i18n system uses Astro's native routing — Spanish pages live at the root (`/about`), English pages are prefixed with `/en/` (`/en/about`). A shared Page Component pattern eliminates route duplication while keeping each locale's route file to four lines.

---

## Features

- **Static Site Generation** — zero runtime, deployable to any CDN
- **Native Astro i18n** — type-safe dictionary, locale-aware path translation, path-preserving language switcher
- **View Transitions** — page fade animations + shared element transitions on project cover images
- **Dark Mode** — class-based (`.dark` on `<html>`), persisted in `localStorage`, no FOUC
- **Content Collections** — Zod-validated Markdown schema for projects
- **Accessibility** — `eslint-plugin-jsx-a11y` enforced at lint time
- **E2E Testing** — Playwright suite covering dark mode, mobile menu, navigation, and SEO meta

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Astro 5.16.7 |
| Styling | Tailwind CSS v4 (via Vite plugin — no config file) |
| Typography | `@tailwindcss/typography` |
| Fonts | Inter (sans), Playfair Display (serif) via `@fontsource` |
| Language | TypeScript (strict mode) |
| Linting | ESLint 9 flat config + `typescript-eslint` + `eslint-plugin-astro` + `eslint-plugin-jsx-a11y` |
| Formatting | Prettier + `prettier-plugin-astro` + `prettier-plugin-tailwindcss` |
| Testing | Playwright (Chromium, Mobile Chrome, Mobile Safari) |
| CI | GitHub Actions |
| Package manager | pnpm |

---

## Project Structure

```
.
├── public/                  # favicon.svg, robots.txt
├── src/
│   ├── assets/
│   │   └── images/          # Optimized via astro:assets (project covers, profile photo)
│   ├── components/
│   │   ├── common/
│   │   │   ├── Header.astro       # Sticky nav, language switcher, ThemeToggle
│   │   │   ├── Footer.astro       # Social links, copyright
│   │   │   └── ThemeToggle.astro  # Sun/moon toggle, View Transitions safe
│   │   ├── landing/
│   │   │   ├── Hero.astro         # Two-column hero (text + profile photo)
│   │   │   ├── Services.astro     # 4-service grid with hover animations
│   │   │   ├── LogoGrid.astro     # 24-technology icon grid
│   │   │   ├── AboutSummary.astro # Asymmetric personal intro section
│   │   │   └── FeaturedWork.astro # Filtered featured projects grid
│   │   └── pages/
│   │       ├── HomePage.astro     # Landing composition — receives lang prop
│   │       ├── AboutPage.astro    # Full about page — receives lang prop
│   │       ├── ContactPage.astro  # Contact info + form — receives lang prop
│   │       ├── ProjectsPage.astro # Project grid — receives lang prop
│   │       └── ProjectPage.astro  # Project detail — receives lang + project props
│   ├── content/
│   │   ├── config.ts              # Zod schema for the projects collection
│   │   └── projects/              # One .md file per project and locale
│   │       ├── es/                # Spanish entries (project-N.md)
│   │       └── en/                # English entries (same filenames)
│   ├── i18n/
│   │   ├── ui.ts                  # Translation dictionary (as const, ~50 keys/locale)
│   │   └── utils.ts               # getLangFromUrl, useTranslations, useTranslatedPath
│   ├── layouts/
│   │   └── Layout.astro           # Base layout: SEO tags, canonical, OG, ClientRouter
│   ├── pages/
│   │   ├── index.astro            # / → <HomePage lang="es" />
│   │   ├── about.astro            # /about  → <AboutPage lang="es" />
│   │   ├── contact.astro          # /contact → <ContactPage lang="es" />
│   │   ├── projects/
│   │   │   ├── index.astro        # /projects
│   │   │   └── [slug].astro       # /projects/:slug
│   │   └── en/
│   │       ├── index.astro        # /en
│   │       ├── about.astro        # /en/about  → <AboutPage lang="en" />
│   │       ├── contact.astro      # /en/contact → <ContactPage lang="en" />
│   │       └── projects/
│   │           ├── index.astro    # /en/projects
│   │           └── [slug].astro   # /en/projects/:slug
│   └── styles/
│       └── global.css             # Tailwind v4 entry, @theme tokens, dark mode variant
├── tests/
│   └── example.spec.ts            # Playwright E2E suite
├── astro.config.mjs
├── eslint.config.mjs
├── playwright.config.ts
├── prettier.config.mjs
└── tsconfig.json
```

---

## i18n Architecture

The site uses [Astro's built-in i18n routing](https://docs.astro.build/en/guides/internationalization/) with `prefixDefaultLocale: false`. Spanish (default) has no URL prefix; English is prefixed with `/en/`.

### How it works

**Dictionary** (`src/i18n/ui.ts`) — `as const` object with full TypeScript inference. Adding a key to `es` without adding it to `en` is a compile-time error.

**Utilities** (`src/i18n/utils.ts`):

```ts
// Detects the active locale from the URL pathname
getLangFromUrl(url: URL): 'es' | 'en'

// Returns a t(key) function with fallback to the default locale
useTranslations(lang): (key) => string

// Returns a translatePath(path, targetLang?) function
// Strips any existing locale prefix before adding the new one
// translatePath('/en/about', 'es') → '/about'
// translatePath('/about', 'en')    → '/en/about'
useTranslatedPath(lang): (path, l?) => string
```

**Page Component pattern** — all page logic lives in `src/components/pages/`. Route files are thin wrappers:

```astro
---
// src/pages/en/about.astro
import AboutPage from '@/components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

Adding a third locale only requires creating a new route folder with wrapper files.

**Language switcher** — uses `translatePath(Astro.url.pathname, targetLang)` so switching from `/en/projects` goes to `/projects`, not `/`.

### Project content

Project content is bilingual: each project has one Markdown file per locale (`src/content/projects/es/` and `src/content/projects/en/`). `src/utils/projects.ts` filters by locale and strips the folder from the slug, so URLs stay `/projects/<slug>` and `/en/projects/<slug>`. If an EN entry is missing, the ES entry is used as a fallback.

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- pnpm (`npm install -g pnpm`)

### Installation

```bash
git clone https://github.com/christianoller8/astro-portfolio.git
cd astro-portfolio
pnpm install
```

### Development

```bash
pnpm dev        # Start dev server at http://localhost:4321
pnpm build      # Build for production → ./dist/
pnpm preview    # Preview the production build locally
pnpm lint       # Run ESLint
pnpm format     # Format with Prettier
```

---

## Available Routes

| Spanish | English | Page |
|---|---|---|
| `/` | `/en` | Home |
| `/about` | `/en/about` | About |
| `/contact` | `/en/contact` | Contact |
| `/projects` | `/en/projects` | Projects index |
| `/projects/:slug` | `/en/projects/:slug` | Project detail |

---

## Content Collections

Projects live in `src/content/projects/<locale>/` (`es/` and `en/`) as Markdown files. Each file is validated against a Zod schema at build time.

### Schema

```ts
{
  title: string
  description: string   // Used for SEO meta and og:description
  year: number
  client: string
  tags: string[]        // Technology tags displayed as #tag
  image: ImageMetadata  // image() helper; path relative to the .md file, e.g. '../../../assets/images/project-1.jpg'
  featured: boolean     // default: false — controls visibility in FeaturedWork
  link?: string         // Optional external URL (live demo or repo)
}
```

### Adding a project

1. Create `src/content/projects/es/my-project.md` (Spanish) and `src/content/projects/en/my-project.md` (English) with the **same filename**
2. Add the frontmatter following the schema above in both files (translate `title`, `description`, `client` and prose tags; keep `year`, `featured`, `link` and `image` in sync)
3. Write the project description in the Markdown body of each file (rendered with `@tailwindcss/typography`)
4. Add the cover image to `src/assets/images/` and reference it as `../../../assets/images/<file>` in the frontmatter

The slug is the filename without the locale folder, so `my-project` is served at `/projects/my-project` (ES) and `/en/projects/my-project` (EN). Slugs must match across locales; an EN file missing for a slug falls back to the ES entry.

---

## Hero Lanyard (3D)

A decorative, draggable 3D ID card hangs from a wide dark strap (with "christianoller.dev" text) in the left half of the home hero (physics with Rapier, rendering with React Three Fiber). It is a React island mounted with `client:only="react"` in `src/components/landing/Hero.astro`.

- The static profile `<Image>` is always rendered. Once the 3D scene is running, the container gets `data-lanyard="ready"` and the image fades out (same box, no layout shift).
- Nothing is rendered (static image stays) when `prefers-reduced-motion: reduce` is set or WebGL is unavailable. The heavy chunk (`LanyardScene`) is only fetched when the container is within 200px of the viewport; the render loop and physics pause when it is offscreen or the tab is hidden. `dpr` is capped at `[1, 1.5]`.
- Touch: the canvas uses `touch-action: pan-y`, so vertical scrolling is never blocked.

Files:

- `src/components/lanyard/Lanyard.tsx`: wrapper (capability checks, IntersectionObserver, lazy import, error boundary).
- `src/components/lanyard/LanyardScene.tsx`: canvas, physics chain (`useRopeJoint` / `useSphericalJoint`), camera-facing strap ribbon, orthographic camera, drag handling.
- `src/components/lanyard/cardTexture.ts`: draws the card front/back, strap tile and soft shadow on 2D canvases.

Change the card: edit the `name`, `role`, `site` props (the status line comes from the `hero.status` i18n key) passed to `<Lanyard>` in `Hero.astro`. The photo comes from `src/assets/images/profile.jpg` (`getImage` creates a 640px JPEG for the texture); swap that import to change it. Layout and colors of the faces are in `cardTexture.ts`.

Dependencies: `@astrojs/react@4.4.2` (the 7.x line targets Astro 6), `react`/`react-dom@19.2.0`, `three@0.180.0`, `@react-three/fiber@9.4.0`, `@react-three/rapier@2.1.0`, `meshline@3.3.1`; dev: `@types/react`, `@types/react-dom`, `@types/three`.

---

## Design System

Tailwind v4 is configured entirely in `src/styles/global.css` via `@theme` — there is no `tailwind.config.js`.

### Color tokens

| Token | Light | Dark |
|---|---|---|
| `background` | `#e5e5e5` | `#2c2c2e` |
| `primary` | `#1a1a1a` | `#f5f5f5` |
| `secondary` | `#4a4a4a` | `#a3a3a3` |
| `surface` | `#ffffff` | `#171717` |

### Dark mode

Dark mode is class-based (`.dark` on `<html>`). The Layout applies it before first render via an inline script, reading from `localStorage` with a `prefers-color-scheme` fallback. The same script re-runs on `astro:after-swap` to persist the preference across View Transition navigations.

### Typography

- `font-sans` → Inter
- `font-serif` → Playfair Display (headings)

---

## Testing

E2E tests run with Playwright against the dev server.

```bash
# Install browsers (first time only)
npx playwright install

# Run all tests
npx playwright test

# Run with UI
npx playwright test --ui
```

### Test suite (`tests/example.spec.ts`)

| Test | What it covers |
|---|---|
| Dark mode toggle | Click toggle, verify `.dark` class, persist after reload, toggle back |
| Mobile menu | Menu hidden by default, opens on tap, closes after navigation |
| Desktop navigation | Nav links route correctly in desktop viewport |
| View Transitions + dark mode | Dark mode persists across SPA navigations |
| SEO meta titles | Home and Projects pages have correct `<title>` values |

Browsers: Chromium, Mobile Chrome (Pixel 5), Mobile Safari (iPhone 12).

CI runs tests on every push and pull request to `main` via `.github/workflows/playwright.yml`. Test reports are uploaded as artifacts with 30-day retention.

---

## Configuration

### Before deploying, update these values

**`astro.config.mjs`** — replace the placeholder with your real domain:

```js
site: 'https://your-domain.com',  // Required for canonical URLs and og:image
```

**`src/pages/index.astro`** and **`src/pages/en/index.astro`** — update the page title and description with your actual name and tagline.

**`src/components/landing/Hero.astro`** — replace placeholder content with your real bio.

**`src/components/common/Footer.astro`** — update social links (Twitter/X, GitHub, LinkedIn).

**`src/components/pages/ContactPage.astro`** — update the email address and connect the form to a backend (Formspree, Netlify Forms, Resend, etc. — currently the form has no `action` and submissions are not processed).

---

## Pending

- [ ] Internationalize landing components (`Hero`, `Services`, `LogoGrid`, `AboutSummary`)
- [ ] Wire up contact form to a mail service
- [ ] Add `@astrojs/sitemap` for SEO
- [ ] Migrate project images from `public/` to `src/assets/` to enable Astro's automatic image optimization pipeline
- [ ] Add `aria-current="page"` to active nav links

---

## License

MIT
