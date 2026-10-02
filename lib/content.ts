import { NEWS } from "./news";
import { PATCHES, UPDATES } from "./updates";

export type TypeKey = "news" | "article" | "tip" | "software" | "ai-model" | "video";
export type DisciplineKey = "ui-ux" | "graphic" | "motion" | "3d" | "web" | "brand";

export type Discipline = {
  key: DisciplineKey;
  name: string;
  color: string; // CSS colour, mixed from the process inks
  blurb: string;
};

// Cyan, magenta and yellow are the three process inks; the other three are their mixes.
export const DISCIPLINES: Discipline[] = [
  { key: "ui-ux", name: "UI/UX", color: "#39D5F0", blurb: "Interfaces, flows, research and design systems." },
  { key: "graphic", name: "Graphic", color: "#FF3FA4", blurb: "Type, layout, illustration and print." },
  { key: "motion", name: "Motion", color: "#FFD43B", blurb: "Animation, timing and moving type." },
  { key: "3d", name: "3D", color: "#8C7BFF", blurb: "Modelling, lighting, rendering and real-time scenes." },
  { key: "web", name: "Web", color: "#5BE3A0", blurb: "Building sites that look the way you designed them." },
  { key: "brand", name: "Brand", color: "#FF8A3D", blurb: "Identity, voice and systems that scale." },
];

export const disciplineByKey = (k: DisciplineKey) => DISCIPLINES.find((d) => d.key === k)!;

export type TypeInfo = { key: TypeKey; route: string; name: string; singular: string; intro: string };

export const TYPES: TypeInfo[] = [
  { key: "news", route: "news", name: "News", singular: "News", intro: "What shipped, what changed and why it matters to designers, rewritten in plain words with a link to every original report." },
  { key: "article", route: "articles", name: "Articles", singular: "Article", intro: "Longer reads on craft, process and the tools changing both." },
  { key: "tip", route: "tips", name: "Tips & tricks", singular: "Tip", intro: "Small habits and shortcuts you can use in the next five minutes." },
  { key: "software", route: "software", name: "Software", singular: "Software", intro: "Design tools worth a look, from open-source staples to newer apps." },
  { key: "ai-model", route: "ai-models", name: "AI models", singular: "AI model", intro: "Generators for images, video, vectors and 3D, and what each is good at." },
  { key: "video", route: "videos", name: "Videos", singular: "Video", intro: "This month's must-watch videos and the YouTube channels that teach the craft well." },
];

export const typeByKey = (k: TypeKey) => TYPES.find((t) => t.key === k)!;
export const typeByRoute = (r: string) => TYPES.find((t) => t.route === r);

export type Item = {
  type: TypeKey;
  slug: string;
  title: string;
  excerpt: string;
  disciplines: DisciplineKey[];
  date: string; // ISO date published on DesignersDream
  featured?: boolean;
  readMins?: number;
  /** Byline. Articles and news default to Barry. */
  author?: "barry";
  /** Outlets we learned the story from; always credited and linked on the page. */
  sources?: { name: string; url: string }[];
  /** Paragraphs. A line starting "## " is a heading, "- " a list item, "1. " a step. */
  body?: string[];
  meta?: {
    maker?: string;
    platforms?: string;
    pricing?: string;
    modality?: string;
    url?: string;
    linkLabel?: string;
    tool?: string;
    handle?: string;
    /** YouTube video ID for single videos (channels leave this empty). */
    youtubeId?: string;
  };
};

