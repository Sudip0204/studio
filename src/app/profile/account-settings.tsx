
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sun, Moon, Monitor, Palette, Leaf, Droplet } from 'lucide-react';
import { useAuth } from '@/firebase';
import { deleteUser } from 'firebase/auth';

export function AccountSettings() {
    const { toast } = useToast();
    const auth = useAuth();
    const [notifications, setNotifications] = useState({
        newsletter: true,
        marketplace: true,
    });
    const [theme, setTheme] = useState('system');

    const handleNotificationChange = (type: 'newsletter' | 'marketplace') => {
        setNotifications(prev => {
            const newSettings = { ...prev, [type]: !prev[type] };
            toast({
                title: 'Notification Settings Updated',
                description: `You will ${newSettings[type] ? 'now receive' : 'no longer receive'} ${type} emails.`,
            });
            return newSettings;
        });
    };

    const handleThemeChange = (selectedTheme: string) => {
        setTheme(selectedTheme);
        document.documentElement.classList.remove('dark', 'theme-green', 'theme-blue');
        if (selectedTheme !== 'system' && selectedTheme !== 'light') {
            document.documentElement.classList.add(selectedTheme);
        } else if (selectedTheme === 'dark') {
            document.documentElement.classList.add('dark');
        }
        
        toast({
            title: 'Theme Updated',
            description: `Switched to ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} theme.`,
        });
    };

    const handleDeleteAccount = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                await deleteUser(user);
                toast({
                    title: 'Account Deleted',
                    description: 'Your account has been permanently deleted.',
                });
                // The onAuthStateChanged listener will handle the logout.
            } catch (error: any) {
                let description = 'An error occurred while deleting your account.';
                if (error.code === 'auth/requires-recent-login') {
                    description = 'This is a sensitive operation. Please log out and log back in before deleting your account.';
                }
                toast({
                    variant: 'destructive',
                    title: 'Deletion Failed',
                    description: description,
                });
            }
        }
    };

    return (
        <div className="p-6 space-y-8">
            {/* Notification Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Manage how we communicate with you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="newsletter-switch" className="flex flex-col space-y-1">
                            <span>Marketing Newsletter</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Receive updates on new features and promotions.
                            </span>
                        </Label>
                        <Switch id="newsletter-switch" checked={notifications.newsletter} onCheckedChange={() => handleNotificationChange('newsletter')} />
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="marketplace-switch" className="flex flex-col space-y-1">
                            <span>Marketplace Updates</span>
                            <span className="font-normal leading-snug text-muted-foreground">
                                Get notified about your listings and messages.
                            </span>
                        </Label>
                        <Switch id="marketplace-switch" checked={notifications.marketplace} onCheckedChange={() => handleNotificationChange('marketplace')} />
                    </div>
                </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card>
                <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the app.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-2">
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={theme} onValueChange={handleThemeChange}>
                            <SelectTrigger id="theme" className="w-full">
                                <SelectValue placeholder="Select theme" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="system">
                                     <div className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4" /> System
                                    </div>
                                </SelectItem>
                                <SelectItem value="light">
                                    <div className="flex items-center gap-2">
                                        <Sun className="h-4 w-4" /> Light
                                    </div>
                                </SelectItem>
                                <SelectItem value="dark">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" /> Dark
                                    </div>
                                </SelectItem>
                                <SelectItem value="theme-green">
                                    <div className="flex items-center gap-2">
                                        <Leaf className="h-4 w-4" /> Green
                                    </div>
                                </SelectItem>
                                <SelectItem value="theme-blue">
                                    <div className="flex items-center gap-2">
                                        <Droplet className="h-4 w-4" /> Blue
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            
            {/* Account Management */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle>Account Management</CardTitle>
                    <CardDescription>These actions are permanent and cannot be undone.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">Delete Account</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive hover:bg-destructive/90">
                                    Delete my account
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
