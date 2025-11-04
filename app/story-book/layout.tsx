import { ReactNode } from "react";

export const metadata = {
  title: "Story Book Plaza - Browse AI Stories & Books | Story AI",
  description: "Discover amazing AI-generated stories and books created by our community. Browse fantasy adventures, children's stories, romance, horror & more interactive narratives.",
  alternates: {
    canonical: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/story-book",
  },
};

export default function StoryBookLayout({ children }: { children: ReactNode }) {
  return children as any;
}


