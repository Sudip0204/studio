
'use client';

import { useUser, useAuth } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInformation } from './personal-information';
import { ManageAddresses } from './manage-addresses';
import { Skeleton } from '@/components/ui/skeleton';
import RewardsPage from './rewards/page';

function AccountSettings() {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium">Account Settings</h3>
      <p className="text-sm text-muted-foreground">Manage your account settings and preferences.</p>
    </div>
  )
}

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = () => {
    auth.signOut();
  };

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <Card>
          <CardHeader className="flex flex-col md:flex-row items-center gap-6">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-64" />
            </div>
            <Skeleton className="h-10 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
            <div className="mt-6 p-6 border rounded-lg">
                <Skeleton className="h-8 w-1/3 mb-4" />
                <Skeleton className="h-24 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-muted/40 min-h-screen">
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row items-center gap-6 bg-background">
            <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary">
              <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <p className="text-sm text-muted-foreground">Hello,</p>
              <CardTitle className="font-headline text-3xl">{user.displayName || 'Eco-Warrior'}</CardTitle>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardHeader>
          <CardContent className="p-0">
             <Tabs defaultValue="personal-info" className="w-full">
                <TabsList className="grid w-full grid-cols-4 rounded-none">
                    <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
                    <TabsTrigger value="addresses">Manage Addresses</TabsTrigger>
                    <TabsTrigger value="rewards">My Rewards</TabsTrigger>
                    <TabsTrigger value="settings">Account Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="personal-info">
                    <PersonalInformation user={user} />
                </TabsContent>

                 <TabsContent value="addresses">
                    <ManageAddresses userId={user.uid} />
                </TabsContent>

                 <TabsContent value="rewards">
                    <RewardsPage />
                </TabsContent>
                
                 <TabsContent value="settings">
                    <AccountSettings />
                </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
