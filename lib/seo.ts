export const siteUrl = "https://dotverse.store";
export const siteName = "DotVerse";
export const defaultDescription =
  "Discover DotVerse premium streetwear and graphic T-shirts inspired by space, futuristic design, and a bold modern mindset.";
export const defaultSocialImage =
  "/images/hero/ChatGPT Image Sep 7, 2026, 03_17_20 AM.png";
export const brandIcon = "/icon.png";

export function absoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}
