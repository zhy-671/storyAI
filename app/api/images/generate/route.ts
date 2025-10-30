import { NextRequest, NextResponse } from "next/server";
import { uploadManyImageUrls } from "@/utils/storage/tos";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, model = "doubao-seedream-4-0-250828", maxImages = 3 } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Call Doubao API
    const doubaoResponse = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 24a2112b-fbb2-42a5-b66c-44e4785c598a"
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        sequential_image_generation: "auto",
        sequential_image_generation_options: {
          max_images: maxImages
        },
        response_format: "url",
        size: "2K",
        stream: true,
        watermark: true
      })
    });

    if (!doubaoResponse.ok) {
      const errorData = await doubaoResponse.text();
      console.error("Doubao API error:", errorData);
      return NextResponse.json({ error: "Failed to generate images" }, { status: 500 });
    }

    // Handle streaming response
    const reader = doubaoResponse.body?.getReader();
    if (!reader) {
      return NextResponse.json({ error: "No response body" }, { status: 500 });
    }

    const decoder = new TextDecoder();
    let images = [];
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              if (parsed.data && parsed.data.length > 0) {
                images.push(...parsed.data);
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Upload each image to Volcano TOS and return real URLs
    const originalUrls = images.map((img: any) => img.url).filter(Boolean);
    console.log("[Images][Step 1] Generated image URLs:", originalUrls);
    const uploadedUrls = await uploadManyImageUrls(originalUrls, "storybook/images");
    console.log("[Images][Step 2] Uploaded image URLs:", uploadedUrls);

    const uploadedImages = images.map((img: any, idx: number) => ({ ...img, url: uploadedUrls[idx] || img.url }));

    return NextResponse.json({
      success: true,
      images: uploadedImages,
      count: uploadedImages.length
    });

  } catch (error) {
    console.error("Image generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate images" },
      { status: 500 }
    );
  }
}
