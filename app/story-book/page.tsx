"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Wand2, Eye, Heart } from "lucide-react";

interface StoryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  featured: boolean;
  bookcontent: string;
  slug?: string;
  data?: any;
}

export default function StoryBookPlaza() {
  const router = useRouter();
  const [favorites, setFavorites] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  // Fetch list from backend/DB - only admin-published books (is_admin = 1)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/storybooks", { cache: "no-store" });
        const data = await res.json();
        
        // Check for error response
        if (data.error) {
          console.error("API Error:", data.error);
          if (active) setStories([]);
        } else {
          // Expect data as array of StoryItem-like objects
          if (active) setStories(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        if (active) setStories([]);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  // simplified card visuals; difficulty/metrics removed

  const filtered = stories; // all items from DB, no client filters

  // resolve thumbnails from bookcontent json (if provided)
  useEffect(() => {
    (async () => {
      const map: Record<string, string> = {};
      const needFetch: StoryItem[] = [];
      for (const s of stories) {
        const cover = s?.data?.coverImage || s?.data?.images?.[0];
        if (cover) map[s.id] = cover;
        else if (s.bookcontent) needFetch.push(s);
      }
      if (needFetch.length > 0) {
        const entries = await Promise.allSettled(
          needFetch.map(async (s) => {
            try {
              const res = await fetch(s.bookcontent, { cache: "force-cache" });
              const json = await res.json();
              const cover: string = json.coverImage || json.images?.[0] || "";
              return [s.id, cover] as const;
            } catch {
              return [s.id, ""] as const;
            }
          })
        );
        for (const r of entries) {
          if (r.status === "fulfilled") {
            const [id, url] = r.value;
            if (url) map[id] = url;
          }
        }
      }
      setThumbs(map);
    })();
  }, [stories]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <section className="border-b bg-background/95 backdrop-blur">
        <div className="container px-4 md:px-6 py-8">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5}} className="text-4xl font-bold">Story Book Plaza</motion.h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Browse and start from a curated set of story book ideas.</p>
          </div>
        </div>
      </section>

      {/* Search/Filter removed per request; list comes from database */}

      {/* Categories removed per request */}

      <section className="py-8">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <div className="col-span-full text-center text-muted-foreground py-12">Loading...</div>
            )}
            {filtered.map((s, i) => (
              <motion.div key={s.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5, delay:i*0.1}}>
                <Card className={`h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden ${s.featured ? 'ring-2 ring-primary' : ''}`}>
                  {s.featured && (
                    <div className="absolute -top-2 -right-2 z-10"><Badge className="bg-primary text-primary-foreground">Featured</Badge></div>
                  )}
                  <div className="relative">
                    <div className="aspect-[2/3] w-full bg-muted">
                      {thumbs[s.id] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={thumbs[s.id]} alt={s.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-2 flex items-center justify-between bg-gradient-to-t from-black/40 to-transparent">
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" onClick={()=>router.push(`/story-book/${(s as any).slug || s.id}`)} className="backdrop-blur bg-white/80">
                          <Eye className="h-4 w-4 mr-1" />Read
                        </Button>
                        <Button size="sm" onClick={()=>router.push('/create')} className="backdrop-blur bg-primary text-primary-foreground">
                          <Wand2 className="h-4 w-4 mr-1" />Create
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={()=>toggleFavorite(s.id)}>
                        <Heart className={`h-4 w-4 ${favorites.has(s.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {(!loading && filtered.length===0) && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No results</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
              <Button onClick={()=> router.refresh() }>Refresh</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}


