import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = {
  title: "About",
  description: "What DesignersDream is, who writes it and how we cover design news.",
  alternates: { canonical: "/about/" },
};

export default function AboutPage() {
  return (
    <TextPage title="About" intro="DesignersDream is a home for designers of every discipline to find what's new and what's useful.">
      <p>
        We cover UI/UX, graphic, motion, 3D, web and brand design. Every week we publish news, longer guides, quick tips, and short
        reviews of the software, AI models and YouTube channels worth your time.
      </p>
      <h2>Who writes it</h2>
      <p>
        Our news desk and guides are written by <Link href="/author/barry/">Barry</Link>, the site's editor.
      </p>
      <h2>How we cover news</h2>
      <ul>
        <li>We read the design press, company announcements and release notes every day.</li>
        <li>We rewrite what matters in our own words and add what it means for working designers.</li>
        <li>Every news story names and links the outlets that reported it first. If a source is wrong, we say so and correct it.</li>
        <li>We never copy articles, and we embed videos instead of re-uploading them.</li>
      </ul>
      <h2>Advertising</h2>
      <p>
        DesignersDream is free to read and is supported by advertising served by Google AdSense. Advertisers don't influence what we
        write. Read our <Link href="/privacy/">privacy policy</Link> to see how ads use cookies.
      </p>
      <h2>Get in touch</h2>
      <p>
        Spotted a mistake or want to suggest a tool? <Link href="/contact/">Contact us</Link>.
      </p>
    </TextPage>
  );
}
