
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { format } from 'date-fns';
import { ShoppingBag, Package, Loader2, CreditCard, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase';

const statusColors = {
  Placed: 'bg-blue-500',
  Shipped: 'bg-yellow-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

const cancellationReasons = [
    "Ordered by mistake",
    "Found a better price elsewhere",
    "Item is no longer needed",
    "Delivery is taking too long",
    "Other",
];

function CancelOrderDialog({ orderId, userId, onCancelSuccess }: { orderId: string, userId: string, onCancelSuccess: () => void }) {
    const firestore = useFirestore();
    const { toast } = useToast();
    const [reason, setReason] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCancelOrder = () => {
        if (!reason) {
            toast({ variant: 'destructive', title: 'Please select a reason' });
            return;
        }

        setIsSubmitting(true);
        const orderRef = doc(firestore, 'users', userId, 'orders', orderId);
        updateDocumentNonBlocking(orderRef, {
            status: 'Cancelled',
            cancellationReason: reason,
        });

        setTimeout(() => {
            toast({ title: "Order Cancelled", description: "Your order has been successfully cancelled." });
            setIsSubmitting(false);
            setIsOpen(false);
            onCancelSuccess();
        }, 1000); // Simulate network latency
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cancel Order</DialogTitle>
                    <DialogDescription>
                        Please let us know why you are cancelling this order. This helps us improve our service.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <RadioGroup value={reason} onValueChange={setReason}>
                        <div className="space-y-2">
                            {cancellationReasons.map((r) => (
                                <div key={r} className="flex items-center space-x-2">
                                    <RadioGroupItem value={r} id={`profile-${r}`} />
                                    <Label htmlFor={`profile-${r}`}>{r}</Label>
                                </div>
                            ))}
                        </div>
                    </RadioGroup>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Back</Button>
                    <Button variant="destructive" onClick={handleCancelOrder} disabled={!reason || isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Cancellation
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function MyOrders({ userId }: { userId: string }) {
  const firestore = useFirestore();
  const [version, setVersion] = useState(0);
  const forceReRender = () => setVersion(v => v + 1);
  
  const ordersRef = useMemoFirebase(() => collection(firestore, 'users', userId, 'orders'), [firestore, userId, version]);
  const ordersQuery = useMemoFirebase(() => query(ordersRef, orderBy('createdAt', 'desc')), [ordersRef]);
  const { data: orders, isLoading } = useCollection(ordersQuery);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold font-headline">My Orders</h3>
          <p className="text-muted-foreground">View your order history and track their status.</p>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}

      {!isLoading && orders && orders.length > 0 ? (
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full">
            {orders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <AccordionItem value={order.id} className="border-b-0">
                  <AccordionTrigger className="p-4 hover:no-underline hover:bg-muted/50">
                    <div className="flex justify-between w-full items-center">
                      <div className="text-left">
                        <p className="font-semibold">Order #{order.id.slice(0, 7).toUpperCase()}</p>
                        <p className="text-sm text-muted-foreground">
                          Placed on {format(order.createdAt.toDate(), 'dd MMM yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                          <p className="font-bold text-lg hidden sm:block">₹{order.totalAmount.toLocaleString()}</p>
                          <Badge className={cn("text-white", statusColors[order.status as keyof typeof statusColors])}>
                              {order.status}
                          </Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-muted/50 border-t">
                      <h4 className="font-semibold mb-4">Items in this order:</h4>
                      <div className="space-y-4">
                          {order.items.map((item: any) => (
                              <div key={item.id} className="flex gap-4 items-center">
                                  <div className="relative h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                                  </div>
                                  <div className="flex-grow">
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                  </div>
                                  <p className="font-semibold">₹{(item.price * item.quantity).toLocaleString()}</p>
                              </div>
                          ))}
                      </div>
                       <Separator className="my-4"/>
                       <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <h4 className="font-semibold mb-2">Total Amount</h4>
                                <p className="font-bold text-lg">₹{order.totalAmount.toLocaleString()}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2">Shipping Address</h4>
                                <p className="text-sm text-muted-foreground">{order.shippingAddress.name}, {order.shippingAddress.addressLine}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                            </div>
                            <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2"><CreditCard className="h-5 w-5"/> Payment Method</h4>
                                <p className="text-sm text-muted-foreground">{order.paymentMethod}</p>
                            </div>
                       </div>
                       {order.status === 'Placed' && (
                         <CardFooter className="px-0 pt-6 justify-end">
                             <CancelOrderDialog orderId={order.id} userId={userId} onCancelSuccess={forceReRender} />
                         </CardFooter>
                       )}
                        {order.status === 'Cancelled' && order.cancellationReason && (
                         <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                           <p className="text-sm text-red-800"><span className="font-semibold">Reason for cancellation:</span> {order.cancellationReason}</p>
                         </div>
                       )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            ))}
          </Accordion>
        </div>
      ) : (
        !isLoading && (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
              <Package className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold">No Orders Yet</h3>
            <p className="text-muted-foreground mt-2">You haven't placed any orders in the marketplace.</p>
          </div>
        )
      )}
    </div>
  );
}
