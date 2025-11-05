import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Comic Generator - Create Professional Comics with AI | Story AI",
  description: "Create stunning comic strips with AI. Generate unique characters, dynamic scenes, and engaging storylines effortlessly. Transform your ideas into professional comics in minutes.",
  keywords: "AI comic generator, comic creator, AI comics, comic strip generator, AI art generator, comic book creator, digital comics, AI storytelling",
  openGraph: {
    title: "AI Comic Generator - Create Professional Comics with AI",
    description: "Transform your ideas into professional comic strips with AI. Generate unique characters, dynamic scenes, and engaging storylines effortlessly.",
    type: "website",
    url: "/ai-comic-generator",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Comic Generator - Create Professional Comics",
    description: "Create stunning comic strips with AI in minutes. No artistic skills required.",
  },
  alternates: {
    canonical: "/ai-comic-generator",
  },
};

export default function AIComicGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

