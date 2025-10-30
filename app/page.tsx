"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles, BookOpen, Users, Zap, Globe, Download, Star, Play, Wand2, Heart, Shield, Crown } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useUser();
  const { toast } = useToast();
  
  const features = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Creation",
      description: "Start creating stories immediately without any registration or login process",
      color: "from-yellow-400 to-orange-500",
      bgColor: "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "AI-Powered Stories",
      description: "Generate complete stories with illustration prompts automatically",
      color: "from-blue-400 to-slate-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Guided Process",
      description: "Step-by-step storytelling guidance for perfect plot development",
      color: "from-green-400 to-emerald-500",
      bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Visual Prompts",
      description: "Perfect illustration prompts for creating stunning picture books",
      color: "from-slate-400 to-blue-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "100% Free",
      description: "Unlimited usage with no hidden costs or restrictions",
      color: "from-emerald-400 to-teal-500",
      bgColor: "bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20"
    },
    {
      icon: <Crown className="h-8 w-8" />,
      title: "All Genres",
      description: "Support for horror, fantasy, romance, children's stories, and more",
      color: "from-blue-400 to-slate-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20"
    }
  ];

  const storyTypes = [
    {
      title: "Children's Stories",
      description: "Bedtime tales, animal adventures, and inspiring growth stories",
      image: "📚",
      examples: ["The Little Cloud's Adventure", "Magic Forest Friends"],
      category: "children",
      gradient: "from-yellow-400 to-orange-500",
      bgGradient: "from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
    },
    {
      title: "Horror & Thriller",
      description: "Creepy atmospheres, psychological thrillers, and urban legends",
      image: "👻",
      examples: ["Midnight at the Station", "The Last Letter"],
      category: "horror",
      gradient: "from-red-400 to-slate-500",
      bgGradient: "from-red-50 to-purple-50 dark:from-red-900/20 dark:to-purple-900/20"
    },
    {
      title: "Fantasy Adventures",
      description: "Magic, heroes, other worlds, and epic fantasy sagas",
      image: "🧙",
      examples: ["The Dragon's Quest", "Time Traveler's Diary"],
      category: "fantasy",
      gradient: "from-blue-400 to-slate-500",
      bgGradient: "from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20"
    },
    {
      title: "Mystery & Crime",
      description: "Detective plots, puzzle-solving, and psychological games",
      image: "🕵️",
      examples: ["The Detective's Last Case", "The Missing Evidence"],
      category: "mystery",
      gradient: "from-slate-400 to-blue-500",
      bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
    },
    {
      title: "Romance & Life",
      description: "Light-hearted stories, school life, and slice-of-life tales",
      image: "💕",
      examples: ["Coffee Shop Encounter", "High School Days"],
      category: "romance",
      gradient: "from-pink-400 to-slate-500",
      bgGradient: "from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20"
    },
    {
      title: "Photo Books",
      description: "Visual storytelling with illustration prompts and layouts",
      image: "🖼️",
      examples: ["Picture Book Adventure", "Visual Story Collection"],
      category: "photo",
      gradient: "from-teal-400 to-slate-500",
      bgGradient: "from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Content Creator",
      content: "I created 50+ illustrated stories for my YouTube channel in just one month! The photo prompts are perfect for visual storytelling.",
      avatar: "👩‍💼",
      rating: 5,
      gradient: "from-blue-400 to-purple-500"
    },
    {
      name: "Michael Rodriguez",
      role: "Elementary Teacher",
      content: "My students love the personalized storybooks I create. The illustration prompts make it easy to create engaging visual stories.",
      avatar: "👨‍🏫",
      rating: 5,
      gradient: "from-green-400 to-emerald-500"
    },
    {
      name: "Emma Thompson",
      role: "Indie Author",
      content: "I use this tool to brainstorm horror and fantasy stories. The step-by-step guidance helps me develop complex plots effortlessly.",
      avatar: "👩‍🎨",
      rating: 5,
      gradient: "from-purple-400 to-pink-500"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900" />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: [0, 100, 0],
              y: [0, -100, 0],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-slate-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, -150, 0],
              y: [0, 100, 0],
              rotate: [360, 180, 0],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-slate-400/20 to-blue-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              x: [0, 200, 0],
              y: [0, -50, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-400/10 to-slate-500/10 rounded-full blur-2xl"
          />
        </div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Section - Text and CTA */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 md:space-y-8"
            >
            
              
              {/* Main Headline */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-4"
              >
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight">
                  <span className="text-white">Create Amazing</span>
                  <br />
                    <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent">
                      Story Book
                    </span>
                  <br />
                    <span className="text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl">
                      with Story AI
                    </span>
                </h1>
              
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-200 max-w-2xl leading-relaxed">
                Create personalized children's stories in seconds to develop your child's creativity and confidence.
                </p>
              </motion.div>
              
              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4"
              >
              <Button
                onClick={() => router.push('/create')}
                size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-4 text-lg h-auto font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                  <Wand2 className="mr-2 h-5 w-5" />
                  Start Creating Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
                
              
              </motion.div>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap gap-4 sm:gap-6 md:gap-8 pt-4 sm:pt-6 md:pt-8"
              >
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">10K+</div>
                  <div className="text-sm sm:text-base text-gray-300">Stories Created</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">50+</div>
                  <div className="text-sm sm:text-base text-gray-300">Story Types</div>
                </div>
                <div className="text-center">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-white">100%</div>
                  <div className="text-sm sm:text-base text-gray-300">Free to Use</div>
                </div>
              </motion.div>
              </motion.div>
              
            {/* Right Section - Story Examples */}
              <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative flex justify-center lg:justify-end mt-8 lg:mt-0"
            >
              <div className="relative w-full max-w-sm sm:max-w-md lg:max-w-none h-[400px] sm:h-[450px] lg:h-[500px] flex items-center justify-center">
                {/* First Card - 第一张图片在左边 */}
                <motion.div
                  initial={{ x: -100, y: -30, rotate: -8 }}
                  animate={{ x: 0, y: 0, rotate: -3 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="absolute left-0 top-4 sm:top-8 w-36 h-48 sm:w-48 sm:h-64 rounded-xl shadow-xl overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 z-10"
                >
                  <img 
                    src="/images/story-ai-1.jpeg" 
                    alt="Story AI Example" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <Badge className="bg-gradient-to-r from-red-400 to-slate-500 text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm">
                      CHILDREN
                    </Badge>
                    <h4 className="text-white font-bold text-xs sm:text-sm">Dentisit</h4>
                  </div>
                </motion.div>

                {/* Main Story Card - 第二张图片居中 */}
                <motion.div
                  initial={{ scale: 0.8, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="relative z-20 w-56 h-80 sm:w-64 sm:h-88 md:w-72 md:h-96 rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900"
                >
                  <div className="h-full relative">
                    <img 
                      src="/images/story-book-2.png" 
                      alt="Story Book Example" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-gradient-to-r from-blue-400 to-slate-500 text-white font-bold text-xs sm:text-sm">
                          FANTASY
                        </Badge>
                      </div>
                      <h3 className="text-white font-bold text-lg sm:text-xl mb-2">Magic Forest</h3>
                      <p className="text-gray-200 text-xs sm:text-sm">A young wizard discovers ancient secrets...</p>
                    </div>
                  </div>
                </motion.div>

                {/* Third Card - 第三张图片在右边 */}
                <motion.div
                  initial={{ x: 100, y: 30, rotate: 8 }}
                  animate={{ x: 0, y: 0, rotate: 3 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="absolute right-0 bottom-4 sm:bottom-8 w-36 h-48 sm:w-48 sm:h-64 rounded-xl shadow-xl overflow-hidden bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 z-10"
                >
                  <img 
                    src="/images/story-ai-3.jpeg" 
                    alt="Story AI Example 3" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                    <Badge className="bg-gradient-to-r from-pink-400 to-slate-500 text-white font-bold mb-1 sm:mb-2 text-xs sm:text-sm">
                      ROMANCE
                    </Badge>
                    <h4 className="text-white font-bold text-xs sm:text-sm">Coffee Shop Love</h4>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creative Superpowers Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-6 mb-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Unleash your child's creative superpowers
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                Foster imagination, creativity, and confidence through personalized storytelling adventures tailored just for them.
              </p>
            </motion.div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {/* Spark Imagination */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="relative mx-auto w-156 h-80 rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/images/storybook_1.png" 
                    alt="Magic Castle Story" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Spark endless imagination
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    From magical castles to space adventures, every story opens new worlds and possibilities for creative thinking.
                  </p>
                </div>
              </motion.div>

              {/* Become Hero */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="relative mx-auto w-156 h-80 rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/images/storybook_2.png" 
                    alt="Hero Story Book" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Become the hero of every tale
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Your child stars in personalized adventures, building self-confidence and making every story uniquely theirs.
                  </p>
                </div>
              </motion.div>

              {/* Explore Emotions */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="relative mx-auto w-156 h-80 rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/images/storybook_3.png" 
                    alt="Emotions Story Book" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Explore emotions safely
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Stories provide a safe space to explore feelings, develop empathy, and learn valuable life lessons through character experiences.
                  </p>
                </div>
              </motion.div>

              {/* Create Memories */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="relative mx-auto w-156 h-80 rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src="/images/storybook_4.png" 
                    alt="Memories Story Book" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Create magical memories
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Build precious bonding moments with personalized bedtime stories that become treasured family memories.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Types Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-6 mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent">
                  Every Story Type
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                From children's bedtime stories to epic novels, our AI adapts to your creative vision
              </p>
            </motion.div>

            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
              {storyTypes.map((type, index) => (
                  <motion.div
                  key={type.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden group">
                    <div className={`h-2 bg-gradient-to-r ${type.gradient}`} />
                    <CardHeader className="text-center pb-2 sm:pb-4 px-3 sm:px-6">
                      <div className="text-4xl sm:text-6xl mb-3 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                        {type.image}
                      </div>
                      <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                        {type.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed">
                        {type.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0 px-3 sm:px-6">
                      <div className="space-y-2 sm:space-y-3">
                        <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">Popular Examples:</p>
                        {type.examples.map((example, i) => (
                          <div key={i} className="flex items-center gap-1 sm:gap-2">
                            <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${type.gradient}`} />
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{example}</p>
                          </div>
                        ))}
              </div>
                    </CardContent>
                  </Card>
            </motion.div>
              ))}
        </div>
          </div>
        </div>
      </section>

      {/* Creativity Meets Storytelling Section */}
      <section className="py-24 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-6 mb-20"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Where creativity meets storytelling
                </span>
              </h2>
            </motion.div>

            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
              {/* Unlimited Creativity */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 flex items-center justify-center text-4xl shadow-lg">
                  🎨
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Unlimited Creativity
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Every story is unique with endless possibilities for characters, settings, and adventures
                  </p>
                </div>
              </motion.div>

              {/* Instant Magic */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 flex items-center justify-center text-4xl shadow-lg">
                  ✨
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Instant Magic
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Beautiful illustrations bring stories to life in seconds, creating immediate wonder and engagement
                  </p>
                </div>
              </motion.div>

              {/* Personal Connection */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
                className="text-center space-y-6"
              >
                <div className="relative mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-rose-100 dark:from-pink-900/20 dark:to-rose-900/20 flex items-center justify-center text-4xl shadow-lg">
                  💝
                </div>
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Personal Connection
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Children connect deeply with stories where they're the star, building confidence and self-worth
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-slate-800 dark:to-slate-900">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-6 mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-slate-600 to-blue-600 bg-clip-text text-transparent">
                  Why Choose Story AI?
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Powerful features designed to make storytelling effortless and enjoyable
              </p>
            </motion.div>
            
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => (
              <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="group"
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white dark:bg-slate-800 overflow-hidden">
                    <CardContent className="p-4 sm:p-6 lg:p-8 text-center space-y-4 sm:space-y-6">
                      <div className={`inline-flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <div className="text-white text-lg sm:text-xl">
                    {feature.icon}
                  </div>
            </div>
                      <div className="space-y-2 sm:space-y-3">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                          {feature.description}
                        </p>
          </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="mx-auto max-w-7xl">
              <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-center space-y-6 mb-20"
            >
              <h2 className="text-5xl md:text-6xl font-bold tracking-tight">
                <span className="bg-gradient-to-r from-blue-600 to-slate-600 bg-clip-text text-transparent">
                  Loved by Creators
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Join thousands of satisfied users creating amazing content with Story AI
              </p>
              </motion.div>
              
            <div className="grid gap-6 grid-cols-2 lg:grid-cols-3">
              {testimonials.map((testimonial, index) => (
              <motion.div
                  key={testimonial.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900">
                    <CardContent className="p-4 sm:p-6 lg:p-8">
                      <div className="space-y-3 sm:space-y-4 lg:space-y-6">
                        <div className="flex items-center gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 italic text-sm sm:text-base lg:text-lg leading-relaxed">
                          "{testimonial.content}"
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
                        <div className="text-2xl sm:text-3xl lg:text-4xl">{testimonial.avatar}</div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base lg:text-lg">
                              {testimonial.name}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              {testimonial.role}
                            </p>
                          </div>
                  </div>
                </div>
                    </CardContent>
                  </Card>
              </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
                 Ready to spark your child's 
                <br />
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                imagination?
                </span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
                Join thousands of creators who are already using Story AI to bring their ideas to life. 
                Start creating your first story in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  onClick={() => router.push('/create')}
                  size="lg"
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-10 py-6 text-xl h-auto font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                >
                  <Wand2 className="mr-3 h-6 w-6" />
                  Start Creating Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
                <Button
                  onClick={() => router.push('/pricing')}
                  size="lg"
                  variant="outline"
                  className="border-2 border-white/30 text-white hover:bg-white/10 px-10 py-6 text-xl h-auto font-semibold rounded-2xl backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  View Pricing Plans
                </Button>
              </div>
              
              <div className="flex flex-wrap justify-center gap-8 pt-8">
                <div className="flex items-center gap-2 text-gray-200">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="font-semibold">100% Free</span>
                </div>
                
                <div className="flex items-center gap-2 text-gray-200">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold">Unlimited Usage</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}