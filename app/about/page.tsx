"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, Users, Globe, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">About Us</h1>
              <p className="text-sm text-muted-foreground">
                Learn more about our mission and story
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <Sparkles className="mr-2 h-4 w-4" />
              AI-Powered Story Creation
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Creating Stories That
              <br />
              <span className="text-primary">Feel Alive</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Story AI Create Story Book helps anyone turn imagination into beautiful illustrated tales. 
              Our intelligent story generator creates personalized storybooks in minutes, powered by advanced AI technology.
            </p>
          </motion.div>

          {/* Mission Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  To make storytelling accessible to everyone. Whether you're a writer, teacher, parent, 
                  or creative enthusiast, we empower you to bring your ideas to life through AI-powered story creation.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Our Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We've helped creators worldwide generate thousands of unique storybooks - from bedtime 
                  stories for children to fantasy adventures and creative narratives for all ages.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Creative Freedom</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Our platform supports all genres - horror, fantasy, romance, children's stories, 
                  mystery, and more. Create stories that match your vision and share them with the world.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Story Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="prose prose-lg max-w-none"
          >
            <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                Our Story
              </h3>
              <div className="space-y-6 text-muted-foreground">
                <p>
                  Story AI Create Story Book was born from a simple belief: everyone has stories to tell, 
                  but not everyone has the time, skills, or resources to bring them to life. Whether you're 
                  a parent wanting to create personalized bedtime stories, a teacher crafting educational content, 
                  or a writer exploring new creative directions, storytelling should be accessible to all.
                </p>
                <p>
                  Our platform combines advanced AI technology with an intuitive interface to transform your 
                  ideas into complete, illustrated storybooks. From generating engaging narratives to creating 
                  vivid scene descriptions for illustrations, we handle the technical complexity so you can 
                  focus on the creative vision.
                </p>
                <p>
                  Every story generated is unique, tailored to your input and preferences. Whether you're 
                  creating a children's picture book, a fantasy adventure, a horror thriller, or any other 
                  genre, Story AI helps you craft stories that resonate with readers and bring your imagination to life.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="space-y-8"
          >
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-4">Our Values</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                These principles guide everything we do
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Creativity & Imagination</h4>
                  <p className="text-muted-foreground">
                    We believe everyone has the potential to create compelling stories. Our AI-powered 
                    platform removes technical barriers, allowing your creativity to flourish.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Quality & Authenticity</h4>
                  <p className="text-muted-foreground">
                    Every story is carefully crafted with engaging narratives, emotional depth, and 
                    vivid descriptions that bring characters and worlds to life.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Accessibility</h4>
                  <p className="text-muted-foreground">
                    No technical skills required. Whether you're an experienced writer or just starting 
                    your storytelling journey, our platform makes story creation simple and enjoyable.
                  </p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Versatility</h4>
                  <p className="text-muted-foreground">
                    Support for all genres and styles - from children's bedtime stories to fantasy 
                    adventures, horror tales, romance, mystery, and more. Your imagination is the limit.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8 md:p-12">
              <h3 className="text-2xl font-bold mb-6 text-center">Contact Us</h3>
              
              <div className="space-y-6 text-center">
                <div>
                  <h4 className="font-semibold mb-3 text-lg">Email</h4>
                  <p className="text-muted-foreground mb-2">
                    For general inquiries, support, or questions about our service:
                  </p>
                  <a 
                    href="mailto:gareaukeenan3155@gmail.com" 
                    className="text-primary hover:text-primary/80 font-medium underline inline-block"
                  >
                    gareaukeenan3155@gmail.com
                  </a>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-semibold mb-3 text-lg">Refund Requests</h4>
                  <p className="text-muted-foreground mb-2">
                    If you need to request a refund, please contact us at:
                  </p>
                  <a 
                    href="mailto:gareaukeenan3155@gmail.com?subject=Refund Request" 
                    className="text-primary hover:text-primary/80 font-medium underline inline-block"
                  >
                    gareaukeenan3155@gmail.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-3">
                    Please include your order details and reason for the refund request in your email.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8 md:p-12"
          >
            <h3 className="text-2xl font-bold mb-4">Ready to Create Your Story?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join creators worldwide who are bringing their imagination to life. 
              Start creating your own AI-powered storybook today.
            </p>
            <Button asChild size="lg" className="font-medium">
              <Link href="/create-story-book">
                Start Creating Now
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}