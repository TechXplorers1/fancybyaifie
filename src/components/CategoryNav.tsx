
'use client';

import { cn } from "@/lib/utils";
import React from "react";

interface CategoryNavProps {
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
    const selectedIndex = categories.findIndex(c => c === selectedCategory);
    
    if (!categories || categories.length === 0) {
        return null;
    }

    return (
        <section className="bg-background/80 backdrop-blur-lg sticky top-20 z-30 border-b py-2 sm:py-4">
            <div className="max-w-4xl mx-auto px-2 sm:px-6 lg:px-8">
                <div className="relative flex items-center p-1 rounded-full border border-primary/20 bg-muted/60 w-full max-w-full overflow-x-auto">
                    {categories.map((category) => (
                        <div key={category} className="flex-shrink-0 flex-grow basis-0">
                            <input 
                                type="radio" 
                                id={`category-${category}`} 
                                name="category-switch"
                                checked={selectedCategory === category}
                                onChange={() => onSelectCategory(category)}
                                className="hidden"
                            />
                            <label
                                htmlFor={`category-${category}`}
                                className={cn(
                                    "block w-full text-center px-3 sm:px-6 py-2 rounded-full cursor-pointer transition-colors duration-300 relative z-10 text-xs sm:text-sm whitespace-nowrap",
                                    selectedCategory === category 
                                        ? "text-accent-foreground font-semibold"
                                        : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {category}
                            </label>
                        </div>
                    ))}
                    {selectedIndex !== -1 && (
                        <span 
                            className="absolute bg-accent h-full top-0 rounded-full transition-all duration-300 ease-in-out z-0"
                            style={{
                                width: `calc(${100 / categories.length}% - 4px)`,
                                left: `calc(${selectedIndex * (100 / categories.length)}% + 2px)`,
                                height: 'calc(100% - 8px)',
                                top: '4px',
                            }}
                        />
                    )}
                </div>
            </div>
        </section>
    );
}
