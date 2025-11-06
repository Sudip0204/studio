
'use client';

import { useFirestore, useCollection, useMemoFirebase, useUser } from '@/firebase';
import { collection, query, orderBy } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Image from 'next/image';
import { format } from 'date-fns';
import { ShoppingBag, Package, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const statusColors = {
  Placed: 'bg-blue-500',
  Shipped: 'bg-yellow-500',
  Delivered: 'bg-green-500',
  Cancelled: 'bg-red-500',
};

export default function MyOrdersPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/my-orders');
    }
  }, [user, isUserLoading, router]);

  const ordersRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'orders') : null, [firestore, user]);
  const ordersQuery = useMemoFirebase(() => ordersRef ? query(ordersRef, orderBy('createdAt', 'desc')) : null, [ordersRef]);
  const { data: orders, isLoading } = useCollection(ordersQuery);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">My Orders</h1>
          <p className="text-muted-foreground">View your order history and track their status.</p>
        </div>
      </div>

      {isLoading && <p>Loading orders...</p>}

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
                       </div>
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
