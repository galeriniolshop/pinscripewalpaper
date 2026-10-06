export function slugify(value: string): string {
  return value
    .trim()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

export function queryFromSlug(slug: string): string {
  let decoded = slug;
  try {
    decoded = decodeURIComponent(slug);
  } catch {
    // A literal percent sign in a keyword should not break the results route.
  }
  return decoded
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function titleCase(value: string): string {
  return value.replace(/(^|\s)(\p{L})/gu, (_match, space: string, letter: string) => `${space}${letter.toLocaleUpperCase("id-ID")}`);
}
