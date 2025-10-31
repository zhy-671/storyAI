import { ReactNode } from "react";

export const metadata = {
  title: "Create Story Book — Story AI",
  description: "Create AI storybooks with images and narrative in minutes.",
  alternates: {
    canonical: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/create-story-book",
  },
};

export default function CreateStoryBookLayout({ children }: { children: ReactNode }) {
  return children as any;
}


