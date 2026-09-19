import { getSiteUrl } from '@/lib/site-config'

const baseUrl = getSiteUrl()
const canonicalUrl = `${baseUrl}/plans`

export default function Head() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: baseUrl,
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'Plans',
                item: canonicalUrl,
              },
            ],
          }),
        }}
      />
    </>
  )
}
