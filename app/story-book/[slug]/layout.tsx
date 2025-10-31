import { ReactNode } from "react";

export async function generateMetadata(props: any) {
  const maybeParams = props?.params;
  const resolvedParams = (maybeParams && typeof maybeParams.then === 'function') ? await maybeParams : maybeParams;
  const slug = resolvedParams?.slug as string;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = `${base}/story-book/${encodeURIComponent(slug || "")}`;
  try {
    const res = await fetch(`${base}/api/storybooks/${encodeURIComponent(slug || "")}`, { cache: "no-store" });
    if (!res.ok) throw new Error("not ok");
    const data = await res.json();
    const title = data?.title || data?.data?.title || "Story";
    const description = data?.description || data?.data?.summary || "Read AI-generated storybook.";
    const image = data?.data?.coverImage || data?.coverImage || data?.images?.[0];
    return {
      title: `${title} — Story AI`,
      description,
      alternates: { canonical: url },
      openGraph: {
        title: `${title} — Story AI`,
        description,
        url,
        type: "article",
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: image ? "summary_large_image" : "summary",
        title: `${title} — Story AI`,
        description,
        images: image ? [image] : undefined,
      },
    } as any;
  } catch {
    return { title: "Story — Story AI", alternates: { canonical: url } } as any;
  }
}

export default function StoryLayout({ children }: { children: ReactNode }) {
  return children as any;
}


