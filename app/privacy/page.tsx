import type { Metadata } from "next";
import Link from "next/link";
import TextPage from "@/components/TextPage";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "How DesignersDream and its advertising partners use cookies and data.",
  alternates: { canonical: "/privacy/" },
};

const UPDATED = "2 October 2026";

export default function PrivacyPage() {
  return (
    <TextPage title="Privacy policy" intro={`How this site and its advertising partners use your data. Last updated ${UPDATED}.`} color="#8C7BFF">
      <h2>What we collect</h2>
      <p>
        DesignersDream has no accounts and no sign-up forms. We don't ask for your name or email. Our hosting provider, Cloudflare,
        processes basic technical data such as your IP address and browser type to deliver pages and protect the site from abuse.
      </p>
      <h2>Advertising and cookies</h2>
      <p>We use Google AdSense to show ads. This is how that works:</p>
      <ul>
        <li>Third-party vendors, including Google, use cookies to serve ads based on your previous visits to this site and other websites.</li>
        <li>Google's use of advertising cookies lets it and its partners serve ads to you based on your visits to this and other sites.</li>
        <li>
          You can opt out of personalised advertising in{" "}
          <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">
            Google's Ads Settings
          </a>
          . You can opt out of other vendors' cookies at{" "}
          <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
            aboutads.info
          </a>
          .
        </li>
        <li>
          Read{" "}
          <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">
            how Google uses information from sites that use its services
          </a>
          .
        </li>
      </ul>
      <p>
        If you visit from the European Economic Area, the UK or Switzerland, you'll be asked for consent before personalised ads are
        shown. You can change your choice at any time from the privacy link in the consent message.
      </p>
      <h2>Your browser's storage</h2>
      <p>The site itself stores nothing about you. If you turn on reduced motion in your operating system, we respect it automatically.</p>
      <h2>Links to other sites</h2>
      <p>We link to the outlets and tools we write about. Their own privacy policies apply once you leave DesignersDream.</p>
      <h2>Children</h2>
      <p>This site is meant for a general audience of designers and isn't directed at children under 13.</p>
      <h2>Changes and contact</h2>
      <p>
        If this policy changes, we'll update the date at the top of this page. Questions? <Link href="/contact/">Contact us</Link>.
      </p>
    </TextPage>
  );
}
