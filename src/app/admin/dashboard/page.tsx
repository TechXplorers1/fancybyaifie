
'use client';

import { useState, useEffect } from 'react';
import { BarChart, Package, LayoutGrid, Users, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from 'next/navigation';
import { ProductManagement } from '@/components/ProductManagement';
import { OutfitManagement } from '@/components/OutfitManagement';
import { Product } from '@/lib/products';
import { Outfit } from '@/lib/outfits';
import { useDatabase } from '@/firebase';
import { ref, onValue } from 'firebase/database';

export default function AdminDashboardPage() {
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const db = useDatabase();
    
    useEffect(() => {
        if (!db) return;

        const productsRef = ref(db, 'products');
        const outfitsRef = ref(db, 'outfits');

        const unsubscribeProducts = onValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            const productsArray: Product[] = data ? Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            })) : [];
            setProducts(productsArray);
        });

        const unsubscribeOutfits = onValue(outfitsRef, (snapshot) => {
            const data = snapshot.val();
            const outfitsArray: Outfit[] = data ? Object.keys(data).map(key => ({
              id: key,
              ...data[key],
              items: data[key].items ? Object.values(data[key].items) : []
            })) : [];
            setOutfits(outfitsArray);
        });

        return () => {
            unsubscribeProducts();
            unsubscribeOutfits();
        };
    }, [db]);

    const categories = [...new Set(products.map(p => p.category))];

    const stats = [
        { title: 'Total Products', value: products.length.toString(), description: 'Across all categories', icon: Package },
        { title: 'Total Outfits', value: outfits.length.toString(), description: 'Curated collections', icon: LayoutGrid },
        { title: 'Categories', value: categories.length.toString(), description: 'Active categories', icon: BarChart },
        { title: 'Newsletter', value: '-', description: 'Subscribers (mock)', icon: Users },
    ]

    return (
        <div className="flex flex-col min-h-screen bg-muted/40 dark:bg-zinc-900/40">
            <header className="bg-background dark:bg-card border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <h1 className="text-lg sm:text-xl font-semibold text-foreground">fancybyaifie Admin</h1>
                        <Button variant="outline" size="sm" onClick={() => router.push('/admin')}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>
            <main className="flex-1 p-2 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    <Tabs defaultValue="overview" className="flex flex-col w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="products">Products</TabsTrigger>
                            <TabsTrigger value="outfits">Outfits</TabsTrigger>
                        </TabsList>
                        <TabsContent value="overview" className="mt-6">
                            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat) => {
                                    const Icon = stat.icon;
                                    return (
                                        <Card key={stat.title}>
                                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                                                <Icon className="h-4 w-4 text-muted-foreground" />
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">{stat.value}</div>
                                                <p className="text-xs text-muted-foreground">{stat.description}</p>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        </TabsContent>
                        <TabsContent value="products">
                           <ProductManagement products={products} setProducts={setProducts} />
                        </TabsContent>
                         <TabsContent value="outfits">
                           <OutfitManagement 
                             outfits={outfits} 
                             allProducts={products}
                             setOutfits={setOutfits}
                           />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
