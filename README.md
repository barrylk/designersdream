# DesignersDream

Articles, tips, new software, AI models and videos for every kind of designer.

Built with Next.js (static export), GSAP (ScrollTrigger, SplitText, Flip), Lenis smooth scroll and a hand-written WebGL "mixing inks" hero.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Content

All content lives in `lib/content.ts`. Add an object to `ITEMS` and push; Cloudflare rebuilds the site automatically.

## Deploy (Cloudflare Pages, free)

- Framework preset: Next.js (Static HTML Export)
- Build command: `npx next build`
- Build output directory: `out`
- Environment variable (optional): `NEXT_PUBLIC_SITE_URL` = your live URL
