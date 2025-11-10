
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
import { OutfitDetail } from '@/components/OutfitDetail';


export default function OutfitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const db = useDatabase();
  const router = useRouter();

  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);

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
            
            let itemsArray: Product[] = [];
            if (outfitData.items) {
              if (Array.isArray(outfitData.items)) {
                itemsArray = outfitData.items.filter(Boolean); // Filter out potential null/undefined values
              } else if (typeof outfitData.items === 'object') {
                itemsArray = Object.keys(outfitData.items).map(itemKey => ({
                    id: itemKey,
                    ...(outfitData.items[itemKey] as Omit<Product, 'id'>)
                }));
              }
            }

            return {
              id: key,
              ...outfitData,
              items: itemsArray,
            };
          }) : [];

          // Sort outfits by createdAt date, newest first
          outfitsArray.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });

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
    setSelectedOutfit(outfit);
    window.scrollTo(0, 0);
  };
  
  const handleCloseDetail = () => {
    setSelectedOutfit(null);
  };
  
  const handleBackToOutfits = () => {
    setSelectedOutfit(null);
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header onNavigate={handleBackToHome} onProductSelect={() => {}} products={products} />
      <main className="flex-grow">
        {selectedOutfit ? (
          <OutfitDetail outfit={selectedOutfit} onBack={handleBackToOutfits} />
        ) : (
          <OutfitGrid outfits={outfits} onOutfitClick={handleOutfitClick} onBack={handleBackToHome}/>
        )}
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}
