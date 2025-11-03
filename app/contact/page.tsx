"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, MessageSquare, HelpCircle, RefreshCw } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container px-4 md:px-6 py-4">
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost" size="sm" className="gap-2">
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <div>
              <h1 className="text-xl font-bold">Contact Us</h1>
              <p className="text-sm text-muted-foreground">
                Get in touch with our team
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container px-4 md:px-6 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-4">
              <MessageSquare className="mr-2 h-4 w-4" />
              We're Here to Help
            </div>
            <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Contact Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Have questions about Story AI Create Story Book? Need support with your account? 
              Want to request a refund? We're here to help you.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid gap-6 md:grid-cols-2"
          >
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Email Support</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  For general inquiries, technical support, or questions about our service:
                </p>
                <a 
                  href="mailto:gareaukeenan3155@gmail.com" 
                  className="text-primary hover:text-primary/80 font-medium underline inline-block text-lg"
                >
                  gareaukeenan3155@gmail.com
                </a>
                <p className="text-sm text-muted-foreground">
                  We typically respond within 24-48 hours.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <RefreshCw className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Refund Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you need to request a refund, please contact us at:
                </p>
                <a 
                  href="mailto:gareaukeenan3155@gmail.com?subject=Refund Request" 
                  className="text-primary hover:text-primary/80 font-medium underline inline-block text-lg"
                >
                  gareaukeenan3155@gmail.com
                </a>
                <p className="text-sm text-muted-foreground">
                  Please include your order details and reason for the refund request in your email.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="space-y-8"
          >
            <div className="bg-muted/30 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                <HelpCircle className="h-6 w-6 text-primary" />
                Frequently Asked Questions
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">How quickly will I receive a response?</h4>
                  <p className="text-muted-foreground">
                    We aim to respond to all inquiries within 24-48 hours during business days.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">What information should I include in my email?</h4>
                  <p className="text-muted-foreground">
                    Please include your account email, a detailed description of your question or issue, 
                    and any relevant screenshots or error messages.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">How long do refunds take to process?</h4>
                  <p className="text-muted-foreground">
                    Refund requests are typically processed within 5-7 business days after approval. 
                    The funds will appear in your original payment method.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-foreground">Can I get help with creating stories?</h4>
                  <p className="text-muted-foreground">
                    Yes! We're happy to help you get the most out of Story AI. Whether you're new to 
                    the platform or have specific questions about features, don't hesitate to reach out.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Additional Resources */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold mb-4">Need More Information?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Check out our other pages for more details about our service, privacy policy, and terms of use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline">
                <Link href="/about">
                  About Us
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/privacy">
                  Privacy Policy
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/terms">
                  Terms of Service
                </Link>
              </Button>
              <Button asChild>
                <Link href="/create-story-book">
                  Start Creating
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

