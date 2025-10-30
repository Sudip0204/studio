
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

const categories = ["Electronics", "Furniture", "Clothing", "Books", "Home Decor", "Kitchenware", "Accessories", "Personal Care"];
const conditions = ["New", "Good", "Fair", "Used"];

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters long.'),
  description: z.string().min(10, 'Description must be at least 10 characters long.'),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('Price must be a positive number.')
  ),
  category: z.string({ required_error: "Please select a category." }),
  condition: z.string({ required_error: "Please select a condition." }),
  location: z.string().min(2, 'Location must be at least 2 characters long.'),
});

type ProductFormValues = z.infer<typeof productSchema>;

type Product = {
    id: number;
    name: string;
    price: number;
    description: string;
    image: string;
    seller: string;
    dataAiHint: string;
    category: string;
    condition: string;
    location: string;
};

interface EditProductFormProps {
    product: Product;
    onFinished: () => void;
}

export function EditProductForm({ product, onFinished }: EditProductFormProps) {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            condition: product.condition,
            location: product.location
        }
    });

    const onSubmit = (values: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            const allProducts = JSON.parse(localStorage.getItem('userProducts') || '[]');
            const updatedProducts = allProducts.map((p: Product) => {
                if (p.id === product.id) {
                    return { ...p, ...values };
                }
                return p;
            });
            localStorage.setItem('userProducts', JSON.stringify(updatedProducts));
            toast({ title: 'Product Updated!' });
            onFinished();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Could not save the product. Please try again.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Product Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl><Textarea rows={4} {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price (in ₹)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Location</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                 <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Condition</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                    {conditions.map(con => <SelectItem key={con} value={con}>{con}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex justify-end pt-4 gap-4">
                    <Button type="button" variant="outline" onClick={onFinished}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    );
}
