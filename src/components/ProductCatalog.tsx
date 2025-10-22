import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ExternalLink, Eye, DollarSign } from 'lucide-react'; // Added DollarSign for consistency
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { db } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

interface OutfitItem {
  name: string;
  category: string;
  price: number;
  image: string;
  affiliateLink: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  sizes?: string[];
  description: string;
  affiliateLink: string;
  totalPrice?: number;
  items?: OutfitItem[];
}

interface ProductCatalogProps {
  activeCategory: string;
}

// Helper function to sort and filter products (moved outside of the component)
const sortProducts = (products: Product[], sortOption: string) => {
    switch (sortOption) {
      case 'price_low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price_high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'newest':
        return [...products].sort((a, b) => (b.isNew ? -1 : a.isNew ? 1 : 0)); // Sort newest first
      default:
        return products;
    }
};

// ------------------------------------------
// Outfit View Dialog Component (Implemented to show outfit items)
// ------------------------------------------
const OutfitViewDialog: React.FC<{ outfit: Product | null, isOpen: boolean, onClose: () => void }> = ({ outfit, isOpen, onClose }) => {
    if (!outfit || !outfit.items || !isOpen) return null;
  
    const handleShopItem = (affiliateLink: string) => {
        window.open(affiliateLink, '_blank', 'noopener,noreferrer');
    };
  
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center justify-between">
                        {outfit.name}
                        <span className="text-xl font-bold text-gray-900 flex items-center gap-1">
                          <DollarSign className="h-5 w-5" />
                          {(outfit.totalPrice || outfit.price).toFixed(2)}
                        </span>
                    </DialogTitle>
                    <DialogDescription>{outfit.description}</DialogDescription>
                </DialogHeader>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left: Full outfit image */}
                    <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50">
                        <ImageWithFallback
                            src={outfit.image}
                            alt={outfit.name}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Right: Individual items */}
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold">Individual Items ({outfit.items.length})</h4>
                        <div className="space-y-3">
                            {outfit.items.map((item, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="w-12 h-12 rounded overflow-hidden bg-stone-50">
                                        <ImageWithFallback
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-gray-800">${item.price.toFixed(2)}</p>
                                        <Button
                                            onClick={() => handleShopItem(item.affiliateLink)}
                                            variant="outline"
                                            size="sm"
                                            className="mt-1 h-7 text-xs"
                                        >
                                            Shop <ExternalLink className="h-3 w-3 ml-1" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// ------------------------------------------

export function ProductCatalog({ activeCategory }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingOutfit, setViewingOutfit] = useState<Product | null>(null);

  // 🔥 Consolidated useEffect to fetch both datasets and merge them once.
  useEffect(() => {
    setLoading(true);
    let allProducts: Product[] = [];
    let allOutfits: Product[] = [];
    let productsLoaded = false;
    let outfitsLoaded = false;

    const checkAndSetData = () => {
        if (productsLoaded && outfitsLoaded) {
            setProducts([...allProducts, ...allOutfits]);
            setLoading(false);
        }
    };

    // 1. Fetch Outfits from 'outfits' node
    const outfitsRef = ref(db, 'outfits');
    const unsubscribeOutfits = onValue(outfitsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedOutfits: Product[] = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          const outfit = data[key];
          loadedOutfits.push({
            id: key,
            name: outfit.name,
            price: outfit.totalPrice || 0,
            image: outfit.image,
            category: 'Outfits', // Assign 'Outfits' category here
            description: outfit.description,
            affiliateLink: '',
            items: outfit.items || [],
            totalPrice: outfit.totalPrice,
          });
        });
      }
      allOutfits = loadedOutfits;
      outfitsLoaded = true;
      checkAndSetData();
    }, (error) => {
        console.error("Firebase Outfits fetch failed:", error);
        outfitsLoaded = true;
        checkAndSetData();
    });

    // 2. Fetch Products from 'products' node
    const productsRef = ref(db, 'products');
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedProducts: Product[] = [];
      if (data) {
        Object.keys(data).forEach((key) => {
            const product = data[key];
            loadedProducts.push({
                id: key,
                name: product.name,
                price: product.price,
                originalPrice: product.originalPrice,
                image: product.image,
                category: product.category, // This category must match the tile name (Top, Bottom, etc.)
                isNew: product.isNew,
                isSale: product.isSale,
                sizes: product.sizes || [],
                description: product.description,
                affiliateLink: product.affiliateLink,
            });
        });
      }
      allProducts = loadedProducts;
      productsLoaded = true;
      checkAndSetData();
    }, (error) => {
        console.error("Firebase Products fetch failed:", error);
        productsLoaded = true;
        checkAndSetData();
    });

    return () => {
      unsubscribeProducts();
      unsubscribeOutfits();
    };
  }, []); // Empty dependency array: fetches data once on mount

  // 🔥 Filtering logic: Filters from the merged 'products' state based on activeCategory
  const filteredProducts =
    activeCategory === 'all' // Assuming 'all' is the default if no category is selected
      ? products
      : products.filter((product) => product.category === activeCategory);

  const sortedProducts = sortProducts(filteredProducts, sortOption);

  const handleShopNow = (product: Product) => {
    if (product.category === 'Outfits') {
      setViewingOutfit(product);
      setIsViewDialogOpen(true);
    } else {
      window.open(product.affiliateLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 text-center text-gray-600">
        Loading products and outfits...
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-12 px-4">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
        {activeCategory === 'all' ? 'Shop All' : activeCategory}
      </h2>

      <div className="flex justify-between items-center mb-8">
        <p className="text-sm text-gray-600">{sortedProducts.length} items found</p>
        <div className="flex items-center space-x-4">
          <Label htmlFor="sort-select" className="text-sm text-gray-700">
            Sort by:
          </Label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger id="sort-select" className="w-[180px] text-left">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="newest">Newest Arrivals</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid with uniform card height */}
     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {sortedProducts.map((product) => (
            <div key={product.id} className="group">
              <div 
                className="relative aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-stone-50 cursor-pointer"
                onClick={() => handleShopNow(product)}
              >
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Badges */}
                <div className="absolute top-3 left-3 space-y-2">
                  {product.isNew && (
                    <Badge variant="secondary" className="bg-white text-gray-900">
                      New
                    </Badge>
                  )}
                  {product.isSale && (
                    <Badge variant="destructive" className="bg-red-600 text-white">
                      Sale
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="text-lg text-gray-900 group-hover:text-gray-600 transition-colors">
                    {product.name}
                  </h3>
                  {/* Display price clearly */}
                  <p className="text-sm font-medium text-gray-900">
                      ${(product.price).toFixed(2)}
                      {product.originalPrice && product.isSale && (
                           <span className="line-through text-gray-500 ml-2">${product.originalPrice.toFixed(2)}</span>
                      )}
                  </p>
                  <p className="text-sm text-gray-500">{product.description}</p>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={() => handleShopNow(product)}
                    className="w-full bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center gap-2"
                  >
                    {product.category === "Outfits" ? "View Outfit Details" : "Shop Now"}
                    {product.category === "Outfits" ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>


      {sortedProducts.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No products found in this category. Please check your Firebase data names.
        </div>
      )}

      <OutfitViewDialog 
        outfit={viewingOutfit} 
        isOpen={isViewDialogOpen} 
        onClose={() => setIsViewDialogOpen(false)} 
      />
    </section>
  );
}