import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { uploadImageFromUrl } from "@/utils/storage/tos";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    // Require authentication for server-side generation (custom prompts)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse body early to inspect guest token (for unauthenticated flow)
    const body = await request.json();
    const { prompt, referenceImages = [] } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Credits-only mode: no per-day/guest quotas here. Frontend has already charged credits.

    // Create a ReadableStream for Server-Sent Events
    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        
        // Helper function to send status updates
        const sendStatus = (status: string, step?: string) => {
          const data = JSON.stringify({ 
            type: 'status', 
            status, 
            step,
            timestamp: new Date().toISOString()
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        };

        try {
          // Step 1: Generate story content
          console.log("[Stream][Step 1] Start: Generate story content");
          sendStatus("Currently creating a picture book", "Generate story content...");
          
          const storyResponse = await fetch("https://ark.cn-beijing.volces.com/api/v3/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer 24a2112b-fbb2-42a5-b66c-44e4785c598a"
            },
            body: JSON.stringify({
              model: "doubao-seed-1-6-251015",
              messages: [
                {
                  role: "system",
                  content: `# rol

You are a **master English picture book creator**.

## Task

Create English picture book content for a specific reader group (children/teenagers/adults/all people), characterized by coherent plots, engaging stories, rich and warm emotions, and relatable content, with storyboards, text, and illustrations arranged strictly in chronological order.**:

- Core Constraint: **Storyboard breakdown → Text (scenes) → Illustration description (scenes_detail) must be bound in a 1:1 sequence**, progressing chronologically from the beginning to the end of the story, like "playing a movie," with no misalignment.

## Workflow

1. Fully understand user needs. Prioritize executing according to the user's specific creative requirements (if any).

2. **Story Conception:** Create a storyline that accurately responds to user needs and provides emotional comfort. The entire story must revolve around "empathy" and "emotional value."

3. **Storyboard Structure and Quantity:**

* Condense the story into **5~10** key scenes, with a maximum of 10 (no more than 10).

* Must follow a clear narrative arc: Beginning → Development → Climax → Resolution.
5. **Book Title ("title" field):**

* Develop a concise, memorable, and creative book title.

* The title must cleverly summarize the essence of the story and instantly resonate with the target audience's emotions.

6. **Story Summary ("summary" field):**

* Create a summary sentence of **no more than 30 english characters**.

* The summary must highly condense the core ideas and emotional value of the story.

7. Output Integration: Organize and output all content in the specified JSON format.
## Security Restrictions The generated content must strictly adhere to the following regulations:

1. **No Violence and Gore:** No detailed descriptions of violence, injury, gore, or disturbing images are permitted.

2. **No Pornographic Content:** No pornographic, sexually suggestive, or inappropriate nudity is permitted.

3. **No Hate and Discrimination:** No hate speech, discrimination, or offensive language targeting any group (based on race, religion, gender, sexual orientation, etc.) is permitted.

4. **No Illegal and Dangerous Behavior:** No depiction or encouragement of illegal activities, self-harm, or dangerous behavior is permitted.

5. **Ensure Universal Appropriateness:** The overall content should remain within the bounds of generally acceptable artistic creation, avoiding extremely controversial topics.
## Output Format Requirements
Organize the data into the following JSON format. The scenes and scenes_detail should be in the same order as the storyboard shots, and correspond one-to-one. There should be a maximum of 10 scenes (no more than 10):
{  
 "title": "Book Title",

"summary": "Summary within 30 words",

"scenes": [
"The text for Scene 1, using 50 words to convey emotions and feelings, evoking reader resonance, and the language style must conform to the setting."

"The text for Scene 2"

],

"scenes_detail": [
"Image 1: This is the description of the scene on the first page. It must begin with 'Image' + number. It should have a strong visual impact, describing the composition (e.g., close-up, long shot), lighting, color, character expressions, actions, and environmental details, conforming to the requirements of the raw image prompts."

"Image 2:"

]
}`
                },
                {
                  role: "user",
                  content: prompt
                }
              ],
              temperature: 0.7,
              max_tokens: 4000
            })
          });

          if (!storyResponse.ok) {
            throw new Error("故事生成失败");
          }

          const storyData = await storyResponse.json();
          const storyContent = storyData.choices[0].message.content;
          
          console.log("[Stream][Step 1] Story content received");
          
          let storyJson;
          try {
            storyJson = JSON.parse(storyContent);
            console.log("[Stream][Step 1] Story JSON parsed, title:", storyJson?.title);
          } catch (parseError) {
            console.error("[Stream][Step 1] Parse JSON failed:", parseError);
            throw new Error("故事内容解析失败");
          }

          console.log("[Stream][Step 1] Done");
          sendStatus("Currently creating a picture book", "The story content is complete; let's start drawing the cover....");

          // Step 2: Generate images - 优先生成封面
          const imagePrompts = storyJson.scenes_detail || [];
          const scenesTexts = Array.isArray(storyJson.scenes) ? storyJson.scenes : [];

          // 基础页数组，后续为每页填充 image
          let pages = (scenesTexts as string[]).map((text: string, idx: number) => ({
            index: idx + 1,
            text,
            detail: imagePrompts[idx] || "",
            image: ""
          }));
          
          // 先单独生成封面
          const coverPrompt = `${prompt} Create a beautiful cover for this storybook.，${imagePrompts[0] || 'A heartwarming children\'s storybook cover'}`;
          
          console.log("[Stream][Step 2] Start: Generate cover image");
          sendStatus("Currently creating a picture book", "Drawing cover...");
          
          const coverResponse = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer 24a2112b-fbb2-42a5-b66c-44e4785c598a"
            },
            body: JSON.stringify({
              model: "doubao-seedream-4-0-250828",
              prompt: coverPrompt,
              image: referenceImages,
              sequential_image_generation: "auto",
              sequential_image_generation_options: {
                max_images: 1
              },
              response_format: "url",
              size: "2K",
              stream: true,
              watermark: false
            })
          });

          console.log("[Stream][Step 2] Cover API status:", coverResponse.status);
          
          if (!coverResponse.ok) {
            const errorText = await coverResponse.text();
            console.error("封面生成失败 - 响应内容:", errorText);
            throw new Error(`封面生成失败: ${coverResponse.status} - ${errorText}`);
          }

          // 处理封面流式响应
          const coverReader = coverResponse.body?.getReader();
          if (!coverReader) {
            throw new Error("封面响应读取失败");
          }

          const coverDecoder = new TextDecoder();
          let coverImages = [];
          let coverBuffer = "";

          try {
            while (true) {
              const { done, value } = await coverReader.read();
              if (done) break;

              coverBuffer += coverDecoder.decode(value, { stream: true });
              const lines = coverBuffer.split('\n');
              coverBuffer = lines.pop() || "";

              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') continue;

                  try {
                    const parsed = JSON.parse(data);
                    // 兼容两种格式：{ data: [{url}] } 或 { url: "...", type: "image_generation.partial_succeeded" }
                    let newUrls: string[] = [];
                    if (parsed?.data && Array.isArray(parsed.data)) {
                      for (const item of parsed.data) {
                        if (item?.url) newUrls.push(item.url);
                      }
                    } else if (parsed?.url) {
                      newUrls.push(parsed.url);
                    } else if (Array.isArray(parsed?.images)) {
                      for (const u of parsed.images) if (u) newUrls.push(u);
                    }

                    if (newUrls.length > 0) {
                      console.log("[Stream][Step 2] Cover generated URL:", newUrls[0]);
                      // 上传第一张封面并替换为真实路径
                      console.log("[Stream][Step 3] Upload cover start");
                      const uploadedCoverUrl = await uploadImageFromUrl(newUrls[0], { keyPrefix: "storybook/images" });
                      coverImages.push({ url: uploadedCoverUrl });
                      console.log("[Stream][Step 3] Upload cover done:", uploadedCoverUrl);

                      // 发送封面进度
                      const coverStorybook = {
                        ...storyJson,
                        images: coverImages.map(img => img.url),
                        coverImage: coverImages[0]?.url,
                        pageImages: [],
                        pages,
                        currentImageCount: 1,
                        totalImages: imagePrompts.length + 1
                      };

                      const coverProgressData = JSON.stringify({
                        type: 'progress',
                        storybook: coverStorybook,
                        currentStep: 1,
                        totalSteps: imagePrompts.length + 1,
                        timestamp: new Date().toISOString()
                      });
                      controller.enqueue(encoder.encode(`data: ${coverProgressData}\n\n`));

                      sendStatus("Currently creating a picture book", "The cover is finished; now I'll start drawing the illustration for page 1....");
                    }
                    } catch (e) {
                    const msg = e instanceof Error ? e.message : String(e);
                    console.log("封面JSON解析失败，跳过:", msg);
                  }
                }
              }
            }
          } finally {
            coverReader.releaseLock();
          }

          // 然后生成页面插图
          console.log("[Stream][Step 2] Done: Cover generated");
          let allImages = [...coverImages];
          
          for (let i = 0; i < imagePrompts.length; i++) {
            const pagePrompt = `${prompt} ${imagePrompts[i]} For the storybook${i + 1}Page creative illustration`;
            
            console.log(`[Stream][Step 2] Start: Generate page ${i + 1} image`);
            sendStatus("Currently creating a picture book", `Drawing No ${i + 1} page illustration...`);
            
            const pageResponse = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer 24a2112b-fbb2-42a5-b66c-44e4785c598a"
              },
              body: JSON.stringify({
                model: "doubao-seedream-4-0-250828",
                prompt: pagePrompt,
                image: referenceImages,
                sequential_image_generation: "auto",
                sequential_image_generation_options: {
                  max_images: 1
                },
                response_format: "url",
                size: "2K",
                stream: true,
                watermark: false
              })
            });

            if (!pageResponse.ok) {
              console.error(`第${i + 1}页插图生成失败`);
              continue;
            }

            // 处理页面插图流式响应
            const pageReader = pageResponse.body?.getReader();
            if (!pageReader) continue;

            const pageDecoder = new TextDecoder();
            let pageImages = [];
            let pageBuffer = "";

            try {
              while (true) {
                const { done, value } = await pageReader.read();
                if (done) break;

                pageBuffer += pageDecoder.decode(value, { stream: true });
                const lines = pageBuffer.split('\n');
                pageBuffer = lines.pop() || "";

                for (const line of lines) {
                  if (line.startsWith('data: ')) {
                    const data = line.slice(6);
                    if (data === '[DONE]') continue;

                    try {
                      const parsed = JSON.parse(data);
                      // 同样兼容 {data:[{url}]} 或 {url}
                      let newUrls: string[] = [];
                      if (parsed?.data && Array.isArray(parsed.data)) {
                        for (const item of parsed.data) {
                          if (item?.url) newUrls.push(item.url);
                        }
                      } else if (parsed?.url) {
                        newUrls.push(parsed.url);
                      } else if (Array.isArray(parsed?.images)) {
                        for (const u of parsed.images) if (u) newUrls.push(u);
                      }

                      if (newUrls.length > 0) {
                        console.log(`[Stream][Step 2] Page ${i + 1} generated URL:`, newUrls[0]);
                        console.log(`[Stream][Step 3] Upload page ${i + 1} start`);
                        const uploadedUrl = await uploadImageFromUrl(newUrls[0], { keyPrefix: "storybook/images" });
                        const normalized = { url: uploadedUrl };
                        pageImages.push(normalized);
                        allImages.push(normalized);

                        console.log(`[Stream][Step 3] Upload page ${i + 1} done:`, uploadedUrl);

                        // 为对应页写入图片地址
                        if (pages[i] && !pages[i].image) {
                          pages[i].image = uploadedUrl;
                        }

                        // 发送页面进度
                        const pageStorybook = {
                          ...storyJson,
                          images: allImages.map(img => img.url),
                          coverImage: allImages[0]?.url,
                          pageImages: allImages.slice(1).map(img => img.url),
                          pages,
                          currentImageCount: allImages.length,
                          totalImages: imagePrompts.length + 1
                        };

                        const pageProgressData = JSON.stringify({
                          type: 'progress',
                          storybook: pageStorybook,
                          currentStep: allImages.length,
                          totalSteps: imagePrompts.length + 1,
                          timestamp: new Date().toISOString()
                        });
                        controller.enqueue(encoder.encode(`data: ${pageProgressData}\n\n`));

                        if (i < imagePrompts.length - 1) {
                          sendStatus("Currently creating a picture book", `NO ${i + 1} page illustrations are complete; begin drawing the next page.${i + 2}page illustration...`);
                        } else {
                          sendStatus("Currently creating a picture book", "All illustrations are complete, and final adjustments are being made....");
                        }
                      }
                    } catch (e) {
                      const msg = e instanceof Error ? e.message : String(e);
                      console.log(`第${i + 1}页JSON解析失败，跳过:`, msg);
                    }
                  }
                }
              }
            } finally {
              pageReader.releaseLock();
            }
          }

          // Step 3: Send final result
          const storybook = {
            ...storyJson,
            images: allImages.map(img => img.url),
            coverImage: allImages[0]?.url,
            pageImages: allImages.slice(1).map(img => img.url),
            pages
          };

          console.log("最终故事书结果:");
          console.log("故事书数据:", JSON.stringify(storybook, null, 2));
          console.log("图片数量:", allImages.length);
          console.log("封面图片:", storybook.coverImage);
          console.log("页面图片:", storybook.pageImages);

          sendStatus("Creation completed", "The picture book is complete!");
          
          const finalData = JSON.stringify({ 
            type: 'complete', 
            storybook,
            timestamp: new Date().toISOString()
          });
          controller.enqueue(encoder.encode(`data: ${finalData}\n\n`));

        } catch (error) {
          const msg = error instanceof Error ? error.message : String(error);
          const errorData = JSON.stringify({ 
            type: 'error', 
            error: msg,
            timestamp: new Date().toISOString()
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error("Storybook generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate storybook" },
      { status: 500 }
    );
  }
}
