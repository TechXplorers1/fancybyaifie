
'use client';

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function Newsletter() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "Thanks for joining our newsletter.",
      });
      setEmail('');
    } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Please enter a valid email address.",
        });
    }
  };

  return (
    <section className="bg-muted dark:bg-muted/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
        <h2 className="text-2xl sm:text-3xl font-headline text-accent">Stay in Touch</h2>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
          Be the first to know about new arrivals, exclusive collections, and stories that inspire our designs.
        </p>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 bg-background border-border text-foreground placeholder:text-muted-foreground h-12 text-base"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-label="Email for newsletter"
          />
          <Button type="submit" size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90">
            Subscribe
          </Button>
        </form>
        <p className="mt-4 text-xs text-muted-foreground/80">
            We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </section>
  );
}
