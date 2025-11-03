import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import Script from "next/script";
import "./globals.css";

const baseUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: "Story AI - Interactive AI Story Writer | Create Your Own Adventure Story Books | Generate Stories for Kids",
  description: "Experience the future of storytelling with Story AI, the ultimate AI interactive story platform. Create, explore, and share unique interactive stories with our advanced AI story writer. Generate stories for kids automatically - Use AI to automatically generate personalized stories for children, including complete plots, characters, and illustration prompts. Generate fantasy, science fiction, romance, horror, mystery, adventure stories and more. Free AI story generator for novels, children's books, and photo books.",
  keywords: "Story AI, AI story writer, AI interactive story, interactive storytelling, AI story generator, AI story maker, AI book creator, story creation platform, AI story platform, story generator, story writer AI, interactive story creator, AI storytelling tool, fantasy story generator, romance story maker, horror story creator, children's story AI, photo book generator, story template, story blueprint, AI writing assistant, story creation tool, creative writing AI, narrative generator, generate stories for kids, auto generate children stories, tell stories to kids, AI children story generator, kids story generator, bedtime stories generator, personalized stories for children, story generator for kids, create children stories",
  icons: {
    icon: "/images/storybook.ico",
    shortcut: "/images/storybook.ico",
    apple: "/images/storybook.ico",
  },
  openGraph: {
    title: "Story AI - Interactive AI Story Writer | Create Your Own Adventure",
    description: "Create your own AI interactive stories with Story AI. Advanced AI story writer platform for generating fantasy, romance, horror, mystery, and adventure stories. Free story creation tool for novels, children's books, and photo books.",
    type: "website",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/images/story-book-2.png`,
        width: 1200,
        height: 630,
        alt: "Story AI - Interactive AI Story Writer Platform for Creating Adventure Stories",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Story AI - Interactive AI Story Writer | Create Your Own Adventure",
    description: "Experience the future of storytelling with Story AI. Create unique interactive stories with our advanced AI story writer. Free AI story generator for all genres.",
  },
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative min-h-screen">
            <Header user={user} />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
          <Script
            id="organization-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Story AI",
                "url": baseUrl,
                "logo": {
                  "@type": "ImageObject",
                  "url": `${baseUrl}/images/storybook.ico`,
                  "width": 512,
                  "height": 512
                },
                "description": "Story AI helps creators generate AI-powered storybooks with illustrations in minutes. Free tool for creating personalized stories, children's books, and photo books."
              })
            }}
          />
          <Script
            id="webpage-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebPage",
                "name": "Story AI - Interactive AI Story Writer | Create Your Own Adventure",
                "url": baseUrl,
                "description": "Experience the future of storytelling with Story AI, the ultimate AI interactive story platform. Create, explore, and share unique interactive stories with our advanced AI story writer.",
                "publisher": {
                  "@type": "Organization",
                  "name": "Story AI",
                  "logo": {
                    "@type": "ImageObject",
                    "url": `${baseUrl}/images/storybook.ico`
                  }
                },
                "mainEntity": {
                  "@type": "SoftwareApplication",
                  "name": "Story AI Interactive Story Writer",
                  "applicationCategory": "WebApplication",
                  "operatingSystem": "Web",
                  "featureList": [
                    "AI Interactive Story Generation",
                    "Story Template Creation",
                    "Multi-Genre Support (Fantasy, Romance, Horror, Mystery, Adventure)",
                    "Character Development",
                    "Story Blueprint Design",
                    "Photo Book Generation"
                  ],
                  "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "USD"
                  }
                }
              })
            }}
          />
          <Script
            id="faq-schema"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is Story AI?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Story AI is an advanced AI interactive story platform that helps you create, explore, and share unique stories. Our AI story writer generates complete interactive stories with characters, plots, and illustrations in minutes."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What genres does Story AI support?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Story AI supports all major story genres including fantasy, science fiction, romance, horror, mystery, adventure, historical fiction, drama, comedy, and action. You can create children's stories, novels, short stories, or photo books."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is Story AI free to use?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes! Story AI offers free story creation with unlimited usage. You can generate interactive stories, design story templates, and create story blueprints without any sign-up requirements."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How does the AI story writer work?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Our AI story writer uses advanced artificial intelligence to generate complete interactive stories. Simply provide a theme or prompt, and our AI creates characters, develops plotlines, generates story scenes, and provides illustration prompts automatically."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How to generate stories for kids automatically?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "With Story AI, you can easily generate personalized stories for kids. Simply enter a story theme or keywords, and our AI story generator will automatically create complete story content including characters, plotlines, scene descriptions, and illustration prompts. The entire process is completely free and requires no registration. Perfect for parents and teachers to create unique bedtime stories and educational stories for children."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What types of children's stories can Story AI generate?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Story AI supports generating various types of children's stories, including fantasy adventures, fairy tales, educational stories, animal stories, friendship stories, and growth stories. Each story includes complete plotlines, vivid character descriptions, and detailed illustration prompts, making it perfect for telling stories to kids."
                    }
                  }
                ]
              })
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
