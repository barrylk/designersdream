// Weekly digest: emails Kit subscribers everything published on DesignersDream in the last 7 days.
// Runs from GitHub Actions every Monday. Needs the KIT_API_KEY secret; does nothing without it.
const SITE = (process.env.SITE_URL || "https://designersdream.pages.dev").replace(/\/$/, "");
const KEY = process.env.KIT_API_KEY;
const DRY = process.env.DRY_RUN === "1";

if (!KEY && !DRY) {
  console.log("KIT_API_KEY is not set, so no email was sent.");
  process.exit(0);
}

const feed = await (await fetch(`${SITE}/feed.json`)).json();
const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
const fresh = feed.items.filter((i) => Date.parse(i.date_published) >= since);

if (fresh.length === 0) {
  console.log("Nothing new this week, so no email was sent.");
  process.exit(0);
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const groups = {};
for (const i of fresh) (groups[i.tags?.[0] || "More"] ??= []).push(i);

const html = `
<div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#0d1030">
  <p style="font-size:16px;line-height:1.5">Here's everything new on DesignersDream this week.</p>
  ${Object.entries(groups)
    .map(
      ([name, list]) => `
  <h2 style="font-size:20px;margin:28px 0 8px">${esc(name)}</h2>
  ${list
    .map(
      (i) => `
  <p style="margin:0 0 16px;font-size:15px;line-height:1.5">
    <a href="${i.url}" style="color:#0d1030;font-weight:bold;font-size:17px">${esc(i.title)}</a><br>${esc(i.summary)}
  </p>`,
    )
    .join("")}`,
    )
    .join("")}
  <p style="margin-top:32px;font-size:15px"><a href="${SITE}/" style="color:#d6247f">Visit DesignersDream</a></p>
</div>`;

const today = new Date().toISOString().slice(0, 10);
const payload = {
  subject: `This week on DesignersDream: ${fresh[0].title}`,
  preview_text: `${fresh.length} new ${fresh.length === 1 ? "story" : "stories"}, tips and tools for designers.`,
  description: `Weekly digest ${today}`,
  content: html,
  public: true,
  published_at: new Date().toISOString(),
  send_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
  subscriber_filter: [],
};

if (DRY) {
  console.log(JSON.stringify({ ...payload, content: `${html.length} chars of HTML` }, null, 2));
  process.exit(0);
}

const res = await fetch("https://api.kit.com/v4/broadcasts", {
  method: "POST",
  headers: { "Content-Type": "application/json", "X-Kit-Api-Key": KEY },
  body: JSON.stringify(payload),
});
const text = await res.text();
if (!res.ok) {
  console.error(`Kit refused the broadcast (${res.status}): ${text}`);
  process.exit(1);
}
console.log(`Scheduled the weekly email with ${fresh.length} items.`);
