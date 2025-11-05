"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AiStoryBook from "@/components/book/AiStoryBook";
import { 
  ArrowLeft, 
  BookOpen, 
  Sparkles, 
  Loader2, 
  Heart, 
  Share2,
  Wand2,
  BookText,
  ImageIcon
} from "lucide-react";

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
  const slug = String(params?.slug || "");
  const [data, setData] = useState<SB | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookInfo, setBookInfo] = useState<{
    title?: string;
    description?: string;
    icon?: string;
    featured?: boolean;
  } | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const boxRef = useRef<HTMLDivElement | null>(null);
  const [boxW, setBoxW] = useState<number>(0);
  const [boxH, setBoxH] = useState<number>(0);

  useEffect(() => {
    let active = true;
    if (!slug) {
      setLoading(false);
      setError("No story identifier provided");
      return;
    }
    
    setLoading(true);
    setError(null);
    setData(null);
    
    (async () => {
      try {
        const metaRes = await fetch(`/api/storybooks/${slug}`, { cache: "no-store" });
        
        if (!metaRes.ok) {
          const errorText = metaRes.status === 404 
            ? "Story not found" 
            : `Error ${metaRes.status}: ${metaRes.statusText}`;
          console.error(`API Error: ${errorText}`);
          if (active) {
            setError(errorText);
            setLoading(false);
          }
          return;
        }
        
        const meta = await metaRes.json();
        
        if (meta.error) {
          console.error("API Error:", meta.error);
          if (active) {
            setError(meta.error);
            setLoading(false);
          }
          return;
        }
        
        if (active) {
          setBookInfo({
            title: meta.title,
            description: meta.description,
            icon: meta.icon,
            featured: meta.featured,
          });
        }

        const path = meta?.bookcontent || idToPath[slug];
        
        if (meta?.data) {
          if (active) {
            setData(meta.data as SB);
            setLoading(false);
          }
          return;
        }
        
        if (path) {
          try {
            const res = await fetch(path, { cache: "no-store" });
            if (!res.ok) {
              console.error(`Failed to fetch bookcontent: ${res.status}`);
              if (active) {
                setError("Failed to load story content");
                setLoading(false);
              }
              return;
            }
            const j = await res.json();
            if (active) {
              setData(j);
              setLoading(false);
            }
          } catch (fetchError) {
            console.error("Failed to fetch bookcontent:", fetchError);
            if (active) {
              setError("Failed to load story content");
              setLoading(false);
            }
          }
        } else {
          if (active) {
            setError("Story content not available");
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Failed to load story:", error);
        if (active) {
          setError(error.message || "Failed to load story");
          setLoading(false);
        }
      }
    })();
    
    return () => { active = false; };
  }, [slug]);

  // Responsive size
  useEffect(() => {
    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        const width = e.contentRect.width || 0;
        const height = e.contentRect.height || 0;
        setBoxW(width);
        setBoxH(height);
      }
    });
    if (boxRef.current) ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);

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

  // 计算书本尺寸，保持双页展开的比例
  const bookDimensions = useMemo(() => {
    const containerWidth = boxW || 896;
    const availableWidth = containerWidth - 40; // 减去 padding (20px * 2)
    const singlePageWidth = Math.max(280, Math.floor(availableWidth / 2));
    const singlePageHeight = Math.floor(singlePageWidth * 1.5); // 保持书本页面比例 2:3
    return { width: singlePageWidth, height: singlePageHeight };
  }, [boxW]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const shareStory = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: bookInfo?.title || data?.title || "Story",
          text: bookInfo?.description || data?.summary || "",
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast here
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Elegant Header */}
      

      {/* Main Content */}
      <main className="container px-4 md:px-6 py-8 md:py-16 max-w-7xl mx-auto">
        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center min-h-[70vh] space-y-6"
            >
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <BookOpen className="w-6 h-6 text-primary" />
                </motion.div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-foreground">Loading your story...</p>
                <p className="text-sm text-muted-foreground">Preparing the pages for you</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        <AnimatePresence>
          {!loading && error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 px-4"
            >
              <Card className="w-full max-w-lg border-2 shadow-lg">
                <CardContent className="flex flex-col items-center text-center space-y-6 p-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center"
                  >
                    <BookOpen className="w-10 h-10 text-destructive" />
                  </motion.div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold">Story Not Found</h2>
                    <p className="text-muted-foreground leading-relaxed">{error}</p>
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <Button 
                      onClick={() => router.push("/story-book")} 
                      variant="outline"
                      className="flex-1 sm:flex-none"
                      size="lg"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Browse Stories
                    </Button>
                    <Button 
                      onClick={() => router.push("/create-story-book")}
                      className="flex-1 sm:flex-none"
                      size="lg"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Create One
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Story Content */}
        <AnimatePresence>
          {!loading && !error && data && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Book Header Card */}
             

              {/* Story Book Reader - Enhanced */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-center"
              >
                <div ref={boxRef} className="w-full max-w-4xl ">
                  <Card className="overflow-hidden shadow-2xl border-2 bg-gradient-to-br from-card via-card to-primary/5 ">
                    <div
                      className="bg-gradient-to-br from-muted/30 via-background to-primary/5 flex items-center justify-center relative"
                      style={{
                        width: "100%",
                        aspectRatio: "5/3", // 双页书本展开的比例（10:6 = 5:3）
                        minHeight: "400px",
                        position: "relative",
                      }}
                    >
                      {pages.length > 0 && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            width: "100%",
                            height: "100%",
                            padding: "20px",
                            boxSizing: "border-box",
                          }}
                        >
                          <AiStoryBook
                            pages={pages}
                            width={bookDimensions.width}
                            height={bookDimensions.height}
                          />
                        </div>
                      )}
                      {pages.length === 0 && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground p-12">
                          <BookOpen className="w-20 h-20 mb-6 opacity-50" />
                          <p className="text-xl font-medium mb-2">No pages available</p>
                          <p className="text-sm">The story content is being prepared</p>
                        </div>
                      )}
                      
                      {/* Decorative Corner Elements */}
                      <div className="absolute top-4 left-4 w-16 h-16 border-t-2 border-l-2 border-primary/20 rounded-tl-lg" />
                      <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-primary/20 rounded-tr-lg" />
                      <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-primary/20 rounded-bl-lg" />
                      <div className="absolute bottom-4 right-4 w-16 h-16 border-b-2 border-r-2 border-primary/20 rounded-br-lg" />
                    </div>
                  </Card>
                </div>
              </motion.div>

              {/* Action Footer */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8"
              >
                <Button
                  variant="outline"
                  onClick={() => router.push("/story-book")}
                  className="gap-2 w-full sm:w-auto"
                  size="lg"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse More Stories
                </Button>
                <Button
                  onClick={() => router.push("/create-story-book")}
                  className="gap-2 w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  size="lg"
                >
                  <Wand2 className="w-4 h-4" />
                  Create Your Own Story
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
