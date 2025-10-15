
'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Image as ImageIcon, X, Heart, MessageSquare, PlusCircle } from 'lucide-react';
import { collection, query, orderBy, limit, serverTimestamp, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { ForumPost, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

function PostAuthor({ authorId }: { authorId: string }) {
    const firestore = useFirestore();
    const authorRef = useMemoFirebase(() => authorId ? doc(firestore, 'users', authorId) : null, [firestore, authorId]);
    const { data: author } = useDoc<UserProfile>(authorRef);

    if (!author) {
        return (
            <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <div className='w-24 h-4 bg-muted rounded-md animate-pulse'></div>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
                <AvatarImage src={author?.photoURL || undefined} alt={author?.name || ''} />
                <AvatarFallback>{author?.name?.[0].toUpperCase() || 'U'}</AvatarFallback>
            </Avatar>
            <p className="font-semibold text-sm truncate">{author?.name || 'Eco-Warrior'}</p>
        </div>
    );
}

function PostCard({ post }: { post: ForumPost }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);

  useEffect(() => {
    if (user && post.likes) {
      setIsLiked(post.likes.includes(user.uid));
    }
  }, [user, post.likes]);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    const postRef = doc(firestore, 'communityPosts', post.id);
    
    const newLikeStatus = !isLiked;
    const newLikeCount = newLikeStatus ? likeCount + 1 : likeCount - 1;

    setIsLiked(newLikeStatus);
    setLikeCount(newLikeCount);

    updateDocumentNonBlocking(postRef, {
      likes: newLikeStatus ? arrayUnion(user.uid) : arrayRemove(user.uid),
    });
  };

  return (
    <div className="group relative bg-card p-4 rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 flex gap-4 items-start">
        <div className='flex-shrink-0'>
            <PostAuthor authorId={post.authorId} />
        </div>
        <div className="flex-grow">
            <div className='flex justify-between items-center'>
                 <p className="text-xs text-muted-foreground">
                    {post.createdAt && formatDistanceToNow((post.createdAt as any).toDate(), { addSuffix: true })}
                </p>
                <div className='flex items-center gap-4'>
                     <button onClick={handleLike} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors disabled:opacity-50" disabled={!user}>
                        <Heart className={cn("h-4 w-4", isLiked ? 'text-red-500 fill-current' : '')} />
                        <span>{likeCount}</span>
                    </button>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.commentCount || 0}</span>
                    </div>
                </div>
            </div>
            <div className="mt-2 space-y-2">
                 {post.title && <h3 className='font-bold'>{post.title}</h3>}
                 <p className="text-sm text-foreground/90 whitespace-pre-wrap">{post.content}</p>
                 {post.imageUrl && (
                    <div className="relative aspect-video rounded-md overflow-hidden mt-2">
                        <Image src={post.imageUrl} alt="Post image" fill className="object-cover"/>
                    </div>
                 )}
            </div>
        </div>
    </div>
  );
}

function PostComposerDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
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
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setImageFile(null);
    if(fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if ((!content.trim() && !imageFile) || !user) return;
    setIsSubmitting(true);

    let imageUrl = '';
    if (imageFile) {
        // In a real app, this would upload to Firebase Storage and get a URL
        // For this demo, we'll just use the base64 preview URL.
        await new Promise(res => setTimeout(res, 1500));
        imageUrl = imagePreview!;
        toast({ title: "Image 'uploaded'!", description: "In a real app, this would be in Firebase Storage."});
    }

    const postsCollection = collection(firestore, 'communityPosts');
    addDocumentNonBlocking(postsCollection, {
      authorId: user.uid,
      title,
      content,
      imageUrl,
      likes: [],
      commentCount: 0,
      createdAt: serverTimestamp(),
    });

    toast({ title: "Post Created!", description: "Your post is now live in the community forum." });
    setTitle('');
    setContent('');
    removeImage();
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Create a New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
                <Input placeholder="Title (optional)" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea placeholder="Share your thoughts, experiences, or questions with the community..." value={content} onChange={(e) => setContent(e.target.value)} rows={5} />
                
                {imagePreview && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                        <Image src={imagePreview} alt="Preview" fill objectFit="cover" />
                        <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={removeImage}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <div className="flex justify-between items-center">
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                        <ImageIcon className="mr-2 h-4 w-4" /> Add Image
                    </Button>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
                    
                    <Button onClick={handleSubmit} disabled={isSubmitting || (!content.trim() && !imageFile)}>
                        {isSubmitting ? <Loader2 className="animate-spin mr-2" /> : <Send className="mr-2 h-4 w-4" />}
                        Post
                    </Button>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default function ForumPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);

  const postsQuery = useMemoFirebase(
    () => query(collection(firestore, 'communityPosts'), orderBy('createdAt', 'desc'), limit(50)),
    [firestore]
  );
  const { data: posts, isLoading: isPostsLoading } = useCollection<ForumPost>(postsQuery);

  const isLoading = isUserLoading || isPostsLoading;

  return (
    <div className="container mx-auto py-12 px-4">
        <Card className="w-full max-w-3xl mx-auto bg-muted/30">
            <CardHeader className="text-center border-b bg-card rounded-t-lg">
                <CardTitle className="font-headline text-3xl">Community Forum</CardTitle>
                <CardDescription>Share, learn, and connect with fellow eco-warriors.</CardDescription>
            </CardHeader>
            <CardContent className="p-2 md:p-4">
                {isLoading ? (
                    <div className="space-y-4 mt-4">
                        {[...Array(3)].map((_, i) => 
                            <div key={i} className="bg-card p-4 rounded-lg flex gap-4 items-start">
                                <Avatar className="h-10 w-10 animate-pulse bg-muted-foreground/20" />
                                <div className="space-y-2 flex-grow">
                                    <div className='h-4 w-1/4 bg-muted rounded-md animate-pulse'></div>
                                    <div className='h-4 w-full bg-muted rounded-md animate-pulse'></div>
                                    <div className='h-4 w-3/4 bg-muted rounded-md animate-pulse'></div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    posts && posts.length > 0 ? (
                        <div className="space-y-3 mt-4">
                            {posts.map(post => <PostCard key={post.id} post={post} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-80 text-center text-muted-foreground">
                            <MessageSquare className="h-16 w-16 mb-4" />
                            <p className="font-semibold text-lg">It's quiet in here...</p>
                            <p>Be the first to share something with the community!</p>
                        </div>
                    )
                )}
            </CardContent>
        </Card>

        {user ? (
            <>
                <Button 
                    className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
                    onClick={() => setCreatePostOpen(true)}
                >
                    <PlusCircle className="h-8 w-8" />
                </Button>
                <PostComposerDialog open={isCreatePostOpen} onOpenChange={setCreatePostOpen} />
            </>
        ) : (
            <Card className="fixed bottom-6 right-6 p-4 rounded-lg shadow-lg bg-background border max-w-sm">
                <CardDescription className="text-sm mb-3">You need to be logged in to post.</CardDescription>
                <Button asChild className="w-full">
                    <Link href="/login">Login or Sign Up</Link>
                </Button>
            </Card>
        )}
    </div>
  );
}
