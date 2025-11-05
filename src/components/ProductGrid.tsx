
'use client';

import { Product } from '@/lib/products';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
    products: Product[];
    category?: string | null;
    onProductClick: (product: Product) => void;
}

export function ProductGrid({ products, category, onProductClick }: ProductGridProps) {
    const filteredProducts = category ? products.filter(p => p.category.toLowerCase() === category.toLowerCase()) : products;

    return (
        <section className="bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <h2 className="text-2xl sm:text-3xl font-headline text-center text-primary mb-8 sm:mb-12 capitalize">{category ? category : 'All Products'}</h2>
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onClick={() => onProductClick(product)} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground py-16">
                        <p>No products found in this category.</p>
                    </div>
                )}
            </div>
        </section>
    );
}
