export type Author = {
  key: "barry";
  name: string;
  role: string;
  bio: string[];
  initial: string;
};

export const AUTHORS: Record<Author["key"], Author> = {
  barry: {
    key: "barry",
    name: "Barry",
    role: "Editor, DesignersDream",
    initial: "B",
    bio: [
      "Barry runs the DesignersDream news desk and writes our longer guides.",
      "He reads the design press so you don't have to, then rewrites what matters in plain words: what shipped, what changed, and whether it should change how you work. Every news story links to the outlets that reported it first.",
    ],
  },
};
