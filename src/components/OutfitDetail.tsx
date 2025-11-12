
'use client';

import React from 'react';
import Image from 'next/image';
import type { Outfit } from '@/lib/outfits';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import { Product } from '@/lib/products';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import { AffLink } from '@/components/AffLink';
import { format } from 'date-fns';

interface OutfitDetailProps {
    outfit: Outfit;
    onBack: () => void;
}

const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.length < 5) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    try {
        const date = new Date(dateString);
        return format(date, 'MM.dd.yy');
    } catch (error) {
        return '';
    }
}

export function OutfitDetail({ outfit, onBack }: OutfitDetailProps) {
    const plugin = React.useRef(
      Autoplay({ delay: 2000, stopOnInteraction: true })
    )

    return (
        <section className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <Button variant="ghost" onClick={onBack} className="mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Outfits
                </Button>
                <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-start">
                    {/* Left Side */}
                    <div className="relative">
                        <AffLink />
                        <div className="relative aspect-[3/4] w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg bg-card border-8 border-card">
                             {isValidUrl(outfit.image) ? (
                                <Image
                                    src={outfit.image}
                                    alt={outfit.name}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-muted-foreground/70">
                                    Main Outfit Image Not Available
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side */}
                    <div className="space-y-6 lg:pt-0">
                        <div className="text-center lg:text-left">
                            <p className="text-sm text-muted-foreground">{formatDate(outfit.createdAt)}</p>
                            <h1 className="text-4xl md:text-5xl font-headline text-primary mt-1">{outfit.name || "Office Chic"}</h1>
                        </div>

                        <Carousel
                            plugins={[plugin.current]}
                            opts={{
                                align: "start",
                                loop: true,
                            }}
                            className="w-full max-w-sm mx-auto lg:max-w-none lg:mx-0"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                        >
                            <CarouselContent className="-ml-2 sm:-ml-4">
                                {(outfit.items || []).map((item: Product, index) => (
                                <CarouselItem key={index} className="pl-2 sm:pl-4 basis-1/2 md:basis-1/3">
                                    <div className="group text-left">
                                        <div className="relative aspect-square w-full rounded-md overflow-hidden bg-card">
                                            {isValidUrl(item.image) ? (
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-xs text-muted-foreground/70 text-center p-2">No Img</div>
                                            )}
                                        </div>
                                        <div className="mt-2 p-2 bg-accent/80 text-accent-foreground rounded-b-md">
                                            <h4 className="text-xs font-semibold truncate">{item.name}</h4>
                                             {item.affiliateLink && (
                                                <a href={item.affiliateLink} target="_blank" rel="noopener noreferrer" className="text-xs underline hover:opacity-80">
                                                    SHOP NOW
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </CarouselItem>
                                ))}
                            </CarouselContent>
                            <div className="hidden sm:flex justify-center lg:justify-end mt-4 gap-2">
                                <CarouselPrevious variant="ghost" className="static -translate-y-0" />
                                <CarouselNext variant="ghost" className="static -translate-y-0" />
                            </div>
                        </Carousel>
                         {(!outfit.items || outfit.items.length === 0) && (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No items found in this outfit.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
