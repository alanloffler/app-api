export function getAllowedPatterns(): RegExp[] {
  const patterns: RegExp[] = [];

  if (process.env.NODE_ENV !== "production") {
    patterns.push(/^https:\/\/localhost:\d+$/);
    patterns.push(/^https:\/\/[\w-]+\.localhost:\d+$/);
  }

  const domain = process.env.APP_DOMAIN;

  if (domain) {
    const escaped = domain.replace(/\./g, "\\.");
    patterns.push(new RegExp(`^https:\\/\\/${escaped}$`));
    patterns.push(new RegExp(`^https:\\/\\/[\\w-]+\\.${escaped}$`));
  }

  return patterns;
}
