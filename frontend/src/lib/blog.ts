import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import remarkRehype from 'remark-rehype'
import rehypeSanitize from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'

const POSTS_DIR = path.join(process.cwd(), 'posts')

export interface PostMeta {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  coverImage?: string
  coverImageAlt?: string
}

export interface Post extends PostMeta {
  contentHtml: string
}

function readPostFile(slug: string): { data: Record<string, any>; content: string } | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  const raw = fs.readFileSync(filePath, 'utf8')
  return matter(raw)
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''))
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const parsed = readPostFile(slug)
      if (!parsed) return null
      const { data } = parsed
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        publishedAt: data.publishedAt || '',
        updatedAt: data.updatedAt || data.publishedAt || '',
        coverImage: data.coverImage || undefined,
        coverImageAlt: data.coverImageAlt || undefined,
      } as PostMeta
    })
    .filter((p): p is PostMeta => p !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const parsed = readPostFile(slug)
  if (!parsed) return null
  const { data, content } = parsed

  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(content)

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    publishedAt: data.publishedAt || '',
    updatedAt: data.updatedAt || data.publishedAt || '',
    coverImage: data.coverImage || undefined,
    coverImageAlt: data.coverImageAlt || undefined,
    contentHtml: processed.toString(),
  }
}
