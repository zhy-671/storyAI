"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface StoryPricingProps {
  onScrollToForm: () => void;
}

export default function StoryPricing({ onScrollToForm }: StoryPricingProps) {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "month",
      description: "Perfect for trying out Story AI",
      features: [
        "5 monthly story generations",
        "Basic story templates",
        "Export to .txt format",
        "Community support",
        "English language only",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Pro",
      price: "$9",
      period: "month",
      description: "For serious writers and creators",
      features: [
        "Unlimited story generations",
        "All story templates & genres",
        "Export to .docx, .txt, Markdown",
        "Priority support",
        "Batch generation",
        "Multilingual support (中文)",
        "Character development tools",
        "Plot architect access",
      ],
      cta: "Start Pro Plan",
      popular: true,
    },
    {
      name: "Team",
      price: "Custom",
      period: "contact",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "API access",
        "SSO integration",
        "Custom templates",
        "Dedicated support",
        "Usage analytics",
        "Custom integrations",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="story-pricing" className="py-20 bg-muted/20">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Simple pricing — free tier to scale
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Choose the plan that fits your creative needs. Start free and upgrade as you grow.
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                    Most Popular
                  </Badge>
                )}
                <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg' : ''}`}>
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="mt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">/{plan.period}</span>
                    </div>
                    <CardDescription className="mt-2">{plan.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={onScrollToForm}
                      className={`w-full ${
                        plan.popular
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                      }`}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
            <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
              <div className="space-y-2">
                <h4 className="font-semibold">Who owns the stories generated by Story AI?</h4>
                <p className="text-sm text-muted-foreground">
                  Generated text is owned by the user, subject to our Terms of Service. We recommend checking specific license language for commercial publishing.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Can Story AI write in Chinese or generate children's picture books in Chinese?</h4>
                <p className="text-sm text-muted-foreground">
                  Yes. Story AI supports 中文 output and includes modes tailored for 儿童故事 and 故事书 formatting.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Is Story AI safe for kids?</h4>
                <p className="text-sm text-muted-foreground">
                  We offer a Children's Book Mode with content filters and simplified language appropriate for specified age ranges.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">How do I export my story for self-publishing?</h4>
                <p className="text-sm text-muted-foreground">
                  Export options include .docx, Markdown, and plain text. For EPUB/print-ready files, export as .docx and use a converter like Calibre.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}