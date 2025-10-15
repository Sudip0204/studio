
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Ticket, CircleSlash, CheckCircle, Calendar, Shirt, MonitorSmartphone, Lamp, Loader2, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { differenceInDays, format, isPast } from 'date-fns';
import { useUser } from "@/firebase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Coupon = {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: Date;
  used: boolean;
  icon?: React.ReactNode;
};

const coupons: Coupon[] = [
  { id: 'c1', title: 'Welcome Gift!', description: 'A thank you for joining our community.', discount: '10% OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() + 30)), used: false, icon: <Ticket className="h-8 w-8" /> },
  { id: 'c2', title: 'First Recycling Milestone', description: 'Congrats on recycling 10 items!', discount: '₹150 OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() + 60)), used: false, icon: <Ticket className="h-8 w-8" /> },
  { id: 'c9', title: 'Gaming Guru', description: 'For scoring over 5,000 EcoPoints!', discount: '₹300 OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() + 40)), used: false, icon: <Gamepad2 className="h-8 w-8" /> },
  { id: 'c6', title: 'Sustainable Fashion', description: 'For purchasing upcycled clothing.', discount: '20% OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() + 45)), used: false, icon: <Shirt className="h-8 w-8" /> },
  { id: 'c7', title: 'Green Tech Discount', description: 'On any refurbished electronics.', discount: '₹1000 OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() + 75)), used: false, icon: <MonitorSmartphone className="h-8 w-8" /> },
  { id: 'c8', title: 'Eco-Decor Special', description: 'For items in our Home Decor category.', discount: '15% OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() + 20)), used: false, icon: <Lamp className="h-8 w-8" /> },
  { id: 'c5', title: 'Community Challenge Winner', description: 'Winner of the "Clean Your Block" challenge.', discount: '50% OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() + 90)), used: false, icon: <Ticket className="h-8 w-8" /> },
  { id: 'c10', title: 'Anniversary Coupon', description: 'One year with EcoCity!', discount: '30% OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() - 15)), used: false, icon: <Ticket className="h-8 w-8" /> }, // Expired
  { id: 'c3', title: 'Eco-Warrior Reward', description: 'For reaching 1000 Eco-points.', expiryDate: new Date(new Date().setDate(new Date().getDate() - 10)), used: true, icon: <Ticket className="h-8 w-8" /> }, // Used & Expired
  { id: 'c4', title: 'Marketplace Launch Coupon', description: 'Special launch offer for our marketplace.', discount: '25% OFF', expiryDate: new Date(new Date().setDate(new Date().getDate() + 5)), used: true, icon: <Ticket className="h-8 w-8" /> }, // Used
];

const CouponCard = ({ coupon }: { coupon: Coupon }) => {
    const isExpired = isPast(coupon.expiryDate);
    const isDisabled = coupon.used || isExpired;
    const daysLeft = differenceInDays(coupon.expiryDate, new Date());

    let status = {
        icon: <Award className="h-5 w-5 text-amber-500" />,
        label: daysLeft >= 1 ? `${daysLeft} days left` : 'Expires today',
        color: "text-amber-500",
    };

    if (coupon.used) {
        status = {
            icon: <CheckCircle className="h-5 w-5 text-primary" />,
            label: "Used",
            color: "text-primary",
        };
    } else if (isExpired) {
        status = {
            icon: <CircleSlash className="h-5 w-5 text-destructive" />,
            label: "Expired",
            color: "text-destructive",
        };
    }
    
    return (
        <Card className={cn("flex flex-col overflow-hidden transition-all", isDisabled && "bg-muted/50 opacity-75")}>
            <div className={cn("h-2 w-full", isDisabled ? "bg-muted-foreground/30" : "bg-primary")}></div>
            <CardHeader className="flex-row items-start gap-4">
                <div className={cn("p-3 rounded-full", isDisabled ? "bg-muted-foreground/10 text-muted-foreground" : "bg-primary/10 text-primary")}>
                    {coupon.icon || <Ticket className="h-8 w-8" />}
                </div>
                <div>
                    <CardTitle className={cn("font-headline text-2xl", isDisabled && "text-muted-foreground")}>{coupon.discount}</CardTitle>
                    <p className={cn("font-semibold", isDisabled && "text-muted-foreground")}>{coupon.title}</p>
                </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
                <p className="text-muted-foreground text-sm flex-grow">{coupon.description}</p>
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <div className={cn("flex items-center gap-2 text-sm", status.color)}>
                        {status.icon}
                        <span>{status.label}</span>
                    </div>
                     <Button asChild disabled={isDisabled} variant={isDisabled ? 'secondary' : 'default'}>
                        <Link href="/marketplace">Apply</Link>
                    </Button>
                </div>
                 <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4" />
                    <span>Valid until {format(coupon.expiryDate, 'PPP')}</span>
                </div>
            </CardContent>
        </Card>
    );
};


export default function RewardsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
       <Card className="w-full max-w-4xl mx-auto bg-transparent border-none shadow-none">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
            <Award className="h-10 w-10 text-primary" />
          </div>
          <CardTitle className="font-headline text-3xl mt-4">Your Rewards</CardTitle>
          <CardDescription className="text-lg">
            Here are the coupons you've earned. Use them in the marketplace to get discounts on eco-friendly products!
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map(coupon => (
                <CouponCard key={coupon.id} coupon={coupon} />
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
