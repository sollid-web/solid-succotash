/**
 * Merge classnames conditionally
 * Similar to clsx or classnames libraries
 */
type ClassNameValue = string | undefined | null | false | Record<string, boolean> | ClassNameValue[]

export function cn(...classes: ClassNameValue[]): string {
  return classes
    .flat()
    .filter((cls): cls is string => typeof cls === 'string' && cls.length > 0)
    .join(' ')
}
