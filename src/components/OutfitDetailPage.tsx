import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { ExternalLink, ArrowLeft } from 'lucide-react';

interface OutfitItem {
  name: string;
  category: string;
  price: number;
  image: string;
  affiliateLink: string;
}

interface OutfitDetailPageProps {
  outfitName: string;
  outfitImage: string;
  outfitDescription: string;
  totalPrice: number;
  items: OutfitItem[];
  onBack: () => void;
}

export function OutfitDetailPage({ 
  outfitName, 
  outfitImage,
  outfitDescription,
  totalPrice,
  items,
  onBack
}: OutfitDetailPageProps) {
  
  const handleShopItem = (affiliateLink: string) => {
    window.open(affiliateLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <section className="py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-8 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Outfits
        </Button>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl tracking-wide text-gray-900 mb-4">{outfitName}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{outfitDescription}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Left: Full outfit image */}
          <div className="space-y-6">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50 sticky top-8">
              <ImageWithFallback
                src={outfitImage}
                alt={outfitName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: Individual items */}
          <div className="grid grid-cols-4 gap-6">
            {Array.from({ length: 16 }).map((_, index) => {
              const item = items[index % items.length];
              return (
                <div 
                  key={index} 
                  className="cursor-pointer overflow-hidden bg-stone-50"
                  onClick={() => handleShopItem(item.affiliateLink)}
                >
                  <div className="aspect-square w-full overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}