"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Star, Zap, Crown, Users, ArrowRight } from "lucide-react";

type BillingCycle = "monthly" | "yearly";

interface Plan {
  name: string;
  price: string;
  period: string;
  originalPrice?: string;
  savings?: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  bgColor: string;
  features: string[];
  limitations: string[];
  cta: string;
  popular: boolean;
}

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");
  const [activeTab, setActiveTab] = useState("individual");

  const plans: Record<BillingCycle, Plan[]> = {
    monthly: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying out Story AI",
        icon: <Zap className="h-6 w-6" />,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        features: [
          "5 story generations per month",
          "Basic story templates",
          "Export to .txt format",
          "Community support",
          "English language only",
          "Basic character development"
        ],
        limitations: [
          "Limited to 500 words per story",
          "No advanced editing tools",
          "No collaboration features"
        ],
        cta: "Start Free",
        popular: false
      },
      {
        name: "Pro",
        price: "$19",
        period: "month",
        description: "For serious writers and creators",
        icon: <Star className="h-6 w-6" />,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        features: [
          "Unlimited story generations",
          "All story templates & genres",
          "Export to .docx, .txt, Markdown, EPUB",
          "Priority support",
          "Batch generation",
          "Multilingual support (20+ languages)",
          "Advanced character development",
          "Plot architect tools",
          "Style customization",
          "Version history",
          "Cloud storage (10GB)"
        ],
        limitations: [],
        cta: "Start Pro Trial",
        popular: true
      },
      {
        name: "Team",
        price: "$49",
        period: "month",
        description: "For teams and organizations",
        icon: <Users className="h-6 w-6" />,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        features: [
          "Everything in Pro",
          "Up to 10 team members",
          "Team collaboration tools",
          "Shared workspace",
          "Team analytics",
          "Custom templates",
          "API access",
          "SSO integration",
          "Dedicated support",
          "Cloud storage (100GB)",
          "Advanced permissions",
          "Brand customization"
        ],
        limitations: [],
        cta: "Start Team Trial",
        popular: false
      }
    ],
    yearly: [
      {
        name: "Free",
        price: "$0",
        period: "forever",
        description: "Perfect for trying out Story AI",
        icon: <Zap className="h-6 w-6" />,
        color: "text-gray-600",
        bgColor: "bg-gray-100",
        features: [
          "5 story generations per month",
          "Basic story templates",
          "Export to .txt format",
          "Community support",
          "English language only",
          "Basic character development"
        ],
        limitations: [
          "Limited to 500 words per story",
          "No advanced editing tools",
          "No collaboration features"
        ],
        cta: "Start Free",
        popular: false
      },
      {
        name: "Pro",
        price: "$15",
        period: "month",
        originalPrice: "$19",
        description: "For serious writers and creators",
        icon: <Star className="h-6 w-6" />,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        features: [
          "Unlimited story generations",
          "All story templates & genres",
          "Export to .docx, .txt, Markdown, EPUB",
          "Priority support",
          "Batch generation",
          "Multilingual support (20+ languages)",
          "Advanced character development",
          "Plot architect tools",
          "Style customization",
          "Version history",
          "Cloud storage (10GB)"
        ],
        limitations: [],
        cta: "Start Pro Trial",
        popular: true,
        savings: "Save 21%"
      },
      {
        name: "Team",
        price: "$39",
        period: "month",
        originalPrice: "$49",
        description: "For teams and organizations",
        icon: <Users className="h-6 w-6" />,
        color: "text-purple-600",
        bgColor: "bg-purple-100",
        features: [
          "Everything in Pro",
          "Up to 10 team members",
          "Team collaboration tools",
          "Shared workspace",
          "Team analytics",
          "Custom templates",
          "API access",
          "SSO integration",
          "Dedicated support",
          "Cloud storage (100GB)",
          "Advanced permissions",
          "Brand customization"
        ],
        limitations: [],
        cta: "Start Team Trial",
        popular: false,
        savings: "Save 20%"
      }
    ]
  };

  const enterpriseFeatures = [
    "Unlimited team members",
    "Custom integrations",
    "Dedicated account manager",
    "SLA guarantee",
    "Custom training",
    "On-premise deployment option",
    "Advanced security features",
    "Custom pricing"
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing differences."
    },
    {
      question: "What happens to my stories if I cancel?",
      answer: "Your stories remain accessible for 30 days after cancellation. You can export them during this period or reactivate your account to regain full access."
    },
    {
      question: "Do you offer refunds?",
      answer: "We offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact us for a full refund."
    },
    {
      question: "Can I use Story AI for commercial purposes?",
      answer: "Yes, all plans allow commercial use of generated content. You own the rights to all stories you create with Story AI."
    },
    {
      question: "Is there a free trial for paid plans?",
      answer: "Yes, we offer a 14-day free trial for Pro and Team plans. No credit card required to start."
    },
    {
      question: "What languages are supported?",
      answer: "We support 20+ languages including English, Chinese, Spanish, French, German, Japanese, and more. More languages are added regularly."
    }
  ];

  const currentPlans = plans[billingCycle];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <Badge variant="secondary" className="px-4 py-2">
                <Crown className="h-4 w-4 mr-2" />
                Simple, Transparent Pricing
              </Badge>
              
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                Choose Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {" "}Creative Plan
                </span>
              </h1>
              
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Start free and scale as you grow. No hidden fees, no surprises. 
                Cancel anytime.
              </p>

              {/* Billing Toggle */}
              <div className="flex items-center justify-center space-x-4">
                <span className={`text-sm ${billingCycle === 'monthly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm ${billingCycle === 'yearly' ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                  Yearly
                </span>
                {billingCycle === 'yearly' && (
                  <Badge variant="secondary" className="ml-2">
                    Save up to 21%
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 md:grid-cols-3">
              {currentPlans.map((plan, index) => (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <Card className={`h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
                    <CardHeader className="text-center pb-8">
                      <div className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${plan.bgColor} ${plan.color} mb-4`}>
                        {plan.icon}
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground">/{plan.period}</span>
                        {plan.originalPrice && (
                          <div className="flex items-center justify-center space-x-2 mt-2">
                            <span className="text-sm text-muted-foreground line-through">
                              {plan.originalPrice}/month
                            </span>
                            {plan.savings && (
                              <Badge variant="secondary" className="text-xs">
                                {plan.savings}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <CardDescription className="mt-2">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-start gap-3">
                            <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                        {plan.limitations.map((limitation, limitIndex) => (
                          <li key={limitIndex} className="flex items-start gap-3">
                            <X className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{limitation}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        onClick={() => router.push('/create')}
                        className={`w-full ${
                          plan.popular
                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                            : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                        }`}
                        size="lg"
                      >
                        {plan.cta}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-8"
            >
              <div>
                <h2 className="text-3xl font-bold mb-4">Need something custom?</h2>
                <p className="text-xl text-muted-foreground">
                  We offer enterprise solutions for large organizations with specific needs
                </p>
              </div>

              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center justify-center space-x-2">
                    <Crown className="h-6 w-6 text-yellow-500" />
                    <span>Enterprise</span>
                  </CardTitle>
                  <CardDescription className="text-center">
                    Custom solutions for large teams and organizations
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {enterpriseFeatures.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" size="lg">
                    Contact Sales
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
              <p className="text-xl text-muted-foreground">
                Everything you need to know about our pricing and plans
              </p>
            </motion.div>

            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-white">
                Ready to start creating?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands of creators who are already using Story AI
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => router.push('/create')}
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 text-lg h-auto"
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => router.push('/contact')}
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg h-auto border-white text-white hover:bg-white hover:text-gray-900"
                >
                  Contact Sales
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
