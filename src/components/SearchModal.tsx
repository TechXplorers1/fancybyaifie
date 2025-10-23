'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Product } from "@/lib/products";
import Image from "next/image";
import { ScrollArea } from "./ui/scroll-area";

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    onProductSelect: (product: Product) => void;
    products: Product[];
}

export function SearchModal({ isOpen, onClose, onProductSelect, products }: SearchModalProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Product[]>([]);

    useEffect(() => {
        if (!isOpen) {
            setSearchTerm('');
            setResults([]);
        }
    }, [isOpen]);

    useEffect(() => {
        if (searchTerm.length > 1) {
            const lowerCaseTerm = searchTerm.toLowerCase();
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(lowerCaseTerm) ||
                product.category.toLowerCase().includes(lowerCaseTerm) ||
                product.description.toLowerCase().includes(lowerCaseTerm)
            );
            setResults(filteredProducts);
        } else {
            setResults([]);
        }
    }, [searchTerm, products]);

    const handleSelect = (product: Product) => {
        onProductSelect(product);
        onClose();
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-background">
                <DialogHeader>
                    <DialogTitle className="font-headline text-2xl text-primary">Search Products</DialogTitle>
                     <DialogDescription>
                        Find your perfect piece of clothing.
                    </DialogDescription>
                </DialogHeader>
                <div className="relative mt-4">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="e.g. 'White T-Shirt'" 
                        className="pl-12 h-12 text-lg" 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <ScrollArea className="mt-6 max-h-[60vh]">
                    {searchTerm.length > 1 ? (
                        results.length > 0 ? (
                             <div className="space-y-4">
                                {results.map((product) => (
                                    <button 
                                        key={product.id} 
                                        onClick={() => handleSelect(product)}
                                        className="w-full text-left flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <div className="relative w-16 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="font-medium text-foreground">{product.name}</h3>
                                            <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-10">
                                <p>No results found for &quot;{searchTerm}&quot;</p>
                            </div>
                        )
                    ) : (
                         <div className="text-center text-muted-foreground py-10">
                            <p>Start typing to see search results.</p>
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}
