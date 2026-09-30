import Link from "next/link";
import { disciplineByKey, formatDate, itemHref, typeByKey, type Item } from "@/lib/content";
import Cover from "./Cover";

export default function ContentCard({ item }: { item: Item }) {
  const t = typeByKey(item.type);
  const detail =
    item.type === "article" && item.readMins
      ? `${item.readMins} min read`
      : item.meta?.modality ?? item.meta?.pricing ?? item.meta?.tool ?? item.meta?.handle ?? formatDate(item.date);

  return (
    <Link href={itemHref(item)} className="card" data-flip-id={item.slug}>
      <Cover item={item} className="card-cover" />
      <div className="card-body">
        <div className="card-type">
          <span>{t.singular}</span>
          <span aria-hidden="true">/</span>
          <span>{detail}</span>
        </div>
        <h3 className="card-title">{item.title}</h3>
        <p className="card-excerpt">{item.excerpt}</p>
        <div className="card-foot">
          {item.disciplines.map((d) => {
            const dis = disciplineByKey(d);
            return (
              <span className="chip" key={d}>
                <span className="dot" style={{ ["--c" as string]: dis.color }} />
                {dis.name}
              </span>
            );
          })}
        </div>
      </div>
    </Link>
  );
}
