/**
 * Generate URL-friendly slug from title
 * Handles Chinese and English text, converts to lowercase, replaces spaces with hyphens
 * For Chinese characters, they will be URL-encoded automatically by the browser
 */
export function generateSlug(title: string): string {
  if (!title) return "";
  
  // Convert to lowercase and trim
  let slug = title.toLowerCase().trim();
  
  // Replace spaces and underscores with hyphens
  slug = slug.replace(/[\s_]+/g, "-");
  
  // Keep letters (including Chinese), numbers, hyphens, and encodeURIComponent will handle Chinese
  // Remove only special characters that shouldn't be in URLs
  slug = slug.replace(/[^\p{L}\p{N}-]/gu, "");
  
  // Remove multiple consecutive hyphens
  slug = slug.replace(/-+/g, "-");
  
  // Remove leading/trailing hyphens
  slug = slug.replace(/^-+|-+$/g, "");
  
  // Limit length to 100 characters to avoid very long URLs
  slug = slug.substring(0, 100);
  
  // If the result is empty (e.g., only Chinese characters that got removed), use a fallback
  if (!slug) {
    // Create a hash-like slug from the title
    slug = `story-${Date.now().toString(36)}`;
  }
  
  return slug;
}

/**
 * Generate unique slug by appending a number if needed
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  if (!existingSlugs.includes(baseSlug)) {
    return baseSlug;
  }
  
  let counter = 1;
  let uniqueSlug = `${baseSlug}-${counter}`;
  while (existingSlugs.includes(uniqueSlug)) {
    counter++;
    uniqueSlug = `${baseSlug}-${counter}`;
  }
  
  return uniqueSlug;
}

