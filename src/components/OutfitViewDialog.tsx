// components/OutfitViewDialog.tsx
'use client';

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { X } from 'lucide-react'; 
import type { Outfit } from '@/lib/outfits';
import type { Product } from '@/lib/products';
import { Button } from './ui/button';

interface OutfitViewDialogProps {
  outfit: Outfit | null;
  isOpen: boolean;
  onClose: () => void;
}

// Utility function to check for a valid external URL
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.length < 5) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

const getTotalPrice = (items: Product[] | undefined) => {
    if (!items || !Array.isArray(items)) return '0.00';
    return items.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);
}

export function OutfitViewDialog({ outfit, isOpen, onClose }: OutfitViewDialogProps) {
  if (!outfit) return null;

  return (
    // The Dialog component uses the high Z-index fix for correct layering
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 md:max-h-[90vh] md:w-full">
        <DialogHeader className="p-6 pb-2 border-b">
          <DialogTitle className="text-2xl font-bold">{outfit.name || 'Untitled Outfit'}</DialogTitle>
          <DialogDescription>
            {outfit.description || 'A curated selection of items for a complete look.'}
          </DialogDescription>
          <button 
            onClick={onClose} 
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
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
              <div className="flex items-center justify-center h-full text-muted-foreground/70 border border-dashed">
                <p className="ml-2">Main Image Not Available</p>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-3 flex justify-between items-center">
                <p className="text-lg font-bold">Total Price: ${getTotalPrice(outfit.items)}</p>
                <Button variant="secondary" size="sm">
                  Add All to Cart
                </Button>
            </div>
          </div>

          {/* Right Side: Product List */}
          <ScrollArea className="h-full p-6 space-y-4">
            <h3 className="text-xl font-semibold mb-4">Items in Outfit ({outfit.items?.length || 0})</h3>
            
            {outfit.items?.map((item) => (
              <div key={item.id} className="flex gap-4 p-3 border rounded-lg bg-background hover:shadow-sm transition-shadow">
                
                <div className="w-16 h-20 relative rounded overflow-hidden bg-muted flex-shrink-0">
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

                <div className="flex-1 min-w-0 pr-2">
                  <p className="font-medium truncate">{item.name}</p>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-lg font-bold mt-1 text-primary">${item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}