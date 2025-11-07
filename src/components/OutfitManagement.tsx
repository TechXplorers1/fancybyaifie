'use client';

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2, Eye, X, Search } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from './ui/scroll-area';
import { Product } from '@/lib/products';
import { Outfit } from '@/lib/outfits';
import { useDatabase } from '@/firebase';
import { ref, set, push, remove } from 'firebase/database';

// Utility function to check for a valid external URL structure (http or https)
const isValidUrl = (url: string | null | undefined): boolean => {
  if (!url || typeof url !== 'string' || url.length < 5) return false;
  // Next.js requires absolute URLs for external images
  return url.startsWith('http://') || url.startsWith('https://');
};

interface OutfitManagementProps {
  outfits: Outfit[];
  setOutfits: React.Dispatch<React.SetStateAction<Outfit[]>>;
  allProducts: Product[];
}

export function OutfitManagement({ outfits, setOutfits, allProducts }: OutfitManagementProps) {
  const db = useDatabase();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [viewingOutfit, setViewingOutfit] = useState<Outfit | null>(null);
  const [outfitToDelete, setOutfitToDelete] = useState<Outfit | null>(null);
  const [productSearchTerm, setProductSearchTerm] = useState('');

  const [formData, setFormData] = useState<{
    name: string;
    description: string;
    image: string;
    items: Product[];
  }>({
    name: '',
    description: '',
    image: '',
    items: [],
  });

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
      items: [],
    });
    setProductSearchTerm('');
  };

  const handleAdd = () => {
    if (!db) return;

    const newOutfitData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      items: formData.items.reduce((acc, item) => {
        // Firebase RTDB doesn't like arrays, convert to object
        acc[item.id] = item;
        return acc;
      }, {} as {[key: string]: Product}),
      createdAt: new Date().toISOString(),
    };
    
    const newOutfitRef = push(ref(db, 'outfits'));
    set(newOutfitRef, newOutfitData);

    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setFormData({
      name: outfit.name,
      description: outfit.description,
      image: outfit.image,
      items: [...(outfit.items || [])],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingOutfit || !db) return;

    const updatedOutfitData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      items: formData.items.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as {[key: string]: Product}),
      createdAt: editingOutfit.createdAt || new Date().toISOString(),
    };

    const outfitRef = ref(db, `outfits/${editingOutfit.id}`);
    set(outfitRef, updatedOutfitData);
    
    setIsEditDialogOpen(false);
    setEditingOutfit(null);
    resetForm();
  };

  const handleDelete = () => {
    if (outfitToDelete && db) {
      remove(ref(db, `outfits/${outfitToDelete.id}`));
      setOutfitToDelete(null);
    }
  };

  const handleView = (outfit: Outfit) => {
    setViewingOutfit(outfit);
    setIsViewDialogOpen(true);
  };

  const handleToggleProductInOutfit = (product: Product, action: 'add' | 'remove') => {
    setFormData(prev => {
      const isAlreadyIn = prev.items.some(item => item.id === product.id);
      if (action === 'add' && !isAlreadyIn) {
        return { ...prev, items: [...prev.items, product] };
      }
      if (action === 'remove' && isAlreadyIn) {
        return { ...prev, items: prev.items.filter(item => item.id !== product.id) };
      }
      return prev;
    });
  };

  const getTotalPrice = (items: Product[] | null | undefined) => {
    const safeItems = Array.isArray(items) ? items : []; 
    return safeItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(2);
  }
  
  const filteredProducts = useMemo(() => {
    if (!productSearchTerm) {
      return allProducts;
    }
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase())
    );
  }, [allProducts, productSearchTerm]);

  const OutfitForm = ({ isEditing = false }: { isEditing?: boolean }) => (
    <div className="grid md:grid-cols-2 gap-6 h-full">
        {/* Left Column: Form Fields & Selected Items */}
        <div className="flex flex-col gap-4">
            <div className="space-y-2">
                <Label htmlFor="outfit-name">Outfit Name</Label>
                <Input
                    id="outfit-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Casual Elegance"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="outfit-description">Description</Label>
                <Textarea
                    id="outfit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Perfect blend of comfort and style..."
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="outfit-image">Main Image URL</Label>
                <Input
                    id="outfit-image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://picsum.photos/seed/..."
                />
            </div>
            
            {/* Selected Items Section */}
            <div className="flex-1 flex flex-col min-h-0 space-y-3">
                <div className="flex items-center justify-between">
                    <Label>Selected Items ({formData.items.length})</Label>
                    <span className="text-sm text-muted-foreground">
                        Total: ${getTotalPrice(formData.items)}
                    </span>
                </div>
                <ScrollArea className="border rounded-lg bg-muted/50 flex-1">
                    <div className="p-3 space-y-2">
                        {formData.items.length > 0 ? (
                            formData.items.map((item, index) => (
                                <div key={`${item.id}-${index}`} className="flex items-center gap-3 p-2 bg-background rounded border">
                                    <div className="w-12 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                                        {isValidUrl(item.image) ? (
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70">No Img</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium whitespace-normal">{item.name}</p>
                                        <p className="text-xs text-muted-foreground">{item.category}</p>
                                    </div>
                                    <p className="text-sm flex-shrink-0">${(item.price || 0).toFixed(2)}</p>
                                    <Button
                                        onClick={() => handleToggleProductInOutfit(item, 'remove')}
                                        variant="ghost"
                                        size="icon"
                                        className="flex-shrink-0 h-8 w-8"
                                    >
                                        <X className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full py-4">
                                <p className="text-sm text-muted-foreground text-center">No items added yet.</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>

        {/* Right Column: Product List */}
        <div className="flex flex-col gap-2 min-h-0">
            <Label>Add Products to Outfit</Label>
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    value={productSearchTerm}
                    onChange={(e) => setProductSearchTerm(e.target.value)}
                    className="pl-9"
                />
            </div>
            <ScrollArea className="border rounded-lg bg-muted/50 flex-1">
                <div className="p-3 space-y-2">
                    {filteredProducts.map((product) => {
                        const isAdded = formData.items.some(item => item.id === product.id);
                        return (
                            <div
                                key={product.id}
                                className={`flex items-center gap-3 p-2 rounded border bg-background cursor-pointer hover:bg-muted/80 ${isAdded ? 'opacity-50 pointer-events-none' : ''}`}
                                onClick={() => !isAdded && handleToggleProductInOutfit(product, 'add')}
                            >
                                <div className="w-12 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                                    {isValidUrl(product.image) ? (
                                        <Image
                                            src={product.image}
                                            alt={product.name}
                                            fill
                                            sizes="48px"
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70">No Img</div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium whitespace-normal">{product.name}</p>
                                    <p className="text-xs text-muted-foreground">{product.category}</p>
                                </div>
                                <p className="text-sm flex-shrink-0">${(product.price || 0).toFixed(2)}</p>
                            </div>
                        );
                    })}
                    {filteredProducts.length === 0 && (
                        <div className="flex items-center justify-center h-full py-4">
                             <p className="text-sm text-muted-foreground text-center">No products found.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    </div>
);


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Outfit Management</CardTitle>
            <CardDescription>Manage curated outfit collections</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
            if (!isOpen) resetForm();
            setIsAddDialogOpen(isOpen);
          }}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Outfit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-full h-full sm:h-[90vh] p-0 flex flex-col sm:rounded-lg">
              <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
                <DialogTitle>Add New Outfit</DialogTitle>
                <DialogDescription>Create a new curated outfit collection</DialogDescription>
              </DialogHeader>
              <div className="flex-1 p-6 overflow-y-auto">
                 <OutfitForm />
              </div>
              <div className="flex flex-col-reverse sm:flex-row gap-2 p-6 pt-4 border-t bg-background flex-shrink-0">
                <Button onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }} variant="outline" className="w-full">
                  Cancel
                </Button>
                <Button onClick={handleAdd} className="w-full">
                  Add Outfit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
      <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Items</TableHead>
                  <TableHead className="hidden sm:table-cell">Total Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(outfits || []).map((outfit) => (
                  <TableRow key={outfit.id}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="w-12 h-16 relative rounded overflow-hidden bg-muted">
                        {isValidUrl(outfit.image) ? (
                          <Image
                            src={outfit.image}
                            alt={outfit.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70 border border-dashed">
                            No Img
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] whitespace-normal">{outfit.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{(outfit.items || []).length} items</TableCell>
                    <TableCell className="hidden sm:table-cell">${getTotalPrice(outfit.items)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button
                          onClick={() => handleView(outfit)}
                          variant="outline"
                          size="icon" className="h-8 w-8"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(outfit)}
                          variant="outline"
                          size="icon" className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setOutfitToDelete(outfit)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this
                                outfit.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setOutfitToDelete(null)}>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          resetForm();
          setEditingOutfit(null);
        }
        setIsEditDialogOpen(isOpen);
      }}>
        <DialogContent className="max-w-4xl w-full h-full sm:h-[90vh] p-0 flex flex-col sm:rounded-lg">
          <DialogHeader className="p-6 pb-4 border-b flex-shrink-0">
            <DialogTitle>Edit Outfit: {editingOutfit?.name}</DialogTitle>
            <DialogDescription>Update the outfit details and manage items</DialogDescription>
          </DialogHeader>
          <div className="flex-1 p-6 overflow-y-auto">
            <OutfitForm isEditing={true} />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 p-6 pt-4 border-t bg-background flex-shrink-0">
            <Button onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }} variant="outline" className="w-full">
              Cancel
            </Button>
            <Button onClick={handleUpdate} className="w-full">
              Update Outfit
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl h-auto max-h-[85vh]">
          <DialogHeader>
            <DialogTitle>{viewingOutfit?.name}</DialogTitle>
            <DialogDescription>{viewingOutfit?.description}</DialogDescription>
          </DialogHeader>
           <ScrollArea className="h-full">
            <div className="grid md:grid-cols-2 gap-8 pr-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                  {isValidUrl(viewingOutfit?.image) ? (
                    <Image
                      src={viewingOutfit?.image || ''}
                      alt={viewingOutfit?.name || 'Outfit Image'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground/70 border border-dashed">
                      No Outfit Image Available
                    </div>
                  )}
                </div>
                <div className="p-3 bg-muted/50 rounded-lg text-sm">
                  <div className="flex justify-between items-center font-medium">
                    <span>Total Price:</span>
                    <span>${viewingOutfit ? getTotalPrice(viewingOutfit.items) : '0.00'}</span> 
                  </div>
                </div>
              </div>

              <div>
                <h4 className="mb-4 text-lg font-semibold">Outfit Items ({(viewingOutfit?.items || []).length})</h4>
                <div className="space-y-3">
                  {viewingOutfit?.items && viewingOutfit.items.length > 0 ? (
                    viewingOutfit.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg bg-background hover:shadow-sm transition-shadow">
                        <div className="w-16 h-20 relative rounded overflow-hidden bg-muted flex-shrink-0">
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
                          <p className="font-medium whitespace-normal">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <p className="text-sm font-semibold mt-1">${(item.price || 0).toFixed(2)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No items in this outfit</p>
                  )}
                </div>
              </div>
            </div>
           </ScrollArea>
        </DialogContent>
      </Dialog>
    </Card>
  );
}