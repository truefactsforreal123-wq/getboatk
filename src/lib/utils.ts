const FALLBACK_SITE_URL = "https://getboatk.vercel.app";

export function getSiteUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SITE_URL ?? "").trim() || FALLBACK_SITE_URL;
  const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes(".")) {
      return FALLBACK_SITE_URL;
    }
    return url;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
