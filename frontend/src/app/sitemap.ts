import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ?? "https://wolvcapital.com";

  const currentDate = new Date().toISOString();

  return [
    // Core pages - highest priority
    { 
      url: `${baseUrl}/`, 
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0
    },
    { 
      url: `${baseUrl}/plans`, 
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9
    },
    { 
      url: `${baseUrl}/how-it-works`, 
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    { 
      url: `${baseUrl}/about`, 
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    
    // Individual plan pages
    { 
      url: `${baseUrl}/plans/pioneer`, 
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    { 
      url: `${baseUrl}/plans/vanguard`, 
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    { 
      url: `${baseUrl}/plans/horizon`, 
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    { 
      url: `${baseUrl}/plans/summit`, 
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    
    // Support & info pages
    { 
      url: `${baseUrl}/faq`, 
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7
    },
    { 
      url: `${baseUrl}/contact`, 
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
    { 
      url: `${baseUrl}/security`, 
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.7
    },
    { 
      url: `${baseUrl}/referral`, 
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6
    },
    { 
      url: `${baseUrl}/leadership`, 
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5
    },
    
    // Legal pages - lower priority, updated yearly
    { 
      url: `${baseUrl}/terms-of-service`, 
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5
    },
    { 
      url: `${baseUrl}/privacy`, 
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5
    },
    { 
      url: `${baseUrl}/risk-disclosure`, 
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5
    },
    { 
      url: `${baseUrl}/legal`, 
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4
    },
    { 
      url: `${baseUrl}/legal-disclaimer`, 
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4
    },
    { 
      url: `${baseUrl}/withdrawal-policy`, 
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.4
    },
    { 
      url: `${baseUrl}/legal/certificate-of-operation`, 
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.3
    }
  ];
}
