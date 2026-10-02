import type { Metadata } from "next";
import Link from "next/link";
import Subscribe from "@/components/Subscribe";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Get DesignersDream's new stories, tips, tools and AI models in one short email every Monday.",
  alternates: { canonical: "/subscribe/" },
};

export default function SubscribePage() {
  return (
    <>
      <header className="page-head" style={{ ["--c" as string]: "#FF3FA4" }}>
        <span className="aura" aria-hidden="true" />
        <div className="wrap">
          <h1 className="page-title">Subscribe</h1>
          <p className="page-intro">Everything new on DesignersDream, in your inbox every Monday morning.</p>
        </div>
      </header>
      <div className="wrap" style={{ padding: "clamp(40px, 6vw, 72px) var(--gutter) clamp(80px, 10vw, 140px)" }}>
        <Subscribe variant="page" />
        <div className="prose text-page" style={{ paddingTop: 48 }}>
          <h2>What you'll get</h2>
          <ul>
            <li>The week's design news, rewritten in plain words by Barry.</li>
            <li>New tips, software and AI model write-ups, with links back to the site.</li>
            <li>Nothing else. We never sell or share your address.</li>
          </ul>
          <p>
            Prefer a feed reader? Follow our <a href="/feed.xml">RSS feed</a>. See the <Link href="/privacy/">privacy policy</Link> for how we
            handle your email.
          </p>
        </div>
      </div>
    </>
  );
}
