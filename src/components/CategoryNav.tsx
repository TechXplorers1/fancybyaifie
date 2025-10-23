'use client';

import { Button } from "./ui/button";

interface CategoryNavProps {
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

export function CategoryNav({ categories, selectedCategory, onSelectCategory }: CategoryNavProps) {
    return (
        <section className="bg-background/80 backdrop-blur-lg sticky top-20 z-30 border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-center items-center space-x-2 sm:space-x-4 h-16 overflow-x-auto">
                    <Button 
                        variant={selectedCategory === null ? 'secondary' : 'ghost'} 
                        onClick={() => onSelectCategory(null)}
                        className="rounded-full flex-shrink-0"
                    >
                        All
                    </Button>
                    {categories.map(category => (
                        <Button 
                            key={category} 
                            variant={selectedCategory === category ? 'secondary' : 'ghost'} 
                            onClick={() => onSelectCategory(category)}
                             className="rounded-full capitalize flex-shrink-0"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>
        </section>
    );
}
