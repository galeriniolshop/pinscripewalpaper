const TRUSTED_IMAGE_SUFFIXES = ["pinimg.com", "pinterest.com"];

export function isTrustedPinterestImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      TRUSTED_IMAGE_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`))
    );
  } catch {
    return false;
  }
}

export function isTrustedPinterestPageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    const hostname = url.hostname.toLowerCase();
    return (
      url.protocol === "https:" &&
      (hostname === "pinterest.com" || hostname.endsWith(".pinterest.com") || hostname === "pin.it")
    );
  } catch {
    return false;
  }
}
