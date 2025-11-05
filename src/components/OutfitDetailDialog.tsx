
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
        <DialogContent className="max-w-3xl w-full h-full sm:h-[85vh] p-0 flex flex-col sm:rounded-lg">
          <DialogHeader className="p-4 sm:p-6 pb-2 border-b flex-shrink-0">
            <DialogTitle className="text-xl sm:text-2xl">{outfit.name}</DialogTitle>
            <DialogDescription>{outfit.description}</DialogDescription>
          </DialogHeader>

          {/* Main content area */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 min-h-0">
            
            {/* Left side: Image (visible on all screens) */}
            <div className="w-full h-full relative overflow-hidden bg-muted md:border-r">
                <ScrollArea className="h-full w-full">
                    <div className="p-4">
                        <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden min-h-[400px]">
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
                                <div className="flex items-center justify-center h-full text-muted-foreground/70">
                                Main Outfit Image Not Available
                                </div>
                            )}
                        </div>
                    </div>
                </ScrollArea>
            </div>
            
            {/* Right side: Items */}
            <div className="flex flex-col min-h-0">
              <div className="p-4 sm:p-6 border-b md:border-b-0 md:border-t-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-lg sm:text-xl font-semibold">Items in Outfit ({(outfit.items || []).length})</h3>
                  <span className="text-base sm:text-lg font-bold text-primary">
                      Total: ${getTotalPrice(outfit.items)}
                  </span>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4 sm:p-6 pt-0">
                <div className="space-y-4">
                  {(outfit.items || []).map((item) => (
                    <div key={item.id} className="flex gap-4 p-3 border rounded-lg hover:shadow-sm transition-shadow">
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
                      <div className="flex-1 min-w-0">
                        <p className="font-medium whitespace-normal text-sm sm:text-base">{item.name}</p>
                        <p className="text-sm text-muted-foreground">{item.category}</p>
                        <p className="text-sm font-semibold mt-1">${(item.price || 0).toFixed(2)}</p>
                      </div>
                      {item.affiliateLink && (
                        <a 
                          href={item.affiliateLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-shrink-0 self-center"
                        >
                          <Button size="sm">Buy Now</Button>
                        </a>
                      )}
                    </div>
                  ))}
                   {(!outfit.items || outfit.items.length === 0) && (
                      <div className="text-center text-muted-foreground py-10">
                        <p>No items found in this outfit.</p>
                      </div>
                    )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
