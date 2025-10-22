import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2, Eye, X, Loader2 } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';

// 1. Import Firebase Realtime Database utilities
import { db } from '../firebaseConfig'; // Import the initialized database instance
import { ref, onValue, set, push, remove, off } from 'firebase/database';

interface OutfitItem {
  name: string;
  category: string;
  price: number;
  image: string;
  affiliateLink: string;
}

// RE-ADDED INTERFACE for the products fetched from Firebase
interface Product {
  id: number; // Assuming product IDs are numeric
  name: string;
  category: string;
  price: number;
  image: string;
  affiliateLink: string;
}

// 2. Add id to be a string to match Firebase push key
interface Outfit {
  id: string; // Changed from number to string for Firebase key
  name: string;
  description: string;
  image: string;
  totalPrice: number;
  items: OutfitItem[];
}


export function OutfitManagement() {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // RE-ADDED STATE for products
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Effect to fetch OUTFIT data from Firebase on component mount
  useEffect(() => {
    const outfitsRef = ref(db, 'outfits');
    
    // Set up a listener for real-time updates
    const unsubscribe = onValue(outfitsRef, (snapshot) => {
      setLoading(false);
      const data = snapshot.val();
      const loadedOutfits: Outfit[] = [];

      if (data) {
        // Convert the Firebase object into an array
        Object.keys(data).forEach(key => {
          loadedOutfits.push({
            id: key, // Use the key as the outfit ID
            ...data[key]
          });
        });
      }
      setOutfits(loadedOutfits);
    }, (err) => {
      console.error("Firebase outfit read error:", err);
      setError("Failed to load outfits. Please check your Firebase connection and rules.");
      setLoading(false);
    });

    // Clean up the listener when the component unmounts
    return () => off(outfitsRef, 'value', unsubscribe);
  }, []); 

  // RE-ADDED EFFECT to fetch ALL PRODUCTS data from Firebase on component mount
  useEffect(() => {
    const productsRef = ref(db, 'products'); // ASSUME your product list is stored under the 'products' path
    
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      const loadedProducts: Product[] = [];

      if (data) {
        // Convert the Firebase object (keys are product IDs/keys) into a typed array
        Object.keys(data).forEach(key => {
          loadedProducts.push({
            // The product data is expected to have an 'id' field
            ...data[key],
          } as Product); 
        });
      }
      setAllProducts(loadedProducts);
    }, (err) => {
      console.error("Firebase products read error:", err);
    });

    // Clean up the listener when the component unmounts
    return () => off(productsRef, 'value', unsubscribe);
  }, []); // Run once on mount to get the product list

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
    });
    setAddingItems([]);
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.image) return; 
    
    const totalPrice = addingItems.reduce((sum, item) => sum + item.price, 0);
    
    const newOutfitData = {
      name: formData.name,
      description: formData.description,
      image: formData.image,
      totalPrice,
      items: addingItems,
    };

    try {
      const outfitsRef = ref(db, 'outfits');
      // Use push() to generate a unique ID and save the data
      await push(outfitsRef, newOutfitData);
      setIsAddDialogOpen(false);
      resetForm();
    } catch (e) {
      console.error("Error adding document: ", e);
      alert("Failed to add outfit.");
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

  const handleUpdate = async () => {
    if (!editingOutfit || !formData.name || !formData.image) return;

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
      // Use set() to overwrite the existing data for that key
      await set(outfitRef, updatedOutfitData);
      
      setIsEditDialogOpen(false);
      setEditingOutfit(null);
      setEditingItems([]);
      resetForm();
    } catch (e) {
      console.error("Error updating document: ", e);
      alert("Failed to update outfit.");
    }
  };

  // Function now correctly uses the allProducts state (sourced from Firebase)
  const handleAddItemToOutfit = (productId: number) => {
    const product = allProducts.find(p => p.id === productId); 
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

  // Function now correctly uses the allProducts state (sourced from Firebase)
  const handleAddItemToNewOutfit = (productId: number) => {
    const product = allProducts.find(p => p.id === productId);
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

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this outfit?')) {
      try {
        const outfitRef = ref(db, `outfits/${id}`);
        await remove(outfitRef); 
      } catch (e) {
        console.error("Error removing document: ", e);
        alert("Failed to delete outfit.");
      }
    }
  };

  const handleView = (outfit: Outfit) => {
    setViewingOutfit(outfit);
    setIsViewDialogOpen(true);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Outfit Management</CardTitle>
          <CardDescription>Manage curated outfit collections</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <p>Loading outfits...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Outfit Management</CardTitle>
          <CardDescription>Manage curated outfit collections</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40 text-red-600">
          <p>{error}</p>
        </CardContent>
      </Card>
    );
  }

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
              <Button className="bg-gray-900 text-white hover:bg-gray-800">
                <Plus className="h-4 w-4 mr-2" />
                Add Outfit
              </Button>
            </DialogTrigger>
            {/* MODIFIED: Changed max-w-6xl to w-[70%] max-w-none */}
            <DialogContent className="w-[70%] max-w-none max-h-[90vh]"> 
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
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  {/* Selected Items */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Selected Items ({addingItems.length})</Label>
                      <span className="text-sm text-gray-500">
                        Total: ${addingItems.reduce((sum, item) => sum + item.price, 0)}
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
                            <p className="text-sm flex-shrink-0">${item.price}</p>
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

                  {/* Add Products */}
                  <div className="space-y-3">
                    <Label>Add Products to Outfit</Label>
                    <div className="border rounded-lg p-3 bg-gray-50">
                      <ScrollArea className="h-64">
                        <div className="space-y-2 pr-4">
                          {/* This now iterates over the Firebase-fetched allProducts state */}
                          {allProducts.map((product) => {
                            const isAlreadyAdded = addingItems.some(
                              item => item.name === product.name && item.image === product.image
                            );
                            return (
                              <div
                                key={product.id}
                                className={`flex items-center gap-3 p-2 rounded border bg-white ${
                                  isAlreadyAdded ? 'opacity-50' : ''
                                }`}
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
                                <p className="text-sm flex-shrink-0">${product.price}</p>
                                {isAlreadyAdded ? (
                                  <span className="text-xs text-gray-500 flex-shrink-0">Added</span>
                                ) : (
                                  <Button
                                    onClick={() => handleAddItemToNewOutfit(product.id)}
                                    variant="outline"
                                    size="sm"
                                    className="flex-shrink-0"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="flex gap-2 pt-4 border-t">
                <Button onClick={handleAdd} className="flex-1 bg-gray-900 text-white hover:bg-gray-800">
                  Add Outfit
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
              {outfits.map((outfit) => (
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
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        {/* MODIFIED: Changed max-w-4xl to w-[70%] max-w-none */}
        <DialogContent className="w-[70%] max-w-none max-h-[90vh]">
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
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-outfit-description">Description</Label>
                <Textarea
                  id="edit-outfit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-outfit-image">Main Image URL</Label>
                <Input
                  id="edit-outfit-image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                />
              </div>

              {/* Current Items */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Current Items ({editingItems.length})</Label>
                  <span className="text-sm text-gray-500">
                    Total: ${editingItems.reduce((sum, item) => sum + item.price, 0)}
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
                        <p className="text-sm flex-shrink-0">${item.price}</p>
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

              {/* Add Products */}
              <div className="space-y-3">
                <Label>Add Products to Outfit</Label>
                <div className="border rounded-lg p-3 bg-gray-50">
                  <ScrollArea className="h-64">
                    <div className="space-y-2 pr-4">
                      {/* This now iterates over the Firebase-fetched allProducts state */}
                      {allProducts.map((product) => {
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
                            <p className="text-sm flex-shrink-0">${product.price}</p>
                            {isAlreadyAdded && (
                              <span className="text-xs text-gray-500 flex-shrink-0">Added</span>
                            )}
                          </div>
                        );
                      })}
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
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{viewingOutfit?.name}</DialogTitle>
            <DialogDescription>{viewingOutfit?.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left side - Main outfit image */}
              <div className="space-y-3">
                <div className="aspect-[3/4] rounded-lg overflow-hidden bg-stone-50">
                  <ImageWithFallback
                    src={viewingOutfit?.image || ''}
                    alt={viewingOutfit?.name || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Items:</span>
                    <span>{viewingOutfit?.items.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600">Total Price:</span>
                    <span>${viewingOutfit?.totalPrice || 0}</span>
                  </div>
                </div>
              </div>
              
              {/* Right side - Outfit items */}
              <div>
                <h4 className="mb-4">Outfit Items</h4>
                <div className="space-y-3">
                  {viewingOutfit?.items && viewingOutfit.items.length > 0 ? (
                    viewingOutfit.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:shadow-sm transition-shadow">
                        <div className="w-16 h-16 rounded overflow-hidden bg-stone-50 flex-shrink-0">
                          <ImageWithFallback
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.category}</p>
                          <a 
                            href={item.affiliateLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline"
                          >
                            View Link
                          </a>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p>${item.price}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">No items in this outfit</p>
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