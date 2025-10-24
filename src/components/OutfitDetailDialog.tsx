// components/OutfitDetailDialog.tsx

'use client';

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { Button } from './ui/button'; 
import { ShoppingCart, PlusCircle } from 'lucide-react'; 
import type { Outfit } from '@/lib/outfits';
import type { Product } from '@/lib/products'; 

interface OutfitDetailDialogProps {
  outfit: Outfit | null;
  isOpen: boolean;
  onClose: () => void;
  onAddItemToCart?: (item: Product) => void;
}

const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.length < 5) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

const getTotalPrice = (items: Product[]) => {
    if (!items || !Array.isArray(items)) return '0.00';
    return items.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);
}

export function OutfitDetailDialog({ outfit, isOpen, onClose, onAddItemToCart }: OutfitDetailDialogProps) {
  if (!outfit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      
      {/* DialogContent uses z-max from dialog.tsx */}
      <DialogContent className="max-w-4xl p-0 md:max-h-[90vh] md:w-full"> 
        
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="text-2xl font-bold">{outfit.name || 'Untitled Outfit'}</DialogTitle>
          <DialogDescription>{outfit.description || 'A curated selection of items for a complete look.'}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[75vh]">
          
          {/* Left Side: Main Outfit Image and Total Price */}
          <div className="relative aspect-[3/4] bg-muted overflow-hidden">
            {isValidUrl(outfit.image) ? (
              <Image
                src={outfit.image}
                alt={outfit.name || 'Outfit Image'}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            ) : (
              // Placeholder for missing main image
              <div className="flex items-center justify-center h-full text-muted-foreground/70 border border-dashed">
                <p className="ml-2">Main Outfit Image Not Available</p>
              </div>
            )}
            
            {/* Total Price Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 flex justify-between items-center">
                <p className="text-lg font-bold">Total Price: ${getTotalPrice(outfit.items)}</p>
                <Button 
                    variant="default" 
                    onClick={() => { alert('Buying entire outfit!'); }}
                    className="flex items-center gap-2"
                >
                    <ShoppingCart className="h-5 w-5" /> Buy Full Outfit
                </Button>
            </div>
          </div>

          {/* Right Side: Product List with Action Buttons */}
          <ScrollArea className="h-full p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Items in Outfit ({outfit.items?.length || 0})</h3>
            
            {outfit.items?.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 border rounded-lg bg-white dark:bg-card hover:shadow-md transition-shadow">
                
                {/* Product Image */}
                <div className="w-16 h-20 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                  {isValidUrl(item.image) ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70">No Img</div>
                  )}
                </div>

                {/* Product Details & Actions */}
                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-lg font-bold mt-1 text-primary">${item.price.toFixed(2)}</p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-2 justify-center flex-shrink-0">
                    <Button 
                        size="sm" 
                        variant="secondary"
                        onClick={() => { onAddItemToCart ? onAddItemToCart(item) : console.log(`Added ${item.name} to cart/wishlist!`); }}
                        className="flex items-center gap-1 text-xs"
                    >
                        <PlusCircle className="h-3 w-3" /> Add Item
                    </Button>
                    {item.affiliateLink && isValidUrl(item.affiliateLink) ? (
                        <a 
                            href={item.affiliateLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                        >
                            <Button size="sm" className="flex items-center gap-1 text-xs w-full">
                                Buy Now
                            </Button>
                        </a>
                    ) : (
                        <Button size="sm" variant="outline" disabled className="text-xs">
                            Link Missing
                        </Button>
                    )}
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}