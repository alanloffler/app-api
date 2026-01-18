export function extractSlugFromOrigin(origin?: string): string | null {
  if (!origin) return null;

  try {
    const url = new URL(origin);
    const hostname = url.hostname;
    const parts = hostname.split(".");

    if (parts.length < 2) return null;

    const subdomain = parts[0];
    if (!subdomain || subdomain === "www") return null;

    return subdomain;
  } catch (error) {
    return null;
  }
}
