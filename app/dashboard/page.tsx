"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Share2, 
  Download,
  Eye,
  Calendar,
  Clock,
  BookOpen,
  Users,
  Zap,
  TrendingUp
} from "lucide-react";

type StoryStatus = "completed" | "draft" | "in-progress";
type StoryType = "Children's Book" | "Short Story" | "Novel" | "Script";

interface Story {
  id: number;
  title: string;
  type: StoryType;
  status: StoryStatus;
  createdAt: string;
  wordCount: number;
  language: string;
  tags: string[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [stories, setStories] = useState<Story[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [activeTab, setActiveTab] = useState("recent");

  // Mock data - in real app, this would come from API
  const mockStories: Story[] = [
    {
      id: 1,
      title: "The Little Cloud's Adventure",
      type: "Children's Book",
      status: "completed",
      createdAt: "2024-01-15",
      wordCount: 450,
      language: "English",
      tags: ["children", "adventure", "educational"]
    },
    {
      id: 2,
      title: "Midnight at the Station",
      type: "Short Story",
      status: "draft",
      createdAt: "2024-01-14",
      wordCount: 1200,
      language: "English",
      tags: ["mystery", "suspense", "urban"]
    },
    {
      id: 3,
      title: "小云朵的冒险",
      type: "Children's Book",
      status: "completed",
      createdAt: "2024-01-13",
      wordCount: 380,
      language: "Chinese",
      tags: ["children", "adventure", "bilingual"]
    },
    {
      id: 4,
      title: "The Detective's Last Case",
      type: "Novel",
      status: "in-progress",
      createdAt: "2024-01-12",
      wordCount: 8500,
      language: "English",
      tags: ["mystery", "crime", "drama"]
    }
  ];

  const stats = {
    totalStories: 24,
    completedStories: 18,
    totalWords: 45600,
    thisMonth: 8
  };

  const getStatusColor = (status: StoryStatus) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: StoryType) => {
    switch (type) {
      case "Children's Book": return "👶";
      case "Short Story": return "📖";
      case "Novel": return "📚";
      case "Script": return "🎬";
      default: return "📝";
    }
  };

  const filteredStories = mockStories.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || story.type.toLowerCase().includes(filterType.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b bg-background/95 backdrop-blur">
        <div className="container px-4 md:px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Stories</h1>
              <p className="text-muted-foreground">Manage and organize your creative works</p>
            </div>
            <Button onClick={() => router.push('/create')}>
              <Plus className="h-4 w-4 mr-2" />
              Create New Story
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-8 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-6 md:grid-cols-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.totalStories}</p>
                        <p className="text-sm text-muted-foreground">Total Stories</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Zap className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.completedStories}</p>
                        <p className="text-sm text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.totalWords.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Total Words</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{stats.thisMonth}</p>
                        <p className="text-sm text-muted-foreground">This Month</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="all">All Stories</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search stories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <TabsContent value="recent" className="space-y-4">
                <div className="grid gap-4">
                  {filteredStories.slice(0, 6).map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl">{getTypeIcon(story.type)}</div>
                              <div>
                                <h3 className="font-semibold text-lg">{story.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>{story.type}</span>
                                  <span>•</span>
                                  <span>{story.wordCount.toLocaleString()} words</span>
                                  <span>•</span>
                                  <span>{story.language}</span>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {story.createdAt}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge className={getStatusColor(story.status)}>
                                    {story.status}
                                  </Badge>
                                  {story.tags.slice(0, 3).map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                <div className="grid gap-4">
                  {filteredStories.map((story, index) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Card className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="text-2xl">{getTypeIcon(story.type)}</div>
                              <div>
                                <h3 className="font-semibold text-lg">{story.title}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span>{story.type}</span>
                                  <span>•</span>
                                  <span>{story.wordCount.toLocaleString()} words</span>
                                  <span>•</span>
                                  <span>{story.language}</span>
                                  <span>•</span>
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {story.createdAt}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 mt-2">
                                  <Badge className={getStatusColor(story.status)}>
                                    {story.status}
                                  </Badge>
                                  {story.tags.slice(0, 3).map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="drafts" className="space-y-4">
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drafts yet</h3>
                  <p className="text-muted-foreground mb-4">Start creating to see your drafts here</p>
                  <Button onClick={() => router.push('/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Story
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                <div className="text-center py-12">
                  <Zap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No completed stories yet</h3>
                  <p className="text-muted-foreground mb-4">Complete your stories to see them here</p>
                  <Button onClick={() => router.push('/create')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Story
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  );
}