
'use client';

import React from 'react';
import Image from 'next/image';
import { Button } from './ui/button';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const heroImages = [
    "https://github.com/TechXplorers1/fancybyaifie/blob/main/outfit_images/PHOTO-2025-11-12-16-29-44.jpg?raw=true",
    "https://github.com/TechXplorers1/fancybyaifie/blob/main/outfit_images/PHOTO-2025-11-12-16-30-21.jpg?raw=true",
    "https://github.com/TechXplorers1/fancybyaifie/blob/main/outfit_images/3.jpeg?raw=true",
    "https://github.com/TechXplorers1/fancybyaifie/blob/main/outfit_images/PHOTO-2025-11-12-16-32-16.jpg?raw=true",
    "https://github.com/TechXplorers1/fancybyaifie/blob/main/outfit_images/PHOTO-2025-11-12-16-31-15.jpg?raw=true"
]

export function HeroSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )

  return (
    <section className="relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline tracking-wide text-accent leading-tight">
                Where Chic Simplicity Inspires Everyday Confidence
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                Welcome to a curated space where fashion, beauty, and lifestyle inspiration blend effortlessly. With daily outfit ideas, beauty tips, lifestyle gems, and thoughtfully selected fashion finds, my goal is to help you elevate your style and highlight your natural beauty.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                size="lg"
                className="bg-accent text-accent-foreground px-8 py-3 hover:bg-accent/90 transition-colors w-full sm:w-auto"
                asChild
              >
                <Link href="/outfits">Shop My Outfits</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Image Carousel */}
          <div className="relative flex justify-center">
             <Carousel 
                plugins={[plugin.current]}
                className="w-full max-w-[20rem] sm:max-w-md"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
             >
                <CarouselContent>
                    {heroImages.map((src, index) => (
                        <CarouselItem key={index}>
                            <div className="relative aspect-[3/4] w-full rounded-lg overflow-hidden shadow-2xl shadow-primary/10 bg-background">
                                <Image
                                    src={src}
                                    alt={`Hero image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
