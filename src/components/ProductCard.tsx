
import Image from 'next/image';
import type { Product } from '@/lib/products';
import { Card, CardContent } from './ui/card';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
    const isValidUrl = product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'));

    if (!isValidUrl) {
        return null;
    }
    
    return (
        <button onClick={onClick} className="group text-left w-full h-full flex flex-col">
            <Card className="overflow-hidden rounded-lg shadow-sm hover:shadow-xl transition-shadow duration-300 border-none flex-grow flex flex-col bg-card">
                <CardContent className="p-0 flex-grow flex flex-col">
                    <div className="aspect-[3/4] relative w-full">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain group-hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            data-ai-hint={product.imageHint}
                        />
                    </div>
                </CardContent>
            </Card>
            <div className="mt-4">
                <h3 className="text-sm text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="mt-1 text-lg font-medium text-foreground">${product.price.toFixed(2)}</p>
            </div>
        </button>
    );
}
