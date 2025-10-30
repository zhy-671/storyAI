"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import AiStoryBook from "@/components/book/AiStoryBook";

type SB = {
  title: string;
  summary?: string;
  coverImage?: string;
  pageImages?: string[];
  pages?: { image?: string; text?: string; title?: string }[];
  scenes?: string[];
};

const idToPath: Record<string, string> = {
  cat: "/samples/storybook_sample_cat.json",
  sample: "/samples/storybook_sample.json",
};

export default function StoryBookReaderPage() {
  const params = useParams();
  const router = useRouter();
  const id = String(params?.id || "sample");
  const [data, setData] = useState<SB | null>(null);
  const [bookPath, setBookPath] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const metaRes = await fetch(`/api/storybooks/${id}`, { cache: "no-store" });
        const meta = await metaRes.json();
        const path = meta?.bookcontent || idToPath[id];
        if (active) setBookPath(path);
        if (path) {
          const res = await fetch(path, { cache: "no-store" });
          const j = await res.json();
          if (active) setData(j);
        }
      } catch {}
    })();
    return () => { active = false; };
  }, [id]);

  const pages = useMemo(() => {
    if (!data) return [] as { image?: string; text?: string; title?: string }[];
    const arr: { image?: string; text?: string; title?: string }[] = [];
    arr.push({ image: data.coverImage, text: `${data.title}\n${data.summary || ""}`, title: data.title });
    if (data.pages && data.pages.length) {
      for (const p of data.pages) arr.push({ image: p.image, text: p.text, title: data.title });
    } else if (data.pageImages && data.scenes) {
      for (let i = 0; i < Math.min(data.pageImages.length, data.scenes.length); i++) {
        arr.push({ image: data.pageImages[i], text: data.scenes[i], title: data.title });
      }
    }
    return arr;
  }, [data]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container px-4 md:px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.push("/story-book")}>Back</Button>
          <div className="text-lg font-semibold text-muted-foreground">Story Book Reader</div>
          <div />
        </div>

        <div className="flex flex-col items-center">
          {data ? (
            <AiStoryBook pages={pages} width={320} height={480} />
          ) : (
            <div className="text-muted-foreground">Loading...</div>
          )}
        </div>
      </div>
    </div>
  );
}


