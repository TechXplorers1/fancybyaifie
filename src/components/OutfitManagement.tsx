import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2, Eye, X } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { allProducts } from '../data/allProducts';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';

interface OutfitItem {
  name: string;
  category: string;
  price: number;
  image: string;
  affiliateLink: string;
}

interface Outfit {
  id: number;
  name: string;
  description: string;
  image: string;
  totalPrice: number;
  items: OutfitItem[];
}

const initialOutfits: Outfit[] = [
  {
    id: 1,
    name: "Casual Elegance",
    description: "Perfect blend of comfort and style for everyday wear",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    totalPrice: 425,
    items: [
      {
        name: "Knit Sweater",
        category: "Top",
        price: 89,
        image: "https://images.unsplash.com/photo-1504198458649-3128b932f49e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        affiliateLink: "https://amazon.com"
      },
      {
        name: "Relaxed Jeans",
        category: "Bottom",
        price: 125,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
        affiliateLink: "https://amazon.com"
      }
    ]
  }
];

export function OutfitManagement() {
  const [outfits, setOutfits] = useState<Outfit[]>(initialOutfits);
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

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      image: '',
    });
    setAddingItems([]);
  };

  const handleAdd = () => {
    const totalPrice = addingItems.reduce((sum, item) => sum + item.price, 0);
    
    const newOutfit: Outfit = {
      id: Math.max(...outfits.map(o => o.id), 0) + 1,
      name: formData.name,
      description: formData.description,
      image: formData.image,
      totalPrice,
      items: addingItems,
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
    });
    setEditingItems([...outfit.items]);
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingOutfit) return;

    const totalPrice = editingItems.reduce((sum, item) => sum + item.price, 0);

    const updatedOutfits = outfits.map(o =>
      o.id === editingOutfit.id
        ? {
            ...o,
            name: formData.name,
            description: formData.description,
            image: formData.image,
            items: editingItems,
            totalPrice,
          }
        : o
    );

    setOutfits(updatedOutfits);
    setIsEditDialogOpen(false);
    setEditingOutfit(null);
    setEditingItems([]);
    resetForm();
  };

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

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this outfit?')) {
      setOutfits(outfits.filter(o => o.id !== id));
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
              <Button className="bg-gray-900 text-white hover:bg-gray-800">
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
                    <p className="text-sm">${item.price}</p>
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
