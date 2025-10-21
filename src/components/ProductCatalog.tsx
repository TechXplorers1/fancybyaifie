import { useState, useEffect } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ExternalLink, Eye, ChevronDown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';

// 🔥 FIREBASE IMPORTS
import { db } from '../firebaseConfig'; 
import { ref, onValue } from 'firebase/database';
// ------------------------------------------

// Re-defining the Product interface to be compatible with both individual products and outfits
interface Product {
  id: string; // Use string ID for Firebase keys
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  isSale?: boolean;
  sizes?: string[]; // Sizes are optional for outfits
  description: string;
  affiliateLink: string;
  totalPrice?: number; // Added for outfits, matches the price field if needed
  // Include a field to hold the outfit items, though not strictly needed for the main catalog view
  items?: OutfitItem[];
}

interface OutfitItem {
  name: string;
  category: string;
  price: number;
  image: string;
  affiliateLink: string;
}

interface ProductCatalogProps {
  activeCategory: string;
}

export function ProductCatalog({ activeCategory }: ProductCatalogProps) {
  const [products, setProducts] = useState<Product[]>([]); 
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState('featured');
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewingOutfit, setViewingOutfit] = useState<Product | null>(null);

  // -------------------------------------------------------------
  // ✨ FETCH REAL-TIME DATA (Products and Outfits)
  // -------------------------------------------------------------
  useEffect(() => {
    setLoading(true);
    let allData: Product[] = [];
    let productsLoaded = false;
    let outfitsLoaded = false;

    // Function to check if both listeners have completed their initial load
    const checkAndSetData = (newProducts: Product[], newOutfits: Product[]) => {
        // Only set the combined data once both listeners have returned data
        if (productsLoaded && outfitsLoaded) {
            setProducts([...newProducts, ...newOutfits]);
            setLoading(false);
        }
    };
    
    // 1. Fetch Outfits
    const outfitsRef = ref(db, 'outfits');
    const unsubscribeOutfits = onValue(outfitsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedOutfits: Product[] = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          const outfit = data[key];
          // Map Outfit structure to the Product interface for catalog display
          loadedOutfits.push({
            id: key,
            name: outfit.name,
            price: outfit.totalPrice || 0, // Use totalPrice as the main price
            image: outfit.image,
            category: "Outfits", // Hardcode category for filtering
            description: outfit.description,
            affiliateLink: "", // Outfits don't have a single affiliate link
            isNew: false, 
            isSale: false, 
            items: outfit.items, // Keep the items array for the detail view
            totalPrice: outfit.totalPrice,
          });
        });
      }
      outfitsLoaded = true;
      // Pass the *current* list of products that aren't outfits
      checkAndSetData(allData.filter(p => p.category !== "Outfits"), loadedOutfits);
    }, (error) => {
      console.error("Firebase outfit data fetching failed:", error);
      outfitsLoaded = true;
      checkAndSetData(allData.filter(p => p.category !== "Outfits"), []);
    });
    
    // 2. Fetch Products
    const productsRef = ref(db, 'products');
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedProducts: Product[] = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          loadedProducts.push({ id: key, ...data[key], sizes: data[key].sizes || [] });
        });
      }
      productsLoaded = true;
      // Pass the *current* list of outfits that are already in allData
      checkAndSetData(loadedProducts, allData.filter(p => p.category === "Outfits"));
    }, (error) => {
      console.error("Firebase product data fetching failed:", error);
      productsLoaded = true;
      checkAndSetData([], allData.filter(p => p.category === "Outfits"));
    });


    // Cleanup listeners
    return () => {
      unsubscribeProducts();
      unsubscribeOutfits();
    };
  }, []);
  // -------------------------------------------------------------

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);

  const sortProducts = (products: Product[]) => {
    switch (sortOption) {
      case 'price_low':
        return [...products].sort((a, b) => a.price - b.price);
      case 'price_high':
        return [...products].sort((a, b) => b.price - a.price);
      case 'newest':
        // Placeholder for newest logic (currently relies on isNew flag)
        return [...products].sort((a, b) => (b.isNew ? 1 : a.isNew ? -1 : 0));
      case 'featured':
      default:
        // No sorting for 'featured'
        return products;
    }
  };

  const sortedProducts = sortProducts(filteredProducts);

  const handleShopNow = (product: Product) => {
    if (product.category === 'Outfits') {
      // Logic to open a dedicated Outfit View Dialog
      setViewingOutfit(product);
      setIsViewDialogOpen(true);
    } else {
      // For regular products, open affiliate link
      window.open(product.affiliateLink, '_blank');
    }
  };

  // --- Outfit View Dialog Implementation ---
  const OutfitViewDialog = () => {
    if (!viewingOutfit) return null;

    return (
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingOutfit.name}</DialogTitle>
            <DialogDescription>
              {viewingOutfit.description} - Total Price: ${viewingOutfit.price.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50">
              <ImageWithFallback
                src={viewingOutfit.image}
                alt={viewingOutfit.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Display the items that make up the outfit */}
            {viewingOutfit.items && viewingOutfit.items.length > 0 && (
              <div>
                <h4 className="mb-3 text-lg font-semibold">Shop The Look ({viewingOutfit.items.length})</h4>
                <div className="space-y-3">
                  {viewingOutfit.items.map((item, index) => (
                    <a 
                      key={index} 
                      href={item.affiliateLink} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex items-center gap-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden bg-stone-50 flex-shrink-0">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-base font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">{item.category}</p>
                      </div>
                      <p className="text-base font-semibold flex-shrink-0">${item.price.toFixed(2)}</p>
                      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-900 transition-colors flex-shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  };
  // ---------------------------------------------------------------------------------------------

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12 text-gray-600">
          <svg className="animate-spin h-5 w-5 mr-3 inline-block" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading products and outfits...
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
        {activeCategory === 'all' ? 'Shop All' : activeCategory}
      </h2>

      <div className="flex justify-between items-center mb-8">
        <p className="text-sm text-gray-600">{filteredProducts.length} items found</p>
        
        <div className="flex items-center space-x-4">
          <Label htmlFor="sort-select" className="text-sm text-gray-700">Sort by:</Label>
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

      <div>
        {/* The main grid container remains the same, which allows row-based height matching */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
          {sortedProducts.map((product) => (
            // ✅ CHANGE 1: Use 'flex flex-col' to enable h-full children
            <div key={product.id} className="group relative flex flex-col space-y-2"> 
              
              {/* This ensures the image is a perfect square */}
              <div className="aspect-[1/1] w-full overflow-hidden rounded-lg bg-gray-200">
                <ImageWithFallback
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
                />
                
                <div className="absolute top-2 left-2 flex flex-col space-y-1">
                  {product.category === "Outfits" && (
                    <Badge className="bg-orange-500 text-white hover:bg-orange-600">
                      Outfit
                    </Badge>
                  )}
                  {product.isNew && product.category !== "Outfits" && (
                    <Badge variant="secondary" className="bg-blue-600 text-white hover:bg-blue-700">
                      New
                    </Badge>
                  )}
                  {product.isSale && product.category !== "Outfits" && (
                    <Badge variant="destructive" className="bg-red-600 text-white hover:bg-red-700">
                      Sale
                    </Badge>
                  )}
                </div>
              </div>

              {/* ✅ CHANGE 2: Use flex-grow/flex-shrink and minimal spacing to compress content and push the button down */}
              <div className="flex flex-col flex-grow space-y-1">
                <div className='flex justify-between items-start'>
                  <h3 className="text-base text-gray-900 group-hover:text-gray-600 transition-colors font-medium leading-tight">
                    {product.name}
                  </h3>
                  <p className="text-base font-bold text-gray-900 ml-4 flex-shrink-0 leading-tight">
                    {product.category === 'Outfits' ? `$${product.price.toFixed(2)}` : `$${product.price.toFixed(2)}`}
                  </p>
                </div>

                {/* ✅ CHANGE 3: Use line-clamp-1 to enforce single-line description height and flex-grow to push content away */}
                <div className="min-h-[20px] flex-grow"> 
                  <p className="text-xs text-gray-500 line-clamp-1">{product.description ?? 'No description available.'}</p> 
                </div>

                <div className="space-y-1 pt-1">
                  {product.category !== "Outfits" && product.sizes && product.sizes.length > 0 && (
                    <div className="flex items-center gap-2">
                        <Label className="text-xs text-gray-600">Sizes:</Label>
                        <div className="flex gap-1">
                            {product.sizes.map(size => (
                                <Badge key={size} variant="outline" className="text-xs bg-white text-gray-700 border-gray-300 h-5 px-1.5">
                                    {size}
                                </Badge>
                            ))}
                        </div>
                    </div>
                  )}

                  <Button
                    onClick={() => handleShopNow(product)}
                    className="w-full bg-gray-900 text-white hover:bg-gray-800 flex items-center justify-center gap-2 h-9"
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
          <div className="text-center py-12">
            <p className="text-gray-500">No products found in this category.</p>
          </div>
        )}
      </div>

      {/* RENDER THE OUTFIT VIEW DIALOG */}
      <OutfitViewDialog />
    </section>
  );
}