
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const isValidUrl = product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'));
    
    return (
        <div onClick={onClick} className="group text-left w-full h-full flex flex-col cursor-pointer">
            <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border-none flex-grow flex flex-col bg-white dark:bg-white text-foreground dark:text-foreground">
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="aspect-[3/4] relative w-full bg-white dark:bg-white">
                        {isValidUrl ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-contain group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                data-ai-hint={product.imageHint}
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
                <h3 className="text-sm text-foreground group-hover:text-primary transition-colors min-h-[2.5rem]">{product.name}</h3>
                <Button size="sm" variant="outline" className="mt-2 w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                   <span>Shop Me</span>
                </Button>
            </div>
        </div>
    );
}
