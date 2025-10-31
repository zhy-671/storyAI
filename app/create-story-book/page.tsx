"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useSubscription } from "@/hooks/use-subscription";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, ChevronLeft, ChevronRight, Maximize2, Coins } from "lucide-react";
import AiStoryBook from "@/components/book/AiStoryBook";

export default function CreatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  const { isSubscribed, credits } = useSubscription();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [storyPrompt, setStoryPrompt] = useState("");
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [showImages, setShowImages] = useState(false);
  const [storybookData, setStorybookData] = useState<any>(null);
  const [generationStatus, setGenerationStatus] = useState<string>("");
  const [currentProgress, setCurrentProgress] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSamplePath, setSelectedSamplePath] = useState<string | null>(null);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const mobileBoxRef = useRef<HTMLDivElement | null>(null);
  const desktopBoxRef = useRef<HTMLDivElement | null>(null);
  const [mobileW, setMobileW] = useState<number>(0);
  const [desktopW, setDesktopW] = useState<number>(0);

  const preloadCover = (url?: string | null) => {
    if (!url) return;
    try {
      const img = new Image();
      img.onload = () => setCoverLoaded(true);
      img.onerror = () => setCoverLoaded(false);
      img.src = url;
    } catch {}
  };

  useEffect(() => {
    const mob = new ResizeObserver((entries) => {
      for (const e of entries) {
        if (e.contentRect.width) setMobileW(e.contentRect.width);
      }
    });
    const desk = new ResizeObserver((entries) => {
      for (const e of entries) {
        if (e.contentRect.width) setDesktopW(e.contentRect.width);
      }
    });
    if (mobileBoxRef.current) mob.observe(mobileBoxRef.current);
    if (desktopBoxRef.current) desk.observe(desktopBoxRef.current);
    return () => { mob.disconnect(); desk.disconnect(); };
  }, []);

  const handleCreateStory = async () => {
    if (!storyPrompt.trim()) {
      toast({
        title: "Please enter your story",
        description: "Describe what you want to create",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to create your storybook.",
      });
      router.push("/sign-in");
      return;
    }

    try { await fetch('/api/credits', { method: 'GET' }); } catch {}

    try {
      const spend = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 3, operation: 'storybook_generation' }),
      });
      if (!spend.ok) {
        toast({ title: 'Insufficient credits', description: 'You need 3 credits to generate. Please purchase a credit pack.' });
        router.push('/credits');
        return;
      }
    } catch {
      toast({ title: 'Insufficient credits', description: 'You need 3 credits to generate. Please purchase a credit pack.' });
      router.push('/credits');
      return;
    }

    setIsGenerating(true);
    setGeneratedImages([]);
    setShowImages(false);
    setStorybookData(null);
    setGenerationStatus("Creating storybook...");
    setCurrentProgress(null);
    setCurrentPage(0);
    setCoverLoaded(false);
    
    try {
      let guestToken = localStorage.getItem("sb_guest_token");
      if (!guestToken) {
        guestToken = crypto.randomUUID();
        localStorage.setItem("sb_guest_token", guestToken);
      }
      if (selectedSamplePath) {
        await simulateFromLocalJson(selectedSamplePath);
        setSelectedSamplePath(null);
        return;
      }

      const response = await fetch('/api/storybook/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: storyPrompt,
          referenceImages: [],
          guestToken: (typeof window !== 'undefined' ? localStorage.getItem('sb_guest_token') : null)
        }),
      });

      if (!response.ok) throw new Error('Request failed');

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Unable to read response');

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.type === 'status') {
                  setGenerationStatus(parsed.step || parsed.status);
                } else if (parsed.type === 'progress') {
                  setCurrentProgress(parsed.storybook);
                  setStorybookData(parsed.storybook);
                  setGeneratedImages(parsed.storybook.images || []);
                  setShowImages(true);
                  if (!coverLoaded && parsed.storybook.coverImage) preloadCover(parsed.storybook.coverImage);
                  const newPageCount = parsed.storybook.currentImageCount || 0;
                  setCurrentPage(newPageCount - 1);
                } else if (parsed.type === 'complete') {
                  const storybook = parsed.storybook;
                  if (storybook.images && storybook.images.length > 0) {
                    setGeneratedImages(storybook.images);
                    setStorybookData(storybook);
                    setShowImages(true);
                    preloadCover(storybook.coverImage);
                  }
                  setIsGenerating(false);
                  toast({ title: "Storybook created!", description: `"${storybook.title}" has been generated` });
                  try {
                    await fetch('/api/storybooks', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        storybook,
                        guestToken,
                        meta: { title: storybook.title, description: storybook.summary, icon: '📖', featured: false }
                      })
                    });
                  } catch {}
                } else if (parsed.type === 'error') {
                  throw new Error(parsed.error);
                }
              } catch {}
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      toast({ title: "Generation failed", description: "Please try again later" });
    } finally {
      setIsGenerating(false);
    }
  };

  const quickPrompts = [
    "Star Lamp in the Ruins",
    "A brave kitten explores the forest",
    "A warm story about friendship and kindness",
    "A little dinosaur learns a new skill"
  ];

  const simulateFromLocalJson = async (path: string) => {
    setIsGenerating(true);
    setGeneratedImages([]);
    setShowImages(false);
    setStorybookData(null);
    setGenerationStatus("Creating storybook...");
    setCurrentProgress(null);
    setCurrentPage(0);

    try {
      const res = await fetch(path, { cache: 'no-store' });
      const sample = await res.json();
      preloadCover(sample.coverImage);
      setGenerationStatus("Story content ready, drawing the cover...");
      const coverOnly = {
        ...sample,
        images: [sample.coverImage],
        pageImages: [],
        pages: (sample.pages || []).map((p: any) => ({ ...p, image: "" })),
        currentImageCount: 1,
        totalImages: (sample.pages?.length || 0) + 1,
      };
      setCurrentProgress(coverOnly);
      setStorybookData(coverOnly);
      setGeneratedImages([sample.coverImage]);
      setShowImages(true);
      setGenerationStatus("Cover finished, start drawing page 1...");
      for (let i = 0; i < (sample.pages?.length || 0); i++) {
        // eslint-disable-next-line no-await-in-loop
        await new Promise(r => setTimeout(r, 300));
        const next = {
          ...sample,
          images: [sample.coverImage, ...sample.pageImages.slice(0, i + 1)],
          coverImage: sample.coverImage,
          pageImages: sample.pageImages.slice(0, i + 1),
          pages: (sample.pages || []).map((p: any, idx: number) => ({
            ...p,
            image: idx <= i ? sample.pageImages[idx] : "",
          })),
          currentImageCount: i + 2,
          totalImages: (sample.pages?.length || 0) + 1,
        };
        setCurrentProgress(next);
        setStorybookData(next);
        setGeneratedImages(next.images);
        setGenerationStatus(i < (sample.pages.length - 1) ? `Page ${i + 1} done, start drawing page ${i + 2}...` : "All illustrations done, finishing touches...");
        setCurrentPage(i + 1);
      }
      setIsGenerating(false);
      setGenerationStatus("Creation completed");
    } catch (e) {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setStoryPrompt(prompt);
    const isCat = /(cat|kitten|kitty)/i.test(prompt);
    const isRuinsStar = /(ruins|star\s?lamp|stars?)/i.test(prompt);
    if (isCat) {
      setSelectedSamplePath('/samples/storybook_sample_cat.json');
    } else if (isRuinsStar) {
      setSelectedSamplePath('/samples/storybook_sample.json');
    } else {
      setSelectedSamplePath('/samples/storybook_sample.json');
    }
  };

  const totalPages = storybookData ? ((storybookData.pages?.length || storybookData.scenes?.length || 0) + 1) : 0;

  const handleNextPage = () => { setCurrentPage((p) => Math.min(totalPages - 1, p + 1)); };
  const handlePrevPage = () => { setCurrentPage((p) => Math.max(0, p - 1)); };

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 40;
  const onTouchStart = (e: React.TouchEvent) => { setTouchStartX(e.touches[0].clientX); setTouchEndX(null); };
  const onTouchMove = (e: React.TouchEvent) => { setTouchEndX(e.touches[0].clientX); };
  const onTouchEnd = () => {
    if (touchStartX == null || touchEndX == null) return;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) handleNextPage(); else handlePrevPage();
  };

  const page = (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-sky-50 to-fuchsia-50 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-900">
      {/* Background Decorations */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-300/40 via-fuchsia-300/30 to-sky-300/40 blur-3xl dark:from-indigo-900/30 dark:via-fuchsia-900/20 dark:to-sky-900/30" />
        <div className="absolute -bottom-28 -right-28 h-96 w-96 rounded-full bg-gradient-to-tr from-sky-300/40 via-purple-300/30 to-indigo-300/40 blur-3xl dark:from-sky-900/30 dark:via-purple-900/20 dark:to-indigo-900/30" />
        <div className="absolute inset-x-0 top-1/3 h-24 bg-gradient-to-r from-transparent via-indigo-200/30 to-transparent dark:via-indigo-800/20" />
      </div>

      {/* Hero */}
      <div className="container px-5 pt-10 pb-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-sky-400">
            Create Your AI Storybook
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 dark:text-gray-300">
            Describe your idea, and we’ll write and illustrate a beautiful book for you.
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className={`grid gap-[20px] justify-items-center ${(currentProgress?.currentImageCount || 0) > 0 ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
        {/* Left Panel */}
        <div className="space-y-6 w-full max-w-xl mx-auto place-self-center justify-self-center">
          {(isGenerating || storybookData) && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  {isGenerating ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Generating storybook</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{generationStatus}</p>
                        </div>
                      </div>
                      {currentProgress && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                            <span>Progress</span>
                            <span>{currentProgress.currentImageCount || 0} / {currentProgress.totalImages || 0}</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${((currentProgress.currentImageCount || 0) / (currentProgress.totalImages || 1)) * 100}%` }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : storybookData ? (
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Creation complete!</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">"{storybookData.title}" has been generated</p>
                      </div>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Mobile Preview */}
          {storybookData && currentProgress && (currentProgress.currentImageCount || 0) > 0 && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="lg:hidden">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{storybookData.title}</h2>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm"><Maximize2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}><ChevronLeft className="h-4 w-4" /></Button>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{currentPage === 0 ? 'Cover' : `Page ${currentPage}`}</span>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage >= totalPages - 1}><ChevronRight className="h-4 w-4" /></Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div ref={mobileBoxRef} className="mx-auto w-full">
                    <div style={{ width: '100%', height: Math.round((mobileW || 300) * 1.5) }}>
                      <AiStoryBook
                        pages={[
                          { image: storybookData.coverImage, text: `${storybookData.title}\n${storybookData.summary}`, bg: "#fff" },
                          ...((storybookData.pages || []).map((p: any) => ({ image: p.image, text: p.text, bg: "#fff" })))
                        ]}
                        width={mobileW || 300}
                        height={Math.round((mobileW || 300) * 1.5)}
                      />
                    </div>
                  </div>
                  <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-300">Page {currentPage + 1} / {totalPages}</div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Input Card */}
          <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="text-center pb-6">
              <div className="text-6xl mb-4">📚</div>
              <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">Start your story</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <label className="text-lg font-semibold text-gray-900 dark:text-white">Story description</label>
                <textarea
                  value={storyPrompt}
                  onChange={(e) => setStoryPrompt(e.target.value)}
                  placeholder="e.g. a rabbit who learns to share, or a brave kitten exploring a forest..."
                  className="w-full h-32 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                />
              </div>
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick start (click to choose):</label>
                <div className="grid gap-2 sm:grid-cols-2">
                  {quickPrompts.map((prompt, index) => (
                    <Button key={index} variant="outline" size="sm" onClick={() => handleQuickPrompt(prompt)} className="text-left justify-start h-auto p-3 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200">
                      <Wand2 className="h-4 w-4 mr-2 text-blue-500" />
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="text-center pt-4">
                <Button onClick={handleCreateStory} disabled={isGenerating || !storyPrompt.trim()} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" size="lg">
                  {isGenerating ? (<><Wand2 className="h-6 w-6 mr-3 animate-spin" />Generating...</>) : (<><Wand2 className="h-6 w-6 mr-3" />Start creating{user && (<span className="ml-3 inline-flex items-center gap-1 text-xs font-semibold bg-white/15 dark:bg-white/10 text-white px-2 py-1 rounded-md"><Coins className="w-4 h-4" />3 </span>)}</>)}
                </Button>
              </div>
              {/* Disclaimer */}
              <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
              Disclaimer: The content on this page is automatically generated by AI based on your description and may contain inaccuracies or inappropriate content. It does not represent the platform's position.

Please verify and edit the content yourself before publishing or sharing, and filter and polish the content if necessary.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel */}
        {storybookData && currentProgress && currentProgress.currentImageCount > 0 && (
          <div className="hidden lg:block space-y-6 w-full">
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{storybookData.title}</h2>
                  <div className="flex items-center gap-2"></div>
                </div>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.max(0, currentPage - 1))} disabled={currentPage === 0}><ChevronLeft className="h-4 w-4" /></Button>
                  <span className="text-sm text-gray-600 dark:text-gray-300">{currentPage === 0 ? 'Cover' : `Page ${currentPage}`}</span>
                  <Button variant="outline" size="sm" onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))} disabled={currentPage >= totalPages - 1}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </CardHeader>
              <CardContent>
                <div ref={desktopBoxRef} className="mx-auto w-full">
                  <div style={{ width: '100%', height: Math.round((desktopW || 320) * 1.5) }}>
                    <AiStoryBook
                      pages={[
                        { image: storybookData.coverImage, text: `${storybookData.title}\n${storybookData.summary}`, bg: "#fff" },
                        ...((storybookData.pages || []).map((p: any) => ({ image: p.image, text: p.text, bg: "#fff" })))
                      ]}
                      width={desktopW || 320}
                      height={Math.round((desktopW || 320) * 1.5)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* SEO Bottom Section */}
      <section className="relative max-w-5xl mx-auto px-6 py-14 my-8 rounded-3xl border border-gray-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.08)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
        <div className="absolute inset-x-6 -top-1 h-1 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-sky-500" />
        <div className="relative">
          <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-fuchsia-600 to-sky-600 dark:from-indigo-400 dark:via-fuchsia-400 dark:to-sky-400">About Story AI Story Creation</h2>
          <p>Story AI Create Story Book lets you bring your imagination to life through intelligent storytelling. With just a few words, you can create illustrated storybooks that feel personal and alive — powered by AI. Every story you generate is unique, beautifully written, and ready to share.</p>
          <p className="mt-3">Our AI story creator understands tone, emotion, and theme, helping writers, teachers, and creators explore new worlds effortlessly. Whether you're crafting bedtime tales, fantasy journeys, or short visual stories, Story AI makes creativity simple and joyful.</p>
          <p className="mt-3">Start writing your next story today and discover how artificial intelligence can turn ideas into stories worth remembering.</p>
        </div>
      </section>
    </div>
  );

  return page;
}
