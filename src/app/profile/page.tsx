
'use client';

import { useUser, useAuth, setDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Edit, LogOut, Loader2, Upload, Trash2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PersonalInformation } from './personal-information';
import { ManageAddresses } from './manage-addresses';
import { Skeleton } from '@/components/ui/skeleton';
import RewardsPage from './rewards/page';
import { AccountSettings } from './account-settings';
import { MyOrders } from './my-orders';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { getStorage, ref, uploadString, getDownloadURL, deleteObject } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc } from 'firebase/firestore';


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || "personal-info";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [isPhotoDialogOpen, setIsPhotoDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login?redirect=/profile');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = () => {
    auth.signOut();
  };
  
  const onTabChange = (value: string) => {
    setActiveTab(value);
    window.history.pushState(null, '', `/profile?tab=${value}`);
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !user) return;
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const dataUrl = reader.result as string;
        const storage = getStorage();
        const storageRef = ref(storage, `profile-pictures/${user.uid}`);
        
        try {
            await uploadString(storageRef, dataUrl, 'data_url');
            const photoURL = await getDownloadURL(storageRef);

            // Update Auth user profile
            await updateProfile(user, { photoURL });

            // Update Firestore user profile
            const userDocRef = doc(auth.app.firestore!, 'users', user.uid);
            setDocumentNonBlocking(userDocRef, { photoURL }, { merge: true });

            toast({ title: "Profile picture updated!" });
            setIsPhotoDialogOpen(false);
        } catch (error) {
            console.error("Error uploading photo: ", error);
            toast({ variant: "destructive", title: "Upload Failed", description: "Could not upload your profile picture." });
        } finally {
            setIsUploading(false);
        }
    };
  };

  const handleRemovePhoto = async () => {
    if (!user) return;
    setIsUploading(true);
    const storage = getStorage();
    const storageRef = ref(storage, `profile-pictures/${user.uid}`);

    try {
        // Delete from Storage
        await deleteObject(storageRef);

        // Update Auth user profile
        await updateProfile(user, { photoURL: null });

        // Update Firestore user profile
        const userDocRef = doc(auth.app.firestore!, 'users', user.uid);
        setDocumentNonBlocking(userDocRef, { photoURL: null }, { merge: true });

        toast({ title: "Profile picture removed." });
        setIsPhotoDialogOpen(false);
    } catch (error: any) {
        if (error.code !== 'storage/object-not-found') {
             console.error("Error removing photo: ", error);
             toast({ variant: "destructive", title: "Removal Failed", description: "Could not remove profile picture." });
        } else {
             // If object doesn't exist, just clear it locally
            await updateProfile(user, { photoURL: null });
            const userDocRef = doc(auth.app.firestore!, 'users', user.uid);
            setDocumentNonBlocking(userDocRef, { photoURL: null }, { merge: true });
            toast({ title: "Profile picture removed." });
            setIsPhotoDialogOpen(false);
        }
    } finally {
        setIsUploading(false);
    }
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
      <div className="container mx-auto py-12 px-4 max-w-6xl">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col md:flex-row items-center gap-6 bg-background">
             <Dialog open={isPhotoDialogOpen} onOpenChange={setIsPhotoDialogOpen}>
                <DialogTrigger asChild>
                    <div className="relative group cursor-pointer">
                        <Avatar className="h-24 w-24 border-4 border-background ring-2 ring-primary">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || ''} />
                        <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Edit className="h-8 w-8 text-white" />
                        </div>
                    </div>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Profile Picture</DialogTitle>
                        <DialogDescription>Update your profile picture.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                         <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} accept="image/*" className="hidden" />
                         <Button onClick={() => fileInputRef.current?.click()} className="w-full" disabled={isUploading}>
                            {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Upload className="mr-2 h-4 w-4" />}
                            Upload New Photo
                         </Button>
                         {user.photoURL && (
                            <Button variant="destructive" onClick={handleRemovePhoto} className="w-full" disabled={isUploading}>
                                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Trash2 className="mr-2 h-4 w-4" />}
                                Remove Photo
                            </Button>
                         )}
                    </div>
                </DialogContent>
            </Dialog>

            <div className="flex-1 text-center md:text-left">
              <p className="text-sm text-muted-foreground">Hello,</p>
              <CardTitle className="font-headline text-3xl">{user.displayName || 'Eco-Warrior'}</CardTitle>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </CardHeader>
          <CardContent className="p-0">
             <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
                <TabsList className="grid w-full grid-cols-1 sm:grid-cols-5 rounded-none">
                    <TabsTrigger value="personal-info">Personal Information</TabsTrigger>
                    <TabsTrigger value="my-orders">My Orders</TabsTrigger>
                    <TabsTrigger value="addresses">Manage Addresses</TabsTrigger>
                    <TabsTrigger value="rewards">My Rewards</TabsTrigger>
                    <TabsTrigger value="settings">Account Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="personal-info">
                    <PersonalInformation user={user} />
                </TabsContent>

                 <TabsContent value="my-orders">
                    <MyOrders userId={user.uid} />
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
