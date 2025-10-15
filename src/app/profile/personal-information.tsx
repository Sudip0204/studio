
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User } from 'firebase/auth';
import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc, Timestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Edit } from 'lucide-react';
import { CountryCodeSelect } from '@/components/country-code-select';
import { format } from 'date-fns';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  gender: z.enum(['male', 'female', 'other'], { required_error: 'Please select a gender.' }),
  dob: z.string().refine((val) => !isNaN(Date.parse(val)), { message: 'A valid date of birth is required.' }),
  email: z.string().email('Invalid email address.'),
  phoneNumber: z.object({
    countryCode: z.string().min(1, 'Country code is required.'),
    number: z.string().min(1, 'Mobile number is required.').max(10, 'Number cannot exceed 10 digits.'),
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function PersonalInformation({ user }: { user: User }) {
  const firestore = useFirestore();
  const userRef = useMemoFirebase(() => doc(firestore, 'users', user.uid), [firestore, user.uid]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<any>(userRef);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      gender: undefined,
      dob: '',
      email: '',
      phoneNumber: { countryCode: '+91', number: '' },
    }
  });

  useEffect(() => {
    if (userProfile) {
      const [countryCode, number] = (userProfile.phoneNumber || '+91 ').split(' ');
      form.reset({
        name: userProfile.name || '',
        gender: userProfile.gender,
        dob: userProfile.dob ? format(userProfile.dob.toDate(), 'yyyy-MM-dd') : '',
        email: userProfile.email || '',
        phoneNumber: {
          countryCode: countryCode || '+91',
          number: number || '',
        },
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      const updatedProfile = {
        name: values.name,
        gender: values.gender,
        dob: new Date(values.dob),
        email: values.email,
        phoneNumber: `${values.phoneNumber.countryCode} ${values.phoneNumber.number}`,
      };
      setDocumentNonBlocking(userRef, updatedProfile, { merge: true });
      
      toast({
        title: 'Profile Updated',
        description: 'Your personal information has been saved.',
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'There was an error updating your profile.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const InfoRow = ({ label, value }: { label: string; value: string | undefined }) => (
    <div className="py-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || 'Not provided'}</p>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Personal Information</h3>
          {!isEditing && <Button variant="outline" onClick={() => setIsEditing(true)}><Edit className="mr-2 h-4 w-4" /> Edit</Button>}
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )} />
            </div>
             <FormField control={form.control} name="dob" render={({ field }) => (
                <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl><Input type="email" disabled {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
            )} />
            <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <div className="flex gap-2">
                    <FormField control={form.control} name="phoneNumber.countryCode" render={({ field }) => (
                        <FormItem className="w-1/3"><FormControl><CountryCodeSelect onValueChange={field.onChange} defaultValue={field.value} /></FormControl></FormItem>
                    )} />
                    <FormField control={form.control} name="phoneNumber.number" render={({ field }) => (
                        <FormItem className="w-2/3"><FormControl><Input type="tel" maxLength={10} {...field} /></FormControl></FormItem>
                    )} />
                </div>
                <FormMessage>{form.formState.errors.phoneNumber?.countryCode?.message || form.formState.errors.phoneNumber?.number?.message}</FormMessage>
            </FormItem>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        isProfileLoading ? <p>Loading profile...</p> :
        userProfile ? (
             <div className="grid md:grid-cols-2 gap-x-8 divide-y md:divide-y-0">
                <InfoRow label="Full Name" value={userProfile.name} />
                <InfoRow label="Gender" value={userProfile.gender} />
                <InfoRow label="Date of Birth" value={userProfile.dob ? format(userProfile.dob.toDate(), 'dd/MM/yyyy') : undefined} />
                <InfoRow label="Email Address" value={userProfile.email} />
                <InfoRow label="Mobile Number" value={userProfile.phoneNumber} />
             </div>
        ) : <p>No profile information found.</p>
      )}
    </div>
  );
}
