
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Image as ImageIcon, X, Heart, MessageSquare } from 'lucide-react';
import { collection, query, orderBy, limit, serverTimestamp, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { ForumPost, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

// This component fetches the author's data based on authorId
function PostAuthor({ authorId }: { authorId: string }) {
    const firestore = useFirestore();
    const authorRef = useMemoFirebase(() => doc(firestore, 'users', authorId), [firestore, authorId]);
    const { data: author } = useDoc<UserProfile>(authorRef);

    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
                <AvatarImage src={author?.photoURL || undefined} alt={author?.name || ''} />
                <AvatarFallback>{author?.name?.[0].toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm">{author?.name || 'Eco-Warrior'}</p>
        </div>
    );
}


function PostCard({ post, isCurrentUser }: { post: ForumPost; isCurrentUser: boolean; }) {
  const [formattedDate, setFormattedDate] = useState('');
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (post.createdAt) {
      // 'as any' is used here because serverTimestamp() can return a token before the date is set.
      const date = (post.createdAt as any).toDate ? (post.createdAt as any).toDate() : new Date();
      setFormattedDate(formatDistanceToNow(date, { addSuffix: true }));
    }
  }, [post.createdAt]);

  const handleLike = () => {
    if (!user) return;
    const postRef = doc(firestore, 'forumposts', post.id);
    const isLiked = post.likes?.includes(user.uid);

    updateDocumentNonBlocking(postRef, {
      likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  const isLiked = user && post.likes?.includes(user.uid);

  return (
    <div className={`flex items-start gap-3 my-4 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
       {isCurrentUser ? (
         <Avatar className="h-10 w-10">
            <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || ''} />
            <AvatarFallback>{user?.displayName?.[0].toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
       ) : (
        <PostAuthor authorId={post.authorId} />
       )}
      <div className={`max-w-xl rounded-lg p-3 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
        <div className="flex items-center gap-2">
          {isCurrentUser && <p className="font-semibold text-sm">You</p>}
        </div>
        {post.content && <p className="text-sm mt-1">{post.content}</p>}
        {post.imageUrl && (
          <div className="relative aspect-video rounded-md overflow-hidden mt-2">
            <Image src={post.imageUrl} alt="Forum post image" layout="fill" objectFit="cover" />
          </div>
        )}
        {formattedDate && <p className={`text-xs mt-2 text-right ${isCurrentUser ? 'opacity-70' : 'text-muted-foreground'}`}>{formattedDate}</p>}
        <div className="flex items-center gap-4 mt-2">
            <button onClick={handleLike} className="flex items-center gap-1 text-xs hover:text-primary transition-colors disabled:opacity-50" disabled={!user}>
                <Heart className={`h-4 w-4 ${isLiked ? 'text-red-500 fill-current' : ''}`} />
                <span>{post.likes?.length || 0}</span>
            </button>
            <button className="flex items-center gap-1 text-xs hover:text-primary transition-colors disabled:opacity-50" disabled={!user}>
                <MessageSquare className="h-4 w-4" />
                <span>{post.commentCount || 0}</span>
            </button>
        </div>
      </div>
    </div>
  );
}


function MessageComposer() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if(fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!message.trim() && !imageFile) || !user) return;

    setIsSubmitting(true);

    let imageUrl = '';
    // This is a placeholder for image upload. In a real app, you would upload to Firebase Storage.
    if (imageFile) {
        // Simulate upload delay and get a placeholder URL
        await new Promise(res => setTimeout(res, 1000));
        imageUrl = imagePreview!; // In a real app, this would be the URL from Firebase Storage
        toast({
            title: "Image Uploaded",
            description: "Your image is ready to be posted.",
        });
    }

    const postsCollection = collection(firestore, 'forumposts');
    const postData: Omit<ForumPost, 'id' | 'createdAt'> = {
      authorId: user.uid,
      content: message,
      likeCount: 0,
      commentCount: 0,
      likes: [],
    };
    
    if (imageUrl) {
        postData.imageUrl = imageUrl;
    }

    // We don't await this to keep the UI responsive.
    addDocumentNonBlocking(postsCollection, {
      ...postData,
      createdAt: serverTimestamp(),
    });

    setMessage('');
    removeImage();
    setIsSubmitting(false);
  };

  if (!user) {
    return (
      <div className="p-4 border-t text-center">
        <p className="text-muted-foreground">
          <Link href="/login" className="text-primary font-semibold hover:underline">Log in</Link> to join the conversation.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      {imagePreview && (
        <div className="relative w-24 h-24 mb-2">
            <Image src={imagePreview} alt="Image preview" layout="fill" objectFit="cover" className="rounded-md" />
            <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeImage}>
                <X className="h-4 w-4" />
            </Button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Share your experience, ask a question..."
          className="flex-1 resize-none"
          rows={1}
          disabled={isSubmitting}
        />
        <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
        <Button size="icon" variant="ghost" type="button" onClick={() => fileInputRef.current?.click()} disabled={isSubmitting}>
          <ImageIcon />
        </Button>
        <Button size="icon" type="submit" disabled={isSubmitting || (!message.trim() && !imageFile)}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </div>
    </form>
  );
}

const samplePosts: ForumPost[] = [
    {
        id: 'sample1',
        authorId: 'user1',
        content: 'Just organized a weekend cleanup drive at our local park. We collected over 50kg of plastic waste! Small steps make a big difference. Who wants to join the next one?',
        createdAt: new Date(Date.now() - 1000 * 60 * 30),
        likeCount: 15,
        likes: [],
        commentCount: 4,
    },
    {
        id: 'sample2',
        authorId: 'user2',
        content: 'My compost bin is finally producing rich fertilizer! Any tips for using it effectively in a small apartment garden?',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        likeCount: 22,
        likes: [],
        commentCount: 8,
    },
    {
        id: 'sample3',
        authorId: 'user3',
        content: "Blog Post: '5 Creative Ways to Upcycle Your Glass Jars'. Check it out and share your own ideas! I've turned mine into herb planters and candle holders.",
        imageUrl: 'https://picsum.photos/seed/glassjars/600/400',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        likeCount: 45,
        likes: [],
        commentCount: 12,
    },
     {
        id: 'sample4',
        authorId: 'user4',
        content: "Let's start a campaign to get local cafes to offer discounts for reusable cups! Who's with me? #BringYourOwnCup",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        likeCount: 78,
        likes: [],
        commentCount: 25,
    },
];

export default function ForumPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const postsQuery = useMemoFirebase(
    () => query(collection(firestore, 'forumposts'), orderBy('createdAt', 'asc'), limit(50)),
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<ForumPost>(postsQuery);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [posts]);
  
  const displayPosts = (posts && posts.length > 0) ? posts : samplePosts;

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center">
      <Card className="w-full max-w-4xl flex flex-col h-[80vh]">
        <CardHeader className="text-center border-b">
          <CardTitle className="font-headline text-2xl">Community Forum</CardTitle>
          <CardDescription>Share, learn, and connect with fellow eco-warriors.</CardDescription>
        </CardHeader>
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading && !posts ? (
            <div className="flex justify-center items-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {displayPosts.map(post => (
                <PostCard key={post.id} post={post} isCurrentUser={user?.uid === post.authorId} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <MessageComposer />
      </Card>
    </div>
  );
}
