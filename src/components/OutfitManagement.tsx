import { useState, useEffect } from 'react';
import React from 'react'; // Import React to use React.ChangeEvent
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2, Eye, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ScrollArea } from './ui/scroll-area';

// 🔥 FIREBASE IMPORTS
import { db } from '../firebaseConfig'; 
import { ref, push, onValue, remove, update } from 'firebase/database';
// ------------------------------------------

interface Product {
  id: string; // Firebase key
  name: string;
  price: number;
  image: string;
  category: string;
  affiliateLink: string;
}

interface OutfitItem {
  name: string;
  category: string;
  price: number;
  image: string;
  affiliateLink: string;
}

interface Outfit {
  id: string; // Firebase key
  name: string;
  description: string;
  image: string;
  totalPrice: number;
  items: OutfitItem[];
}


export function OutfitManagement() {
  const [outfits, setOutfits] = useState<Outfit[]>([]); 
  const [products, setProducts] = useState<Product[]>([]); 

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [viewingOutfit, setViewingOutfit] = useState<Outfit | null>(null);
  const [editingItems, setEditingItems] = useState<OutfitItem[]>([]);
  const [addingItems, setAddingItems] = useState<OutfitItem[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  // -------------------------------------------------------------
  // ✨ FETCH REAL-TIME DATA (Products and Outfits)
  // -------------------------------------------------------------
  useEffect(() => {
    // 1. Fetch Products
    const productsRef = ref(db, 'products');
    const unsubscribeProducts = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedProducts: Product[] = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          loadedProducts.push({ id: key, ...data[key] });
        });
      }
      setProducts(loadedProducts);
    }, (error) => {
      console.error("Firebase product data fetching failed:", error);
    });

    // 2. Fetch Outfits
    const outfitsRef = ref(db, 'outfits');
    const unsubscribeOutfits = onValue(outfitsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedOutfits: Outfit[] = [];
      if (data) {
        Object.keys(data).forEach((key) => {
          // Firebase key is set as the Outfit ID
          loadedOutfits.push({ id: key, ...data[key] });
        });
      }
      setOutfits(loadedOutfits);
    }, (error) => {
      console.error("Firebase outfit data fetching failed:", error);
    });

    // Cleanup listeners
    return () => {
      unsubscribeProducts();
      unsubscribeOutfits();
    };
  }, []);
  // -------------------------------------------------------------


  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
    });
    setAddingItems([]);
  };

  // 🔥 Save to Firebase
  const handleAdd = async () => {
    const totalPrice = addingItems.reduce((sum, item) => sum + item.price, 0);
    
    const newOutfitData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      totalPrice,
      items: addingItems,
      createdAt: new Date().toISOString(),
    };

    try {
        const outfitsRef = ref(db, 'outfits');
        // Push data to Firebase, which updates the 'outfits' state automatically
        await push(outfitsRef, newOutfitData);

        setIsAddDialogOpen(false);
        resetForm();
    } catch (error) {
        console.error("Error adding outfit to Firebase:", error);
        alert("Failed to save outfit.");
    }
  };

  const handleEdit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setFormData({
      name: outfit.name,
      description: outfit.description,
      image: outfit.image,
    });
    setEditingItems([...outfit.items]);
    setIsEditDialogOpen(true);
  };

  // Update Logic (Uses Firebase update)
  const handleUpdate = async () => {
    if (!editingOutfit) return;

    const totalPrice = editingItems.reduce((sum, item) => sum + item.price, 0);

    const updatedOutfitData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      items: editingItems,
      totalPrice,
    };
    
    try {
        const outfitRef = ref(db, `outfits/${editingOutfit.id}`);
        await update(outfitRef, updatedOutfitData);

        setIsEditDialogOpen(false);
        setEditingOutfit(null);
        setEditingItems([]);
        resetForm();
    } catch (error) {
        console.error("Error updating outfit in Firebase:", error);
        alert("Failed to update outfit.");
    }
  };

  const handleAddItemToOutfit = (productId: string) => {
    // Uses the real-time 'products' state
    const product = products.find(p => p.id === productId); 
    if (!product) return;

    const newItem: OutfitItem = {
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      affiliateLink: product.affiliateLink,
    };

    setEditingItems([...editingItems, newItem]);
  };

  const handleRemoveItemFromOutfit = (index: number) => {
    setEditingItems(editingItems.filter((_, i) => i !== index));
  };

  const handleAddItemToNewOutfit = (productId: string) => {
    // Uses the real-time 'products' state
    const product = products.find(p => p.id === productId); 
    if (!product) return;

    const newItem: OutfitItem = {
      name: product.name,
      category: product.category,
      price: product.price,
      image: product.image,
      affiliateLink: product.affiliateLink,
    };

    setAddingItems([...addingItems, newItem]);
  };

  const handleRemoveItemFromNewOutfit = (index: number) => {
    setAddingItems(addingItems.filter((_, i) => i !== index));
  };

  // Delete Logic (Uses Firebase remove)
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this outfit?')) {
        try {
            const outfitRef = ref(db, `outfits/${id}`);
            await remove(outfitRef);
        } catch (error) {
            console.error("Error deleting outfit from Firebase:", error);
            alert("Failed to delete outfit.");
        }
    }
  };

  const handleView = (outfit: Outfit) => {
    setViewingOutfit(outfit);
    setIsViewDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Outfit Management</CardTitle>
            <CardDescription>Manage curated outfit collections</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 text-white hover:bg-gray-800" onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Outfit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Add New Outfit</DialogTitle>
                <DialogDescription>Create a new curated outfit collection</DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] pr-4">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="outfit-name">Outfit Name</Label>
                    <Input
                      id="outfit-name"
                      value={formData.name}
                      // FIXED: Explicitly type the event object
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Outfit Name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outfit-description">Description</Label>
                    <Textarea
                      id="outfit-description"
                      value={formData.description}
                      // FIXED: Explicitly type the event object
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description of the outfit"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outfit-image">Main Image URL</Label>
                    <Input
                      id="outfit-image"
                      value={formData.image}
                      // FIXED: Explicitly type the event object
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="Main Image URL"
                    />
                  </div>

                  {/* Selected Items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Selected Items ({addingItems.length})</Label>
                      <span className="text-sm text-gray-500">
                        Total: ${addingItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                      </span>
                    </div>
                    {addingItems.length > 0 ? (
                      <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                        {addingItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border">
                            <div className="w-12 h-12 rounded overflow-hidden bg-stone-50 flex-shrink-0">
                              <ImageWithFallback
                                src={item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm truncate">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.category}</p>
                            </div>
                            <p className="text-sm flex-shrink-0">${item.price.toFixed(2)}</p>
                            <Button
                              onClick={() => handleRemoveItemFromNewOutfit(index)}
                              variant="ghost"
                              size="sm"
                              className="flex-shrink-0"
                            >
                              <X className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4 border rounded-lg bg-gray-50">
                        No items added yet. Select products below to add them.
                      </p>
                    )}
                  </div>

                  {/* Add Products - USES REAL-TIME PRODUCTS */}
                  <div className="space-y-3">
                    <Label>Add Products to Outfit</Label>
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <ScrollArea className="h-64">
                        <div className="space-y-2 pr-4">
                          {products.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Loading products from Firebase...</p>
                          ) : (
                            products.map((product) => {
                              const isAlreadyAdded = addingItems.some(
                                item => item.name === product.name && item.image === product.image
                              );
                              return (
                                <div
                                  key={product.id}
                                  className={`flex items-center gap-3 p-2 rounded border bg-white ${
                                    isAlreadyAdded ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'
                                  }`}
                                  onClick={() => !isAlreadyAdded && handleAddItemToNewOutfit(product.id)}
                                >
                                  <div className="w-12 h-12 rounded overflow-hidden bg-stone-50 flex-shrink-0">
                                    <ImageWithFallback
                                      src={product.image}
                                      alt={product.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm truncate">{product.name}</p>
                                    <p className="text-xs text-gray-500">{product.category}</p>
                                  </div>
                                  <p className="text-sm flex-shrink-0">${product.price.toFixed(2)}</p>
                                  {isAlreadyAdded ? (
                                    <span className="text-xs text-gray-500 flex-shrink-0">Added</span>
                                  ) : (
                                    <Button
                                      onClick={(e: { stopPropagation: () => void; }) => {
                                        e.stopPropagation(); // Prevent dialog close
                                        handleAddItemToNewOutfit(product.id);
                                      }}
                                      variant="outline"
                                      size="sm"
                                      className="flex-shrink-0"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex gap-2 pt-4 border-t">
                <Button 
                  onClick={handleAdd} 
                  className="flex-1 bg-gray-900 text-white hover:bg-gray-800"
                  disabled={!formData.name || addingItems.length === 0} // Disable if no name or items
                >
                  Add Outfit to Firebase
                </Button>
                <Button onClick={() => {
                  setIsAddDialogOpen(false);
                  resetForm();
                }} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Items</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outfits.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No outfits found in the database.
                    </TableCell>
                  </TableRow>
              ) : (
                outfits.map((outfit) => (
                  <TableRow key={outfit.id}>
                    <TableCell>
                      <div className="w-12 h-12 rounded overflow-hidden bg-stone-50">
                        <ImageWithFallback
                          src={outfit.image}
                          alt={outfit.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{outfit.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{outfit.description}</TableCell>
                    <TableCell>{outfit.items.length} items</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleView(outfit)}
                          variant="outline"
                          size="sm"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleEdit(outfit)}
                          variant="outline"
                          size="sm"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(outfit.id)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Outfit</DialogTitle>
            <DialogDescription>Update the outfit details and manage items</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="edit-outfit-name">Outfit Name</Label>
                <Input
                  id="edit-outfit-name"
                  value={formData.name}
                  // FIXED: Explicitly type the event object
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-outfit-description">Description</Label>
                <Textarea
                  id="edit-outfit-description"
                  value={formData.description}
                  // ✅ FIX FOR LINE 374: Explicitly type the event object
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-outfit-image">Main Image URL</Label>
                <Input
                  id="edit-outfit-image"
                  value={formData.image}
                  // FIXED: Explicitly type the event object
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              {/* Current Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Current Items ({editingItems.length})</Label>
                  <span className="text-sm text-gray-500">
                    Total: ${editingItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                  </span>
                </div>
                {editingItems.length > 0 ? (
                  <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                    {editingItems.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-white rounded border">
                        <div className="w-12 h-12 rounded overflow-hidden bg-stone-50 flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.name}</p>
                          <p className="text-xs text-gray-500">{item.category}</p>
                        </div>
                        <p className="text-sm flex-shrink-0">${item.price.toFixed(2)}</p>
                        <Button
                          onClick={() => handleRemoveItemFromOutfit(index)}
                          variant="ghost"
                          size="sm"
                          className="flex-shrink-0"
                        >
                          <X className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4 border rounded-lg bg-gray-50">
                    No items added yet. Select products below to add them.
                  </p>
                )}
              </div>

              {/* Add Products - USES REAL-TIME PRODUCTS */}
              <div className="space-y-3">
                <Label>Add Products to Outfit</Label>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <ScrollArea className="h-64">
                    <div className="space-y-2 pr-4">
                      {products.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Loading products from Firebase...</p>
                      ) : (
                        products.map((product) => {
                          const isAlreadyAdded = editingItems.some(
                            item => item.name === product.name && item.image === product.image
                          );
                          return (
                            <div
                              key={product.id}
                              className={`flex items-center gap-3 p-2 rounded border bg-white ${
                                isAlreadyAdded ? 'opacity-50' : 'hover:bg-gray-50 cursor-pointer'
                              }`}
                              onClick={() => !isAlreadyAdded && handleAddItemToOutfit(product.id)}
                            >
                              <div className="w-12 h-12 rounded overflow-hidden bg-stone-50 flex-shrink-0">
                                <ImageWithFallback
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm truncate">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.category}</p>
                              </div>
                              <p className="text-sm flex-shrink-0">${product.price.toFixed(2)}</p>
                              {isAlreadyAdded && (
                                <span className="text-xs text-gray-500 flex-shrink-0">Added</span>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={handleUpdate} className="flex-1 bg-gray-900 text-white hover:bg-gray-800">
              Update Outfit
            </Button>
            <Button onClick={() => {
              setIsEditDialogOpen(false);
              setEditingItems([]);
            }} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{viewingOutfit?.name}</DialogTitle>
            <DialogDescription>{viewingOutfit?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50">
              <ImageWithFallback
                src={viewingOutfit?.image || ''}
                alt={viewingOutfit?.name || ''}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div>
              <h4 className="mb-3">Outfit Items ({viewingOutfit?.items.length || 0})</h4>
              <div className="space-y-2">
                {viewingOutfit?.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 rounded overflow-hidden bg-stone-50">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </div>
                    <p className="text-sm">${item.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}