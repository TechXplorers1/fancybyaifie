import Image from 'next/image';
import type { Product } from '@/lib/products';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductDetailProps {
    product: Product;
    onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
    return (
        <section className="bg-white dark:bg-card">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Button variant="ghost" onClick={onBack} className="mb-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to products
                </Button>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative aspect-[3/4] w-full max-w-lg mx-auto rounded-lg overflow-hidden shadow-lg">
                        <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            data-ai-hint={product.imageHint}
                        />
                    </div>
                    <div className="space-y-6">
                        <h1 className="text-4xl font-headline text-primary">{product.name}</h1>
                        <p className="text-3xl text-foreground">${product.price.toFixed(2)}</p>
                        <p className="text-base text-muted-foreground leading-relaxed">{product.description}</p>
                        {product.affiliateLink && (
                            <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" asChild>
                               <Link href={product.affiliateLink} target="_blank">View Link</Link>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
