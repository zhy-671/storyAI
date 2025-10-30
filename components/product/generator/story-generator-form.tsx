"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";

const storyFormSchema = z.object({
  prompt: z.string().min(10, "Please provide at least 10 characters for your story idea"),
  genre: z.enum(['children-book', 'horror', 'fantasy', 'mystery', 'romance', 'photo-book', 'novel', 'short-story', 'script'], {
    required_error: "Please select a story genre",
  }),
  tone: z.enum(['whimsical', 'dramatic', 'mystery', 'comedic', 'child-friendly', 'horror', 'romantic', 'adventurous'], {
    required_error: "Please select a tone",
  }),
  length: z.enum(['short', 'medium', 'long'], {
    required_error: "Please select a length",
  }),
  language: z.enum(['english', 'chinese', 'both'], {
    required_error: "Please select a language",
  }),
  includeIllustrations: z.boolean(),
  illustrationStyle: z.enum(['realistic', 'cartoon', 'anime', 'watercolor', 'sketch', 'digital-art']).optional(),
  targetAge: z.string().optional(),
  readingLevel: z.string().optional(),
  planType: z.enum(['1', '4'], {
    required_error: "Please select a plan type",
  }),
});

type StoryFormData = z.infer<typeof storyFormSchema>;

interface StoryGeneratorFormProps {
  onGenerate: (data: StoryFormData) => void;
  isGenerating: boolean;
  hasTriedFree: boolean;
  savedFormData?: any;
}

