"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wand2, Download, RefreshCw } from "lucide-react";

export default function TestImageGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [testPrompt, setTestPrompt] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  // 测试用的JSON数据
  const testStoryJson = {
    "title": "小兔子的勇敢之旅",
    "summary": "小兔子学会勇敢面对困难的故事",
    "scenes": [
      "小兔子住在森林里，每天都很害怕外面的世界",
      "有一天，小兔子决定走出家门去探险",
      "在路上遇到了友善的小鸟，学会了交朋友",
      "最终小兔子变得勇敢，不再害怕"
    ],
    "scenes_detail": [
      "图片1：小兔子坐在家里，透过窗户看着外面的森林，表情有些害怕，温暖的室内光线",
      "图片2：小兔子鼓起勇气走出家门，站在门口犹豫不决，阳光透过树叶洒下",
      "图片3：小兔子在森林小径上遇到一只彩色的小鸟，两个小动物友好地打招呼",
      "图片4：小兔子和小鸟一起在森林中快乐地玩耍，阳光明媚，充满生机"
    ]
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const handleTestImageGeneration = async () => {
    setIsGenerating(true);
    setGeneratedImages([]);
    setLogs([]);
    
    try {
      addLog("开始测试图片生成...");
      
      // 构建图片prompt
      const imagePrompts = testStoryJson.scenes_detail || [];
      const imagePromptString = imagePrompts.join(" ");
      const finalImagePrompt = `${testPrompt || "儿童故事书"} ${imagePromptString} 最后，为故事书创作一个封面。 再检查所有图片，去除图片中的文字`;
      
      addLog(`图片prompt: ${finalImagePrompt}`);
      addLog(`场景数量: ${imagePrompts.length}`);
      
      // 调用图片生成API
      const response = await fetch('/api/images/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalImagePrompt,
          maxImages: imagePrompts.length + 1 // +1 for cover
        }),
      });

      addLog(`API响应状态: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.text();
        addLog(`API错误: ${errorData}`);
        throw new Error(`API调用失败: ${response.status}`);
      }

      const data = await response.json();
      addLog(`收到响应数据: ${JSON.stringify(data, null, 2)}`);
      
      if (data.images && data.images.length > 0) {
        const imageUrls = data.images.map((img: any) => img.url);
        setGeneratedImages(imageUrls);
        addLog(`成功生成 ${imageUrls.length} 张图片`);
      } else {
        addLog("没有收到图片数据");
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`错误: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleTestStorybookAPI = async () => {
    setIsGenerating(true);
    setGeneratedImages([]);
    setLogs([]);
    
    try {
      addLog("开始测试完整故事书生成...");
      
      const response = await fetch('/api/storybook/generate-stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt || "一个小兔子学会勇敢的故事",
          referenceImages: []
        }),
      });

      addLog(`API响应状态: ${response.status}`);
      
      if (!response.ok) {
        throw new Error('请求失败');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法读取响应');
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
                addLog(`收到数据: ${JSON.stringify(parsed, null, 2)}`);
                
                if (parsed.type === 'complete') {
                  const storybook = parsed.storybook;
                  if (storybook.images && storybook.images.length > 0) {
                    setGeneratedImages(storybook.images);
                    addLog(`故事书生成完成: ${storybook.title}`);
                  }
                }
              } catch (parseError) {
                const parseErrorMessage = parseError instanceof Error ? parseError.message : String(parseError);
                addLog(`解析错误: ${parseErrorMessage}`);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      addLog(`错误: ${errorMessage}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            图片生成测试页面
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            测试豆包图片生成API的功能
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* 左侧：控制面板 */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>测试控制</CardTitle>
                <CardDescription>选择测试方式和输入参数</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">测试提示词（可选）</label>
                  <textarea
                    value={testPrompt}
                    onChange={(e) => setTestPrompt(e.target.value)}
                    placeholder="输入测试提示词，如：一个小兔子学会勇敢的故事"
                    className="w-full h-20 p-3 border rounded-md resize-none"
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button
                    onClick={handleTestImageGeneration}
                    disabled={isGenerating}
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        测试图片生成
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={handleTestStorybookAPI}
                    disabled={isGenerating}
                    variant="outline"
                    className="flex-1"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        生成中...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        测试完整API
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 测试数据 */}
            <Card>
              <CardHeader>
                <CardTitle>测试数据</CardTitle>
                <CardDescription>使用的JSON测试数据</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-auto max-h-60">
                  {JSON.stringify(testStoryJson, null, 2)}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* 右侧：结果展示 */}
          <div className="space-y-6">
            {/* 日志 */}
            <Card>
              <CardHeader>
                <CardTitle>执行日志</CardTitle>
                <CardDescription>API调用和响应的详细日志</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-60 overflow-auto">
                  {logs.length === 0 ? (
                    <div className="text-gray-500">等待执行...</div>
                  ) : (
                    logs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* 生成的图片 */}
            {generatedImages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>生成的图片</CardTitle>
                  <CardDescription>共生成 {generatedImages.length} 张图片</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {generatedImages.map((imageUrl, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={imageUrl}
                          alt={`Generated image ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg shadow-lg"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 rounded-lg flex items-center justify-center">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            onClick={() => window.open(imageUrl, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            查看大图
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          图片 {index + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
