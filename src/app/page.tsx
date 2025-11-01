
'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HeroSection } from '@/components/HeroSection';
import { ProductGrid } from '@/components/ProductGrid';
import { ProductDetail } from '@/components/ProductDetail';
import type { Product } from '@/lib/products';
import { CategoryNav } from '@/components/CategoryNav';
import { Newsletter } from '@/components/Newsletter';
import { useDatabase } from '@/firebase';
import { ref, onValue } from 'firebase/database';
import { Outfit } from '@/lib/outfits';
import { useRouter } from 'next/navigation';
import { OutfitDetailDialog } from '@/components/OutfitDetailDialog';

type View = 'home' | 'product';

export default function Home() {
  const [view, setView] = useState<View>('home');
  const [currentCategory, setCurrentCategory] = useState<string | null>('All');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const db = useDatabase();
  const router = useRouter();

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
              ? Object.values(outfitData.items)
              : [];

            return {
              id: key,
              ...outfitData,
              items: itemsArray as Product[],
              createdAt: outfitData.createdAt
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
  
  useEffect(() => {
    const handleNavigateOutfit = (event: Event) => {
      const customEvent = event as CustomEvent;
      const productId = customEvent.detail;
      const product = products.find(p => p.id === productId);
      if (product) {
        setSelectedProduct(product);
        setView('product');
        window.scrollTo(0, 0);
      }
    };
    
    window.addEventListener('navigate-outfit', handleNavigateOutfit);

    return () => {
      window.removeEventListener('navigate-outfit', handleNavigateOutfit);
    };
  }, [products]);

  useEffect(() => {
    const handleAdminAccess = () => {
      router.push('/admin');
    };
    window.addEventListener('admin-access-trigger', handleAdminAccess);
    return () => {
      window.removeEventListener('admin-access-trigger', handleAdminAccess);
    };
  }, [router]);
  
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setView('product');
    window.scrollTo(0, 0);
  }

  const handleBackToHome = () => {
    setSelectedProduct(null);
    setView('home');
  }

  const handleShowOutfitDetail = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOutfit(null);
  };

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const renderContent = () => {
    if (view === 'product' && selectedProduct) {
        return <ProductDetail product={selectedProduct} onBack={handleBackToHome} />;
    }

    return (
        <>
            <HeroSection />
            <CategoryNav 
                categories={categories}
                selectedCategory={currentCategory}
                onSelectCategory={setCurrentCategory}
            />
            <ProductGrid 
                products={products}
                category={currentCategory === 'All' ? null : currentCategory}
                onProductClick={handleSelectProduct} 
            />
        </>
    )
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-body">
      <Header onNavigate={handleBackToHome} onProductSelect={handleSelectProduct} products={products} />
      <main className="flex-grow">
        {renderContent()}
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
