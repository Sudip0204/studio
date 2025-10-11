
'use client';

import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Award, BarChart3, Edit, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/firebase';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = () => {
    auth.signOut();
  };

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="flex flex-col md:flex-row items-center gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center md:text-left">
            <CardTitle className="font-headline text-3xl">{user.displayName || 'Eco-Warrior'}</CardTitle>
            <CardDescription className="text-lg text-muted-foreground">{user.email}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
            <Button variant="destructive" onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" /> Logout</Button>
          </div>
        </CardHeader>
        <CardContent className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart3 className="text-primary"/> Your Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>EcoPoints:</strong> 1,250</p>
                <p><strong>Level:</strong> Earth Advocate</p>
                <p><strong>Items Recycled:</strong> 42</p>
              </CardContent>
            </Card>
            <Card className="flex flex-col items-center justify-center text-center p-6 hover:bg-muted/50 transition-colors">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-headline text-xl font-semibold">Rewards</h3>
              <p className="text-muted-foreground text-sm mb-4">View your earned rewards and redeem points.</p>
              <Button asChild>
                <Link href="/profile/rewards">Go to Rewards</Link>
              </Button>
            </Card>
        </CardContent>
      </Card>
    </div>
  );
}
