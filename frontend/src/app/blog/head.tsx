const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') ?? 'https://wolvcapital.com'
const canonicalUrl = `${baseUrl}/blog`

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
                name: 'Blog',
                item: canonicalUrl,
              },
            ],
          }),
        }}
      />
    </>
  )
}
