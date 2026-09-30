import Link from "next/link";
import Hero from "@/components/Hero";
import Ticker from "@/components/Ticker";
import DropsRail from "@/components/DropsRail";
import Reveal from "@/components/Reveal";
import ContentCard from "@/components/ContentCard";
import Cover from "@/components/Cover";
import {
  DISCIPLINES,
  disciplineByKey,
  itemHref,
  itemsOfDiscipline,
  itemsOfType,
  latest,
} from "@/lib/content";

export default function Home() {
  const tools = [...itemsOfType("software"), ...itemsOfType("ai-model")].map((i) => ({
    label: i.title,
    kind: i.type === "software" ? "software" : "AI model",
    color: disciplineByKey(i.disciplines[0]).color,
  }));
  const drops = latest(9);
  const articles = itemsOfType("article");
  const feature = articles.find((a) => a.featured) ?? articles[0];
  const tips = itemsOfType("tip").slice(0, 5);
  const models = itemsOfType("ai-model");
  const channels = itemsOfType("video");

  return (
    <>
      <Hero />
      <Ticker entries={tools} />

      {/* Disciplines as ink swatches */}
      <section className="section" aria-labelledby="disc-title">
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <h2 id="disc-title" className="section-title" data-reveal>
                Pick your discipline
              </h2>
              <p className="section-sub">Three process inks and their mixes. Each discipline gets its own colour, and its own feed.</p>
            </div>
          </Reveal>
          <div className="swatches">
            {DISCIPLINES.map((d) => (
              <Link key={d.key} href={`/discipline/${d.key}/`} className="swatch">
                <span className="swatch-chip" style={{ ["--c" as string]: d.color }} />
                <span className="swatch-body">
                  <span className="swatch-name">{d.name}</span>
                  <span className="swatch-hex">{d.color}</span>
                  <span className="swatch-count">{itemsOfDiscipline(d.key).length} items</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest drops, pinned horizontal rail */}
      <DropsRail
        head={
          <Reveal className="section-head">
            <div>
              <h2 id="latest-title" className="section-title" data-reveal>
                Latest drops
              </h2>
              <p className="section-sub">Everything new this month, across every format.</p>
            </div>
          </Reveal>
        }
      >
        {drops.map((item) => (
          <ContentCard key={item.slug} item={item} />
        ))}
      </DropsRail>

      {/* Featured read + tips */}
      <section className="section" aria-labelledby="read-title">
        <div className="wrap">
          <Reveal className="section-head">
            <h2 id="read-title" className="section-title" data-reveal>
              This week's read
            </h2>
            <Link href="/articles/" className="link-more">
              All articles
            </Link>
          </Reveal>
          <div className="feature">
            <Link href={itemHref(feature)} aria-label={feature.title}>
              <Cover item={feature} className="feature-cover" large />
            </Link>
            <div>
              <span className="chip">{feature.readMins} min read</span>
              <h3 className="feature-title">
                <Link href={itemHref(feature)}>{feature.title}</Link>
              </h3>
              <p>{feature.excerpt}</p>
              <Link href={itemHref(feature)} className="btn btn-solid" data-magnetic>
                Read the article
              </Link>
            </div>
          </div>

          <div style={{ marginTop: "clamp(72px, 10vw, 128px)" }}>
            <Reveal className="section-head">
              <div>
                <h2 className="section-title" data-reveal>
                  Five-minute tips
                </h2>
                <p className="section-sub">Shortcuts and habits you can try before your next coffee.</p>
              </div>
              <Link href="/tips/" className="link-more">
                All tips
              </Link>
            </Reveal>
            <ul className="tip-list">
              {tips.map((t) => (
                <li key={t.slug}>
                  <Link href={itemHref(t)}>
                    <span className="tip-tool">{t.meta?.tool}</span>
                    <span>
                      <span className="tip-title">{t.title}</span>
                      <span className="tip-excerpt">{t.excerpt}</span>
                    </span>
                    <span className="dots">
                      {t.disciplines.map((d) => (
                        <span key={d} className="dot" style={{ ["--c" as string]: disciplineByKey(d).color }} />
                      ))}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* AI model index */}
      <section className="section" aria-labelledby="ai-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <h2 id="ai-title" className="section-title" data-reveal>
                AI models, compared
              </h2>
              <p className="section-sub">What each generator makes, who makes it, and what it's best at.</p>
            </div>
            <Link href="/ai-models/" className="link-more">
              All AI models
            </Link>
          </Reveal>
          <table className="model-table">
            <thead>
              <tr>
                <th scope="col">Model</th>
                <th scope="col">Makes</th>
                <th scope="col">Good for</th>
                <th scope="col">Access</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m) => (
                <tr key={m.slug}>
                  <td>
                    <Link href={itemHref(m)} className="model-name">
                      {m.title}
                    </Link>
                    {m.meta?.maker !== m.title && <div className="model-maker">{m.meta?.maker}</div>}
                  </td>
                  <td>{m.meta?.modality}</td>
                  <td className="model-desc">{m.excerpt}</td>
                  <td style={{ color: "var(--mist)", fontSize: 14 }}>{m.meta?.pricing}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Channels */}
      <section className="section" aria-labelledby="video-title" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <Reveal className="section-head">
            <div>
              <h2 id="video-title" className="section-title" data-reveal>
                Channels worth your evenings
              </h2>
              <p className="section-sub">YouTube teachers we'd point a friend to, by discipline.</p>
            </div>
            <Link href="/videos/" className="link-more">
              All channels
            </Link>
          </Reveal>
          <div className="channels">
            {channels.map((c) => {
              const col = disciplineByKey(c.disciplines[0]).color;
              return (
                <Link key={c.slug} href={itemHref(c)} className="channel">
                  <span className="channel-avatar" style={{ background: col }} aria-hidden="true">
                    {c.title.slice(0, 1)}
                  </span>
                  <span>
                    <h3>{c.title}</h3>
                    <p>{c.excerpt}</p>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="closer" aria-labelledby="closer-title">
        <div className="wrap">
          <Reveal>
            <h2 id="closer-title" className="closer-title" data-reveal>
              Find the tool you didn't know you needed.
            </h2>
          </Reveal>
          <div className="hero-actions">
            <Link href="/software/" className="btn btn-solid" data-magnetic>
              Browse software
            </Link>
            <Link href="/tips/" className="btn" data-magnetic>
              Read the tips
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
