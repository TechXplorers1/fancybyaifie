import Image from 'next/image';
import type { Outfit } from '@/lib/outfits';
import { Card, CardContent } from './ui/card';

interface OutfitCardProps {
    outfit: Outfit;
    onClick: () => void;
}

export function OutfitCard({ outfit, onClick }: OutfitCardProps) {
    const isValidUrl = outfit.image && (outfit.image.startsWith('http://') || outfit.image.startsWith('https://'));
    const hasItems = outfit.items && Array.isArray(outfit.items);

    if (!isValidUrl) {
        // Don't render the card if the image URL is invalid
        return null;
    }

    const totalPrice = hasItems ? outfit.items.reduce((acc, item) => acc + (item.price || 0), 0) : 0;
    
    return (
        <button onClick={onClick} className="group text-left w-full h-full flex flex-col">
            <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border-none flex-grow flex flex-col bg-card">
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="aspect-[3/4] relative w-full">
                        <Image
                            src={outfit.image}
                            alt={outfit.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="mt-4">
                <h3 className="text-sm text-foreground group-hover:text-primary transition-colors">{outfit.name}</h3>
                {hasItems && (
                    <>
                        <p className="mt-1 text-lg font-medium text-foreground">${totalPrice.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">{outfit.items.length} {outfit.items.length === 1 ? 'item' : 'items'}</p>
                    </>
                )}
            </div>
        </button>
    );
}
