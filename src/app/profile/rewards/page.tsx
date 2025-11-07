
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp, Timestamp, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Ticket, Gift, Sparkles, AlertTriangle, Info, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format, isPast } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { useCart } from '@/context/cart-context';
import { useRouter } from 'next/navigation';

// Base rewards that can be unlocked
const allPossibleRewards = [
  { id: 'ECOTEN', title: '10% Off Your Next Purchase', description: 'Get 10% off any item in the marketplace.', discountType: 'percentage', discountValue: 10, source: 'Milestone', pointsRequired: 100 },
  { id: 'GREEN50', title: '₹50 Fixed Discount', description: 'A flat ₹50 discount on your next order above ₹500.', discountType: 'fixed', discountValue: 50, source: 'Milestone', pointsRequired: 250 },
  { id: 'ECOSHIP', title: 'Free Shipping', description: 'Enjoy free shipping on your next marketplace order.', discountType: 'shipping', discountValue: 100, source: 'Milestone', pointsRequired: 500 },
  { id: 'FURNISH200', title: '₹200 Off Furniture', description: 'Get ₹200 off any furniture item.', discountType: 'fixed', discountValue: 200, source: 'Milestone', pointsRequired: 1000 },
  { id: 'ECOTECH15', title: '15% Off All Electronics', description: 'Save on refurbished gadgets.', discountType: 'percentage', discountValue: 15, source: 'Milestone', pointsRequired: 1500 },
  { id: 'PLANET25', title: "Planet Protector's Perk", description: 'A special 25% discount for being an active member.', discountType: 'percentage', discountValue: 25, source: 'Milestone', pointsRequired: 2500 },
  { id: 'STYLE300', title: 'Upcycle Your Style', description: '₹300 off any upcycled clothing item.', discountType: 'fixed', discountValue: 300, source: 'Milestone', pointsRequired: 4000 },
  { id: 'DECOR20', title: 'Home Decor Delight', description: '20% off any item in the Home Decor category.', discountType: 'percentage', discountValue: 20, source: 'Milestone', pointsRequired: 5000 },
];

export default function RewardsPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const { cart, applyCoupon } = useCart();
  const router = useRouter();

  const userRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [firestore, user]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<any>(userRef);

  const rewardsRef = useMemoFirebase(() => user ? collection(firestore, 'users', user.uid, 'rewards') : null, [firestore, user]);
  const { data: unlockedRewards, isLoading: areRewardsLoading } = useCollection(rewardsRef);
  
  const [lastCheckedPoints, setLastCheckedPoints] = useState(0);

  // Effect to check for new unlockable rewards when user's points change
  useEffect(() => {
    if (!userProfile || !rewardsRef) return;
    
    const currentPoints = userProfile.ecoPoints || 0;
    
    // Only run if points have increased since last check
    if (currentPoints > lastCheckedPoints) {
      const checkAndAddRewards = async () => {
        for (const reward of allPossibleRewards) {
          if (currentPoints >= reward.pointsRequired) {
            // Check if user already has this reward by its ID/code
            const rewardQuery = query(rewardsRef, where('code', '==', reward.id));
            const existing = await getDocs(rewardQuery);
            
            if (existing.empty) {
                // User has enough points and doesn't have the reward yet, so add it
                addDocumentNonBlocking(rewardsRef, {
                    title: reward.title,
                    description: reward.description,
                    code: reward.id,
                    discountType: reward.discountType,
                    discountValue: reward.discountValue,
                    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiry
                    isUsed: false,
                    source: reward.source,
                    pointsRequired: reward.pointsRequired,
                });
                 toast({
                    title: "New Reward Unlocked!",
                    description: `You've unlocked: "${reward.title}"`,
                });
            }
          }
        }
      };
      
      checkAndAddRewards();
      setLastCheckedPoints(currentPoints);
    }
  }, [userProfile, rewardsRef, toast, lastCheckedPoints]);


  const handleCopyCode = (code: string) => {
    if (cart.length === 0) {
        toast({
            variant: 'destructive',
            title: "Your cart is empty!",
            description: "Add valid items in the cart to redeem your coupon.",
        });
        return;
    }
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied!",
      description: `Coupon code "${code}" has been copied to your clipboard.`,
    });
  };

  const handleApplyCoupon = (coupon: any) => {
    if (cart.length === 0) {
        toast({
            variant: 'destructive',
            title: "Your cart is empty!",
            description: "Add valid items in the cart to redeem your coupon.",
        });
        return;
    }
    applyCoupon(coupon);
    toast({
        title: "Coupon Applied!",
        description: `Code "${coupon.code}" has been applied.`,
    });
    router.push('/marketplace/cart');
  }

  const sortedRewards = useMemo(() => {
    if (!unlockedRewards) return [];
    return unlockedRewards.sort((a, b) => {
      const aIsDisabled = a.isUsed || isPast(a.expiryDate.toDate());
      const bIsDisabled = b.isUsed || isPast(b.expiryDate.toDate());
      if (aIsDisabled && !bIsDisabled) return 1;
      if (!aIsDisabled && bIsDisabled) return -1;
      return b.expiryDate.toDate().getTime() - a.expiryDate.toDate().getTime();
    });
  }, [unlockedRewards]);

  const currentEcoPoints = userProfile?.ecoPoints || 0;

  if (isUserLoading || isProfileLoading) {
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
            <p className="text-sm text-muted-foreground">EcoPoints</p>
            <p className="text-2xl font-bold text-primary">{currentEcoPoints.toLocaleString()}</p>
        </div>
      </div>
      
      <h4 className="font-headline text-lg font-semibold mb-4">Unlocked Rewards</h4>
      {areRewardsLoading ? (
         <p>Loading your rewards...</p>
      ) : sortedRewards.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-6">
          {sortedRewards.map((reward) => {
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
                                onClick={() => handleApplyCoupon(reward)}
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

      <h4 className="font-headline text-lg font-semibold mt-12 mb-4">Future Rewards</h4>
      <div className="grid md:grid-cols-2 gap-6">
        {allPossibleRewards.filter(r => r.pointsRequired > currentEcoPoints).map(reward => (
             <Card key={reward.id} className="bg-muted/30 border-dashed">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-muted-foreground">
                        <Lock className="h-6 w-6"/>
                        <span>{reward.title}</span>
                    </CardTitle>
                    <CardDescription>{reward.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                    <p className="text-sm font-semibold text-primary">Unlocks at {reward.pointsRequired.toLocaleString()} EcoPoints</p>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
