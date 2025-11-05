"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUser } from "@/hooks/use-user";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Coins, Sparkles, Zap, Check, Star, Gift, Repeat } from "lucide-react";

export default function CreditsPage() {
  const router = useRouter();
  const { user } = useUser();
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [subscriptionLoadingId, setSubscriptionLoadingId] = useState<string | null>(null);

  const packs = [
    { 
      id: "starter", 
      productId: "prod_4empHxretatXGF5QDbzKkO", 
      credits: 30, 
      name: "Starter Pack", 
      desc: "Perfect for first-time creators", 
      price: "$9.99", 
      detail: "30 Credits · 10 Generations", 
      highlight: false,
      icon: <Zap className="h-6 w-6" />,
    },
    { 
      id: "standard", 
      productId: "prod_2ftgfVw62UIeah2rfhTxH2", 
      credits: 100, 
      name: "Standard Pack", 
      desc: "For regular storytellers", 
      price: "$29.99", 
      detail: "100 Credits · 33 Generations", 
      highlight: false,
      icon: <Coins className="h-6 w-6" />,
    },
    { 
      id: "pro", 
      productId: "prod_3kgAMq0cFcKariXrvemDGJ", 
      credits: 300, 
      name: "Pro Pack", 
      desc: "Most popular among creators", 
      price: "$69.99", 
      detail: "300 Credits · 100 Generations", 
      highlight: true,
      bonus: "10% Bonus",
      icon: <Star className="h-6 w-6" />,
    },
    { 
      id: "creator", 
      productId: "prod_2jSDE8g41GeKAJ8Dyis1dp", 
      credits: 1000, 
      name: "Creator Pack", 
      desc: "For professional AI storytellers", 
      price: "$199", 
      detail: "1000 Credits · 333 Generations", 
      highlight: false,
      bonus: "10% Bonus",
      icon: <Sparkles className="h-6 w-6" />,
    },
  ];

  const subscriptions = [
    {
      id: "basic",
      productId: "prod_2Sus73lymqYrHndxgQpkby", // TODO: Replace with actual Creem product ID
      credits: 40,
      name: "Basic Plan",
      desc: "For light creators",
      price: "$9.99",
      period: "/month",
      detail: "40 Credits / month",
      highlight: false,
      icon: <Zap className="h-6 w-6" />,
      savings: "$13.33 value",
    },
    {
      id: "pro",
      productId: "prod_7w8BMHPCpe3n16UXQNNEW", // TODO: Replace with actual Creem product ID
      credits: 120,
      name: "Pro Plan",
      desc: "Most popular for creators",
      price: "$19.99",
      period: "/month",
      detail: "120 Credits / month",
      highlight: true,
      icon: <Star className="h-6 w-6" />,
      savings: "$29.99 value",
    },
    {
      id: "creator",
      productId: "prod_2Sus73lymqYrHndxgQpkby", // TODO: Replace with actual Creem product ID
      credits: 300,
      name: "Creator Plan",
      desc: "For advanced creators",
      price: "$39.99",
      period: "/month",
      detail: "300 Credits / month",
      highlight: false,
      icon: <Sparkles className="h-6 w-6" />,
      savings: "$69.99 value",
    },
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

  const handleSubscribe = async (subscription: (typeof subscriptions)[number]) => {
    if (!user) {
      toast({ title: "Sign in required", description: "Please sign in to subscribe." });
      router.push('/sign-in');
      return;
    }
    setSubscriptionLoadingId(subscription.id);
    try {
      const res = await fetch('/api/creem/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: subscription.productId, credits: subscription.credits }),
      });
      const data = await res.json();
      if (!res.ok || !data?.checkoutUrl) {
        throw new Error(data?.error || 'Failed to create subscription');
      }
      window.location.href = data.checkoutUrl as string;
    } catch (e: any) {
      toast({ title: 'Subscription failed', description: e?.message || 'Please try again later' });
    } finally {
      setSubscriptionLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-8 md:py-12">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 dark:from-purple-500/5 dark:via-pink-500/5 dark:to-blue-500/5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]" />
        
        <div className="container relative px-4 md:px-6 max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 mb-2">
              <Gift className="h-3 w-3" />
              <span className="text-xs font-semibold">New Users Get 5 Free Credits!</span>
            </div>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400">
              Unlock Limitless Story Creation
            </h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into beautiful AI-generated storybooks with our powerful credit system
            </p>
          </motion.div>
        </div>
      </section>

      {/* Tabs for Credits Packs and Subscriptions */}
      <section className="container px-4 md:px-6 py-6 md:py-8 max-w-7xl mx-auto">
        <Tabs defaultValue="subscription" className="w-full">
          <div className="flex justify-center mb-8 md:mb-12 px-2">
            <TabsList className="flex md:inline-flex h-10 md:h-12 w-full max-w-full md:w-auto items-center justify-center rounded-full bg-muted p-1 md:p-1.5 shadow-lg border border-border/50 backdrop-blur-sm gap-1">
              <TabsTrigger 
                value="credits" 
                className="flex-1 md:flex-initial flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-200 font-medium md:font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:via-pink-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md md:data-[state=active]:scale-105 min-w-0 shrink"
                style={{ fontSize: 'clamp(0.625rem, 2vw, 0.875rem)' }}
              >
                <Coins className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Credit Packs</span>
              </TabsTrigger>
              <TabsTrigger 
                value="subscription" 
                className="flex-1 md:flex-initial flex items-center justify-center gap-1 md:gap-2 px-2 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-200 font-medium md:font-semibold data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:via-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-md md:data-[state=active]:scale-105 min-w-0 shrink"
                style={{ fontSize: 'clamp(0.625rem, 2vw, 0.875rem)' }}
              >
                <Repeat className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                <span className="whitespace-nowrap">Subscription</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Credit Packs Tab */}
          <TabsContent value="credits" className="mt-0">
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
              {packs.map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative group flex-shrink-0 w-[calc(25%-0.75rem)] min-w-[260px] md:min-w-0 md:w-auto snap-start ${
                pack.highlight
                  ? 'md:-mt-4 md:mb-4 md:scale-105 z-10'
                  : ''
              }`}
            >
              <div
                className={`h-full rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                  pack.highlight
                    ? 'bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 text-white shadow-2xl shadow-purple-500/50 border-4 border-purple-400/50'
                    : 'bg-card border-2 border-border hover:border-primary/50 shadow-lg hover:shadow-2xl dark:bg-card/50 backdrop-blur-sm'
                }`}
              >
                {pack.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Star className="h-4 w-4 fill-current" />
                      Best Value
                    </div>
                  </div>
                )}

                {pack.bonus && (
                  <div className={`absolute -top-3 -right-3 ${pack.highlight ? 'bg-yellow-400 text-purple-900' : 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white'} px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1`}>
                    <Sparkles className="h-3 w-3" />
                    {pack.bonus}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${
                    pack.highlight 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {pack.icon}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className={`text-2xl font-bold mb-2 ${pack.highlight ? 'text-white' : ''}`}>
                      {pack.name}
                    </h3>
                    <p className={`text-sm ${pack.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {pack.desc}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-extrabold ${pack.highlight ? 'text-white' : ''}`}>
                        {pack.price}
                      </span>
                    </div>
                    <p className={`text-sm ${pack.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {pack.detail}
                    </p>
                    {pack.bonus && (
                      <p className={`text-sm font-semibold ${pack.highlight ? 'text-yellow-300' : 'text-primary'}`}>
                        +{Math.floor(pack.credits * 0.1)} bonus credits!
                      </p>
                    )}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    <li className={`flex items-center gap-2 text-sm ${pack.highlight ? 'text-white/90' : 'text-foreground/70'}`}>
                      <Check className={`h-4 w-4 ${pack.highlight ? 'text-white' : 'text-primary'}`} />
                      {pack.credits} Credits
                    </li>
                    <li className={`flex items-center gap-2 text-sm ${pack.highlight ? 'text-white/90' : 'text-foreground/70'}`}>
                      <Check className={`h-4 w-4 ${pack.highlight ? 'text-white' : 'text-primary'}`} />
                      {Math.floor(pack.credits / 3)} Story Generations
                    </li>
                    <li className={`flex items-center gap-2 text-sm ${pack.highlight ? 'text-white/90' : 'text-foreground/70'}`}>
                      <Check className={`h-4 w-4 ${pack.highlight ? 'text-white' : 'text-primary'}`} />
                      Instant Access
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleBuy(pack)}
                    disabled={loadingId === pack.id}
                    className={`w-full py-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                      pack.highlight
                        ? 'bg-white text-purple-600 hover:bg-white/90 hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {loadingId === pack.id ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Subscription Plans Tab */}
          <TabsContent value="subscription" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-8 mb-12"
            >
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 border border-primary/20">
                <Repeat className="h-5 w-5 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold">Subscribe and Save More</h2>
              </div>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Get fresh credits every month and unlock continuous story creation — no need to top up manually.
              </p>
            </motion.div>

            <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 lg:gap-8 overflow-x-auto md:overflow-visible pb-4 md:pb-0 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
              {subscriptions.map((sub, i) => (
            <motion.div
              key={sub.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className={`relative group flex-shrink-0 w-[calc(33.333%-0.67rem)] min-w-[280px] md:min-w-0 md:w-auto snap-start ${
                sub.highlight
                  ? 'md:-mt-4 md:mb-4 md:scale-105 z-10'
                  : ''
              }`}
            >
              <div
                className={`h-full rounded-3xl p-6 md:p-8 transition-all duration-300 ${
                  sub.highlight
                    ? 'bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 text-white shadow-2xl shadow-blue-500/50 border-4 border-blue-400/50'
                    : 'bg-card border-2 border-border hover:border-primary/50 shadow-lg hover:shadow-2xl dark:bg-card/50 backdrop-blur-sm'
                }`}
              >
                {sub.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                      <Star className="h-4 w-4 fill-current" />
                      Best Value
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon */}
                  <div className={`flex items-center justify-center w-16 h-16 rounded-2xl ${
                    sub.highlight 
                      ? 'bg-white/20 backdrop-blur-sm' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    {sub.icon}
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className={`text-2xl font-bold mb-2 ${sub.highlight ? 'text-white' : ''}`}>
                      {sub.name}
                    </h3>
                    <p className={`text-sm ${sub.highlight ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {sub.desc}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className={`text-5xl font-extrabold ${sub.highlight ? 'text-white' : ''}`}>
                        {sub.price}
                      </span>
                      <span className={`text-base ${sub.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>
                        {sub.period}
                      </span>
                    </div>
                    <p className={`text-sm ${sub.highlight ? 'text-white/70' : 'text-muted-foreground'}`}>
                      {sub.detail}
                    </p>
                    <p className={`text-xs font-semibold ${sub.highlight ? 'text-yellow-300' : 'text-primary'}`}>
                      ≈ {sub.savings} vs one-time purchase
                    </p>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2">
                    <li className={`flex items-center gap-2 text-sm ${sub.highlight ? 'text-white/90' : 'text-foreground/70'}`}>
                      <Check className={`h-4 w-4 ${sub.highlight ? 'text-white' : 'text-primary'}`} />
                      {sub.credits} Credits / month
                    </li>
                    <li className={`flex items-center gap-2 text-sm ${sub.highlight ? 'text-white/90' : 'text-foreground/70'}`}>
                      <Check className={`h-4 w-4 ${sub.highlight ? 'text-white' : 'text-primary'}`} />
                      Auto-renewal
                    </li>
                    <li className={`flex items-center gap-2 text-sm ${sub.highlight ? 'text-white/90' : 'text-foreground/70'}`}>
                      <Check className={`h-4 w-4 ${sub.highlight ? 'text-white' : 'text-primary'}`} />
                      Cancel anytime
                    </li>
                    <li className={`flex items-center gap-2 text-sm ${sub.highlight ? 'text-white/90' : 'text-foreground/70'}`}>
                      <Check className={`h-4 w-4 ${sub.highlight ? 'text-white' : 'text-primary'}`} />
                      Credits roll over
                    </li>
                  </ul>

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(sub)}
                    disabled={subscriptionLoadingId === sub.id}
                    className={`w-full py-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                      sub.highlight
                        ? 'bg-white text-blue-600 hover:bg-white/90 hover:scale-105 shadow-lg hover:shadow-xl'
                        : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-md hover:shadow-lg'
                    }`}
                  >
                    {subscriptionLoadingId === sub.id ? (
                      <span className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      'Subscribe Now'
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-sm text-muted-foreground mt-8"
            >
              Cancel anytime. Unused credits roll over to the next month.
            </motion.p>
          </TabsContent>
        </Tabs>
      </section>

      {/* Bonus Section */}
      <section className="container px-4 md:px-6 py-16 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-blue-500/20 border border-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="text-2xl md:text-3xl font-bold">Special Bonuses</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200/50 dark:border-purple-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">New User Bonus</h3>
              </div>
              <p className="text-muted-foreground">
                All new users receive <strong className="text-primary">5 free credits</strong> when they sign up — enough to create your first AI storybook!
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200/50 dark:border-blue-800/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Star className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">Premium Bonus</h3>
              </div>
              <p className="text-muted-foreground">
                Purchase the <strong className="text-primary">Pro Pack</strong> or <strong className="text-primary">Creator Pack</strong> and receive an additional <strong className="text-primary">10% bonus credits</strong>!
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* SEO Section */}
      <section className="container px-4 md:px-6 py-16 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="prose prose-sm dark:prose-invert max-w-none text-center space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4">About Story AI Credits</h2>
          <p className="text-muted-foreground leading-relaxed">
            Story AI Create Story Book is a creative platform that uses artificial intelligence to help you write and illustrate storybooks instantly.
            Use your credits to generate stories, images, and characters effortlessly — all powered by AI. Whether you're creating bedtime stories, fantasy adventures, or comic-style photo books, our story AI brings imagination to life.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Start your storytelling journey today and explore what's possible with Story AI Create Story Book — where creativity meets technology.
          </p>
        </motion.div>
      </section>
    </div>
  );
}
