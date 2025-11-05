
'use client';

import Image from 'next/image';
import { Button } from './ui/button';
import imageData from '@/lib/placeholder-images.json';
import Link from 'next/link';

const { placeholderImages: PlaceHolderImages } = imageData;

export function HeroSection() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero');

  return (
    <section className="relative bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline tracking-wide text-primary leading-tight">
                Born Out of Free
              </h1>
              <p className="text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed">
                Embracing authenticity and individual expression through thoughtfully designed pieces that speak to your unique style.
              </p>
            </div>
            
            <div className="space-y-4">
              <Button 
                size="lg"
                className="bg-primary text-primary-foreground px-8 py-3 hover:bg-primary/90 transition-colors w-full sm:w-auto"
                asChild
              >
                <Link href="/outfits">Shop My Outfits</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Model image */}
          <div className="relative group">
            <div className="relative aspect-[3/4] w-full max-w-sm sm:max-w-md mx-auto rounded-lg overflow-hidden shadow-2xl shadow-primary/10">
              {heroImage &&
                <Image
                  src={heroImage.imageUrl}
                  alt="Model in white clothing"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  data-ai-hint={heroImage.imageHint}
                  priority
                />
              }
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
