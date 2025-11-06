
'use client';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { format } from 'date-fns';
import { ShoppingBag, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const statusColors = {
  Placed: 'bg-blue-500',
  Shipped: 'bg-yellow-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

export function MyOrders({ userId }: { userId: string }) {
  const firestore = useFirestore();
  const ordersRef = useMemoFirebase(() => collection(firestore, 'users', userId, 'orders'), [firestore, userId]);
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

      {isLoading && <p>Loading orders...</p>}

      {!isLoading && orders && orders.length > 0 ? (
        <div className="space-y-4">
          <Accordion type="single" collapsible>
            {orders.map((order) => (
              <AccordionItem key={order.id} value={order.id}>
                <AccordionTrigger>
                  <div className="flex justify-between w-full items-center pr-4">
                    <div className="text-left">
                      <p className="font-semibold">Order #{order.id.slice(0, 7).toUpperCase()}</p>
                      <p className="text-sm text-muted-foreground">
                        Placed on {format(order.createdAt.toDate(), 'dd MMM yyyy')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <p className="font-bold text-lg">₹{order.totalAmount.toLocaleString()}</p>
                        <Badge className={cn("text-white", statusColors[order.status as keyof typeof statusColors])}>
                            {order.status}
                        </Badge>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 bg-muted/50 rounded-b-md">
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
                    <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold mb-2">Shipping Address</h4>
                        <p className="text-sm text-muted-foreground">{order.shippingAddress}</p>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
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
