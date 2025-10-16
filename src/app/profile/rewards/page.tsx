
'use client';

import { useEffect, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, Gift, Sparkles, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Dummy function to add rewards for prototyping
const addDummyRewards = (firestore: any, userId: string) => {
  const rewardsRef = collection(firestore, 'users', userId, 'rewards');
  const rewards = [
    {
      title: '10% Off Your Next Purchase',
      description: 'Get 10% off any item in the marketplace.',
      code: 'ECOTEN',
      discountType: 'percentage',
      discountValue: 10,
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      isUsed: false,
      source: 'Welcome Gift',
    },
    {
      title: '₹50 Fixed Discount',
      description: 'A flat ₹50 discount on your next order above ₹500.',
      code: 'GREEN50',
      discountType: 'fixed',
      discountValue: 50,
      expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      isUsed: false,
      source: 'First Recycle',
    },
    {
        title: 'Expired Coupon',
        description: 'This coupon has expired.',
        code: 'OLDNEWS',
        discountType: 'percentage',
        discountValue: 20,
        expiryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isUsed: false,
        source: 'Past Event',
    },
     {
        title: 'Used Coupon',
        description: 'You have already used this coupon.',
        code: 'USEDUP',
        discountType: 'fixed',
        discountValue: 100,
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        isUsed: true,
        source: 'Special Offer',
    },
    {
      title: 'Free Shipping',
      description: 'Enjoy free shipping on your next marketplace order.',
      code: 'ECOSHIP',
      discountType: 'shipping',
      discountValue: 100, // Represents 100% off shipping
      expiryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      isUsed: false,
      source: 'Community Goal',
    },
    {
      title: '₹200 Off Furniture',
      description: 'Get ₹200 off any furniture item.',
      code: 'FURNISH200',
      discountType: 'fixed',
      discountValue: 200,
      expiryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      isUsed: false,
      source: 'Marketplace Seller',
    }
  ];
  
  rewards.forEach(reward => {
    addDocumentNonBlocking(rewardsRef, reward);
  });
};


export default function RewardsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  
  const rewardsRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'rewards') : null, [firestore, user]);
  const { data: rewards, isLoading: areRewardsLoading } = useCollection(rewardsRef);
  
  const [hasAddedDummies, setHasAddedDummies] = useState(false);

  useEffect(() => {
    // Add dummy rewards once for the logged-in user if they have no rewards
    if (user && firestore && rewards?.length === 0 && !areRewardsLoading && !hasAddedDummies) {
        addDummyRewards(firestore, user.uid);
        setHasAddedDummies(true);
    }
  }, [user, firestore, rewards, areRewardsLoading, hasAddedDummies]);


  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `Coupon code "${code}" has been copied to your clipboard.`,
    });
  };

  const handleApplyCode = (code: string) => {
    toast({
        title: "Coupon Applied!",
        description: `Code "${code}" has been applied to your cart.`,
    });
    // Here you would typically redirect to the cart or update the cart context
  }

  if (isUserLoading || areRewardsLoading) {
    return (
        <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-full mt-2" />
                        </CardHeader>
                        <CardContent>
                             <Skeleton className="h-10 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-4 w-1/3" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold font-headline">My Rewards</h3>
          <p className="text-muted-foreground">Your collection of exclusive discounts and offers.</p>
        </div>
        <div className="text-right">
            <p className="text-sm text-muted-foreground">Total Points</p>
            <p className="text-2xl font-bold text-primary">1,250 pts</p>
        </div>
      </div>
      
      {rewards && rewards.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {rewards.map((reward) => {
            const hasExpired = isPast(reward.expiryDate.toDate());
            const isDisabled = reward.isUsed || hasExpired;
            return (
              <Card key={reward.id} className={cn("flex flex-col", isDisabled && "bg-muted/50")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className={cn("h-6 w-6", isDisabled ? 'text-muted-foreground' : 'text-primary')} />
                    <span>{reward.title}</span>
                  </CardTitle>
                  <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <div className="flex flex-col sm:flex-row items-center gap-2">
                        <div 
                            className={cn(
                                "border-2 border-dashed rounded-lg p-3 flex-grow text-center",
                                isDisabled ? 'border-muted-foreground/30' : 'border-primary/50'
                            )}
                        >
                            <span className={cn(
                                "font-mono text-lg font-bold tracking-widest",
                                isDisabled ? 'text-muted-foreground' : 'text-primary'
                            )}>{reward.code}</span>
                        </div>
                        <div className="flex-shrink-0 flex gap-2 w-full sm:w-auto">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1"
                                onClick={() => !isDisabled && handleCopyCode(reward.code)}
                                disabled={isDisabled}
                            >
                                Copy
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1"
                                disabled={isDisabled}
                                onClick={() => handleApplyCode(reward.code)}
                            >
                                Apply
                            </Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground justify-between">
                    {reward.isUsed ? (
                        <div className="flex items-center gap-1 text-orange-500 font-semibold">
                            <Info className="h-4 w-4" />
                            <span>Already Used</span>
                        </div>
                    ) : hasExpired ? (
                        <div className="flex items-center gap-1 text-red-500 font-semibold">
                            <AlertTriangle className="h-4 w-4" />
                            <span>Expired on {format(reward.expiryDate.toDate(), 'dd MMM yyyy')}</span>
                        </div>
                    ) : (
                        <span>Expires on {format(reward.expiryDate.toDate(), 'dd MMM yyyy')}</span>
                    )}
                     <p>From: {reward.source}</p>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit mb-4">
                <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-bold">No Rewards Yet</h3>
            <p className="text-muted-foreground mt-2">Keep participating in EcoCity activities to earn exclusive coupons!</p>
        </div>
      )}
    </div>
  );
}
