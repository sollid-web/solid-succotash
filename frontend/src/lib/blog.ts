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

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string // ISO yyyy-mm-dd or full ISO string
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

  if (!title) throw new Error(`Post ${slug} is missing frontmatter field: title`)
  if (!description) throw new Error(`Post ${slug} is missing frontmatter field: description`)
  if (!dateRaw) throw new Error(`Post ${slug} is missing frontmatter field: date`)

  const date = new Date(dateRaw)
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Post ${slug} has invalid frontmatter date: ${dateRaw}`)
  }

  return {
    meta: {
      slug,
      title,
      description,
      // Store as YYYY-MM-DD for stable sorting and display.
      date: date.toISOString().slice(0, 10),
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

  posts.sort((a, b) => b.date.localeCompare(a.date))
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
