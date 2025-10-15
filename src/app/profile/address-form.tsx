'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useFirestore, setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase';
import { doc, collection }from 'firebase/firestore';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export const addressSchema = z.object({
  name: z.string().min(2, 'Name is required.'),
  phoneNumber: z.string().min(10, 'A valid phone number is required.'),
  pincode: z.string().min(5, 'A valid pincode is required.'),
  addressLine: z.string().min(5, 'Address is required.'),
  city: z.string().min(2, 'City is required.'),
  state: z.string().min(2, 'State is required.'),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressFormProps {
    userId: string;
    existingAddress?: any;
    onFinished: () => void;
}

export function AddressForm({ userId, existingAddress, onFinished }: AddressFormProps) {
    const firestore = useFirestore();
    const { toast } = useToast();
    
    const form = useForm<AddressFormValues>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            name: existingAddress?.name || '',
            phoneNumber: existingAddress?.phoneNumber || '',
            pincode: existingAddress?.pincode || '',
            addressLine: existingAddress?.addressLine || '',
            city: existingAddress?.city || '',
            state: existingAddress?.state || '',
        }
    });

    const { formState: { isSubmitting } } = form;

    const onSubmit = async (values: AddressFormValues) => {
        try {
            if (existingAddress) {
                // Update existing address
                const addressRef = doc(firestore, 'users', userId, 'addresses', existingAddress.id);
                setDocumentNonBlocking(addressRef, values, { merge: true });
                toast({ title: 'Address Updated!' });
            } else {
                // Add new address
                const addressesRef = collection(firestore, 'users', userId, 'addresses');
                addDocumentNonBlocking(addressesRef, values);
                toast({ title: 'Address Added!' });
            }
            onFinished();
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'Something went wrong',
                description: 'Could not save the address. Please try again.'
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl><Input type="tel" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                 <FormField control={form.control} name="addressLine" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl><Input placeholder="Street, house no." {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <div className="grid grid-cols-2 gap-4">
                     <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                     <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                            <FormLabel>State</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                </div>
                <FormField control={form.control} name="pincode" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Pincode</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                         {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Address
                    </Button>
                </div>
            </form>
        </Form>
    );
}
