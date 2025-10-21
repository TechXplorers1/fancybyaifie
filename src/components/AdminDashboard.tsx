import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LogOut, Package, ShoppingBag, Users, TrendingUp } from 'lucide-react';
import { ProductManagement } from './ProductManagement';
import { OutfitManagement } from './OutfitManagement';

// 🔥 FIREBASE IMPORTS
import { db } from '../firebaseConfig'; 
import { ref, onValue } from 'firebase/database';
// ------------------------------------------

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  // State for live counts
  const [productCount, setProductCount] = useState<number | string>('...');
  const [outfitCount, setOutfitCount] = useState<number | string>('...');

  // Effect to fetch live counts from Firebase
  useEffect(() => {
    // 1. Fetch Product Count from /products
    const productsRef = ref(db, 'products');
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProductCount(Object.keys(data).length);
      } else {
        setProductCount(0);
      }
    }, (error) => {
      console.error("Firebase product count fetching failed:", error);
      setProductCount('Error');
    });

    // 2. Fetch Outfit Count from /outfits
    const outfitsRef = ref(db, 'outfits');
    const unsubscribeOutfits = onValue(outfitsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setOutfitCount(Object.keys(data).length);
      } else {
        setOutfitCount(0);
      }
    }, (error) => {
      console.error("Firebase outfit count fetching failed:", error);
      setOutfitCount('Error');
    });

    // Cleanup listeners
    return () => {
      unsubscribeProducts();
      unsubscribeOutfits();
    };
  }, []);


  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl text-gray-900">Fancybyaifie Admin</h1>
            </div>
            <Button
              onClick={onLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="outfits">Outfits</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  {/* Display LIVE productCount */}
                  <div className="text-2xl">{productCount}</div> 
                  <p className="text-xs text-gray-500">Across all categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Total Outfits</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  {/* Display LIVE outfitCount */}
                  <div className="text-2xl">{outfitCount}</div>
                  <p className="text-xs text-gray-500">Curated collections</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Categories</CardTitle>
                  <TrendingUp className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">6</div>
                  <p className="text-xs text-gray-500">Active categories</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm">Newsletter</CardTitle>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl">-</div>
                  <p className="text-xs text-gray-500">Subscribers (mock)</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common management tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => setActiveTab('products')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Manage Products
                </Button>
                <Button
                  onClick={() => setActiveTab('outfits')}
                  variant="outline"
                  className="w-full justify-start"
                >
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Manage Outfits
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <ProductManagement />
          </TabsContent>

          <TabsContent value="outfits">
            <OutfitManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}