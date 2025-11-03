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
  const [favorites, setFavorites] = useState(new Set<string>());
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Fetch list from backend/DB - only admin-published books (is_admin = 1)
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/storybooks", { cache: "no-store" });
        
        if (!res.ok) {
          console.error(`API Error: ${res.status} ${res.statusText}`);
          if (active) {
            setStories([]);
            setLoading(false);
          }
          return;
        }
        
        const data = await res.json();
        
        // Check for error response
        if (data.error) {
          console.error("API Error:", data.error);
          if (active) {
            setStories([]);
            setLoading(false);
          }
        } else {
          // Expect data as array of StoryItem-like objects
          if (active) {
            setStories(Array.isArray(data) ? data : []);
            setLoading(false);
          }
        }
      } catch (error: any) {
        console.error("Fetch Error:", error?.message || error);
        if (active) {
          setStories([]);
          setLoading(false);
        }
      }
    })();
    return () => { active = false; };
  }, []);

  // simplified card visuals; difficulty/metrics removed

  const filtered = stories; // all items from DB, no client filters

  // resolve thumbnails from bookcontent json (if provided)
  useEffect(() => {
    if (stories.length === 0) return;
    
    let active = true;
    (async () => {
      const map: Record<string, string> = {};
      const needFetch: StoryItem[] = [];
      
      for (const s of stories) {
        const cover = s?.data?.coverImage || s?.data?.images?.[0];
        if (cover) {
          map[s.id] = cover;
        } else if (s.bookcontent) {
          needFetch.push(s);
        }
      }
      
      if (needFetch.length > 0) {
        const entries = await Promise.allSettled(
          needFetch.map(async (s) => {
            try {
              // Check if bookcontent is a valid URL or path
              if (!s.bookcontent || (!s.bookcontent.startsWith('http') && !s.bookcontent.startsWith('/'))) {
                return [s.id, ""] as const;
              }
              
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
              
              try {
                const res = await fetch(s.bookcontent, { 
                  cache: "force-cache",
                  signal: controller.signal
                });
                
                clearTimeout(timeoutId);
                
                if (!res.ok) {
                  console.warn(`Failed to fetch bookcontent for ${s.id}: ${res.status}`);
                  return [s.id, ""] as const;
                }
                
                const json = await res.json();
                const cover: string = json.coverImage || json.images?.[0] || "";
                return [s.id, cover] as const;
              } catch (fetchError: any) {
                clearTimeout(timeoutId);
                throw fetchError;
              }
            } catch (error: any) {
              // Silently fail for individual image fetches
              if (error?.name !== 'AbortError') {
                console.warn(`Error fetching bookcontent for ${s.id}:`, error?.message || error);
              }
              return [s.id, ""] as const;
            }
          })
        );
        
        for (const r of entries) {
          if (r.status === "fulfilled" && active) {
            const [id, url] = r.value;
            if (url) map[id] = url;
          }
        }
      }
      
      if (active) setThumbs(map);
    })();
    
    return () => { active = false; };
  }, [stories]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40 dark:from-background dark:to-slate-900">
      {/* Hero */}
      <section className="relative border-b bg-background/80 backdrop-blur">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/20 via-fuchsia-300/10 to-sky-300/20 blur-3xl dark:from-indigo-900/20 dark:via-fuchsia-900/10 dark:to-sky-900/20" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-300/20 via-purple-300/10 to-indigo-300/20 blur-3xl dark:from-sky-900/20 dark:via-purple-900/10 dark:to-indigo-900/20" />
        </div>
        <div className="container px-4 md:px-6 py-12">
          <div className="max-w-6xl mx-auto text-center space-y-4">
            <motion.h1 initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5}} className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-sky-400">Story Book Plaza</motion.h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto">Browse a curated collection of AI storybooks. Read, enjoy, and get inspired to create your own.</p>
          </div>
        </div>
      </section>

      {/* Search/Filter removed per request; list comes from database */}

      {/* Categories removed per request */}

      <section className="py-10">
        <div className="container px-4 md:px-6 max-w-6xl mx-auto">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {loading && (
              <div className="col-span-full text-center text-muted-foreground py-12">Loading...</div>
            )}
            {filtered.map((s, i) => {
              const displayTitle = (s.title || "").trim()
                || (s as any)?.data?.title?.trim()
                || (s as any)?.data?.meta?.title?.trim()
                || (s as any)?.data?.storybook?.title?.trim()
                || (s as any)?.data?.storybook?.meta?.title?.trim()
                || "Untitled";
              const slugOrId = (s as any).slug || s.id;
              return (
              <motion.div key={s.id} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.5, delay:i*0.1}}>
                <Card className={`group h-full overflow-hidden border-0 bg-white/80 dark:bg-slate-900/70 backdrop-blur-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${s.featured ? 'ring-2 ring-primary' : ''}`}>
                  {s.featured && (
                    <div className="absolute -top-2 -right-2 z-10"><Badge className="bg-primary text-primary-foreground shadow">Featured</Badge></div>
                  )}
                  <div className="relative">
                    <div className="aspect-[2/3] w-full bg-muted/70 dark:bg-slate-800/60 overflow-hidden relative">
                      {thumbs[s.id] && !imageErrors.has(s.id) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img 
                          src={thumbs[s.id]} 
                          alt={`${displayTitle} - AI-generated storybook cover image from Story AI Create Story Book`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                          loading="lazy"
                          onError={() => {
                            // Mark image as failed
                            setImageErrors(prev => new Set(prev).add(s.id));
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                          <span className="text-4xl mb-2">{s.icon}</span>
                          <span className="text-sm">No Image</span>
                        </div>
                      )}
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-3 flex items-center justify-between bg-gradient-to-t from-black/40 to-transparent">
                      <div className="flex items-center gap-2">
                        <Button variant="secondary" size="sm" onClick={()=>router.push(`/story-book/${slugOrId}`)} className="backdrop-blur bg-white/85">
                          <Eye className="h-4 w-4 mr-1" />Read
                        </Button>
                        <Button size="sm" onClick={()=>router.push('/create-story-book')} className="backdrop-blur bg-primary text-primary-foreground shadow">
                          <Wand2 className="h-4 w-4 mr-1" />Create
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" onClick={()=>toggleFavorite(s.id)} className="hover:bg-white/20">
                        <Heart className={`h-4 w-4 ${favorites.has(s.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-4">
                    <CardTitle className="line-clamp-1">{displayTitle}</CardTitle>
                  </CardHeader>
                </Card>
              </motion.div>
            );})}
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


