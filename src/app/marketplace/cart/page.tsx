
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Loader2, Trash2, Heart, Plus, Minus, Info, ShieldCheck, Ticket, Gift, X, Home, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { format, isPast } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';


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

function CouponDialog({ onApplyCoupon, user }: { onApplyCoupon: (coupon: any) => void; user: any; }) {
  const firestore = useFirestore();
  const rewardsRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'rewards') : null, [firestore, user]);
  const { data: rewards, isLoading } = useCollection(rewardsRef);

  const validRewards = useMemo(() => {
    if (!rewards) return [];
    return rewards.filter(reward => !reward.isUsed && !isPast(reward.expiryDate.toDate()));
  }, [rewards]);
  
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Select a Coupon</DialogTitle>
      </DialogHeader>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto p-1">
        {isLoading && <p>Loading coupons...</p>}
        {!isLoading && validRewards.length === 0 && <p className="text-muted-foreground text-center">No valid coupons available.</p>}
        {validRewards.map(coupon => (
          <Card key={coupon.id} className="cursor-pointer hover:border-primary transition-colors" onClick={() => onApplyCoupon(coupon)}>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                 <Gift className="h-5 w-5 text-primary"/> {coupon.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{coupon.description}</p>
            </CardHeader>
            <CardFooter className="text-xs justify-between">
                <span>Code: <span className="font-mono font-bold">{coupon.code}</span></span>
                <span>Expires: {format(coupon.expiryDate.toDate(), 'dd MMM yyyy')}</span>
            </CardFooter>
          </Card>
        ))}
      </div>
    </DialogContent>
  );
}

function AddressSelectionDialog({ open, onOpenChange, onConfirm, userId }: { open: boolean, onOpenChange: (open: boolean) => void, onConfirm: (address: any) => void, userId: string }) {
    const firestore = useFirestore();
    const router = useRouter();
    const addressesRef = useMemoFirebase(() => collection(firestore, 'users', userId, 'addresses'), [firestore, userId]);
    const { data: addresses, isLoading } = useCollection(addressesRef);
    const [selectedAddress, setSelectedAddress] = useState<any | null>(null);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Select Shipping Address</DialogTitle>
                    <DialogDescription>Choose where you'd like your order to be delivered.</DialogDescription>
                </DialogHeader>
                <div className="max-h-[60vh] overflow-y-auto space-y-4 p-1">
                    {isLoading && <p>Loading addresses...</p>}
                    {!isLoading && addresses && addresses.length > 0 ? (
                        addresses.map(address => (
                            <Card 
                                key={address.id} 
                                className={cn("cursor-pointer transition-all", selectedAddress?.id === address.id && "border-primary ring-2 ring-primary")}
                                onClick={() => setSelectedAddress(address)}
                            >
                                <CardContent className="p-4">
                                    <p className="font-semibold">{address.name}</p>
                                    <p className="text-sm text-muted-foreground">{address.addressLine}, {address.city}, {address.state} - {address.pincode}</p>
                                    <p className="text-sm text-muted-foreground">Mobile: {address.phoneNumber}</p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        !isLoading && (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No shipping addresses found.</p>
                                <Button onClick={() => router.push('/profile?tab=addresses')}>Add an Address</Button>
                            </div>
                        )
                    )}
                </div>
                <DialogFooter>
                    <Button 
                        disabled={!selectedAddress}
                        onClick={() => selectedAddress && onConfirm(selectedAddress)}
                    >
                        Continue to Payment <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function CartPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/marketplace/cart');
    }
  }, [user, isUserLoading, router]);

  const handleApplyCoupon = (coupon: any) => {
    applyCoupon(coupon);
    setIsCouponDialogOpen(false);
    toast({
        title: "Coupon Applied!",
        description: `You've applied the "${coupon.title}" coupon.`
    })
  }
  
  const priceDetails = useMemo(() => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
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

    const platformFee = totalItems > 0 ? 109 : 0;
    const total = subtotal - totalDiscount + platformFee;
    return { subtotal, totalDiscount, platformFee, total, totalItems, couponDiscount, demoDiscount };
  }, [cart, appliedCoupon]);

  const handlePlaceOrder = () => {
    setIsAddressDialogOpen(true);
  }

  const handleAddressSelected = (address: any) => {
    setSelectedShippingAddress(address);
    setIsAddressDialogOpen(false);
    setIsPaymentDialogOpen(true);
  }

  const handleConfirmPayment = async () => {
    if (!user || !selectedShippingAddress) return;
    
    const ordersRef = collection(firestore, 'users', user.uid, 'orders');
    
    const orderData = {
      userId: user.uid,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: priceDetails.total,
      status: "Placed",
      shippingAddress: selectedShippingAddress,
      paymentMethod: "Simulated Payment",
      cancellationReason: null,
      appliedCoupon: appliedCoupon ? { code: appliedCoupon.code, discountValue: appliedCoupon.discountValue, discountType: appliedCoupon.discountType } : null,
      createdAt: serverTimestamp(),
    };

    addDocumentNonBlocking(ordersRef, orderData);

    // Mark the coupon as used
    if (appliedCoupon) {
      const couponRef = doc(firestore, 'users', user.uid, 'rewards', appliedCoupon.id);
      updateDocumentNonBlocking(couponRef, { isUsed: true });
    }

    setIsPaymentDialogOpen(false);
    router.push('/marketplace/order-confirmation');
  }

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
                                <span className="text-primary">- ₹{priceDetails.totalDiscount.toLocaleString()}</span>
                            </div>
                            {appliedCoupon && (
                                <div className="flex justify-between items-center text-xs pl-4 text-primary">
                                    <span>Coupon: "{appliedCoupon.code}"</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeCoupon}>
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                            )}
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
                            <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full" disabled={!!appliedCoupon}>
                                        <Ticket className="mr-2"/>
                                        {appliedCoupon ? 'Coupon Applied' : 'Apply Coupon'}
                                    </Button>
                                </DialogTrigger>
                                {user && <CouponDialog user={user} onApplyCoupon={handleApplyCoupon} />}
                            </Dialog>
                             <p className="text-sm font-semibold text-primary">You will save ₹{priceDetails.totalDiscount.toLocaleString()} on this order</p>
                            <Button className="w-full" size="lg" onClick={handlePlaceOrder}>Place Order</Button>
                        </CardFooter>
                    </Card>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm">
                        <ShieldCheck className="h-5 w-5 text-gray-400" />
                        <p>Safe and Secure Payments. Easy returns. 100% Authentic products.</p>
                    </div>
                </div>
            </div>
        </div>
        
        {user && <AddressSelectionDialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen} onConfirm={handleAddressSelected} userId={user.uid} />}

        <AlertDialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
                <AlertDialogDescription>
                    You are about to place an order for a total of <span className="font-bold">₹{priceDetails.total.toLocaleString()}</span>. Please confirm to proceed with payment.
                </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleConfirmPayment}>Confirm & Pay</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </div>
  );
}
