import { NextRequest, NextResponse } from "next/server";
import { uploadManyImageUrls } from "@/utils/storage/tos";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, referenceImages = [] } = body;

    // Validate required fields
    if (!prompt) {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    // Step 1: Generate story content using Doubao text model
    console.log("[Storybook][Step 1] Start: Generate story content");
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
      const errorData = await storyResponse.text();
      console.error("Doubao story generation error:", errorData);
      return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
    }

    const storyData = await storyResponse.json();
    const storyContent = storyData.choices[0].message.content;
    
    let storyJson;
    try {
      storyJson = JSON.parse(storyContent);
    } catch (parseError) {
      console.error("[Storybook][Step 1] Parse story JSON failed:", parseError);
      return NextResponse.json({ error: "Failed to parse story content" }, { status: 500 });
    }
    console.log("[Storybook][Step 1] Done: Story parsed with title:", storyJson?.title);

    // Step 2: Generate images using scenes_detail
    const imagePrompts = storyJson.scenes_detail || [];
    const imagePromptString = imagePrompts.join(" ");
    const finalImagePrompt = `${prompt} ${imagePromptString} Finally, create a cover for the storybook. Then check all the images and remove any text from them.`;

    console.log("[Storybook][Step 2] Start: Generate images");
    const imageResponse = await fetch("https://ark.cn-beijing.volces.com/api/v3/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 24a2112b-fbb2-42a5-b66c-44e4785c598a"
      },
      body: JSON.stringify({
        model: "doubao-seedream-4-0-250828",
        prompt: finalImagePrompt,
        image: referenceImages,
        sequential_image_generation: "auto",
        sequential_image_generation_options: {
          max_images: imagePrompts.length + 1 // +1 for cover
        },
        response_format: "url",
        size: "2K",
        stream: true,
        watermark: true
      })
    });

    if (!imageResponse.ok) {
      const errorData = await imageResponse.text();
      console.error("[Storybook][Step 2] Doubao image generation error:", errorData);
      return NextResponse.json({ error: "Failed to generate images" }, { status: 500 });
    }

    // Handle streaming response for images
    const reader = imageResponse.body?.getReader();
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
    console.log("[Storybook][Step 2] Done: Images generated count:", images.length);
    const originalUrls = images.map((img: any) => img.url).filter(Boolean);
    console.log("[Storybook][Step 2] Generated image URLs:", originalUrls);

    // Upload images to TOS and replace URLs
    console.log("[Storybook][Step 3] Start: Upload images to TOS, count:", originalUrls.length);
    const uploadedUrls = await uploadManyImageUrls(originalUrls, "storybook/images");
    console.log("[Storybook][Step 3] Done: Uploaded to TOS");
    console.log("[Storybook][Step 3] Uploaded image URLs:", uploadedUrls);

    // Step 3: Combine story and images with uploaded URLs
    console.log("[Storybook][Step 4] Start: Build final JSON");
    const storybook = {
      ...storyJson,
      images: uploadedUrls,
      coverImage: uploadedUrls[0],
      pageImages: uploadedUrls.slice(1)
    };
    console.log("[Storybook][Step 4] Done: Final JSON ready");

    console.log("[Storybook][Step 5] Ready to save to DB on client request");
    return NextResponse.json({
      success: true,
      storybook: storybook,
      storyContent: storyJson,
      images: uploadedUrls.map(url => ({ url })),
      imageCount: uploadedUrls.length
    });

  } catch (error) {
    console.error("Storybook generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate storybook" },
      { status: 500 }
    );
  }
}
