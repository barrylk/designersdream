"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ADSENSE_CLIENT, ADSENSE_ENABLED } from "@/lib/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A fixed AdSense display unit. Renders nothing until both the publisher ID and this
 * slot's ad unit ID are set, so empty boxes never appear on the page.
 */
export default function AdSlot({ slot, className = "" }: { slot: string; className?: string }) {
  const ref = useRef<HTMLModElement>(null);
  const pathname = usePathname();
  const active = ADSENSE_ENABLED && /^\d+$/.test(slot);

  useEffect(() => {
    if (!active || !ref.current || ref.current.dataset.adsbygoogleStatus) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      /* ad blockers or a not-yet-approved site: leave the space empty */
    }
  }, [active, pathname]);

  if (!active) return null;

  return (
    <aside className={`ad ${className}`} aria-label="Advertisement">
      <span className="ad-label">Advertisement</span>
      <ins
        key={pathname}
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}
