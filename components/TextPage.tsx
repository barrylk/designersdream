import type { ReactNode } from "react";

/** Plain reading layout for About, Privacy and Contact. */
export default function TextPage({ title, intro, color = "#39D5F0", children }: { title: string; intro: string; color?: string; children: ReactNode }) {
  return (
    <>
      <header className="page-head" style={{ ["--c" as string]: color }}>
        <span className="aura" aria-hidden="true" />
        <div className="wrap">
          <h1 className="page-title">{title}</h1>
          <p className="page-intro">{intro}</p>
        </div>
      </header>
      <div className="wrap">
        <div className="prose text-page">{children}</div>
      </div>
    </>
  );
}
