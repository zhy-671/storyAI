"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function CreditsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const packs = [
    { id: "starter", productId: "prod_4empHxretatXGF5QDbzKkO", credits: 30, name: "Starter Pack", desc: "Perfect for first-time creators", price: "$9.99", detail: "30 Credits · 10 Generations", highlight: false },
    { id: "standard", productId: "prod_2ftgfVw62UIeah2rfhTxH2", credits: 100, name: "Standard Pack", desc: "For regular storytellers", price: "$29.99", detail: "100 Credits · 33 Generations", highlight: false },
    { id: "pro", productId: "prod_3kgAMq0cFcKariXrvemDGJ", credits: 300, name: "Pro Pack", desc: "Most popular among creators", price: "$69.99", detail: "300 Credits · 100 Generations", highlight: true },
    { id: "creator", productId: "prod_2jSDE8g41GeKAJ8Dyis1dp", credits: 1000, name: "Creator Pack", desc: "For professional AI storytellers", price: "$199", detail: "1000 Credits · 333 Generations", highlight: false },
  ];

  const handleBuy = async (pack: (typeof packs)[number]) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to purchase credits." });
      router.push('/sign-in');
      return;
    }
    setLoadingId(pack.id);
    try {
      const res = await fetch('/api/creem/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: pack.productId, credits: pack.credits }),
      });
      const data = await res.json();
      if (!res.ok || !data?.checkoutUrl) {
        throw new Error(data?.error || 'Failed to create checkout');
      }
      window.location.href = data.checkoutUrl as string;
    } catch (e: any) {
      toast({ title: 'Checkout failed', description: e?.message || 'Please try again later' });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 1. 标题区 */}
      <section className="text-center py-12 bg-muted/30">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold mb-2">Buy Credits — Unlock Limitless Story Creation</h1>
          <p className="text-lg text-muted-foreground">
            Use your credits to generate AI storybooks, illustrations, and creative ideas instantly.
          </p>
        </motion.div>
      </section>

      {/* 2. 购买卡片区 */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 px-6 py-12 max-w-6xl mx-auto">
        {packs.map((p, i) => (
          <motion.div key={p.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className={`${p.highlight ? 'border-2 border-blue-500 bg-blue-50 shadow-md relative' : 'border bg-white shadow-sm'} rounded-2xl p-6`}>
            {p.highlight && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm rounded-bl-xl">Best Value</div>
            )}
            <h3 className="text-xl font-semibold mb-2">{p.name}</h3>
            <p className="text-muted-foreground mb-4">{p.desc}</p>
            <p className={`text-4xl font-bold mb-2 ${p.highlight ? 'text-blue-600' : ''}`}>{p.price}</p>
            <p className="text-muted-foreground mb-4">{p.detail}</p>
            <Button className={`${p.highlight ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''} w-full py-2 rounded-xl`} onClick={() => handleBuy(p)} disabled={loadingId === p.id}>
              {loadingId === p.id ? 'Processing...' : 'Buy Now'}
            </Button>
          </motion.div>
        ))}
      </section>

      {/* 3. 购买激励区 */}
      <section className="text-center py-10 bg-muted/40">
        <h2 className="text-2xl font-semibold mb-4">✨ Special Bonus</h2>
        <p className="text-muted-foreground mb-2">
          New users get <strong>3 free credits</strong> — enough to generate your first AI storybook!
        </p>
        <p className="text-muted-foreground">
          Plus, earn <strong>10% extra credits</strong> when you purchase the Pro or Creator Pack.
        </p>
      </section>

      {/* 4. SEO 底部介绍 */}
      <section className="max-w-5xl mx-auto px-6 py-10 text-foreground/80 text-sm leading-relaxed">
        <h2 className="text-lg font-semibold mb-2">About Story AI Create Story Book</h2>
        <p>
          Story AI Create Story Book is a creative platform that uses artificial intelligence to help you write and illustrate storybooks instantly.
          Use your credits to generate stories, images, and characters effortlessly — all powered by AI. Whether you’re creating bedtime stories, fantasy adventures, or comic-style photo books, our story AI brings imagination to life.
        </p>
        <p className="mt-3">
          Start your storytelling journey today and explore what’s possible with Story AI Create Story Book — where creativity meets technology.
        </p>
      </section>
    </div>
  );
}


