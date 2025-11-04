"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wand2, Sparkles, Image as ImageIcon, Zap, Coins } from "lucide-react";

export default function AIComicGeneratorPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useUser();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [comicPrompt, setComicPrompt] = useState("");

  const handleGenerate = async () => {
    if (!comicPrompt.trim()) {
      toast({
        title: "Please enter your comic idea",
        description: "Describe the comic story you want to create",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to generate comics.",
      });
      router.push("/sign-in");
      return;
    }

    toast({
      title: "Coming soon",
      description: "AI Comic Generator feature is under development.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500" />
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                AI-Powered Comic Creation
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span className="text-white">Create Stunning</span>
                <br />
                <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  AI Comics
                </span>
                <br />
                <span className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
                  in Minutes
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Transform your ideas into professional comic strips with AI. Generate unique characters, dynamic scenes, and engaging storylines effortlessly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => {
                  const element = document.getElementById('generator-section');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                size="lg"
                className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-6 text-lg h-auto font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Start Creating
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator-section" className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-4 mb-12"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Create Your Comic
                </span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Describe your comic story and let AI bring it to life
              </p>
            </motion.div>

            <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Comic Story Generator</CardTitle>
                <CardDescription>
                  Enter your comic idea below. Our AI will create characters, scenes, and dialogue for your comic strip.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Comic Story Prompt
                  </label>
                  <textarea
                    value={comicPrompt}
                    onChange={(e) => setComicPrompt(e.target.value)}
                    placeholder="Example: A superhero saves the day in a funny way, or a group of friends goes on an adventure..."
                    className="w-full h-32 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    {user && (
                      <>
                        <Coins className="w-4 h-4 text-yellow-500" />
                        <span>Consumes 5 credits</span>
                      </>
                    )}
                  </div>
                  <Button
                    onClick={handleGenerate}
                    disabled={isGenerating || !comicPrompt.trim()}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="mr-2 h-5 w-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-5 w-5" />
                        Generate Comic
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white/50 dark:bg-slate-900/50">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose AI Comic Generator?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Powerful features to create professional comics in minutes
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Auto-Generated Art</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  AI creates stunning comic panels with consistent character designs and dynamic compositions.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Smart Dialogue</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Automatically generates engaging dialogue and speech bubbles that match your story tone.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center space-y-4"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Instant Creation</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Create complete comic strips in minutes. No artistic skills required - just your imagination.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to Create Your First AI Comic?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Join thousands of creators making amazing comics with AI
            </p>
            <Button
              onClick={() => {
                const element = document.getElementById('generator-section');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6 text-lg h-auto font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Wand2 className="mr-3 h-6 w-6" />
              Start Creating Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

