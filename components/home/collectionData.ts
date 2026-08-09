export interface Collection {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  label: string;
  className: string;
  glowClass: string;
}

export const collections: Collection[] = [
  {
    id: "cosmic",
    eyebrow: "01 / COLLECTION",
    title: "COSMIC",
    description:
      "Futuristic silhouettes designed for those who move beyond the ordinary.",
    label: "Explore collection",
    className:
      "bg-[radial-gradient(circle_at_70%_35%,rgba(124,58,237,0.42),transparent_32%),linear-gradient(135deg,#160b2d,#07050d)]",
    glowClass: "bg-violet-500/20",
  },

  {
    id: "essentials",
    eyebrow: "02 / COLLECTION",
    title: "ESSENTIALS",
    description:
      "Minimal streetwear. Clean forms. Everyday pieces built around the DotVerse identity.",
    label: "Explore collection",
    className:
      "bg-[radial-gradient(circle_at_30%_70%,rgba(168,85,247,0.32),transparent_30%),linear-gradient(135deg,#10091d,#05040a)]",
    glowClass: "bg-purple-500/20",
  },

  {
    id: "signature",
    eyebrow: "03 / COLLECTION",
    title: "SIGNATURE",
    description:
      "The original DotVerse language — bold, experimental and unmistakably .Dot.",
    label: "Explore collection",
    className:
      "bg-[radial-gradient(circle_at_65%_60%,rgba(99,102,241,0.35),transparent_30%),linear-gradient(135deg,#0d0a1b,#040309)]",
    glowClass: "bg-indigo-500/20",
  },
];