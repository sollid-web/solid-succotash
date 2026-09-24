# Solid Succotash

## WolvCapital Web Platform

A production-oriented web platform for WolvCapital, combining a responsive investment-product experience with content, legal/compliance pages, administrative workflows, and supporting automation. The project demonstrates how to organize a modern Next.js application around reusable UI, SEO, accessibility, testing, and operational documentation.

> **Portfolio note:** This repository is presented as a software engineering project. Financial copy, investment claims, tokenomics, and compliance content should be reviewed by qualified legal and financial professionals before being used in production.

## Why this project is interview-ready

This project is more than a landing page. It provides discussion points across frontend architecture, product design, accessibility, quality engineering, and delivery:

- Built a responsive web experience with **Next.js, React, JavaScript/TypeScript, and Tailwind CSS**.
- Uses reusable components and a clear separation between application code, static assets, content, tests, and operational scripts.
- Includes interactive UI such as the accessible flip-card experience, with keyboard support and reduced-motion consideration.
- Treats SEO as an engineering concern through metadata, Open Graph/Twitter card support, image optimization, and content structure.
- Includes legal and risk-disclosure navigation appropriate for a financial-product interface.
- Includes unit/integration and end-to-end testing foundations using **Jest** and **Playwright**.
- Documents backend integration expectations, environment configuration, deployment options, and future product areas.

## Core capabilities

- Responsive, mobile-first marketing and product pages
- Reusable React UI components
- Interactive virtual-card presentation
- Accessible keyboard and reduced-motion interactions
- Investment plan and product-content sections
- Legal disclaimer, privacy, terms, and risk-disclosure routes/links
- SEO metadata and social-sharing configuration
- Optimized static images and lazy loading with Next/Image
- Blog/content support through the `posts` directory
- Django/API integration boundary through environment configuration
- Automated browser testing with Playwright
- JavaScript/TypeScript linting and Jest test configuration

## Technology profile

| Area | Technologies |
| --- | --- |
| UI | React, Next.js, Tailwind CSS |
| Primary implementation | JavaScript with TypeScript support |
| Testing | Jest, Playwright |
| Content | Markdown/content assets and Next.js routes |
| Integration | HTTP API boundary, Django-compatible deployment model |
| Delivery | Node.js, Vercel, Docker, standalone Next.js deployment |

The repository's measured language composition is approximately **81.4% JavaScript, 10.1% RouterOS Script, 6.4% HTML, 2% TypeScript, and 0.1% CSS**. This is useful context in interviews: describe the project as a JavaScript-first Next.js application with TypeScript adoption and supporting infrastructure/automation scripts, rather than overstating it as a fully TypeScript codebase.

## Project structure

```text
.
├── src/                 # Application code and reusable UI
├── public/               # Images, icons, and static assets
├── posts/                # Blog/content material
├── e2e/                 # Playwright end-to-end tests
├── tests/                # Additional test coverage
├── scripts/              # Maintenance and operational scripts
├── frontend/             # Documented frontend integration area, where applicable
├── package.json          # Scripts and dependencies
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Design tokens and styling configuration
└── playwright.config.ts  # Browser-test configuration
```

## Getting started

### Prerequisites

- Node.js 18 or newer
- npm
- A configured API/backend if using dynamic integration features

### Installation

```bash
git clone https://github.com/sollid-web/solid-succotash.git
cd solid-succotash
npm install
cp .env.example .env.local
```

Review `.env.local` and replace example values with local, non-secret configuration. Never commit credentials, private keys, or production tokens.

### Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Quality checks

Use the scripts available in `package.json`; the typical checks are:

```bash
npm run lint
npm test
npm run build
```

If an end-to-end script is configured in the local checkout, run it with Playwright after starting the application:

```bash
npx playwright test
```

## Engineering decisions worth discussing

1. **Component boundaries:** interactive behavior is kept in client components while static page structure can remain server-rendered.
2. **Accessibility:** interactive controls should be usable with keyboard input, expose meaningful labels, and respect `prefers-reduced-motion`.
3. **Performance:** image optimization, lazy loading, and careful client-component usage reduce unnecessary browser work.
4. **SEO:** metadata and social cards make product pages understandable to search engines and link previews.
5. **Integration:** `NEXT_PUBLIC_API_URL` provides an explicit boundary between the frontend and a Django/API service.
6. **Risk management:** financial and legal content is separated from generic marketing UI so it can be reviewed and changed deliberately.

## Interview walkthrough

A strong five-minute explanation is:

> “I built a JavaScript-first Next.js product experience for a financial platform. I focused on reusable responsive UI, accessible interactions, SEO, image performance, legal-content navigation, and a clean API boundary for a Django service. I also added Jest/Playwright foundations and documented deployment and operational concerns.”

Be ready to demonstrate one component, explain server versus client rendering, show how the environment variables are used, and describe how you would add authentication, API validation, observability, and stronger CI coverage.

## Responsible next steps

- Add a CI workflow that runs lint, tests, type checking, and production builds.
- Add a screenshot or short demo GIF showing the primary user journey.
- Add exact local setup instructions for any required backend and seed data.
- Remove generated artifacts and ambiguous files from version control where possible.
- Add explicit test coverage for navigation, legal links, keyboard interaction, and responsive layouts.
- Document accessibility and performance results with Lighthouse or equivalent tooling.
- Add a clear license and contribution guidelines if this is intended for public collaboration.

## License

No license is currently declared. Add an explicit license before presenting this as an open-source project, or state the intended usage terms clearly.
