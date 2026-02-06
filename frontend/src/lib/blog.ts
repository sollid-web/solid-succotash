import 'server-only'

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeStringify from 'rehype-stringify'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'

type HastNode = {
  type?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: HastNode[]
}

function isExternalHttpUrl(href: string): boolean {
  if (!href) return false

  const trimmed = href.trim()
  if (!trimmed) return false

  // Internal/relative anchors should remain normal.
  // Note: protocol-relative URLs start with '//' and should be treated as absolute.
  if ((trimmed.startsWith('/') && !trimmed.startsWith('//')) || trimmed.startsWith('#')) return false
  if (trimmed.startsWith('mailto:') || trimmed.startsWith('tel:')) return false

  let url: URL
  try {
    url = new URL(trimmed, 'https://wolvcapital.com')
  } catch {
    return false
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false

  const host = url.hostname.toLowerCase()
  if (host === 'wolvcapital.com' || host === 'www.wolvcapital.com') return false
  if (host.endsWith('.wolvcapital.com')) return false

  return true
}

function normalizeRel(value: unknown): string {
  if (Array.isArray(value)) return value.filter((v) => typeof v === 'string').join(' ')
  return typeof value === 'string' ? value : ''
}

function addExternalLinkAttrs(tree: HastNode): void {
  const visit = (node: HastNode) => {
    if (!node) return

    if (node.type === 'element' && node.tagName === 'a') {
      const props = (node.properties ??= {})
      const href = typeof props.href === 'string' ? props.href : ''

      if (href && isExternalHttpUrl(href)) {
        props.target = '_blank'

        const rel = normalizeRel(props.rel)
        const tokens = new Set(rel.split(/\s+/).filter(Boolean).map((t) => t.toLowerCase()))
        tokens.add('noopener')
        tokens.add('noreferrer')
        props.rel = Array.from(tokens).join(' ')
      }
    }

    if (Array.isArray(node.children)) {
      for (const child of node.children) visit(child)
    }
  }

  visit(tree)
}

function rehypeExternalLinks() {
  return (tree: HastNode) => {
    addExternalLinkAttrs(tree)
  }
}

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string // ISO yyyy-mm-dd (derived from publishedAt)
  publishedAt: string // ISO yyyy-mm-dd
  updatedAt: string // ISO yyyy-mm-dd
  coverImage?: string
  coverImageAlt?: string
}

export type BlogPost = BlogPostMeta & {
  contentHtml: string
}

const POSTS_DIR = path.join(process.cwd(), 'posts')

function isSafeSlug(slug: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(slug)
}

function listMarkdownFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.toLowerCase().endsWith('.md'))
    .map((entry) => entry.name)
}

export function getAllPostSlugs(): string[] {
  return listMarkdownFiles()
    .map((fileName) => fileName.replace(/\.md$/i, ''))
    .filter((slug) => isSafeSlug(slug))
}

function parseAndValidateFrontmatter(slug: string, raw: string): { meta: BlogPostMeta; markdown: string } {
  const { data, content } = matter(raw)

  const title = typeof data.title === 'string' ? data.title.trim() : ''
  const description = typeof data.description === 'string' ? data.description.trim() : ''
  const dateRaw = typeof data.date === 'string' ? data.date.trim() : ''
  const publishedAtRaw = typeof data.publishedAt === 'string' ? data.publishedAt.trim() : ''
  const updatedAtRaw = typeof data.updatedAt === 'string' ? data.updatedAt.trim() : ''

  const coverImageRaw = typeof data.coverImage === 'string' ? data.coverImage.trim() : ''
  const coverImageAltRaw = typeof data.coverImageAlt === 'string' ? data.coverImageAlt.trim() : ''

  if (!title) throw new Error(`Post ${slug} is missing frontmatter field: title`)
  if (!description) throw new Error(`Post ${slug} is missing frontmatter field: description`)
  if (!publishedAtRaw && !dateRaw) {
    throw new Error(`Post ${slug} is missing frontmatter field: publishedAt`)
  }

  const publishedAtValue = publishedAtRaw || dateRaw
  const publishedAtDate = new Date(publishedAtValue)
  if (Number.isNaN(publishedAtDate.getTime())) {
    throw new Error(`Post ${slug} has invalid frontmatter publishedAt: ${publishedAtValue}`)
  }

  const updatedAtValue = updatedAtRaw || publishedAtValue
  const updatedAtDate = new Date(updatedAtValue)
  if (Number.isNaN(updatedAtDate.getTime())) {
    throw new Error(`Post ${slug} has invalid frontmatter updatedAt: ${updatedAtValue}`)
  }

  const coverImage = (() => {
    if (!coverImageRaw) return undefined
    const lower = coverImageRaw.toLowerCase()
    if (lower.startsWith('/') || lower.startsWith('https://') || lower.startsWith('http://')) return coverImageRaw
    return undefined
  })()

  const coverImageAlt = coverImage ? (coverImageAltRaw || title) : undefined

  return {
    meta: {
      slug,
      title,
      description,
      // Store as YYYY-MM-DD for stable sorting and display.
      date: publishedAtDate.toISOString().slice(0, 10),
      publishedAt: publishedAtDate.toISOString().slice(0, 10),
      updatedAt: updatedAtDate.toISOString().slice(0, 10),
      ...(coverImage ? { coverImage } : {}),
      ...(coverImageAlt ? { coverImageAlt } : {}),
    },
    markdown: content,
  }
}

export function getAllPostsMeta(): BlogPostMeta[] {
  const slugs = getAllPostSlugs()

  const posts = slugs.map((slug) => {
    const filePath = path.join(POSTS_DIR, `${slug}.md`)
    const raw = fs.readFileSync(filePath, 'utf8')
    return parseAndValidateFrontmatter(slug, raw).meta
  })

  posts.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  return posts
}

async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const schema = {
    ...defaultSchema,
    attributes: {
      ...(defaultSchema.attributes ?? {}),
      a: [...((defaultSchema.attributes?.a as any[]) ?? []), ['rel'], ['target']],
    },
  }

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeExternalLinks)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(markdown)

  return String(file)
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSafeSlug(slug)) return null

  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null

  try {
    const raw = fs.readFileSync(filePath, 'utf8')
    const { meta, markdown } = parseAndValidateFrontmatter(slug, raw)

    const contentHtml = await renderMarkdownToHtml(markdown)

    return {
      ...meta,
      contentHtml,
    }
  } catch {
    return null
  }
}
