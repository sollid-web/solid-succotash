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

export const BLOG_CATEGORIES = [
  'Protocol Guides',
  'Security & Compliance',
  'DeFi Basics',
  'Crypto Investing Basics',
  'Risk Management',
] as const

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]

export interface FaqItem {
  question: string
  answer: string
}

export interface PostMeta {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt: string
  author?: string
  category: BlogCategory
  tags: string[]
  coverImage?: string
  coverImageAlt?: string
}

export interface Post extends PostMeta {
  contentHtml: string
  faqs: FaqItem[]
}

function readPostFile(slug: string): { data: Record<string, any>; content: string } | null {
  const filePath = path.join(POSTS_DIR, `${slug}.md`)
  if (!fs.existsSync(filePath)) return null
  return matter(fs.readFileSync(filePath, 'utf8'))
}

function firstParagraph(content: string): string {
  const paragraph = content
    .split(/\n\s*\n/)
    .map((block) => block.replace(/^#+\s+.*$/gm, '').replace(/[*_`>#]/g, '').trim())
    .find(Boolean)
  return paragraph?.replace(/\s+/g, ' ').slice(0, 160) || 'Practical guidance and educational insights from WolvCapital.'
}

function inferCategory(slug: string, title: string, explicit?: string): BlogCategory {
  if (BLOG_CATEGORIES.includes(explicit as BlogCategory)) return explicit as BlogCategory
  const value = `${slug} ${title}`.toLowerCase()
  if (/kyc|aml|regulat|compliance|transparency|security|scam|smart-contract|bscscan|trustworthy/.test(value)) return 'Security & Compliance'
  if (/staking|bnb|defi|token|blockchain|wallet|yield|passive-income/.test(value)) return 'DeFi Basics'
  if (/risk|volatil|leverage|overconf|platform-fail|withdrawal|deposit/.test(value)) return 'Risk Management'
  if (/wolv|platform|how-to|guide|investment-plan/.test(value)) return 'Protocol Guides'
  return 'Crypto Investing Basics'
}

function normaliseTags(value: unknown, category: BlogCategory): string[] {
  const tags = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  return Array.from(new Set([category, ...tags.map((tag) => String(tag).trim()).filter(Boolean)])).slice(0, 6)
}

function toPostMeta(slug: string, data: Record<string, any>, content = ''): PostMeta {
  const title = String(data.title || slug)
  return {
    slug,
    title,
    description: String(data.description || firstParagraph(content)),
    publishedAt: String(data.publishedAt || ''),
    updatedAt: String(data.updatedAt || data.publishedAt || ''),
    author: data.author ? String(data.author) : 'WolvCapital Editorial Team',
    category: inferCategory(slug, title, data.category),
    tags: normaliseTags(data.tags, inferCategory(slug, title, data.category)),
    coverImage: data.coverImage ? String(data.coverImage) : undefined,
    coverImageAlt: data.coverImageAlt ? String(data.coverImageAlt) : undefined,
  }
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return []
  return fs.readdirSync(POSTS_DIR).filter((file) => file.endsWith('.md')).map((file) => file.replace(/\.md$/, ''))
}

export function getAllPostsMeta(): PostMeta[] {
  return getAllPostSlugs()
    .map((slug) => {
      const parsed = readPostFile(slug)
      return parsed ? toPostMeta(slug, parsed.data, parsed.content) : null
    })
    .filter((post): post is PostMeta => post !== null)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1))
}

function markdownToPlainText(markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export function extractFaqs(content: string): FaqItem[] {
  const lines = content.split('\n')
  const faqs: FaqItem[] = []
  for (let index = 0; index < lines.length; index += 1) {
    const heading = lines[index].match(/^#{2,4}\s+(.+\?)\s*$/)
    if (!heading) continue
    const answerLines: string[] = []
    for (let cursor = index + 1; cursor < lines.length && !/^#{1,4}\s+/.test(lines[cursor]); cursor += 1) {
      if (lines[cursor].trim()) answerLines.push(lines[cursor].trim())
    }
    const answer = markdownToPlainText(answerLines.join(' '))
    if (answer.length >= 30) faqs.push({ question: heading[1].trim(), answer: answer.slice(0, 500) })
  }
  return faqs.slice(0, 8)
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const parsed = readPostFile(slug)
  if (!parsed) return null
  const processed = await unified().use(remarkParse).use(remarkGfm).use(remarkRehype).use(rehypeSanitize).use(rehypeStringify).process(parsed.content)
  return {
    ...toPostMeta(slug, parsed.data, parsed.content),
    contentHtml: processed.toString(),
    faqs: extractFaqs(parsed.content),
  }
}
