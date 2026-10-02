import { disciplineByKey, type Item } from "@/lib/content";

const GLYPH: Record<Item["type"], string> = {
  news: "Nº",
  article: "Aa",
  tip: "✳",
  software: "⌘",
  "ai-model": "✦",
  video: "▶",
};

function seeded(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}

/** A unique ink-blot cover per item, mixed from its disciplines' colours. No image files needed. */
export default function Cover({ item, className = "", large = false }: { item: Item; className?: string; large?: boolean }) {
  const rand = seeded(item.slug);
  const colors = item.disciplines.map((d) => disciplineByKey(d).color);
  const inks = [...colors, "#39D5F0", "#FF3FA4", "#FFD43B"].slice(0, 3);
  const blots = inks.map((c, i) => {
    const size = 55 + rand() * 45;
    return {
      c,
      size,
      left: -10 + rand() * 70 + i * 6,
      top: -20 + rand() * 70,
      opacity: i === 0 ? 0.95 : 0.75,
    };
  });

  return (
    <div className={`cover ${className}`} aria-hidden="true">
      {blots.map((b, i) => (
        <span
          key={i}
          className="cover-blot"
          style={{
            background: b.c,
            width: `${b.size}%`,
            height: `${b.size * 1.35}%`,
            left: `${b.left}%`,
            top: `${b.top}%`,
            opacity: b.opacity,
            filter: `blur(${large ? 60 : 28}px)`,
          }}
        />
      ))}
      <span className="cover-glyph" style={large ? { fontSize: "clamp(140px, 22vw, 320px)" } : undefined}>
        {item.type === "software" || item.type === "ai-model" || item.type === "video" || item.type === "news" ? item.title.slice(0, 1) : GLYPH[item.type]}
      </span>
      <span className="cover-grain" />
    </div>
  );
}
