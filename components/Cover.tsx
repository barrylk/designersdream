import { disciplineByKey, formatDate, typeByKey, type Item } from "@/lib/content";

/**
 * Print-shop covers. Each item gets a deterministic risograph-style composition:
 * two or three halftone ink layers, slightly misregistered, under a paper-white motif
 * that says what kind of thing it is. No image files: everything is inline SVG.
 *
 * The SVG uses `slice`, so the motif sits in a safe centre zone (x 300–1300, y 220–780)
 * that survives every aspect ratio we use (16:10 cards, 21:9 heroes, 4:3 on phones).
 */

const PAPER = "#EEF0FF";
const INK = "#141845";

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

const pick = <T,>(r: () => number, arr: T[]) => arr[Math.floor(r() * arr.length) % arr.length];

function Motif({ item, r, uid }: { item: Item; r: () => number; uid: string }) {
  const initial = item.title.replace(/^[^A-Za-z0-9]+/, "").slice(0, 1).toUpperCase();
  const stroke = { fill: "none", stroke: PAPER, strokeWidth: 6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

  switch (item.type) {
    case "news": {
      // A front page: masthead rule, a headline block and column text.
      const cols = 3;
      return (
        <g transform="translate(470 250)">
          <rect x="0" y="0" width="660" height="500" rx="10" fill={INK} fillOpacity="0.55" stroke={PAPER} strokeWidth="5" />
          <rect x="40" y="38" width="580" height="10" fill={PAPER} />
          <rect x="40" y="60" width="580" height="3" fill={PAPER} />
          <text x="40" y="160" fill={PAPER} style={{ font: "800 92px var(--display)", letterSpacing: "-0.04em" }}>
            {initial}
            <tspan style={{ font: "700 60px var(--display)" }} dx="12">
              ——
            </tspan>
          </text>
          {Array.from({ length: cols }).map((_, c) => (
            <g key={c} transform={`translate(${40 + c * 200} 210)`}>
              {Array.from({ length: 9 }).map((__, l) => (
                <rect key={l} x="0" y={l * 28} width={l === 8 ? 90 + r() * 60 : 168 - (l % 3 === 2 ? r() * 40 : 0)} height="9" rx="4.5" fill={PAPER} fillOpacity={c === 0 && l < 3 ? 1 : 0.55} />
              ))}
            </g>
          ))}
        </g>
      );
    }
    case "software": {
      // An app window with a toolbar and a shape on its canvas.
      const shape = pick(r, ["circle", "star", "pen"]);
      return (
        <g transform="translate(420 240)">
          <rect x="0" y="0" width="760" height="520" rx="26" fill={INK} fillOpacity="0.6" stroke={PAPER} strokeWidth="5" />
          <line x1="0" y1="70" x2="760" y2="70" stroke={PAPER} strokeWidth="4" />
          {[0, 1, 2].map((d) => (
            <circle key={d} cx={44 + d * 34} cy="36" r="10" fill={PAPER} fillOpacity={d === 0 ? 1 : 0.45} />
          ))}
          <rect x="24" y="96" width="62" height="400" rx="14" fill="none" stroke={PAPER} strokeOpacity="0.5" strokeWidth="3" />
          {[0, 1, 2, 3].map((t) => (
            <rect key={t} x="40" y={118 + t * 60} width="30" height="30" rx="8" fill={PAPER} fillOpacity={t === 1 ? 1 : 0.35} />
          ))}
          <g transform="translate(430 290)">
            {shape === "circle" && (
              <>
                <circle r="130" {...stroke} strokeDasharray="2 18" />
                <circle r="92" fill={PAPER} />
                <text y="34" textAnchor="middle" fill={INK} style={{ font: "800 96px var(--display)" }}>
                  {initial}
                </text>
              </>
            )}
            {shape === "star" && (
              <>
                <path d="M0 -150 L36 -48 L144 -46 L58 18 L90 122 L0 60 L-90 122 L-58 18 L-144 -46 L-36 -48 Z" fill={PAPER} />
                <rect x="-170" y="-170" width="340" height="320" fill="none" stroke={PAPER} strokeWidth="3" strokeDasharray="10 10" />
              </>
            )}
            {shape === "pen" && (
              <>
                <path d="M-180 80 C -80 -160, 80 160, 180 -80" {...stroke} strokeWidth={8} />
                {[
                  [-180, 80],
                  [0, 0],
                  [180, -80],
                ].map(([x, y], k) => (
                  <rect key={k} x={x - 14} y={y - 14} width="28" height="28" fill={INK} stroke={PAPER} strokeWidth="5" />
                ))}
                <line x1="0" y1="0" x2="-90" y2="-90" stroke={PAPER} strokeWidth="3" />
                <circle cx="-90" cy="-90" r="10" fill={PAPER} />
              </>
            )}
          </g>
        </g>
      );
    }
    case "ai-model": {
      // A generation grid: noise resolving into a solid form, tile by tile.
      const cols = 5;
      const rows = 3;
      const size = 132;
      const gap = 14;
      return (
        <g transform={`translate(${800 - (cols * size + (cols - 1) * gap) / 2} ${500 - (rows * size + (rows - 1) * gap) / 2})`}>
          {Array.from({ length: rows * cols }).map((_, k) => {
            const c = k % cols;
            const row = Math.floor(k / cols);
            const t = k / (rows * cols - 1);
            const x = c * (size + gap);
            const y = row * (size + gap);
            return (
              <g key={k} transform={`translate(${x} ${y})`}>
                <rect width={size} height={size} rx="16" fill={INK} fillOpacity="0.55" stroke={PAPER} strokeOpacity={0.25 + t * 0.75} strokeWidth="3" />
                {t < 0.5 ? (
                  <rect width={size} height={size} rx="16" fill={`url(#${uid}-noise)`} opacity={1 - t} />
                ) : (
                  <circle cx={size / 2} cy={size / 2} r={size * 0.12 + size * 0.26 * t} fill={PAPER} fillOpacity={0.4 + t * 0.6} />
                )}
              </g>
            );
          })}
        </g>
      );
    }
    case "video": {
      // A film frame with perforations and a play button.
      return (
        <g transform="translate(400 250)">
          <rect x="0" y="0" width="800" height="500" rx="20" fill={INK} fillOpacity="0.55" stroke={PAPER} strokeWidth="5" />
          {Array.from({ length: 14 }).map((_, k) => (
            <g key={k}>
              <rect x={24 + k * 56} y="18" width="30" height="20" rx="5" fill={PAPER} fillOpacity="0.6" />
              <rect x={24 + k * 56} y="462" width="30" height="20" rx="5" fill={PAPER} fillOpacity="0.6" />
            </g>
          ))}
          <circle cx="400" cy="250" r="118" fill={PAPER} />
          <path d="M370 190 L470 250 L370 310 Z" fill={INK} />
          <rect x="60" y="410" width="680" height="6" rx="3" fill={PAPER} fillOpacity="0.35" />
          <rect x="60" y="410" width={150 + r() * 380} height="6" rx="3" fill={PAPER} />
        </g>
      );
    }
    case "tip": {
      // A keycap with the tool's initial, plus a sparkle of the 'aha'.
      const tool = (item.meta?.tool ?? item.title).replace(/^Any$/, "✳");
      return (
        <g transform="translate(800 500)">
          <rect x="-200" y="-190" width="400" height="380" rx="56" fill={INK} fillOpacity="0.55" stroke={PAPER} strokeWidth="6" />
          <rect x="-160" y="-160" width="320" height="290" rx="40" fill={PAPER} />
          <text y="40" textAnchor="middle" fill={INK} style={{ font: "800 170px var(--display)", letterSpacing: "-0.04em" }}>
            {tool.slice(0, 1).toUpperCase()}
          </text>
          <g transform="translate(250 -200)" fill={PAPER}>
            <path d="M0 -60 L14 -14 L60 0 L14 14 L0 60 L-14 14 L-60 0 L-14 -14 Z" />
          </g>
          <g transform="translate(-270 170) scale(0.5)" fill={PAPER} fillOpacity="0.7">
            <path d="M0 -60 L14 -14 L60 0 L14 14 L0 60 L-14 14 L-60 0 L-14 -14 Z" />
          </g>
        </g>
      );
    }
    default: {
      // Articles: a big specimen of the title's first letter on a baseline grid.
      return (
        <g>
          {Array.from({ length: 7 }).map((_, k) => (
            <line key={k} x1="300" x2="1300" y1={260 + k * 80} y2={260 + k * 80} stroke={PAPER} strokeOpacity={k === 5 ? 0.9 : 0.25} strokeWidth={k === 5 ? 4 : 2} />
          ))}
          <text x="800" y="660" textAnchor="middle" fill={PAPER} style={{ font: "800 480px var(--display)", letterSpacing: "-0.06em" }}>
            {initial}
            <tspan style={{ font: "800 480px var(--display)" }} fillOpacity="0.35">
              {item.title.replace(/^[^A-Za-z0-9]+/, "").slice(1, 2).toLowerCase()}
            </tspan>
          </text>
          <line x1="300" x2="1300" y1="420" y2="420" stroke={PAPER} strokeWidth="3" strokeDasharray="4 12" />
        </g>
      );
    }
  }
}

export default function Cover({ item, className = "", large = false }: { item: Item; className?: string; large?: boolean }) {
  const r = rng(item.slug);
  const uid = `cv-${item.slug}${large ? "-l" : ""}`;
  const colors = [...new Set([...item.disciplines.map((d) => disciplineByKey(d).color), "#39D5F0", "#FF3FA4", "#FFD43B"])].slice(0, 3);

  // Ink layers: big geometric forms, each filled with a halftone screen at its own angle.
  const forms = colors.map((c, i) => {
    const kind = pick(r, ["circle", "arch", "slab"]);
    return {
      c,
      kind,
      x: 200 + r() * 1200,
      y: 150 + r() * 700,
      s: 380 + r() * 360,
      angle: [15, 45, 75][i],
      dot: 7 + Math.floor(r() * 5),
      rot: Math.floor(r() * 4) * 90,
    };
  });
  const offset = 10 + r() * 12;
  const t = typeByKey(item.type);

  const shape = (f: (typeof forms)[number], fill: string, extra?: object) => {
    if (f.kind === "circle") return <circle cx={f.x} cy={f.y} r={f.s / 2} fill={fill} {...extra} />;
    if (f.kind === "arch")
      return (
        <path
          transform={`rotate(${f.rot} ${f.x} ${f.y})`}
          d={`M${f.x - f.s / 2} ${f.y + f.s / 2} V${f.y} A${f.s / 2} ${f.s / 2} 0 0 1 ${f.x + f.s / 2} ${f.y} V${f.y + f.s / 2} Z`}
          fill={fill}
          {...extra}
        />
      );
    return <rect transform={`rotate(${f.rot / 6 - 8} ${f.x} ${f.y})`} x={f.x - f.s / 2} y={f.y - f.s / 3} width={f.s} height={(f.s * 2) / 3} rx="24" fill={fill} {...extra} />;
  };

  return (
    <div className={`cover ${className}`} aria-hidden="true">
      <svg className="cover-art" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          {forms.map((f, i) => (
            <pattern key={i} id={`${uid}-dots-${i}`} width={f.dot * 2} height={f.dot * 2} patternUnits="userSpaceOnUse" patternTransform={`rotate(${f.angle})`}>
              <circle cx={f.dot} cy={f.dot} r={f.dot * 0.62} fill={f.c} />
            </pattern>
          ))}
          <pattern id={`${uid}-noise`} width="12" height="12" patternUnits="userSpaceOnUse">
            <rect width="4" height="4" fill={PAPER} fillOpacity="0.7" />
            <rect x="8" y="4" width="4" height="4" fill={PAPER} fillOpacity="0.4" />
            <rect x="4" y="8" width="4" height="4" fill={PAPER} fillOpacity="0.55" />
          </pattern>
          <radialGradient id={`${uid}-glow`} cx="50%" cy="45%" r="70%">
            <stop offset="0" stopColor="#262c74" />
            <stop offset="1" stopColor="#10133a" />
          </radialGradient>
        </defs>

        <rect width="1600" height="1000" fill={`url(#${uid}-glow)`} />

        {/* halftone ink layers, screen-blended like overprinted inks */}
        <g style={{ mixBlendMode: "screen" }}>
          {forms.map((f, i) => (
            <g key={i} style={{ mixBlendMode: "screen" }}>
              {shape(f, `url(#${uid}-dots-${i})`)}
              {shape(f, f.c, { fillOpacity: 0.18 })}
            </g>
          ))}
        </g>
        {/* misregistered outline of the first ink, the riso tell */}
        {shape(forms[0], "none", { stroke: forms[0].c, strokeWidth: 5, transform: `translate(${offset} ${-offset})` })}

        <Motif item={item} r={r} uid={uid} />
      </svg>
      <span className="cover-tag">
        <span className="cover-dot" style={{ background: colors[0] }} />
        {t.singular}
      </span>
      <span className="cover-date">{formatDate(item.date)}</span>
      <span className="cover-grain" />
    </div>
  );
}
