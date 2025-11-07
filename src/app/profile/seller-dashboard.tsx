'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { User } from 'firebase/auth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Edit, Trash2, PackageOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { EditProductForm } from './edit-product-form';

type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    sellerId: string;
    seller: string;
    dataAiHint: string;
    category: string;
    condition: string;
    location: string;
};

interface EditProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onFinished: () => void;
}

function EditProductDialog({ product, open, onOpenChange, onFinished }: EditProductDialogProps) {
    if (!product) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                </DialogHeader>
                <EditProductForm
                    product={product}
                    onFinished={onFinished}
                />
            </DialogContent>
        </Dialog>
    );
}

export function SellerDashboard({ user }: { user: User }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const fetchUserProducts = () => {
    try {
      const allProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
      const userProducts = allProducts.filter((p: Product) => p.sellerId === user.uid);
      setProducts(userProducts);
    } catch (error) {
      console.error("Failed to load products from localStorage", error);
    }
  };

  useEffect(() => {
    fetchUserProducts();
  }, [user.uid]);

  const handleDelete = (productId: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const allProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
        const updatedProducts = allProducts.filter((p: Product) => p.id !== productId);
        localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
        fetchUserProducts(); // Refresh the list
        toast({ title: "Product Deleted", description: "The item has been removed from the marketplace." });
      } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Failed to delete product." });
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };
  
  const handleFormFinished = () => {
      setIsFormOpen(false);
      setEditingProduct(null);
      fetchUserProducts(); // Refresh products after edit
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
            <h3 className="text-xl font-bold font-headline">My Listings</h3>
            <p className="text-muted-foreground">Manage your items for sale.</p>
        </div>
      </div>
      
      <EditProductDialog
        product={editingProduct}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onFinished={handleFormFinished}
      />

      {products.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardContent className="p-4 flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                  <Image src={product.image} alt={product.name} fill className="object-cover" />
                </div>
                <div className="flex-grow">
                  <p className="font-semibold">{product.name}</p>
                  <p className="text-sm text-primary font-bold">₹{product.price}</p>
                  <p className="text-xs text-muted-foreground">{product.category} - {product.condition}</p>
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(product)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
              <PackageOpen className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold">No Listings Yet</h3>
          <p className="text-muted-foreground mt-2">You haven't listed any items for sale.</p>
        </div>
      )}
    </div>
  );
}
