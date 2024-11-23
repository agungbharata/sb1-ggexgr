export function generateSlug(brideName: string, groomName: string): string {
  const combinedNames = `wedding-${brideName}-${groomName}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  return combinedNames;
}