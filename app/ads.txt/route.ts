import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/site";

export const dynamic = "force-static";

/** Authorised Digital Sellers file. AdSense checks it at /ads.txt before serving ads. */
export function GET() {
  const body = ADSENSE_ENABLED
    ? `google.com, ${ADSENSE_CLIENT.replace(/^ca-/, "")}, DIRECT, f08c47fec0942fa0\n`
    : "# Add your AdSense publisher ID in lib/site.ts to publish this file.\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
