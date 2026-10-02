import Link from "next/link";
import { DISCIPLINES, TYPES } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <p className="footer-note">
              DesignersDream collects what's new and useful for designers of every discipline. Summaries are our own; we link to the people who made the work.
            </p>
          </div>
          <div>
            <h4>Browse</h4>
            <ul>
              {TYPES.map((t) => (
                <li key={t.key}>
                  <Link href={`/${t.route}/`}>{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Disciplines</h4>
            <ul>
              {DISCIPLINES.map((d) => (
                <li key={d.key}>
                  <Link href={`/discipline/${d.key}/`}>{d.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav className="footer-pages" aria-label="About this site">
          <Link href="/about/">About</Link>
          <Link href="/author/barry/">Barry, our editor</Link>
          <Link href="/subscribe/">Subscribe</Link>
          <a href="/feed.xml">RSS</a>
          <Link href="/contact/">Contact</Link>
          <Link href="/privacy/">Privacy policy</Link>
        </nav>
        <div className="wordmark" aria-hidden="true">
          DesignersDream
        </div>
        <div className="footer-legal">
          <span>© {new Date().getFullYear()} DesignersDream</span>
          <span>Press / anywhere to search</span>
        </div>
      </div>
    </footer>
  );
}
