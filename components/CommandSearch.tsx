"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type SearchEntry = { title: string; excerpt: string; href: string; type: string; color: string; terms: string };

export default function CommandSearch({ entries }: { entries: SearchEntry[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const router = useRouter();

  const results = useMemo(() => {
    const words = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!words.length) return entries.slice(0, 8);
    return entries.filter((e) => words.every((w) => e.terms.includes(w))).slice(0, 12);
  }, [q, entries]);

  useEffect(() => setActive(0), [q]);

  useEffect(() => {
    const open = () => {
      if (!dialog.current?.open) {
        dialog.current?.showModal();
        setQ("");
        requestAnimationFrame(() => input.current?.focus());
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (dialog.current?.open) dialog.current.close();
        else open();
      } else if (e.key === "/" && !(e.target as HTMLElement).closest("input, textarea")) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("dd:search", open);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("dd:search", open);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const go = (href: string) => {
    dialog.current?.close();
    router.push(href);
  };

  return (
    <dialog
      ref={dialog}
      className="search-dialog"
      aria-label="Search"
      onClick={(e) => {
        if (e.target === dialog.current) dialog.current?.close();
      }}
    >
      <div className="search-input-row">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          ref={input}
          className="search-input"
          placeholder="Search articles, tools, AI models…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-controls="search-results"
          aria-activedescendant={results[active] ? `sr-${active}` : undefined}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActive((a) => Math.min(a + 1, results.length - 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((a) => Math.max(a - 1, 0));
            } else if (e.key === "Enter" && results[active]) {
              e.preventDefault();
              go(results[active].href);
            }
          }}
        />
      </div>
      <ul className="search-results" id="search-results" role="listbox">
        {results.length === 0 && <li className="search-empty">No matches for “{q}”. Try a tool name like Figma or a discipline like motion.</li>}
        {results.map((r, i) => (
          <li key={r.href} role="option" id={`sr-${i}`} aria-selected={i === active}>
            <a
              href={r.href}
              data-active={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={(e) => {
                e.preventDefault();
                go(r.href);
              }}
            >
              <span className="dot" style={{ ["--c" as string]: r.color }} />
              <span className="r-title">{r.title}</span>
              <span className="r-type">{r.type}</span>
            </a>
          </li>
        ))}
      </ul>
    </dialog>
  );
}
