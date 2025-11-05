import { Metadata } from "next";
import StoryAIContent from "@/components/story-ai/story-ai-content";

export const metadata: Metadata = {
  title: "Story AI — AI Story Generator for Novels, Children's Books & Scripts",
  description: "Story AI helps writers, educators, and creators generate high-quality stories, children's books, and scripts in minutes. Try Story AI for free — supports character design, scene prompts and multilingual output (故事 AI / AI 写故事).",
  keywords: "story ai, ai story generator, story generator, children's books, novel writing, script writing, 故事 AI, AI 写故事, 儿童故事书, story writing ai",
  openGraph: {
    title: "Story AI — AI Story Generator for Novels, Children's Books & Scripts",
    description: "Generate novels, short stories, children's storybooks, and scripts with Story AI. Export to .docx, Markdown, or EPUB-ready files. 免费试用 (故事 AI / AI 写故事).",
    type: "website",
    url: "/story-ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Story AI — AI Story Generator",
    description: "Generate novels, short stories, children's storybooks, and scripts with Story AI.",
  },
  alternates: {
    canonical: "/story-ai",
  },
};

export default function StoryAIPage() {
  return <StoryAIContent />;
}
