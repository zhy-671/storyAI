import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo to Coloring - Turn Photos into Coloring Pages | Story AI",
  description: "Convert any photo into printable coloring pages with AI. Create clean line art from your images, perfect for kids' coloring and creative activities.",
  keywords: "photo to coloring, coloring page generator, AI line art, photo to line art, printable coloring pages, kids coloring, AI coloring book",
  openGraph: {
    title: "Photo to Coloring - Turn Photos into Coloring Pages",
    description: "Use AI to convert photos into clean line art coloring pages. Perfect for kids and creative projects.",
    type: "website",
    url: "/photo-to-coloring",
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo to Coloring - AI Coloring Page Generator",
    description: "Convert photos into coloring pages in seconds. Print-ready and kid-friendly.",
  },
  alternates: {
    canonical: "/photo-to-coloring",
  },
};

export default function PhotoToColoringLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
