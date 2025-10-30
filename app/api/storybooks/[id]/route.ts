import { NextResponse } from "next/server";

export async function GET(_req: Request, context: { params: { id: string } }) {
  const id = context.params.id;
  const map: Record<string, any> = {
    cat: {
      id: "cat",
      title: "Sunny Kitten",
      description: "A warm bedtime picture book about a smiling kitten",
      icon: "🐱",
      featured: true,
      bookcontent: "/samples/storybook_sample_cat.json",
    },
    sample: {
      id: "sample",
      title: "Star Lamp in the Ruins",
      description: "A healing story about light and courage",
      icon: "⭐",
      featured: true,
      bookcontent: "/samples/storybook_sample.json",
    },
  };
  const item = map[id] || null;
  if (!item) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(item);
}


