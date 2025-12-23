export interface SegmentAnalytics {
  track: (event: string, properties?: Record<string, any>) => void
  page: (name?: string, properties?: Record<string, any>) => void
  identify: (userId: string, traits?: Record<string, any>) => void
}

declare global {
  interface Window {
    analytics: SegmentAnalytics
  }
}

export const analytics: SegmentAnalytics = {
  track: (event: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.track(event, properties)
    }
  },
  page: (name?: string, properties?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.page(name, properties)
    }
  },
  identify: (userId: string, traits?: Record<string, any>) => {
    if (typeof window !== 'undefined' && window.analytics) {
      window.analytics.identify(userId, traits)
    }
  }
}

export const trackEvent = (event: string, properties?: Record<string, any>) => {
  analytics.track(event, properties)
}
