# WolvCapital Blog SEO Audit and Consolidation

## Executive summary

The repository contains **103 Markdown articles**. The live blog index was sending a server-rendered `Loading Blog...` placeholder because the entire content section was wrapped in `Suspense`, even though the post list is available synchronously from the filesystem. The index now renders the article list directly on the server. Article pages already used dynamic metadata, but the implementation has been strengthened with typed taxonomy, server-rendered FAQ content, Article JSON-LD, conditional FAQPage JSON-LD, and breadcrumbs.

The audit also identified several duplicate or near-duplicate topic URLs. Permanent redirects and sitemap exclusions now consolidate the clearest duplicate pairs.

## Consolidation map

| Retired URL | Master URL | Decision |
| --- | --- | --- |
| `/blog/wolvcapital-platform-review-2026` | `/blog/wolvcapital-review-2026` | The May 2026 review is the newer and more direct master URL. |
| `/blog/passive-income-crypto-staking-realistic-2026` | `/blog/passive-income-crypto-staking-2026` | The May 2026 article is the newer master URL. |
| `/blog/regulated-crypto-investment-platforms-2026` | `/blog/crypto-investment-platform-comparison-2026` | The May comparison is kept as the broader comparison pillar. |

These redirects are configured as permanent redirects in `next.config.js`. The retired slugs are omitted from `sitemap.xml`.

## Metadata corrections

Two duplicated description pairs were found. The crypto investing/trading description had been copied into the blockchain security article, including an incorrect title. The article frontmatter now matches its actual subject. The platform comparison article also has a distinct description from the regulated-platform article.

All posts now receive a safe author, category, and tag fallback from `src/lib/blog.ts`. Existing frontmatter remains authoritative when a category or tags are added later.

## Implemented technical changes

The blog index is now deterministic server-rendered HTML. There is no client-only loading state around the post list, so crawlers and users receive the article titles, descriptions, dates, and links in the initial response.

The index provides topic navigation for Protocol Guides, Security & Compliance, DeFi Basics, Crypto Investing Basics, and Risk Management. Categories are inferred from the existing slugs and titles until explicit editorial taxonomy is added to frontmatter.

Each article now exposes canonical metadata, Open Graph metadata, an Article schema, and a breadcrumb schema. When a post contains question-form headings with substantive answers, the route renders those answers in an FAQ section and adds FAQPage JSON-LD. This avoids publishing FAQ structured data for pages without visible question-and-answer content.

Every article also includes an independent-verification callout directing readers to verify token, contract, balance, and transaction claims on BscScan rather than relying on screenshots or marketing copy.

## Remaining editorial recommendations

The redirect map covers clear URL duplicates, but a full editorial review should still decide whether the two first-person philosophy articles should remain separate. They have different purposes: one explains investing philosophy, while the other is a company founding statement. They should not be redirected unless the editorial goal is to remove brand-led content entirely.

Short mindset posts should be expanded with concrete examples or decision checklists in a separate content pass. The current implementation provides the navigation and schema foundation but does not invent financial claims or rewrite every article automatically.

Before publishing, verify the redirect status codes and rendered HTML in production. The key checks are that `/blog` contains article links without JavaScript, each canonical points to `https://www.wolvcapital.com/blog/<slug>`, retired URLs return a 308/301 to their master, and `sitemap.xml` contains only canonical blog URLs.
