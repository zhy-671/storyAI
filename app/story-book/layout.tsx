import { ReactNode } from "react";

export const metadata = {
  title: "Story Book Plaza — Story AI",
  description: "Browse curated AI storybooks created by our community.",
  alternates: {
    canonical: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/story-book",
  },
};

export default function StoryBookLayout({ children }: { children: ReactNode }) {
  return children as any;
}


