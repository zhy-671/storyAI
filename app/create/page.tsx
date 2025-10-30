"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, ArrowLeft, ChevronLeft, ChevronRight, Maximize2, RotateCcw } from "lucide-react";
import AiStoryBook from "@/components/book/AiStoryBook";

export default function CreatePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  
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

    setIsGenerating(true);
    setGeneratedImages([]);
    setShowImages(false);
    setStorybookData(null);
    setGenerationStatus("Creating storybook...");
    setCurrentProgress(null);
    setCurrentPage(0);
    setCoverLoaded(false);
    
    try {
      // ensure guest token
      let guestToken = localStorage.getItem("sb_guest_token");
      if (!guestToken) {
        guestToken = crypto.randomUUID();
        localStorage.setItem("sb_guest_token", guestToken);
      }
      // 如果选择了默认提示语（本地样本），优先用本地JSON模拟
      if (selectedSamplePath) {
        await simulateFromLocalJson(selectedSamplePath);
        setSelectedSamplePath(null);
        return;
      }

      // 使用流式API
      const response = await fetch('/api/storybook/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: storyPrompt,
          referenceImages: []
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to read response');
      }

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
                  // 处理进度更新
                  setCurrentProgress(parsed.storybook);
                  setStorybookData(parsed.storybook);
                  setGeneratedImages(parsed.storybook.images || []);
                  setShowImages(true);
                  // 预加载封面，仅当拿到封面时显示右侧
                  if (!coverLoaded && parsed.storybook.coverImage) {
                    preloadCover(parsed.storybook.coverImage);
                  }
                  
                  // 自动翻到最新页面
                  const newPageCount = parsed.storybook.currentImageCount || 0;
                  setCurrentPage(newPageCount - 1);
                } else if (parsed.type === 'complete') {
                  const storybook = parsed.storybook;
                  
                  // 显示生成的故事书数据
                  if (storybook.images && storybook.images.length > 0) {
                    setGeneratedImages(storybook.images);
                    setStorybookData(storybook);
                    setShowImages(true);
                    preloadCover(storybook.coverImage);
                  }
                  
                  // 确保生成状态正确更新
                  setIsGenerating(false);
                  
        toast({
                    title: "Storybook created!",
                    description: `"${storybook.title}" has been generated`,
                  });

                  // persist to DB
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
              } catch (parseError) {
                // Skip invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      toast({
        title: "Generation failed",
        description: "Please try again later",
      });
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

      // 1) Story content ready
      setGenerationStatus("Story content ready, drawing the cover...");

      // 2) 先推送封面
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

      // 3) 逐页推送
      for (let i = 0; i < (sample.pages?.length || 0); i++) {
        // 模拟延时
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
        setCurrentPage(i + 1); // 自动翻页
      }

      setIsGenerating(false);
      setGenerationStatus("Creation completed");
    } catch (e) {
      setIsGenerating(false);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setStoryPrompt(prompt);
    // 记录本地样本路径，点击“开始创作”时触发
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

  const totalPages = storybookData ? ((storybookData.pages?.length || storybookData.scenes?.length || 0) + 1) : 0; // +1 for cover
  const currentPageData = storybookData ? (
    currentPage === 0
      ? {
          isCover: true,
          title: storybookData.title,
          summary: storybookData.summary,
          image: storybookData.coverImage,
          text: null,
        }
      : {
          isCover: false,
          title: storybookData.title,
          summary: storybookData.summary,
          image: (storybookData.pages?.[currentPage - 1]?.image) ?? storybookData.pageImages?.[currentPage - 1],
          text: (storybookData.pages?.[currentPage - 1]?.text) ?? storybookData.scenes?.[currentPage - 1],
        }
  ) : null;

  // Page navigation helpers
  const handleNextPage = () => {
    setCurrentPage((p) => Math.min(totalPages - 1, p + 1));
  };
  const handlePrevPage = () => {
    setCurrentPage((p) => Math.max(0, p - 1));
  };

  // Touch swipe support
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const SWIPE_THRESHOLD = 40; // px
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchEndX(null);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.touches[0].clientX);
  };
  const onTouchEnd = () => {
    if (touchStartX == null || touchEndX == null) return;
    const delta = touchEndX - touchStartX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;
    if (delta < 0) {
      handleNextPage(); // swipe left => next
    } else {
      handlePrevPage(); // swipe right => prev
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      {/* Claim guest data when user logs in */}
      {user && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (async function(){
                try {
                  var t = localStorage.getItem('sb_guest_token');
                  if(t){ await fetch('/api/storybooks', { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ guestToken: t })}); }
                } catch(e){}
              })();
            `,
          }}
        />
      )}
      {/* Header */}
        <div className="container px-5 py-6">
       

        {/* Main Layout */}
        {(() => { const showRight = (currentProgress?.currentImageCount || 0) > 0; return (
        <div className={`grid gap-[20px] justify-items-center ${showRight ? 'lg:grid-cols-2' : 'lg:grid-cols-1'}`}>
          {/* Left Panel - Input and Generation */}
          <div className="space-y-6 w-full max-w-xl mx-auto place-self-center justify-self-center">
            {/* Generation Status Card */}
            {(isGenerating || storybookData) && (
                    <motion.div
                initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardContent className="p-6">
                    {isGenerating ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Generating storybook
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {generationStatus}
                            </p>
                          </div>
                </div>

                        {/* 进度条 */}
                        {currentProgress && (
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300">
                              <span>Progress</span>
                              <span>{currentProgress.currentImageCount || 0} / {currentProgress.totalImages || 0}</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ 
                                  width: `${((currentProgress.currentImageCount || 0) / (currentProgress.totalImages || 1)) * 100}%` 
                                }}
                              ></div>
                </div>
                </div>
                        )}
                      </div>
                    ) : storybookData ? (
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Creation complete!
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            "{storybookData.title}" has been generated
                          </p>
                        </div>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Storybook Preview - Mobile Top */}
            {storybookData && currentProgress && (currentProgress.currentImageCount || 0) > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="lg:hidden"
              >
                <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                        {storybookData.title}
                      </h2>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Page Navigation */}
                    <div className="flex items-center justify-center gap-4 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                        disabled={currentPage === 0}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <span className="text-sm text-gray-600 dark:text-gray-300">
                        {currentPage === 0 ? 'Cover' : `Page ${currentPage}`}
                      </span>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                        disabled={currentPage >= totalPages - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Mobile 3D FlipBook (react-pageflip) */}
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
                    
                    {/* Page Counter */}
                    <div className="text-center mt-4 text-xs text-gray-600 dark:text-gray-300">
                      Page {currentPage + 1} / {totalPages}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Input Card */}
            <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                  <CardHeader className="text-center pb-6">
                <div className="text-6xl mb-4">📚</div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Start your story
                </CardTitle>
                {/* description removed by request */}
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Story Input */}
                <div className="space-y-4">
                  <label className="text-lg font-semibold text-gray-900 dark:text-white">
                    Story description
                  </label>
                  <textarea
                    value={storyPrompt}
                    onChange={(e) => setStoryPrompt(e.target.value)}
                    placeholder="e.g. a rabbit who learns to share, or a brave kitten exploring a forest..."
                    className="w-full h-32 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-800 transition-all duration-200 text-gray-900 dark:text-white bg-white dark:bg-slate-700"
                  />
                </div>

                {/* Quick Prompts */}
                <div className="space-y-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quick start (click to choose):
                  </label>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {quickPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-left justify-start h-auto p-3 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
                      >
                        <Wand2 className="h-4 w-4 mr-2 text-blue-500" />
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Create Button */}
                <div className="text-center pt-4">
                  <Button
                    onClick={handleCreateStory}
                    disabled={isGenerating || !storyPrompt.trim()}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-12 py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Wand2 className="h-6 w-6 mr-3 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-6 w-6 mr-3" />
                        Start creating
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
              </div>

          {/* Right Panel - Storybook Preview - Desktop Only */}
          {storybookData && currentProgress && currentProgress.currentImageCount > 0 && (
            <div className="hidden lg:block space-y-6 w-full">
              <Card className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {storybookData.title}
                    </h2>
                    <div className="flex items-center gap-2"></div>
                    </div>
                  
                  {/* Page Navigation */}
                  <div className="flex items-center justify-center gap-4 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                      disabled={currentPage === 0}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {currentPage === 0 ? 'Cover' : `Page ${currentPage}`}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                      disabled={currentPage >= totalPages - 1}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {/* Desktop 3D FlipBook (react-pageflip) */}
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
            </div> ); })()}
          </div>
    </div>
  );
}