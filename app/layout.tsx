import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CommandSearch, { type SearchEntry } from "@/components/CommandSearch";
import { ITEMS, byDate, disciplineByKey, itemHref, typeByKey } from "@/lib/content";
import { ADSENSE_CLIENT, ADSENSE_ENABLED, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "DesignersDream: articles, tools and AI models for designers", template: "%s · DesignersDream" },
  description:
    "Articles, quick tips, new design software, AI models and video channels for UI/UX, graphic, motion, 3D, web and brand designers.",
  openGraph: { type: "website", siteName: "DesignersDream", url: SITE_URL },
  twitter: { card: "summary_large_image" },
  ...(ADSENSE_ENABLED ? { other: { "google-adsense-account": ADSENSE_CLIENT } } : {}),
};

export const viewport: Viewport = { themeColor: "#0d1030", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const entries: SearchEntry[] = [...ITEMS].sort(byDate).map((i) => ({
    title: i.title,
    excerpt: i.excerpt,
    href: itemHref(i),
    type: typeByKey(i.type).singular,
    color: disciplineByKey(i.disciplines[0]).color,
    terms: [i.title, i.excerpt, typeByKey(i.type).name, i.meta?.maker, i.meta?.tool, ...i.disciplines.map((d) => disciplineByKey(d).name)]
      .filter(Boolean)
      .join(" ")
      .toLowerCase(),
  }));

  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js-motion')`,
          }}
        />
        {ADSENSE_ENABLED && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
            crossOrigin="anonymous"
          />
        )}
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <SmoothScroll />
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <CommandSearch entries={entries} />
      </body>
    </html>
  );
}
