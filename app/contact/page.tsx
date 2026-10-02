import type { Metadata } from "next";
import TextPage from "@/components/TextPage";
import { CONTACT_EMAIL, CONTACT_FALLBACK_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send DesignersDream a correction, a tip or a tool to review.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <TextPage title="Contact" intro="Corrections, story tips and tools to review are all welcome." color="#FFD43B">
      {CONTACT_EMAIL ? (
        <p>
          Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We read everything and reply to most messages within a few
          days.
        </p>
      ) : (
        <p>
          Open a note on our{" "}
          <a href={CONTACT_FALLBACK_URL} target="_blank" rel="noopener noreferrer">
            public feedback board
          </a>
          . We read everything and reply to most messages within a few days.
        </p>
      )}
      <h2>Corrections</h2>
      <p>Tell us which page, what's wrong and, if you can, a link that shows the right information. We fix confirmed errors and note the change.</p>
      <h2>Suggest a tool or story</h2>
      <p>Send the link and a sentence on why designers should care. We can't cover everything, and we never accept payment for coverage.</p>
    </TextPage>
  );
}
