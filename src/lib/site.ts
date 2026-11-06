export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// Only same-site paths, so a crafted link cannot send people to another website.
export function safePath(path: string | null, fallback = "/home") {
  return path && /^\/(?![/\\])/.test(path) ? path : fallback;
}
