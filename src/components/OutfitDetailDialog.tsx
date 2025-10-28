
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogPortal, DialogOverlay } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import type { Outfit } from '@/lib/outfits';
import { Button } from './ui/button';
import { Product } from '@/lib/products';

interface OutfitDetailDialogProps {
  outfit: Outfit | null;
  isOpen: boolean;
  onClose: () => void;
}

const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.length < 5) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

const getTotalPrice = (items: Product[] | undefined) => {
    if (!items) return '0.00';
    return items.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);
}


export function OutfitDetailDialog({ outfit, isOpen, onClose }: OutfitDetailDialogProps) {
  if (!outfit) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent className="max-w-6xl p-0 z-[100]">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-2xl">{outfit.name}</DialogTitle>
            <DialogDescription>{outfit.description}</DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 max-h-[80vh]">
            {/* Left Side: Main Outfit Image */}
            <div className="relative aspect-[3/4] bg-muted overflow-hidden">
              {isValidUrl(outfit.image) ? (
                <Image
                  src={outfit.image}
                  alt={outfit.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground/70 border border-dashed">
                  Main Outfit Image Not Available
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center text-lg font-bold">
                  Total Price: ${getTotalPrice(outfit.items)}
              </div>
            </div>

            {/* Right Side: Product List */}
            <ScrollArea className="h-full p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4">Items in Outfit ({(outfit.items || []).length})</h3>
              {(outfit.items || []).map((item) => (
                <div key={item.id} className="flex gap-4 p-3 border rounded-lg hover:shadow-sm transition-shadow">
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
                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                    <p className="text-sm font-semibold mt-1">${(item.price || 0).toFixed(2)}</p>
                  </div>
                  {/* Affiliate Link Button (Optional) */}
                  {item.affiliateLink && (
                    <a 
                      href={item.affiliateLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-shrink-0"
                    >
                      <Button size="sm">Buy Now</Button>
                    </a>
                  )}
                </div>
              ))}
            </ScrollArea>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
