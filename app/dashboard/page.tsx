"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { motion } from "framer-motion";

interface StoryBook {
  id: string;
  title: string;
  slug?: string;
  bookcontent?: string;
  data?: {
    coverImage?: string;
    images?: string[];
  };
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [storybooks, setStorybooks] = useState<StoryBook[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  // Fetch user's storybooks
  useEffect(() => {
    if (!user && !loading) {
      router.push('/sign-in');
      return;
    }

    if (!user) return;

    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/storybooks/mine", { cache: "no-store" });
        
        if (!res.ok) {
          console.error(`API Error: ${res.status} ${res.statusText}`);
          if (active) {
            setStorybooks([]);
            setLoadingStories(false);
          }
          return;
        }
        
        const data = await res.json();
        
        if (active) {
          setStorybooks(Array.isArray(data) ? data : []);
          setLoadingStories(false);
        }
      } catch (error: any) {
        console.error("Fetch Error:", error?.message || error);
        if (active) {
          setStorybooks([]);
          setLoadingStories(false);
        }
      }
    })();
    return () => { active = false; };
  }, [user, loading, router]);

  // Resolve cover images
  useEffect(() => {
    if (storybooks.length === 0) return;
    
    let active = true;
    (async () => {
      const map: Record<string, string> = {};
      
      for (const book of storybooks) {
        // Try data.coverImage or data.images[0] first
        const cover = book?.data?.coverImage || book?.data?.images?.[0];
        if (cover) {
          map[book.id] = cover;
        } else if (book.bookcontent) {
          // Try fetching from bookcontent JSON
          try {
            if (!book.bookcontent || (!book.bookcontent.startsWith('http') && !book.bookcontent.startsWith('/'))) {
              continue;
            }
            
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            try {
              const res = await fetch(book.bookcontent, { 
                cache: "force-cache",
                signal: controller.signal
              });
              
              clearTimeout(timeoutId);
              
              if (!res.ok) {
                continue;
              }
              
              const json = await res.json();
              const coverUrl: string = json.coverImage || json.images?.[0] || "";
              if (coverUrl) {
                map[book.id] = coverUrl;
              }
            } catch (fetchError: any) {
              clearTimeout(timeoutId);
              // Silently fail
            }
          } catch (error) {
            // Silently fail
          }
        }
      }
      
      if (active) {
        setThumbs(map);
      }
    })();
    return () => { active = false; };
  }, [storybooks]);

  if (loading || loadingStories) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your stories...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleBookClick = (book: StoryBook) => {
    if (book.slug) {
      router.push(`/story-book/${encodeURIComponent(book.slug)}`);
    } else {
      router.push(`/story-book/${book.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container px-4 md:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">My Stories</h1>
          
          {storybooks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">You haven't created any stories yet.</p>
              <button
                onClick={() => router.push('/create-story-book')}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Your First Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
              {storybooks.map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="cursor-pointer group"
                  onClick={() => handleBookClick(book)}
                >
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-muted mb-2 group-hover:shadow-lg transition-shadow">
                    {thumbs[book.id] ? (
                      <img
                        src={thumbs[book.id]}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          // Hide broken image
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-center line-clamp-2 group-hover:text-primary transition-colors">
                    {book.title || "Untitled"}
                  </h3>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
