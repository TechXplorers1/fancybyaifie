
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { OutfitGrid } from '@/components/OutfitGrid';
import { Newsletter } from '@/components/Newsletter';
import { useDatabase } from '@/firebase';
import { ref, onValue } from 'firebase/database';
import type { Outfit } from '@/lib/outfits';
import type { Product } from '@/lib/products';
import { useRouter } from 'next/navigation';
import { OutfitDetailDialog } from '@/components/OutfitDetailDialog';


export default function OutfitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const db = useDatabase();
  const router = useRouter();

  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    if (db) {
      const productsRef = ref(db, 'products');
      const unsubscribeProducts = onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsArray: Product[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setProducts(productsArray);
        } else {
          setProducts([]);
        }
      });

      const outfitsRef = ref(db, 'outfits');
      const unsubscribeOutfits = onValue(outfitsRef, (snapshot) => {
          const data = snapshot.val();
          const outfitsArray: Outfit[] = data ? Object.keys(data).map(key => {
            const outfitData = data[key];
            
            const itemsArray = outfitData.items && typeof outfitData.items === 'object' 
              ? Object.keys(outfitData.items).map(itemKey => ({
                  id: itemKey,
                  ...(outfitData.items[itemKey] as Omit<Product, 'id'>)
                }))
              : [];

            return {
              id: key,
              ...outfitData,
              items: itemsArray as Product[]
            };
          }) : [];
          setOutfits(outfitsArray);
      });

      return () => {
        unsubscribeProducts();
        unsubscribeOutfits();
      };
    }
  }, [db]);

  const handleBackToHome = () => {
    router.push('/');
  }

  const handleOutfitClick = (outfit: Outfit) => {
    console.log("Selected outfit:", outfit);
    setSelectedOutfit(outfit);
    setIsDetailOpen(true);
  };
  
  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOutfit(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header onNavigate={handleBackToHome} onProductSelect={() => {}} products={products} />
      <main className="flex-grow">
        <OutfitGrid outfits={outfits} onOutfitClick={handleOutfitClick} onBack={handleBackToHome}/>
      </main>
      <Newsletter />
      <Footer />
      <OutfitDetailDialog
        outfit={selectedOutfit}
        isOpen={isDetailOpen}
        onClose={handleCloseDetail}
      />
    </div>
  );
}
