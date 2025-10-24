'use client';

import { Outfit } from '@/lib/outfits';
import { OutfitCard } from './OutfitCard';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

interface OutfitGridProps {
    outfits: Outfit[];
    onOutfitClick: (outfit: Outfit) => void;
    onBack: () => void;
}

export function OutfitGrid({ outfits, onOutfitClick, onBack }: OutfitGridProps) {
    return (
        <section className="bg-white dark:bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <Button variant="ghost" onClick={onBack} className="mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to products
                </Button>
                <h2 className="text-3xl font-headline text-center text-primary mb-12">Curated Outfits</h2>
                {outfits && outfits.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                        {outfits.map(outfit => (
                            <OutfitCard key={outfit.id} outfit={outfit} onClick={() => onOutfitClick(outfit)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No outfits found.</p>
                        <p className="text-sm mt-2">Check back later or add some in the admin dashboard.</p>
                    </div>
                )}
            </div>
        </section>
    );
}