const RAW_ITEMS: Item[] = [
  ...NEWS,
  ...UPDATES,
  // ───────────────────────── Articles
  {
    type: "article",
    slug: "designing-with-ai-without-losing-your-voice",
    title: "Designing with AI without losing your voice",
    excerpt: "Generators are fast at making something. Your job is still deciding what's right. A working method for keeping taste in the loop.",
    disciplines: ["ui-ux", "graphic", "brand"],
    date: "2026-09-29",
    featured: true,
    readMins: 7,
    body: [
      "Image and layout generators have made the first draft almost free. That changes where a designer's time goes, not whether it's needed. The work moves from producing options to choosing, editing and explaining them.",
      "## Start with a brief the model can't write for you",
      "Before you prompt anything, write three sentences: who this is for, what it must make them feel or do, and what it must never look like. That last line matters most. Generators drift toward the average of everything they have seen, and your brief is the only thing pulling them away from it.",
      "## Generate wide, then stop early",
      "Use AI where breadth is cheap: moodboards, colour directions, rough compositions, copy variants. Give yourself a hard limit, such as twenty images, then close the tab. Endless generation feels productive but mostly delays the decision.",
      "## Edit like it's someone else's work",
      "Treat every output as a junior designer's first pass. Redraw the type, rebuild the grid, repaint the parts that look like everyone else's. If you can't point to at least three changes you made and why, the piece isn't yours yet.",
      "## Keep a record of taste",
      "- Save the outputs you rejected and write one line on why.",
      "- Build a small library of your own references that you reuse in prompts.",
      "- Review the pile monthly. Patterns in what you reject are your style, written down.",
      "Used this way, AI speeds up the boring middle of a project and leaves the beginning and the end, where taste lives, to you.",
    ],
  },
  {
    type: "article",
    slug: "variable-fonts-explained",
    title: "Variable fonts, explained for people who ship",
    excerpt: "One file, every weight and width in between. What variable fonts actually change for performance, responsive type and motion.",
    disciplines: ["graphic", "web", "brand"],
    date: "2026-09-24",
    readMins: 6,
    body: [
      "A variable font stores a whole family as one file with adjustable axes. Instead of shipping Regular, Medium, Bold and Black separately, you ship one font and pick any value along the weight axis.",
      "## The axes you'll meet most",
      "- Weight (wght): thin to black, in any step you like.",
      "- Width (wdth): condensed to extended, great for fitting headlines.",
      "- Optical size (opsz): subtle shape changes so small text stays open and big text stays tight.",
      "- Slant or italic (slnt, ital): angle without swapping files.",
      "## Why it matters on the web",
      "Fewer files usually means fewer requests. More importantly, you stop rationing weights. Use 560 for a UI label if 500 feels thin and 600 feels heavy. Pair width with container queries and a headline can condense itself instead of wrapping onto an awkward second line.",
      "## Why it matters in motion",
      "Axes can be animated. A weight shift on hover, a width stretch on scroll, a pulse on a loading state: all without the jump you get swapping between two separate fonts. Keep it subtle; type that never sits still is tiring to read.",
      "## A sensible default",
      "Pick one variable family for display and one for text. Set a clear scale, choose three or four weights you actually use, and let the in-between values solve problems as they come up rather than becoming the design.",
    ],
  },
  {
    type: "article",
    slug: "practical-guide-to-motion-easing",
    title: "A practical guide to motion easing",
    excerpt: "Linear motion looks mechanical because nothing in the world moves that way. How to pick curves and durations that feel physical.",
    disciplines: ["motion", "ui-ux", "web"],
    date: "2026-09-18",
    readMins: 6,
    body: [
      "Easing describes how speed changes over an animation. Almost every good interface motion speeds up, slows down, or both. Linear timing is right for very few things, such as spinners and continuous marquees.",
      "## Three curves cover most interface work",
      "- Ease-out (fast start, gentle stop) for things entering the screen. It feels responsive because movement starts immediately.",
      "- Ease-in (gentle start, fast finish) for things leaving. They get out of the way.",
      "- Ease-in-out for things moving from one place on screen to another.",
      "## Duration follows distance",
      "Small changes like a button state want 100–200 ms. A panel sliding in wants 250–400 ms. Full-screen transitions can take 500 ms or more. If an animation makes someone wait to do their next thing, it is too long.",
      "## Give motion a reason",
      "Before animating, name what the motion explains: where a thing came from, where it went, or what just changed. If you can't name it, the element probably doesn't need to move.",
      "## Check it with reduced motion on",
      "Operating systems let people ask for less motion. Respect it: keep fades, drop large movement, parallax and auto-playing effects. Your design should still make sense with every flourish switched off.",
    ],
  },
  {
    type: "article",
    slug: "colour-systems-that-survive-dark-mode",
    title: "Colour systems that survive dark mode",
    excerpt: "Inverting your palette isn't a dark theme. Build colour as roles and tokens so both themes stay readable and on-brand.",
    disciplines: ["ui-ux", "web", "brand"],
    date: "2026-09-12",
    readMins: 5,
    body: [
      "Most dark themes fail for the same reason: someone swapped white for black and called it done. Contrast collapses, brand colours glow too hard, and shadows vanish.",
      "## Name colours by job, not by hue",
      "Define tokens like surface, surface-raised, text, text-muted, border, accent and danger. Components only ever use those names. Each theme then maps the names to real values.",
      "## Lift surfaces with lightness, not shadow",
      "In light themes, raised things cast shadows. In dark themes, shadows barely show, so raise elements by making their surface slightly lighter instead.",
      "## Tone down saturated brand colours",
      "A vivid brand colour that works on white often vibrates on near-black. Keep the hue, reduce saturation a little and raise lightness until text on it passes contrast.",
      "## Test with real content",
      "- Check body text at 4.5:1 contrast or better in both themes.",
      "- Look at charts and illustrations, which often hard-code colours.",
      "- View the dark theme at low screen brightness, the way people actually use it at night.",
    ],
  },
  {
    type: "article",
    slug: "blender-first-week-roadmap",
    title: "From sketch to 3D in Blender: a first-week roadmap",
    excerpt: "Blender is huge. You need about 5% of it to start. A day-by-day plan to get from nothing to a lit, rendered object.",
    disciplines: ["3d"],
    date: "2026-09-06",
    readMins: 8,
    body: [
      "Blender can model, sculpt, animate, simulate, edit video and more. That breadth is why beginners stall. The fix is to learn one narrow path end to end, then widen it.",
      "## Day 1: move around",
      "Learn to orbit, pan and zoom, select, and move, rotate and scale with G, R and S. Frame the selected object with the numpad period key. Do nothing else.",
      "## Days 2–3: model something simple",
      "Pick an object with clear shapes, like a mug or a desk lamp. Use edit mode, extrude and loop cuts. Add a Subdivision Surface modifier and watch hard shapes turn smooth.",
      "## Day 4: materials",
      "Give it a Principled BSDF material. Change base colour, roughness and metallic. Most realistic surfaces come down to getting roughness right.",
      "## Day 5: light it",
      "Delete the default light. Add one large area light as a key and a dimmer one opposite as fill. Or load an HDRI world for instant, believable light.",
      "## Days 6–7: render and share",
      "Frame a camera shot, set the render engine, and export a still. Post it. Finishing one small piece teaches more than half-finishing five ambitious ones.",
    ],
  },
  {
    type: "article",
    slug: "writing-a-case-study-people-finish",
    title: "Writing a design case study people finish reading",
    excerpt: "Hiring managers skim. Structure your case study so the skim tells the whole story and the detail rewards anyone who stays.",
    disciplines: ["ui-ux", "graphic", "brand"],
    date: "2026-08-30",
    readMins: 5,
    body: [
      "Most portfolio case studies read like a diary: first we did research, then we did wireframes. Readers want the opposite order: what changed, and how you got there.",
      "## Lead with the outcome",
      "Open with one sentence on the problem, one on what you shipped, and one on the result. If you have a number, use it. If you don't, describe the change in behaviour you saw.",
      "## Show the hard decision",
      "Every project has a moment where two good options competed. Show both, say which you chose and why. That single section shows more judgement than ten process diagrams.",
      "## Make images do the talking",
      "- Caption every image with what the reader should notice.",
      "- Show before and after side by side.",
      "- Cut anything that only proves you were busy.",
      "## End with what you'd do next",
      "A short honest note on what you'd change shows you keep thinking after the handoff, which is exactly what teams hire for.",
    ],
  },
  {
    type: "article",
    slug: "grids-are-a-decision",
    title: "Grids are a decision, not a default",
    excerpt: "Twelve columns is a starting point, not a style. How to derive a grid from your content so layouts feel intentional.",
    disciplines: ["graphic", "web"],
    date: "2026-08-22",
    readMins: 5,
    body: [
      "A 12-column grid is popular because it divides neatly into halves, thirds and quarters. That flexibility is also why so many pages built on it look alike.",
      "## Start from the content",
      "Measure your most important element first: the ideal line length of body text, the aspect ratio of your images, the width of a data table. Build columns around those, not the other way round.",
      "## Try asymmetry on purpose",
      "A 5 + 7 split or a narrow margin column for notes and captions immediately gives a page character. Asymmetric grids suit editorial content where hierarchy matters.",
      "## Let the grid break once",
      "- One image that bleeds to the edge.",
      "- One headline that ignores the column.",
      "- One pull quote in the margin.",
      "A grid is most noticeable, and most useful, at the single moment you choose to break it.",
    ],
  },
  {
    type: "article",
    slug: "scroll-animation-that-helps",
    title: "Scroll animation that helps instead of distracts",
    excerpt: "Scroll effects can guide attention or bury it. Rules for using pinning, parallax and reveals so the page still reads well.",
    disciplines: ["motion", "web"],
    date: "2026-08-15",
    readMins: 6,
    body: [
      "Scroll-driven animation ties motion to the reader's own movement, which makes it feel responsive and controllable. It's also easy to overdo, turning a page into an obstacle course.",
      "## Use scroll for storytelling, not decoration",
      "Pinning a section while content changes is great for explaining a sequence: a product assembling, a process step by step. Pinning a section just because you can makes people feel stuck.",
      "## Keep the reader in control",
      "Tie animations to scroll position (scrubbing) rather than firing long timed sequences. If someone scrolls back, the animation should reverse, not replay from the start.",
      "## Performance rules",
      "- Animate transform and opacity only.",
      "- Use one scroll loop for everything; smooth-scroll libraries should drive your scroll animations, not compete with them.",
      "- Test on a mid-range phone, not your desktop.",
      "## Always offer the calm version",
      "When reduced motion is on, skip pinning and parallax and show the content plainly. If the page doesn't work that way, the animation was carrying meaning it shouldn't.",
    ],
  },

  // ───────────────────────── Tips
  {
    type: "tip",
    slug: "figma-auto-layout-shortcut",
    title: "Add auto layout in one keystroke",
    excerpt: "Select layers in Figma and press Shift + A to wrap them in an auto layout frame.",
    disciplines: ["ui-ux", "web"],
    date: "2026-09-27",
    meta: { tool: "Figma" },
    body: [
      "1. Select the layers you want to stack.",
      "2. Press Shift + A. Figma wraps them in an auto layout frame and guesses the direction.",
      "3. Adjust gap and padding in the right panel, or drag the handles on canvas.",
      "Press Shift + A again on an auto layout frame to remove it and keep the layers.",
    ],
  },
  {
    type: "tip",
    slug: "figma-big-nudge",
    title: "Set big nudge to your spacing unit",
    excerpt: "Change Figma's Shift + arrow nudge from 10 px to 8 px so every move lands on your grid.",
    disciplines: ["ui-ux", "web"],
    date: "2026-09-22",
    meta: { tool: "Figma" },
    body: [
      "1. Open the main menu and go to Preferences, then Nudge amount.",
      "2. Set Big nudge to 8 (or whatever your spacing unit is).",
      "3. Now Shift + arrow keys move layers in steps that match your spacing scale.",
    ],
  },
  {
    type: "tip",
    slug: "blender-frame-selected",
    title: "Lost in the viewport? Frame the selection",
    excerpt: "Press numpad period in Blender to zoom straight to whatever you have selected.",
    disciplines: ["3d"],
    date: "2026-09-16",
    meta: { tool: "Blender" },
    body: [
      "1. Select the object you want to see.",
      "2. Press the period key on the numpad (View Selected). The view zooms and centres on it.",
      "3. Press Home to frame everything in the scene instead.",
      "No numpad? Use View, then Frame Selected from the viewport menu.",
    ],
  },
  {
    type: "tip",
    slug: "after-effects-easy-ease",
    title: "Instant smoothness with Easy Ease",
    excerpt: "Select keyframes in After Effects and press F9 to replace linear motion with a gentle ease.",
    disciplines: ["motion"],
    date: "2026-09-10",
    meta: { tool: "After Effects" },
    body: [
      "1. Select one or more keyframes in the timeline.",
      "2. Press F9 to apply Easy Ease. Shift + F9 eases in only; Ctrl/Cmd + Shift + F9 eases out only.",
      "3. Open the Graph Editor to shape the curve further. Steeper curve, snappier motion.",
    ],
  },
  {
    type: "tip",
    slug: "squint-test",
    title: "Check hierarchy with the squint test",
    excerpt: "Blur your eyes at the layout. Whatever you still see first is what readers will see first.",
    disciplines: ["graphic", "ui-ux", "web"],
    date: "2026-09-04",
    meta: { tool: "Any" },
    body: [
      "1. Step back from the screen and squint until the text is unreadable.",
      "2. Note the first, second and third things you notice.",
      "3. If that order isn't the order you intended, adjust size, weight or contrast until it is.",
      "For a digital version, apply a heavy blur to a screenshot and look at it for two seconds.",
    ],
  },
  {
    type: "tip",
    slug: "test-type-at-real-size",
    title: "Review type at its real size",
    excerpt: "Zoomed-in canvases lie. Check body text on the actual device before you sign off.",
    disciplines: ["graphic", "ui-ux", "brand"],
    date: "2026-08-28",
    meta: { tool: "Any" },
    body: [
      "1. Set your design tool to 100% zoom, or open a prototype on the real device.",
      "2. Hold the phone at a normal reading distance.",
      "3. If you lean in to read it, increase the size or line height.",
    ],
  },
  {
    type: "tip",
    slug: "clean-svg-exports",
    title: "Clean your SVGs before you ship them",
    excerpt: "Run exported SVGs through SVGO or SVGOMG to strip editor junk and shrink the file.",
    disciplines: ["web", "graphic"],
    date: "2026-08-20",
    meta: { tool: "SVGO" },
    body: [
      "1. Export the icon or illustration as SVG.",
      "2. Drop it into SVGOMG in the browser, or run npx svgo file.svg.",
      "3. Keep the viewBox, remove fixed width and height, and check the preview still matches.",
      "Files often shrink by half, and cleaner markup is easier to recolour with CSS.",
    ],
  },
  {
    type: "tip",
    slug: "name-layers-like-components",
    title: "Name layers the way developers will",
    excerpt: "Layer names like button/primary/hover become component and variant names. Your handoff gets easier.",
    disciplines: ["ui-ux", "web"],
    date: "2026-08-12",
    meta: { tool: "Figma" },
    body: [
      "1. Use slashes to group: button/primary, button/secondary.",
      "2. Name states after what users see: hover, pressed, disabled.",
      "3. Agree the names with your developer once, then reuse them everywhere.",
    ],
  },

  // ───────────────────────── Software
  {
    type: "software",
    slug: "figma",
    title: "Figma",
    excerpt: "Browser-based interface design with real-time collaboration, components, variables and prototyping.",
    disciplines: ["ui-ux", "web"],
    date: "2026-09-26",
    featured: true,
    meta: { maker: "Figma", platforms: "Web, macOS, Windows", pricing: "Free plan, paid plans for teams", url: "https://www.figma.com", linkLabel: "Visit figma.com" },
    body: [
      "Figma runs in the browser, so a file link is all anyone needs to view, comment or edit. That made it the default tool for product teams.",
      "## Best for",
      "- Interface design and design systems with components and variables.",
      "- Clickable prototypes for testing flows.",
      "- Working live with developers, writers and product managers in one file.",
    ],
  },
  {
    type: "software",
    slug: "blender",
    title: "Blender",
    excerpt: "Free, open-source 3D suite for modelling, sculpting, animation, rendering and compositing.",
    disciplines: ["3d", "motion"],
    date: "2026-09-20",
    meta: { maker: "Blender Foundation", platforms: "Windows, macOS, Linux", pricing: "Free and open source", url: "https://www.blender.org", linkLabel: "Visit blender.org" },
    body: [
      "Blender covers almost the whole 3D pipeline in one app, and it costs nothing. A large community means there's a tutorial for nearly anything.",
      "## Best for",
      "- Product shots and 3D illustration.",
      "- Motion graphics and short animations.",
      "- Learning 3D without paying for a licence.",
    ],
  },
  {
    type: "software",
    slug: "penpot",
    title: "Penpot",
    excerpt: "Open-source design and prototyping tool built on web standards, which you can use online or self-host.",
    disciplines: ["ui-ux", "web"],
    date: "2026-09-14",
    meta: { maker: "Kaleidos", platforms: "Web, self-hosted", pricing: "Free and open source", url: "https://penpot.app", linkLabel: "Visit penpot.app" },
    body: [
      "Penpot stores designs as open formats like SVG, CSS and HTML, which makes handoff to code more direct. Teams that need to host their own tools can run it on their own servers.",
      "## Best for",
      "- Teams that want an open-source alternative for interface design.",
      "- Organisations that need to keep design files in-house.",
    ],
  },
  {
    type: "software",
    slug: "spline",
    title: "Spline",
    excerpt: "Design interactive 3D scenes in the browser and embed them on websites without writing WebGL.",
    disciplines: ["3d", "web", "ui-ux"],
    date: "2026-09-08",
    meta: { maker: "Spline", platforms: "Web, macOS, Windows", pricing: "Free plan, paid plans", url: "https://spline.design", linkLabel: "Visit spline.design" },
    body: [
      "Spline brings 3D into a design-tool interface that feels familiar to anyone who uses Figma. Scenes can respond to hover, scroll and clicks, then be exported as embeds or code.",
      "## Best for",
      "- 3D hero sections and interactive product visuals.",
      "- Designers moving into 3D without learning a full 3D suite.",
    ],
  },
  {
    type: "software",
    slug: "rive",
    title: "Rive",
    excerpt: "Build interactive, state-driven animations that run in apps, games and websites from a tiny file.",
    disciplines: ["motion", "ui-ux", "web"],
    date: "2026-09-02",
    meta: { maker: "Rive", platforms: "Web, desktop apps", pricing: "Free plan, paid plans", url: "https://rive.app", linkLabel: "Visit rive.app" },
    body: [
      "Rive animations include state machines, so an animated character or button can react to input and switch states at runtime, not just play a loop.",
      "## Best for",
      "- Animated icons, buttons and onboarding illustrations.",
      "- Game and app UI that needs to respond to the user.",
    ],
  },
  {
    type: "software",
    slug: "framer",
    title: "Framer",
    excerpt: "Design and publish responsive websites visually, with animation, CMS and hosting built in.",
    disciplines: ["web", "ui-ux"],
    date: "2026-08-26",
    meta: { maker: "Framer", platforms: "Web, macOS", pricing: "Free plan, paid site plans", url: "https://www.framer.com", linkLabel: "Visit framer.com" },
    body: [
      "Framer lets designers go from canvas to a live website without handing off to a developer. It is strong on animation and responsive layout.",
      "## Best for",
      "- Portfolios, landing pages and marketing sites.",
      "- Designers who want to publish their own work.",
    ],
  },
  {
    type: "software",
    slug: "davinci-resolve",
    title: "DaVinci Resolve",
    excerpt: "Editing, colour grading, visual effects and audio post-production in one application, with a capable free version.",
    disciplines: ["motion"],
    date: "2026-08-18",
    meta: { maker: "Blackmagic Design", platforms: "Windows, macOS, Linux", pricing: "Free version, paid Studio version", url: "https://www.blackmagicdesign.com/products/davinciresolve", linkLabel: "Visit Blackmagic Design" },
    body: [
      "Resolve started as a colour grading tool and grew into a full post-production suite. The free version covers what most designers need for showreels and social video.",
      "## Best for",
      "- Editing portfolio reels and case study videos.",
      "- Colour grading footage to match a brand look.",
    ],
  },
  {
    type: "software",
    slug: "inkscape",
    title: "Inkscape",
    excerpt: "Free, open-source vector editor for illustration, icons, diagrams and anything that should scale cleanly.",
    disciplines: ["graphic", "brand", "web"],
    date: "2026-08-10",
    meta: { maker: "Inkscape Project", platforms: "Windows, macOS, Linux", pricing: "Free and open source", url: "https://inkscape.org", linkLabel: "Visit inkscape.org" },
    body: [
      "Inkscape works natively with SVG, so what you draw is ready for the web. It's a solid free option for logos, icons and illustration.",
      "## Best for",
      "- Vector illustration and icon sets.",
      "- Laser cutting, plotting and print work that needs clean paths.",
    ],
  },

  // ───────────────────────── AI models
  {
    type: "ai-model",
    slug: "midjourney",
    title: "Midjourney",
    excerpt: "Image generator known for strong aesthetic defaults, style control and painterly or cinematic results.",
    disciplines: ["graphic", "brand", "3d"],
    date: "2026-09-28",
    featured: true,
    meta: { maker: "Midjourney", modality: "Image, video", pricing: "Paid subscription", url: "https://www.midjourney.com", linkLabel: "Visit midjourney.com" },
    body: [
      "Midjourney tends to produce polished, stylised images with little prompting, which makes it popular for moodboards and concept art.",
      "## Good for",
      "- Moodboards and art direction exploration.",
      "- Concept art and visual storytelling.",
      "## Watch out for",
      "- A recognisable house style. Push it with your own references and heavy editing.",
    ],
  },
  {
    type: "ai-model",
    slug: "adobe-firefly",
    title: "Adobe Firefly",
    excerpt: "Adobe's generative models for images, vectors and video, built into Photoshop, Illustrator and the Firefly web app.",
    disciplines: ["graphic", "brand", "motion"],
    date: "2026-09-21",
    meta: { maker: "Adobe", modality: "Image, vector, video", pricing: "Free tier, included with Adobe plans", url: "https://firefly.adobe.com", linkLabel: "Visit Firefly" },
    body: [
      "Firefly's biggest advantage is where it lives: inside the Adobe apps many designers already use, for tasks like extending a photo or filling a selection.",
      "## Good for",
      "- Generative fill and expand in Photoshop.",
      "- Quick vector ideas in Illustrator.",
    ],
  },
  {
    type: "ai-model",
    slug: "flux",
    title: "FLUX",
    excerpt: "Family of image models from Black Forest Labs, with strong prompt following and openly available versions.",
    disciplines: ["graphic", "3d", "web"],
    date: "2026-09-15",
    meta: { maker: "Black Forest Labs", modality: "Image", pricing: "Open-weight versions and paid API", url: "https://bfl.ai", linkLabel: "Visit bfl.ai" },
    body: [
      "FLUX models follow detailed prompts closely and some versions can be run locally or in tools like ComfyUI, which gives technical designers a lot of control.",
      "## Good for",
      "- Precise compositions from detailed prompts.",
      "- Custom pipelines where you control the model.",
    ],
  },
  {
    type: "ai-model",
    slug: "stable-diffusion",
    title: "Stable Diffusion",
    excerpt: "Open-weight image models from Stability AI that you can run locally and customise with your own training.",
    disciplines: ["graphic", "3d"],
    date: "2026-09-09",
    meta: { maker: "Stability AI", modality: "Image", pricing: "Open weights, licence terms vary", url: "https://stability.ai", linkLabel: "Visit stability.ai" },
    body: [
      "Stable Diffusion's open ecosystem means thousands of community fine-tunes, control tools and interfaces. It rewards people willing to tinker.",
      "## Good for",
      "- Running image generation on your own hardware.",
      "- Training a model on a consistent style or product.",
    ],
  },
  {
    type: "ai-model",
    slug: "runway",
    title: "Runway",
    excerpt: "AI video generation and editing tools for turning text, images or footage into short clips.",
    disciplines: ["motion"],
    date: "2026-09-03",
    meta: { maker: "Runway", modality: "Video, image", pricing: "Free tier, paid plans", url: "https://runwayml.com", linkLabel: "Visit runwayml.com" },
    body: [
      "Runway combines video generation with practical editing tools like background removal and motion tracking, all in the browser.",
      "## Good for",
      "- Animatics and motion concepts before a full production.",
      "- Short social clips and visual experiments.",
    ],
  },
  {
    type: "ai-model",
    slug: "ideogram",
    title: "Ideogram",
    excerpt: "Image generator that handles readable text inside images well, useful for posters and typographic concepts.",
    disciplines: ["graphic", "brand"],
    date: "2026-08-27",
    meta: { maker: "Ideogram", modality: "Image with text", pricing: "Free tier, paid plans", url: "https://ideogram.ai", linkLabel: "Visit ideogram.ai" },
    body: [
      "Many image models scramble lettering. Ideogram is built to place words correctly, which makes it handy for poster, packaging and logo-style explorations.",
      "## Good for",
      "- Typographic poster concepts.",
      "- Quick packaging and signage mock ideas.",
    ],
  },
  {
    type: "ai-model",
    slug: "recraft",
    title: "Recraft",
    excerpt: "Generates vector graphics and brand-consistent images, with style sets you can reuse across a project.",
    disciplines: ["brand", "graphic", "web"],
    date: "2026-08-19",
    meta: { maker: "Recraft", modality: "Vector, image", pricing: "Free tier, paid plans", url: "https://www.recraft.ai", linkLabel: "Visit recraft.ai" },
    body: [
      "Recraft focuses on output designers can use directly: editable vectors, icons and illustrations that stay in one consistent style.",
      "## Good for",
      "- Icon sets and spot illustrations in a single style.",
      "- SVG output you can edit in a vector tool.",
    ],
  },
  {
    type: "ai-model",
    slug: "meshy",
    title: "Meshy",
    excerpt: "Turns text prompts or images into textured 3D models you can export to Blender, game engines and more.",
    disciplines: ["3d"],
    date: "2026-08-11",
    meta: { maker: "Meshy", modality: "3D models", pricing: "Free tier, paid plans", url: "https://www.meshy.ai", linkLabel: "Visit meshy.ai" },
    body: [
      "Meshy is useful for blocking out 3D props fast. Expect to clean up topology and materials before anything goes into production.",
      "## Good for",
      "- Placeholder and background props.",
      "- Quick 3D concepts from sketches or images.",
    ],
  },

  // ───────────────────────── Video channels
  {
    type: "video",
    slug: "blender-guru",
    title: "Blender Guru",
    excerpt: "Andrew Price's channel, home of the famous beginner donut series and clear lessons on realism and lighting.",
    disciplines: ["3d"],
    date: "2026-09-25",
    meta: { handle: "@blenderguru", url: "https://www.youtube.com/@blenderguru", linkLabel: "Watch on YouTube" },
    body: ["If you're starting Blender, the beginner donut series is a rite of passage. It walks through modelling, materials, lighting and rendering in one project."],
  },
  {
    type: "video",
    slug: "the-futur",
    title: "The Futur",
    excerpt: "Brand strategy, logo design, pricing and the business side of being a designer.",
    disciplines: ["brand", "graphic"],
    date: "2026-09-19",
    meta: { handle: "@thefutur", url: "https://www.youtube.com/@thefutur", linkLabel: "Watch on YouTube" },
    body: ["Strong on the conversations designers often avoid: pricing, clients and positioning, alongside practical branding and typography lessons."],
  },
  {
    type: "video",
    slug: "school-of-motion",
    title: "School of Motion",
    excerpt: "Motion design principles, After Effects and Cinema 4D techniques, and interviews with working artists.",
    disciplines: ["motion"],
    date: "2026-09-13",
    meta: { handle: "@SchoolofMotion", url: "https://www.youtube.com/@SchoolofMotion", linkLabel: "Watch on YouTube" },
    body: ["A good place to learn animation fundamentals like timing and spacing before diving into tool-specific tricks."],
  },
  {
    type: "video",
    slug: "flux-academy",
    title: "Flux Academy",
    excerpt: "Web design process, layout, typography and building sites in no-code tools.",
    disciplines: ["web", "ui-ux"],
    date: "2026-09-07",
    meta: { handle: "@FluxAcademy", url: "https://www.youtube.com/@FluxAcademy", linkLabel: "Watch on YouTube" },
    body: ["Useful for freelancers: website design walkthroughs, critiques and advice on running a web design business."],
  },
  {
    type: "video",
    slug: "figma-channel",
    title: "Figma",
    excerpt: "Official feature walkthroughs, Config talks and tutorials on components, variables and prototyping.",
    disciplines: ["ui-ux", "web"],
    date: "2026-08-31",
    meta: { handle: "@Figma", url: "https://www.youtube.com/@Figma", linkLabel: "Watch on YouTube" },
    body: ["The quickest way to see how new Figma features are meant to be used, straight from the team that builds them."],
  },
  {
    type: "video",
    slug: "designcourse",
    title: "DesignCourse",
    excerpt: "UI design and front-end development side by side, with frequent design critiques and live redesigns.",
    disciplines: ["ui-ux", "web"],
    date: "2026-08-24",
    meta: { handle: "@DesignCourse", url: "https://www.youtube.com/@DesignCourse", linkLabel: "Watch on YouTube" },
    body: ["Good for designers who want to understand code, and developers who want a better eye for layout and visual polish."],
  },
];

/** Everything written in-house carries Barry's byline. */
export const ITEMS: Item[] = RAW_ITEMS.map((raw) => {
  const p = PATCHES[raw.slug];
  const i = p ? { ...raw, date: p.date ?? raw.date, body: [...(raw.body ?? []), ...p.appendBody], sources: [...(raw.sources ?? []), ...p.sources] } : raw;
  return i.type === "article" || i.type === "news" ? { ...i, author: i.author ?? "barry" } : i;
});

export const byDate = (a: Item, b: Item) => b.date.localeCompare(a.date);
export const itemsOfType = (t: TypeKey) => ITEMS.filter((i) => i.type === t).sort(byDate);
export const itemsOfDiscipline = (d: DisciplineKey) => ITEMS.filter((i) => i.disciplines.includes(d)).sort(byDate);
export const latest = (n: number, exclude: TypeKey[] = []) =>
  ITEMS.filter((i) => !exclude.includes(i.type)).sort(byDate).slice(0, n);
export const itemHref = (i: Item) => `/${typeByKey(i.type).route}/${i.slug}/`;
export const findItem = (route: string, slug: string) => {
  const t = typeByRoute(route);
  return t ? ITEMS.find((i) => i.type === t.key && i.slug === slug) : undefined;
};

export const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
