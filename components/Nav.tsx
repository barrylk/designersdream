"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/news/", label: "News" },
  { href: "/articles/", label: "Articles" },
  { href: "/tips/", label: "Tips" },
  { href: "/software/", label: "Software" },
  { href: "/ai-models/", label: "AI models" },
  { href: "/videos/", label: "Videos" },
];

export const openSearch = () => window.dispatchEvent(new CustomEvent("dd:search"));

export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [mac, setMac] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    setMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className={`nav${scrolled || open ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <div className="wrap nav-inner">
        <Link href="/" className="logo" aria-label="DesignersDream home">
          <span className="logo-mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          DesignersDream
        </Link>
        <nav className="nav-links" id="site-menu" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} aria-current={pathname.startsWith(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
        <button type="button" className="search-trigger" onClick={openSearch} aria-label="Search DesignersDream">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <span className="label">Search</span>
          <kbd>{mac ? "⌘K" : "Ctrl K"}</kbd>
        </button>
        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
          </svg>
        </button>
      </div>
    </header>
  );
}
