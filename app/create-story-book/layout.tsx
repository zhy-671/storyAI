import { ReactNode } from "react";

export const metadata = {
  title: "Create Story Books - AI Story Generator | Story AI",
  description: "Create amazing storybooks with AI. Generate personalized children's stories, fantasy adventures, and interactive narratives with our AI story generator. Start writing now!",
  alternates: {
    canonical: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000") + "/create-story-book",
  },
};

export default function CreateStoryBookLayout({ children }: { children: ReactNode }) {
  return children as any;
}


