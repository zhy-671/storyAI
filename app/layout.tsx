import Header from "@/components/header";
import { Footer } from "@/components/footer";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/utils/supabase/server";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

const baseUrl = process.env.BASE_URL
  ? `https://${process.env.BASE_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: " Story AI Create Story Book｜Free AI Story & Photo Book Generator",
  description: "Create your own AI story and photo books for free! Supports horror, fantasy, romance, school life, anime, and more. No sign-up required, unlimited usage, perfect for short stories, novels, or fully illustrated books.",
  keywords: "Story AI, Create Story Book, AI story generator, AI story maker, AI book creator",
  icons: {
    icon: "/images/storybook.ico",
    shortcut: "/images/storybook.ico",
    apple: "/images/storybook.ico",
  },
  openGraph: {
    title: "Story AI & Photo Book Generator｜Free Picture & Story Creation Tool",
    description: "Create your own AI story and photo books for free! Supports horror, fantasy, romance, school life, anime, and more. No sign-up required, unlimited usage.",
    type: "website",
    url: baseUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Storybooks - Develop Your Child's Reading Skills with Story AI",
    description: "Easily create personalized stories that build literacy, creativity, and social-emotional intelligence. Make storytime fun, magical, and enriching.,Create your own Story AI and photo books for free! Supports all genres with illustration prompts.",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
