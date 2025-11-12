
'use client';

import Image from 'next/image';
import type { Outfit } from '@/lib/outfits';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface OutfitCardProps {
    outfit: Outfit;
    onClick: () => void;
}

export function OutfitCard({ outfit, onClick }: OutfitCardProps) {
    const isValidUrl = outfit.image && (outfit.image.startsWith('http://') || outfit.image.startsWith('https://'));
    
    return (
        <div onClick={onClick} className="group text-left w-full h-full flex flex-col cursor-pointer">
            <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border-none flex-grow flex flex-col bg-border text-foreground dark:text-foreground">
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="aspect-[3/4] relative w-full" style={{ backgroundColor: '#E5E5E5' }}>
                        {isValidUrl ? (
                            <Image
                                src={outfit.image}
                                alt={outfit.name}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-center text-muted-foreground/70 p-4">
                                <span className="text-sm font-medium">Image Not Available</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="mt-4">
                <h3 className="text-sm text-foreground group-hover:text-primary transition-colors min-h-[2.5rem]">{outfit.name}</h3>
                <Button size="sm" variant="outline" className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Shop Now
                </Button>
            </div>
        </div>
    );
}
