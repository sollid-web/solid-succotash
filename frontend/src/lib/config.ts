/**
 * Application configuration utilities
 */

/**
 * Get the API base URL from environment variable or default to localhost
 * Returns URL without trailing slash
 */
export function getApiBaseUrl(): string {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  // Remove trailing slash if present
  return apiUrl.replace(/\/$/, '')
}
