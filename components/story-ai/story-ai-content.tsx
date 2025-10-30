"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";

import StoryGeneratorForm from "@/components/product/generator/story-generator-form";
import StoryPricing from "@/components/product/pricing/story-pricing";
import StoryExamples from "@/components/product/examples/story-examples";
import { saveFormData, loadFormData } from "@/utils/form-storage";

interface StoryData {
  title: string;
  content: string;
  genre: string;
  tone: string;
  length: string;
  characters: Array<{
    name: string;
    description: string;
    role: string;
  }>;
  plot: string;
  theme: string;
  language: string;
}

interface FormData {
  prompt: string;
  genre: 'children-book' | 'horror' | 'fantasy' | 'mystery' | 'romance' | 'photo-book' | 'novel' | 'short-story' | 'script';
  tone: 'whimsical' | 'dramatic' | 'mystery' | 'comedic' | 'child-friendly' | 'horror' | 'romantic' | 'adventurous';
  length: 'short' | 'medium' | 'long';
  language: 'english' | 'chinese' | 'both';
  includeIllustrations: boolean;
  illustrationStyle?: 'realistic' | 'cartoon' | 'anime' | 'watercolor' | 'sketch' | 'digital-art';
  targetAge?: string;
  readingLevel?: string;
  planType: '1' | '4';
}

