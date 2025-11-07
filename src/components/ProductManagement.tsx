// src/components/ProductManagement.tsx
'use client';

import { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { Product } from '@/lib/products';
import { v4 as uuidv4 } from 'uuid';
import { useDatabase } from '@/firebase';
import { ref, set, push, remove } from 'firebase/database';

// Define the shape of the form data (price is a string for input fields)
type ProductFormData = Omit<Product, 'id' | 'price'> & { price: string };

// Define categories array
const categories = ['Top', 'Bottom', 'Accessories', 'Footwear', 'Outerwear'];

interface ProductManagementProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>; 
}

// Initial form state - all optional string fields initialized to empty string
const initialFormData: ProductFormData = {
  name: '',
  price: '0.00',
  image: '',
  imageHint: '', // Must be explicitly set to '' not undefined
  category: categories[0] || '',
  description: '',
  affiliateLink: '',
};

export function ProductManagement({ products, setProducts }: ProductManagementProps) {
  const db = useDatabase();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>(initialFormData); 

  const resetForm = () => {
    setFormData(initialFormData);
  };

  const filteredProducts = useMemo(() => {
    if (filterCategory === 'all') {
      return products;
    }
    return products.filter(p => p.category === filterCategory);
  }, [products, filterCategory]);

  const handleAdd = () => {
    if (!db) return;
    
    // 🚀 FIREBASE REALTIME DATABASE ADD LOGIC 🚀
    const newProductData = {
      name: formData.name,
      // Convert the string price from the form to a floating-point number
      price: parseFloat(formData.price) || 0,
      image: formData.image,
      imageHint: formData.imageHint || '',
      category: formData.category,
      description: formData.description,
      affiliateLink: formData.affiliateLink,
    };
    
    // 1. Get a reference to the 'products' node.
    // 2. Use push() to generate a unique key for the new product.
    const newProductRef = push(ref(db, 'products'));
    
    // 3. Use set() to write the new product data to that unique key.
    set(newProductRef, newProductData);
    
    // 4. Update UI state
    setIsAddDialogOpen(false);
    resetForm();
    // -------------------------------------------
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toFixed(2),
      image: product.image,
      imageHint: product.imageHint || '', // Ensure it's handled on edit load
      category: product.category,
      description: product.description,
      affiliateLink: product.affiliateLink,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdate = () => {
    if (!editingProduct || !db) return;

    const updatedProductData = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        image: formData.image || '',
        imageHint: formData.imageHint || '',
        category: formData.category,
        description: formData.description || '',
        affiliateLink: formData.affiliateLink || '',
    };
    
    const productRef = ref(db, `products/${editingProduct.id}`);
    set(productRef, updatedProductData);

    setIsEditDialogOpen(false); 
    setEditingProduct(null);
    resetForm();
  };

  const handleDelete = () => {
    if (productToDelete && db) {
      const productRef = ref(db, `products/${productToDelete.id}`);
      remove(productRef);
      setProductToDelete(null);
    }
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Product Management</CardTitle>
            <CardDescription>Add, edit, or remove products from your catalog</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
            // Reset form on close
            if (!isOpen) resetForm();
            setIsAddDialogOpen(isOpen);
          }}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>Enter the product details below</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Classic Linen Shirt"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="85.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="A timeless linen shirt..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://picsum.photos/seed/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="affiliateLink">Affiliate Link</Label>
                  <Input
                    id="affiliateLink"
                    value={formData.affiliateLink}
                    onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
                    placeholder="https://amazon.com/..."
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                <Button onClick={handleAdd} className="flex-1">
                  Add Product
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
        <div className="mb-4">
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] hidden sm:table-cell">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="hidden sm:table-cell">Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="hidden sm:table-cell">
                      <div className="w-12 h-16 relative rounded overflow-hidden bg-muted">
                        {product.image && (product.image.startsWith('http') || product.image.startsWith('/')) ? (
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-gray-500 text-xs">
                            No Image
                          </div>
                        )}

                      </div>
                    </TableCell>
                    <TableCell className="font-medium max-w-[150px] whitespace-normal">{product.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{product.category}</TableCell>
                    <TableCell className="hidden sm:table-cell">${product.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1 sm:gap-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => setProductToDelete(product)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                product.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={() => setProductToDelete(null)}>Cancel</AlertDialogCancel>
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

      {/* Edit Dialog (Handles edit form submission and updates) */}
      <Dialog open={isEditDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
          setEditingProduct(null);
          resetForm();
        }
        setIsEditDialogOpen(isOpen);
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product: {editingProduct?.name}</DialogTitle>
            <DialogDescription>Update the product details below</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Product Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-price">Price ($)</Label>
              <Input
                id="edit-price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Image URL</Label>
              <Input
                id="edit-image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
            </div>
            
             <div className="space-y-2">
              <Label htmlFor="edit-imageHint">Image Hint</Label>
              <Input
                id="edit-imageHint"
                value={formData.imageHint}
                onChange={(e) => setFormData({ ...formData, imageHint: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-affiliateLink">Affiliate Link</Label>
              <Input
                id="edit-affiliateLink"
                value={formData.affiliateLink}
                onChange={(e) => setFormData({ ...formData, affiliateLink: e.target.value })}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
            <Button onClick={handleUpdate} className="flex-1">
              Update Product
            </Button>
            <Button onClick={() => setIsEditDialogOpen(false)} variant="outline" className="flex-1">
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
} 