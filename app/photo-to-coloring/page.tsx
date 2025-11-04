"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Upload, Wand2, Sparkles, Image as ImageIcon, Zap } from "lucide-react";

export default function PhotoToColoringPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const handleGenerate = async () => {
    if (!imageUrl.trim()) {
      toast({
        title: "Please provide an image URL",
        description: "Paste the photo URL you want to convert into a coloring page.",
      });
      return;
    }

    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to use Photo to Coloring." });
      router.push("/sign-in");
      return;
    }

    toast({ title: "Coming soon", description: "Photo to Coloring is under development." });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-rose-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500" />
        <div className="absolute inset-0 bg-black/20" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:.8}} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI Photo to Coloring
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
                <span className="text-white">Turn Photos into</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-rose-300 bg-clip-text text-transparent">Coloring Pages</span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Convert any photo into clean, print-ready line art. Perfect for kids' activities, education, and DIY coloring books.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Generator */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Photo to Coloring</CardTitle>
                <CardDescription>Paste a photo URL and generate a coloring page with AI</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Photo URL</label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/your-photo.jpg"
                    className="w-full h-11 px-4 border rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                  <p className="mt-2 text-xs text-muted-foreground">Future update will support direct upload.</p>
                </div>
                <div className="flex items-center justify-end">
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !imageUrl.trim()}
                    className="bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate Coloring Page
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <ImageIcon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Clean Line Art</h3>
              <p className="text-gray-600 dark:text-gray-300">AI extracts lines and removes noise for crisp, printable results.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 text-white">
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Easy Input</h3>
              <p className="text-gray-600 dark:text-gray-300">Paste a URL now—direct uploads and batch conversion coming soon.</p>
            </div>
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold">Kid-Friendly</h3>
              <p className="text-gray-600 dark:text-gray-300">Create engaging coloring pages tailored for children's creativity.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
