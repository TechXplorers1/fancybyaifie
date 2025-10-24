import Image from 'next/image';
import type { Outfit } from '@/lib/outfits';
import { Card, CardContent } from './ui/card';

interface OutfitCardProps {
    outfit: Outfit;
    onClick: () => void;
}

export function OutfitCard({ outfit, onClick }: OutfitCardProps) {
    // This check is kept to determine if we should render an image or a placeholder
    const isValidUrl = outfit.image && (outfit.image.startsWith('http://') || outfit.image.startsWith('https://'));
    const hasItems = outfit.items && Array.isArray(outfit.items);

    // ❌ REMOVED: The logic 'if (!isValidUrl) { return null; }' 
    // This ensures the card structure is rendered even without a valid image.

    const totalPrice = hasItems ? outfit.items.reduce((acc, item) => acc + (item.price || 0), 0) : 0;
    
    return (
        <button onClick={onClick} className="group text-left w-full h-full flex flex-col">
            <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border-none flex-grow flex flex-col bg-white dark:bg-white text-foreground dark:text-foreground">
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="aspect-[3/4] relative w-full bg-muted/50 flex items-center justify-center">
                        {isValidUrl ? (
                            // Render Image if the URL is valid
                            <Image
                                src={outfit.image}
                                alt={outfit.name || 'Outfit Image'}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                        ) : (
                            // Render Placeholder if the URL is invalid or missing
                            <div className="text-sm text-muted-foreground/70 p-4 text-center">
                                Outfit Image Missing
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <div className="mt-4">
                {/* Fallback to 'Untitled Outfit' if name is empty */}
                <h3 className="text-sm text-foreground group-hover:text-primary transition-colors">{outfit.name || 'Untitled Outfit'}</h3>
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