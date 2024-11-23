export function generateSlug(brideName: string, groomName: string, customSlug?: string): string {
  if (customSlug) {
    return sanitizeSlug(customSlug);
  }

  const combinedNames = `${brideName}-${groomName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return combinedNames;
}

export function sanitizeSlug(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function isSlugUnique(slug: string): boolean {
  const invitations = JSON.parse(localStorage.getItem('invitations') || '[]');
  return !invitations.some((inv: any) => generateSlug(inv.brideNames, inv.groomNames, inv.customSlug) === slug);
}