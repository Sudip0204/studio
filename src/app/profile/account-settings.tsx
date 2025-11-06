
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
import { Sun, Moon, Monitor } from 'lucide-react';

export function AccountSettings() {
    const { toast } = useToast();
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
        // Logic to actually change the theme would go here
        // For example, adding/removing 'dark' class to the html element
        if (selectedTheme === 'system') {
            document.documentElement.classList.remove('dark', 'light');
        } else {
            document.documentElement.classList.remove('dark', 'light');
            document.documentElement.classList.add(selectedTheme);
        }
        toast({
            title: 'Theme Updated',
            description: `Switched to ${selectedTheme.charAt(0).toUpperCase() + selectedTheme.slice(1)} theme.`,
        });
    };

    const handleDeleteAccount = () => {
        // In a real app, this would trigger a series of backend operations.
        toast({
            variant: 'destructive',
            title: 'Account Deletion Initiated',
            description: 'Your account is scheduled for deletion. You will be logged out.',
        });
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
                                <SelectItem value="system">
                                     <div className="flex items-center gap-2">
                                        <Monitor className="h-4 w-4" /> System
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>
            
            {/* Danger Zone */}
            <Card className="border-destructive/50">
                <CardHeader>
                    <CardTitle className="text-destructive">Danger Zone</CardTitle>
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
