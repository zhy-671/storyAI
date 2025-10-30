import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, genre, tone, length, language, targetAge, readingLevel, planType } = body;

    // Validate required fields
    if (!prompt || !genre || !tone || !length || !language || !planType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check user credits
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("credits")
      .eq("id", user.id)
      .single();

    if (userError || !userData) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const requiredCredits = planType === "1" ? 1 : 4;
    if (userData.credits < requiredCredits) {
      return NextResponse.json({ error: "Insufficient credits" }, { status: 400 });
    }

    // Generate story using OpenAI
    const openai = require("openai");
    const client = new openai.OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const systemPrompt = `You are a professional story generator. Create ${planType} ${genre} story(ies) based on the user's prompt.

Requirements:
- Genre: ${genre}
- Tone: ${tone}
- Length: ${length}
- Language: ${language}
- Target Age: ${targetAge || "Not specified"}
- Reading Level: ${readingLevel || "Not specified"}

For each story, provide:
1. Title
2. Complete story content
3. Character descriptions
4. Plot summary
5. Theme
6. Cultural notes (if applicable)

Format the response as JSON with an array of stories.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: 4000,
      temperature: 0.7,
    });

    const generatedContent = completion.choices[0].message.content;
    let stories;
    
    try {
      stories = JSON.parse(generatedContent);
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      stories = [{
        title: "Generated Story",
        content: generatedContent,
        genre: genre,
        tone: tone,
        length: length,
        characters: [],
        plot: "Generated from user prompt",
        theme: "User-specified theme",
        language: language
      }];
    }

    // Ensure stories is an array
    if (!Array.isArray(stories)) {
      stories = [stories];
    }

    // Update user credits
    const { error: updateError } = await supabase
      .from("users")
      .update({ credits: userData.credits - requiredCredits })
      .eq("id", user.id);

    if (updateError) {
      console.error("Error updating credits:", updateError);
      return NextResponse.json({ error: "Failed to update credits" }, { status: 500 });
    }

    // Save generation to database
    const { data: batchData, error: batchError } = await supabase
      .from("generation_batches")
      .insert({
        user_id: user.id,
        generation_type: "story",
        total_stories_generated: stories.length,
        credits_used: requiredCredits,
        status: "completed"
      })
      .select()
      .single();

    if (batchError) {
      console.error("Error saving batch:", batchError);
    }

    return NextResponse.json({
      success: true,
      stories: stories,
      creditsUsed: requiredCredits,
      remainingCredits: userData.credits - requiredCredits,
      batch: batchData,
      generationRound: 1,
      isContinuation: false,
      message: `Successfully generated ${stories.length} story(ies)`
    });

  } catch (error) {
    console.error("Story generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate story" },
      { status: 500 }
    );
  }
}
