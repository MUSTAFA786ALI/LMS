/**
 * Formatting utilities
 */

/**
 * Format price with currency
 */
export function formatPrice(price: number, currency: string = '$'): string {
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format duration in hours to readable string
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)}m`;
  }
  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = Math.round(hours % 24);
    return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
  }
  return `${Math.round(hours)}h`;
}

/**
 * Format instructor name
 */
export function formatInstructorName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

/**
 * Format rating with stars
 */
export function formatRating(rating: number): string {
  const stars = Math.round(rating * 2) / 2;
  return `${stars.toFixed(1)}★`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number = 100): string {
  if (text.length <= length) {
    return text;
  }
  return text.substring(0, length) + '...';
}

/**
 * Format enrollment count
 */
export function formatEnrollmentCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