export default function StoryGeneratorForm({ 
  onGenerate, 
  isGenerating, 
  hasTriedFree, 
  savedFormData,
}: StoryGeneratorFormProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const form = useForm<StoryFormData>({
    resolver: zodResolver(storyFormSchema),
    defaultValues: {
      prompt: savedFormData?.prompt || "",
      genre: savedFormData?.genre || "children-book",
      tone: savedFormData?.tone || "whimsical",
      length: savedFormData?.length || "medium",
      language: savedFormData?.language || "english",
      includeIllustrations: savedFormData?.includeIllustrations ?? true,
      illustrationStyle: savedFormData?.illustrationStyle || "cartoon",
      targetAge: savedFormData?.targetAge || "",
      readingLevel: savedFormData?.readingLevel || "",
      planType: savedFormData?.planType || "1",
    },
  });

  const onSubmit = (data: StoryFormData) => {
    onGenerate(data);
  };

  const genreOptions = [
    { value: "children-book", label: "Children's Storybooks & Growth Tales", description: "Bedtime stories, animal adventures, fairy tales" },
    { value: "horror", label: "Horror / Creepypasta / Analog Horror", description: "Creepy atmospheres, psychological thrillers" },
    { value: "fantasy", label: "Fantasy Adventures & Epic Legends", description: "Magic, heroes, other worlds, epic sagas" },
    { value: "mystery", label: "Mystery & Crime Thrillers", description: "Detective plots, puzzle-solving, serial crimes" },
    { value: "romance", label: "Comedy / Romance / School Life / Slice of Life / Anime", description: "Light-hearted, feel-good stories" },
    { value: "photo-book", label: "Photo Books & Illustrated Stories", description: "Visual storytelling with illustration prompts" },
    { value: "novel", label: "Novel", description: "Full-length fiction" },
    { value: "short-story", label: "Short Story", description: "Brief narrative" },
    { value: "script", label: "Script", description: "Screenplay or play" },
  ];

  const toneOptions = [
    { value: "whimsical", label: "Whimsical", description: "Playful and imaginative" },
    { value: "dramatic", label: "Dramatic", description: "Intense and emotional" },
    { value: "mystery", label: "Mystery", description: "Suspenseful and intriguing" },
    { value: "horror", label: "Horror", description: "Scary and unsettling" },
    { value: "romantic", label: "Romantic", description: "Love and relationships" },
    { value: "adventurous", label: "Adventurous", description: "Exciting and action-packed" },
    { value: "comedic", label: "Comedic", description: "Humorous and light" },
    { value: "child-friendly", label: "Child-friendly", description: "Simple and educational" },
  ];

  const lengthOptions = [
    { value: "short", label: "Short", description: "1-3 pages" },
    { value: "medium", label: "Medium", description: "4-10 pages" },
    { value: "long", label: "Long", description: "10+ pages" },
  ];

  const languageOptions = [
    { value: "english", label: "English" },
    { value: "chinese", label: "中文 (Chinese)" },
    { value: "both", label: "Both Languages" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
    <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Generate Your Story</CardTitle>
          <CardDescription>
            Tell us your story idea and let our AI create a compelling narrative for you
          </CardDescription>
      </CardHeader>
      <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Story Prompt */}
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Idea or Prompt *</FormLabel>
                    <FormControl>
            <Textarea
                        placeholder="Describe your story idea, characters, setting, or theme. For example: 'A lost toy who finds courage' or 'A detective solving a mystery in a small town'"
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Genre Selection */}
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Story Genre *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-2 gap-4"
                      >
                        {genreOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <label
                              htmlFor={option.value}
                              className="flex flex-col cursor-pointer"
                            >
                              <span className="font-medium">{option.label}</span>
                              <span className="text-sm text-muted-foreground">
                                {option.description}
                              </span>
                            </label>
          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tone and Length */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="tone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Tone *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                <SelectTrigger>
                            <SelectValue placeholder="Select tone" />
                </SelectTrigger>
                        </FormControl>
                <SelectContent>
                          {toneOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-sm text-muted-foreground">
                                  {option.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                </SelectContent>
              </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="length"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Story Length *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                <SelectTrigger>
                            <SelectValue placeholder="Select length" />
                </SelectTrigger>
                        </FormControl>
                <SelectContent>
                          {lengthOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex flex-col">
                                <span>{option.label}</span>
                                <span className="text-sm text-muted-foreground">
                                  {option.description}
                                </span>
                              </div>
                            </SelectItem>
                          ))}
                </SelectContent>
              </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
          </div>

              {/* Language Selection */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-wrap gap-4"
                      >
                        {languageOptions.map((option) => (
                          <div key={option.value} className="flex items-center space-x-2">
                            <RadioGroupItem value={option.value} id={option.value} />
                            <label htmlFor={option.value} className="cursor-pointer">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Illustration Options */}
              <FormField
                control={form.control}
                name="includeIllustrations"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Include illustration prompts
                      </FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Generate detailed prompts for creating illustrations and photos for your story
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {form.watch("includeIllustrations") && (
                <FormField
                  control={form.control}
                  name="illustrationStyle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Illustration Style</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select illustration style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="realistic">Realistic</SelectItem>
                          <SelectItem value="cartoon">Cartoon</SelectItem>
                          <SelectItem value="anime">Anime</SelectItem>
                          <SelectItem value="watercolor">Watercolor</SelectItem>
                          <SelectItem value="sketch">Sketch</SelectItem>
                          <SelectItem value="digital-art">Digital Art</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Advanced Options */}
          <div className="space-y-4">
              <div className="flex items-center space-x-2">
                  <Checkbox
                    id="advanced"
                    checked={showAdvanced}
                    onCheckedChange={(checked) => setShowAdvanced(checked === true)}
                  />
                  <label htmlFor="advanced" className="text-sm font-medium cursor-pointer">
                    Show advanced options
                  </label>
          </div>

                {showAdvanced && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="targetAge"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Age (for children's books)</FormLabel>
                            <FormControl>
                <Input
                                placeholder="e.g., 3-6, 7-10, 11-14"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="readingLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reading Level</FormLabel>
                            <FormControl>
                              <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                                  <SelectValue placeholder="Select reading level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Plan Type */}
              <FormField
                control={form.control}
                name="planType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generation Plan *</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="1" id="plan-1" />
                          <label htmlFor="plan-1" className="flex flex-col cursor-pointer">
                            <span className="font-medium">Single Story</span>
                            <span className="text-sm text-muted-foreground">
                              Generate 1 story
                            </span>
                          </label>
                        </div>
                        <div className="flex items-center space-x-2 p-4 border rounded-lg">
                          <RadioGroupItem value="4" id="plan-4" />
                          <label htmlFor="plan-4" className="flex flex-col cursor-pointer">
                            <span className="font-medium">Multiple Stories</span>
                            <span className="text-sm text-muted-foreground">
                              Generate 4 stories
                            </span>
                          </label>
            </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
          )}
              />

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
              type="submit"
                  disabled={isGenerating}
                  className="w-full sm:w-auto px-8 py-3 text-lg"
            >
                  {isGenerating ? "Generating story..." : (hasTriedFree ? "🔒 Sign In to Generate" : "🎯 Generate Story")}
                </Button>
          </div>

              {/* Free Trial Info */}
              {!hasTriedFree && (
                <p className="text-center text-sm text-muted-foreground">
                  Free trial: Generate 1 story without signing up
                </p>
              )}
        </form>
          </Form>
      </CardContent>
    </Card>
    </motion.div>
  );
}