
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { useUser } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, ShoppingBag, Home } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function OrderConfirmationPage() {
  const { cart, clearCart, appliedCoupon } = useCart();
  const { user } = useUser();
  const router = useRouter();

  // Redirect if cart is empty, as this page shouldn't be accessed directly
  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/marketplace');
    }
  }, [cart, router]);

  // Clear the cart once the component has mounted and displayed the order
  useEffect(() => {
    return () => {
      clearCart();
    };
  }, [clearCart]);
  
  const priceDetails = useMemo(() => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let couponDiscount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        couponDiscount = (subtotal * appliedCoupon.discountValue) / 100;
      } else if (appliedCoupon.discountType === 'fixed') {
        couponDiscount = appliedCoupon.discountValue;
      }
    }
    
    const demoDiscount = Math.floor(subtotal * 0.1); 
    const totalDiscount = demoDiscount + couponDiscount;
    const platformFee = cart.length > 0 ? 109 : 0;
    const total = subtotal - totalDiscount + platformFee;
    return { subtotal, totalDiscount, platformFee, total, totalItems: cart.reduce((sum, item) => sum + item.quantity, 0) };
  }, [cart, appliedCoupon]);


  if (cart.length === 0) {
    return null; // Or a loading/redirecting state
  }

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container mx-auto max-w-3xl py-12 px-4">
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-background">
            <div className="mx-auto bg-green-100 rounded-full p-4 w-fit">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="font-headline text-3xl mt-4">Payment Successful!</CardTitle>
            <p className="text-muted-foreground">Thank you for your order. A confirmation email has been sent.</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
              <Separator />
              <div className="space-y-2">
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{priceDetails.subtotal.toLocaleString()}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-muted-foreground">Discount</span>
                    <span className="text-primary">- ₹{priceDetails.totalDiscount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-muted-foreground">Platform Fee</span>
                    <span>₹{priceDetails.platformFee.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-xl">
                    <span>Total Paid</span>
                    <span>₹{priceDetails.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline" className="flex-1">
                <Link href="/marketplace">
                  <ShoppingBag className="mr-2" /> Continue Shopping
                </Link>
              </Button>
              <Button asChild className="flex-1">
                <Link href="/profile">
                  <Home className="mr-2" /> Go to Profile
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