export default function StoryAIContent() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { toast } = useToast();
  
  // UI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasTriedFree, setHasTriedFree] = useState(false);

  // Check localStorage for previous free trial usage
  useEffect(() => {
    if (!loading) {
      if (!user) {
        const hasUsedFree = localStorage.getItem('hasTriedFreeGeneration') === 'true';
        setHasTriedFree(hasUsedFree);
      } else {
        // Clear localStorage flag for authenticated users
        localStorage.removeItem('hasTriedFreeGeneration');
        setHasTriedFree(false);
      }
    }
  }, [user, loading]);

  // Load saved form data
  const [savedFormData, setSavedFormData] = useState<any>(null);
  useEffect(() => {
    const loadedData = loadFormData();
    if (loadedData) {
      setSavedFormData(loadedData);
    }
  }, []);

  const handleGenerate = async (formData: FormData) => {
    // Check if it's a free trial attempt
    if (!user && hasTriedFree) {
      toast({
        title: "Free trial used",
        description: "You've already used your free generation. Please sign in for unlimited access!",
      });
      router.push('/sign-in');
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch('/api/story/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle rate limiting specifically
        if (response.status === 429 && data.rateLimited) {
          toast({
            title: "Daily limit reached",
            description: data.error || "You can generate 3 free stories per day. Please sign in for unlimited access!",
          });
          // Show sign-in option
          setTimeout(() => {
            router.push('/sign-in');
          }, 3000);
          return;
        }
        throw new Error(data.error || 'Failed to generate story');
      }

      // Calculate total rounds based on generation round
      const estimatedTotalRounds = data.isContinuation 
        ? Math.ceil(data.batch.totalStoriesGenerated / 6)
        : data.generationRound;

      // Save results to sessionStorage and redirect to results page
      const sessionData = {
        stories: data.stories,
        formData: formData,
        batch: data.batch,
        generationRound: data.generationRound,
        totalGenerationRounds: estimatedTotalRounds,
        isHistoryMode: false,
      };
      
      sessionStorage.setItem('storyGenerationResults', JSON.stringify(sessionData));
      
      // Mark free trial as used for non-authenticated users
      if (!user) {
        setHasTriedFree(true);
        localStorage.setItem('hasTriedFreeGeneration', 'true');
      }

      // Save form data to localStorage for future use
      saveFormData({
        prompt: formData.prompt,
        genre: formData.genre,
        tone: formData.tone,
        length: formData.length,
        language: formData.language,
        targetAge: formData.targetAge,
        readingLevel: formData.readingLevel
      });

      toast({
        title: data.message || "Story generated successfully!",
        description: `Generated ${data.stories.length} unique stories${data.creditsUsed ? ` using ${data.creditsUsed} credits` : ' for free'}`,
      });
      
      // Navigate to results page
      router.push('/results');
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : "Something went wrong. Please try again.";
      console.error('Detailed error:', errorMessage);
      toast({
        title: "Generation failed",
        description: errorMessage,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const scrollToForm = () => {
    const formSection = document.querySelector('[data-story-generator-form]');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-b from-muted/20 to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
                <span className="mr-2">📚</span>
                AI-Powered Story Generation
              </div>
              
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl">
                Story AI — The Fast, Smart
                <br />
                <span className="text-primary">AI Story Generator</span>
              </h1>
              
              <p className="mt-6 text-xl text-muted-foreground md:text-2xl max-w-3xl mx-auto">
                Write novels, short stories, children's books, and scripts in minutes. 支持中文：故事 AI / AI 写故事 / 儿童故事书。
              </p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-lg"
                >
                  {loading ? 'Loading...' : !user ? (hasTriedFree ? '🔒 Sign In for More' : '🎁 Start Free Trial') : '🎯 Generate Story'}
                </button>
                <button
                  onClick={() => {
                    router.push('/story-ai#examples');
                  }}
                  className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium border border-border text-foreground hover:bg-muted rounded-md transition-colors"
                >
                  See Examples
                </button>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex items-center justify-center gap-8 pt-8 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  {loading ? 'Loading...' : !user ? '5 free stories monthly' : 'Unlimited generation'}
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                  Export to .docx/.txt
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  Multilingual support
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 bg-background">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  Turn a single idea into a complete story
                </h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Select tone, length, and format — Story AI generates outlines, characters, chapter drafts, and dialogue you can edit and export instantly.
                </p>
              </div>

              <div id="story-generator-form" data-story-generator-form>
                <StoryGeneratorForm 
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                  hasTriedFree={hasTriedFree}
                  savedFormData={savedFormData}
                />
                
                {/* Personal Center Button for authenticated users */}
                {user && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="text-center mt-6"
                  >
                    <button
                      onClick={() => router.push('/profile')}
                      className="inline-flex items-center gap-2 px-6 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors border border-primary/20 hover:border-primary/40 rounded-lg"
                    >
                      👤 Profile - View History & Saved Stories
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Story Examples Section */}
      <section id="examples" className="py-20 bg-gradient-to-b from-background to-muted/20" data-story-examples>
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl">
            <StoryExamples onScrollToGenerator={scrollToForm} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/20">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-6xl space-y-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why writers and creators choose Story AI
              </h2>
              <p className="mx-auto max-w-3xl text-muted-foreground text-lg">
                Advanced storytelling tools combined with AI intelligence to create compelling stories that engage and inspire.
              </p>
            </motion.div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="rounded-2xl bg-background p-8 shadow-sm border border-border"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Speed up writing</h3>
                  <p className="text-muted-foreground">
                    From one-line prompts to a polished chapter in minutes.
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="rounded-2xl bg-background p-8 shadow-sm border border-border"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Flexible outputs</h3>
                  <p className="text-muted-foreground">
                    Novels, short stories, scene-by-scene drafts, and children's storybooks (儿童故事书).
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="rounded-2xl bg-background p-8 shadow-sm border border-border"
              >
                <div className="space-y-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-2xl">🎭</span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Rich character design</h3>
                  <p className="text-muted-foreground">
                    Auto-generate personality profiles, backstories and consistent dialogue.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <div id="pricing">
        <StoryPricing onScrollToForm={scrollToForm} />
      </div>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-muted/10 to-background">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-4xl text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
              className="space-y-6"
            >
              <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                Start Your Creative Journey Today
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
                Turn your ideas into compelling stories that engage and inspire readers.
                <br />
                Join thousands of writers who have discovered the power of AI-assisted storytelling.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <button 
                  onClick={scrollToForm}
                  className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors shadow-lg"
                >
                  {loading ? 'Loading...' : !user ? (hasTriedFree ? '🔒 Sign In for Unlimited Stories' : '🎁 Start Free Trial') : '🎯 Generate Your First Story'}
                </button>
                <a 
                  href="#story-pricing"
                  className="inline-flex items-center justify-center h-14 px-8 text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Compare Plans →
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
