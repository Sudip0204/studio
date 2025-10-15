
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Trash2, Heart, Plus, Minus, Info, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function CartItem({ item, updateQuantity, removeFromCart }: any) {
  return (
    <div className="flex gap-4 py-4">
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-sm text-muted-foreground">Seller: {item.seller}</p>
        <p className="text-lg font-semibold mt-2">₹{item.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-4">
          <div className="flex items-center border rounded-md">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center text-sm">{item.quantity}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" className="text-muted-foreground hover:text-primary">
            <Heart className="mr-2 h-4 w-4" /> SAVE FOR LATER
          </Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={() => removeFromCart(item.id)}>
            <Trash2 className="mr-2 h-4 w-4" /> REMOVE
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/marketplace/cart');
    }
  }, [user, isUserLoading, router]);

  const priceDetails = useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = Math.floor(subtotal * 0.1); // 10% discount for demo
    const platformFee = totalItems > 0 ? 109 : 0;
    const total = subtotal - discount + platformFee;
    return { subtotal, discount, platformFee, total, totalItems };
  }, [cart]);

  if (isUserLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto max-w-5xl py-12 text-center">
        <h1 className="text-2xl font-bold">Your Cart is Empty</h1>
        <p className="text-muted-foreground mt-2">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild className="mt-6">
          <Link href="/marketplace">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="bg-muted/40">
        <div className="container mx-auto max-w-7xl py-12 px-4">
            <h1 className="text-3xl font-headline font-bold mb-8">Your Shopping Cart</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Items ({priceDetails.totalItems})</CardTitle>
                    </CardHeader>
                    <CardContent className="divide-y">
                        {cart.map(item => (
                            <CartItem key={item.id} item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
                        ))}
                    </CardContent>
                </Card>

                <div className="lg:col-span-1 space-y-6 sticky top-24">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-muted-foreground">
                                <Info className="mr-2" /> Price Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between">
                                <span>Price ({priceDetails.totalItems} items)</span>
                                <span>₹{priceDetails.subtotal.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Discount</span>
                                <span className="text-primary">- ₹{priceDetails.discount.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between">
                                <span>Platform Fee</span>
                                <span>₹{priceDetails.platformFee.toLocaleString()}</span>
                            </div>
                            <Separator />
                            <div className="flex justify-between font-bold text-lg">
                                <span>Total Amount</span>
                                <span>₹{priceDetails.total.toLocaleString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col gap-4">
                             <p className="text-sm font-semibold text-primary">You will save ₹{priceDetails.discount.toLocaleString()} on this order</p>
                            <Button className="w-full" size="lg">Place Order</Button>
                        </CardFooter>
                    </Card>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                        <ShieldCheck className="h-5 w-5 text-gray-400" />
                        <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
