"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface StoryExamplesProps {
  onScrollToGenerator: () => void;
}

export default function StoryExamples({ onScrollToGenerator }: StoryExamplesProps) {
  const examples = [
    {
      title: "The Lost Toy's Journey",
      genre: "Children's Book",
      tone: "Whimsical",
      language: "English",
      excerpt: "Little Cloud lost his smile when the wind carried him far from home. Through forests of cotton candy and rivers of starlight, he searched for the way back, learning that sometimes the greatest adventures lead us exactly where we need to be.",
      age: "3-6 years",
      length: "Short",
    },
    {
      title: "Midnight at the Station",
      genre: "Short Story",
      tone: "Mystery",
      language: "English",
      excerpt: "The dimly lit station held its breath as two strangers met under the flickering neon sign. She clutched a red umbrella; he carried a briefcase that seemed heavier than it should. Neither knew their encounter would change everything.",
      age: "Adult",
      length: "Medium",
    },
    {
      title: "小云朵的冒险",
      genre: "Children's Book",
      tone: "Child-friendly",
      language: "中文",
      excerpt: "小云朵失去了笑容，当风把它吹得离家很远。穿过棉花糖森林和星光河流，它寻找回家的路，学会了有时最大的冒险会带我们到最需要去的地方。",
      age: "3-6岁",
      length: "Short",
    },
    {
      title: "The Detective's Last Case",
      genre: "Novel",
      tone: "Dramatic",
      language: "English",
      excerpt: "Detective Sarah Chen had solved hundreds of cases, but this one was different. The evidence pointed to someone she trusted, and the victim was someone she loved. As the city slept, she faced the hardest decision of her career.",
      age: "Adult",
      length: "Long",
    },
  ];

  const getGenreColor = (genre: string) => {
    switch (genre) {
      case "Children's Book":
        return "bg-pink-100 text-pink-800";
      case "Short Story":
        return "bg-blue-100 text-blue-800";
      case "Novel":
        return "bg-purple-100 text-purple-800";
      case "Script":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "Whimsical":
        return "bg-yellow-100 text-yellow-800";
      case "Mystery":
        return "bg-indigo-100 text-indigo-800";
      case "Child-friendly":
        return "bg-pink-100 text-pink-800";
      case "Dramatic":
        return "bg-red-100 text-red-800";
      case "Comedic":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <section className="py-20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Real outputs — ready to use
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              See what Story AI can create for you. These examples show the quality and variety of stories you can generate.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <CardTitle className="text-xl">{example.title}</CardTitle>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getGenreColor(example.genre)}>
                            {example.genre}
                          </Badge>
                          <Badge className={getToneColor(example.tone)}>
                            {example.tone}
                          </Badge>
                          <Badge variant="outline">
                            {example.language}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription>
                      {example.age} • {example.length} story
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="text-sm text-muted-foreground italic leading-relaxed">
                          "{example.excerpt}"
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          Generated in seconds
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={onScrollToGenerator}
                        >
                          Try Similar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Button
              onClick={onScrollToGenerator}
              size="lg"
              className="px-8 py-3 text-lg"
            >
              Generate Your Own Story
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              Start with a simple idea and let Story AI bring it to life
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}