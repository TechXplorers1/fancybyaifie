'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2, Eye, X } from 'lucide-react';
import Image from 'next/image';
import { ScrollArea } from './ui/scroll-area';
import { Product } from '@/lib/products';
import { Outfit } from '@/lib/outfits';

// Removed FALLBACK_IMAGE_PATH since we are conditionally rendering

interface OutfitManagementProps {
  outfits: Outfit[];
  setOutfits: React.Dispatch<React.SetStateAction<Outfit[]>>;
  allProducts: Product[];
}

export function OutfitManagement({ outfits, setOutfits, allProducts }: OutfitManagementProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [editingOutfit, setEditingOutfit] = useState<Outfit | null>(null);
  const [viewingOutfit, setViewingOutfit] = useState<Outfit | null>(null);
  const [outfitToDelete, setOutfitToDelete] = useState<Outfit | null>(null);

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
  };

  const handleAdd = () => {
    const newOutfit: Outfit = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      image: formData.image,
      items: formData.items,
    };
    setOutfits([...outfits, newOutfit]);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleEdit = (outfit: Outfit) => {
    setEditingOutfit(outfit);
    setFormData({
      name: outfit.name,
      description: outfit.description,
      image: outfit.image,
      items: [...outfit.items],
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingOutfit) return;
    const updatedOutfits = outfits.map(o =>
      o.id === editingOutfit.id
        ? {
          ...o,
          name: formData.name,
          description: formData.description,
          image: formData.image,
          items: formData.items,
        }
        : o
    );
    setOutfits(updatedOutfits);
    setIsEditDialogOpen(false);
    setEditingOutfit(null);
    resetForm();
  };

  const handleDelete = () => {
    if (outfitToDelete) {
      setOutfits(outfits.filter(o => o.id !== outfitToDelete.id));
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

  const getTotalPrice = (items: Product[]) => {
    return items.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Outfit Management</CardTitle>
            <CardDescription>Manage curated outfit collections</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
            if (!isOpen) resetForm();
            setIsAddDialogOpen(isOpen);
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Outfit
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-7xl max-h-[90vh]">
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
                      placeholder="https://picsum.photos/seed/..."
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Selected Items ({formData.items.length})</Label>
                      <span className="text-sm text-muted-foreground">
                        Total: ${getTotalPrice(formData.items)}
                      </span>
                    </div>
                    {formData.items.length > 0 ? (
                      <div className="space-y-2 border rounded-lg p-3 bg-muted/50">
                        {formData.items.map((item, index) => (
                          <div key={index} className="flex items-center gap-3 p-2 bg-background rounded border">
                            <div className="w-12 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                              {/* FIX 1: Conditional render the Image component */}
                              {item.image && (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              )}
                              {!item.image && <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70">No Img</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{item.name}</p>
                              <p className="text-xs text-muted-foreground">{item.category}</p>
                            </div>
                            <p className="text-sm flex-shrink-0">${item.price.toFixed(2)}</p>
                            <Button
                              onClick={() => handleToggleProductInOutfit(item, 'remove')}
                              variant="ghost"
                              size="icon"
                              className="flex-shrink-0 h-8 w-8"
                            >
                              <X className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg bg-muted/50">
                        No items added yet. Select products below.
                      </p>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label>Add Products to Outfit</Label>
                    <div className="border rounded-lg p-3 bg-muted/50">
                      <ScrollArea className="h-64">
                        <div className="space-y-2 pr-4">
                          {allProducts.map((product) => {
                            const isAdded = formData.items.some(item => item.id === product.id);
                            return (
                              <div
                                key={product.id}
                                className={`flex items-center gap-3 p-2 rounded border bg-background cursor-pointer hover:bg-muted/80 ${isAdded ? 'opacity-50 pointer-events-none' : ''
                                  }`}
                                onClick={() => !isAdded && handleToggleProductInOutfit(product, 'add')}
                              >
                                <div className="w-12 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                                  {/* FIX 2: Conditional render the Image component */}
                                  {product.image && (
                                    <Image
                                      src={product.image}
                                      alt={product.name}
                                      fill
                                      sizes="48px"
                                      className="object-cover"
                                    />
                                  )}
                                  {!product.image && <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70">No Img</div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{product.name}</p>
                                  <p className="text-xs text-muted-foreground">{product.category}</p>
                                </div>
                                <p className="text-sm flex-shrink-0">${product.price.toFixed(2)}</p>
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
                <Button onClick={handleAdd} className="flex-1">
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
                <TableHead>Items</TableHead>
                <TableHead>Total Price</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {outfits.map((outfit) => (
                <TableRow key={outfit.id}>
                  <TableCell>
                    <div className="w-12 h-16 relative rounded overflow-hidden bg-muted">
                      {/* FIX 3 (Line 298 in error): Conditional render the Image component */}
                      {outfit.image ? (
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
                  <TableCell className="font-medium">{outfit.name}</TableCell>
                  <TableCell>{outfit.items.length} items</TableCell>
                  <TableCell>${getTotalPrice(outfit.items)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
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
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        setIsEditDialogOpen(isOpen);
      }}>
        <DialogContent className="sm:max-w-7xl max-h-[90vh]">
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

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Selected Items ({formData.items.length})</Label>
                  <span className="text-sm text-muted-foreground">
                    Total: ${getTotalPrice(formData.items)}
                  </span>
                </div>
                {formData.items.length > 0 ? (
                  <div className="space-y-2 border rounded-lg p-3 bg-muted/50">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 bg-background rounded border">
                        <div className="w-12 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                          {/* FIX 4: Conditional render the Image component */}
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                          {!item.image && <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70">No Img</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <p className="text-sm flex-shrink-0">${item.price.toFixed(2)}</p>
                        <Button
                          onClick={() => handleToggleProductInOutfit(item, 'remove')}
                          variant="ghost"
                          size="icon"
                          className="flex-shrink-0 h-8 w-8"
                        >
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg bg-muted/50">
                    No items added yet. Select products below.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <Label>Add Products to Outfit</Label>
                <div className="border rounded-lg p-3 bg-muted/50">
                  <ScrollArea className="h-64">
                    <div className="space-y-2 pr-4">
                      {allProducts.map((product) => {
                        const isAdded = formData.items.some(item => item.id === product.id);
                        return (
                          <div
                            key={product.id}
                            className={`flex items-center gap-3 p-2 rounded border bg-background cursor-pointer hover:bg-muted/80 ${isAdded ? 'opacity-50 pointer-events-none' : ''
                              }`}
                            onClick={() => !isAdded && handleToggleProductInOutfit(product, 'add')}
                          >
                            <div className="w-12 h-16 relative rounded overflow-hidden bg-muted flex-shrink-0">
                              {/* FIX 5: Conditional render the Image component */}
                              {product.image && (
                                <Image
                                  src={product.image}
                                  alt={product.name}
                                  fill
                                  sizes="48px"
                                  className="object-cover"
                                />
                              )}
                              {!product.image && <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70">No Img</div>}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{product.category}</p>
                            </div>
                            <p className="text-sm flex-shrink-0">${product.price.toFixed(2)}</p>
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
            <Button onClick={handleUpdate} className="flex-1">
              Update Outfit
            </Button>
            <Button onClick={() => {
              setIsEditDialogOpen(false);
              resetForm();
            }} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{viewingOutfit?.name}</DialogTitle>
            <DialogDescription>{viewingOutfit?.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[70vh] pr-4">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-muted">
                  {/* FIX 6: Conditional render the Image component */}
                  {viewingOutfit?.image ? (
                    <Image
                      src={viewingOutfit.image}
                      alt={viewingOutfit?.name || 'Outfit Image'}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground/70">
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
                <h4 className="mb-4 text-lg font-semibold">Outfit Items ({viewingOutfit?.items.length || 0})</h4>
                <div className="space-y-3">
                  {viewingOutfit?.items && viewingOutfit.items.length > 0 ? (
                    viewingOutfit.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 border rounded-lg bg-background hover:shadow-sm transition-shadow">
                        <div className="w-16 h-20 relative rounded overflow-hidden bg-muted flex-shrink-0">
                          {/* FIX 7: Conditional render the Image component */}
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          )}
                          {!item.image && <div className="flex items-center justify-center h-full text-[8px] text-muted-foreground/70">No Img</div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.category}</p>
                          <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
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