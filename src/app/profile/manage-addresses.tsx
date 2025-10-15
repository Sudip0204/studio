'use client';

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Home, Trash2, Edit } from 'lucide-react';
import { AddressForm, addressSchema } from './address-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';

export function ManageAddresses({ userId }: { userId: string }) {
  const firestore = useFirestore();
  const addressesRef = useMemoFirebase(() => collection(firestore, 'users', userId, 'addresses'), [firestore, userId]);
  const { data: addresses, isLoading } = useCollection(addressesRef);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any | null>(null);
  const { toast } = useToast();

  const handleAddNew = () => {
    setEditingAddress(null);
    setIsFormOpen(true);
  };

  const handleEdit = (address: any) => {
    setEditingAddress(address);
    setIsFormOpen(true);
  }

  const handleDelete = (addressId: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
        const addressDocRef = doc(firestore, 'users', userId, 'addresses', addressId);
        deleteDocumentNonBlocking(addressDocRef);
        toast({ title: "Address Deleted" });
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Manage Addresses</h3>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={handleAddNew}><Plus className="mr-2 h-4 w-4" /> Add a new address</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{editingAddress ? 'Edit Address' : 'Add a new Address'}</DialogTitle>
                </DialogHeader>
                <AddressForm userId={userId} existingAddress={editingAddress} onFinished={() => setIsFormOpen(false)} />
            </DialogContent>
        </Dialog>
      </div>
      
      {isLoading && <p>Loading addresses...</p>}

      {!isLoading && addresses && addresses.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card key={address.id}>
              <CardContent className="p-4">
                 <div className="flex justify-between items-start">
                    <div>
                        <p className="font-semibold flex items-center gap-2"><Home className="h-4 w-4" /> {address.name}</p>
                        <p className="text-sm text-muted-foreground mt-2">{address.addressLine}, {address.city}</p>
                        <p className="text-sm text-muted-foreground">{address.state} - {address.pincode}</p>
                        <p className="text-sm text-muted-foreground mt-2">Mobile: {address.phoneNumber}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(address)}><Edit className="h-4 w-4"/></Button>
                        <Button variant="destructive" size="icon" onClick={() => handleDelete(address.id)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !isLoading && <p className="text-muted-foreground text-center py-8">No saved addresses. Add one to get started!</p>
      )}
    </div>
  );
}
