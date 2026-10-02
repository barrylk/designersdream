export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://designersdream.pages.dev").replace(/\/$/, "");

/**
 * Google AdSense.
 * Paste your publisher ID below (looks like "ca-pub-1234567890123456"), or set
 * NEXT_PUBLIC_ADSENSE_CLIENT in Cloudflare Pages → Settings → Environment variables.
 * With only this ID set, turn on Auto ads in AdSense and Google places ads for you.
 */
const ADSENSE_CLIENT_ID = "";

export const ADSENSE_CLIENT = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT || ADSENSE_CLIENT_ID).trim();
export const ADSENSE_ENABLED = /^ca-pub-\d{10,20}$/.test(ADSENSE_CLIENT);

/**
 * Optional: ad unit IDs for fixed placements (AdSense → Ads → By ad unit → Display ads).
 * Leave empty to rely on Auto ads only. Each value is the numeric data-ad-slot.
 */
export const ADSENSE_SLOTS = {
  inArticle: process.env.NEXT_PUBLIC_ADSENSE_SLOT_ARTICLE || "",
  listing: process.env.NEXT_PUBLIC_ADSENSE_SLOT_LISTING || "",
  home: process.env.NEXT_PUBLIC_ADSENSE_SLOT_HOME || "",
};

/** Shown on the contact and privacy pages. Leave empty to point people to GitHub instead. */
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "nirmala.itdev@proton.me";
/**
 * Email subscriptions run on Kit (kit.com, free up to 10,000 subscribers).
 * Paste the numeric ID of your Kit form below, or set NEXT_PUBLIC_KIT_FORM_ID in Cloudflare.
 */
const KIT_FORM = "9992044";
export const KIT_FORM_ID = (process.env.NEXT_PUBLIC_KIT_FORM_ID || KIT_FORM).trim();
export const SUBSCRIBE_ENABLED = /^\d+$/.test(KIT_FORM_ID);

export const CONTACT_FALLBACK_URL = "https://github.com/barrylk/designersdream/issues";
