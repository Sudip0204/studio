'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Image as ImageIcon, X, Heart, MessageSquare, Shield, PlusCircle } from 'lucide-react';
import { collection, query, orderBy, limit, serverTimestamp, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { ForumPost, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';


function PostAuthor({ authorId }: { authorId: string }) {
    const firestore = useFirestore();
    const authorRef = useMemoFirebase(() => authorId ? doc(firestore, 'users', authorId) : null, [firestore, authorId]);
    const { data: author } = useDoc<UserProfile>(authorRef);

    if (!author) {
        return (
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-sm">Loading...</p>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
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
    e.stopPropagation(); // Prevent dialog from opening when liking
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
    <Dialog>
        <DialogTrigger asChild>
            <div className="group relative aspect-square w-full cursor-pointer overflow-hidden rounded-lg">
                {post.imageUrl ? (
                    <Image src={post.imageUrl} alt="Forum post" fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted p-4">
                        <p className="line-clamp-6 text-sm text-muted-foreground">{post.content}</p>
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100 flex items-center justify-center">
                    <div className="flex items-center gap-6 text-white">
                        <div className="flex items-center gap-2">
                            <Heart className="h-6 w-6" fill={isLiked ? "white" : "none"} />
                            <span className="font-bold">{likeCount}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MessageSquare className="h-6 w-6" />
                            <span className="font-bold">{post.commentCount || 0}</span>
                        </div>
                    </div>
                </div>
            </div>
        </DialogTrigger>
        <DialogContent className="max-w-4xl p-0">
            <div className="grid md:grid-cols-2">
                <div className="relative aspect-square">
                    {post.imageUrl ? (
                        <Image src={post.imageUrl} alt="Forum post" fill className="object-cover rounded-l-lg" />
                     ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted p-8 rounded-l-lg">
                            <p className="text-muted-foreground italic">{post.content}</p>
                        </div>
                    )}
                </div>
                <div className="flex flex-col">
                    <div className="p-4 border-b">
                        <PostAuthor authorId={post.authorId} />
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        <p>{post.content}</p>
                        <p className="text-xs text-muted-foreground">
                            {post.createdAt && formatDistanceToNow((post.createdAt as any).toDate(), { addSuffix: true })}
                        </p>
                    </div>
                    <div className="p-4 border-t flex items-center gap-4">
                        <button onClick={handleLike} className="flex items-center gap-2 text-sm hover:text-primary transition-colors disabled:opacity-50" disabled={!user}>
                            <Heart className={cn("h-5 w-5", isLiked ? 'text-red-500 fill-current' : '')} />
                            <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
                        </button>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MessageSquare className="h-5 w-5" />
                            <span>{post.commentCount || 0} comments</span>
                        </div>
                    </div>
                </div>
            </div>
        </DialogContent>
    </Dialog>
  );
}

function PostComposerDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
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
        // Placeholder for Firebase Storage upload
        await new Promise(res => setTimeout(res, 1500));
        imageUrl = imagePreview!; // In real app, get URL from storage
    }

    const postsCollection = collection(firestore, 'communityPosts');
    addDocumentNonBlocking(postsCollection, {
      authorId: user.uid,
      content,
      imageUrl,
      likes: [],
      commentCount: 0,
      createdAt: serverTimestamp(),
    });

    toast({ title: "Post Created!", description: "Your post is now live in the community forum." });
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
                <div className="grid w-full gap-1.5">
                    <Textarea placeholder="Share your thoughts..." value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
                </div>
                {imagePreview && (
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                        <Image src={imagePreview} alt="Preview" fill objectFit="cover" />
                        <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 rounded-full" onClick={removeImage}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                )}
                <div className="flex justify-between items-center">
                    <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
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
        <Card className="w-full max-w-6xl mx-auto">
            <CardHeader className="text-center border-b">
                <CardTitle className="font-headline text-3xl">Community Forum</CardTitle>
                <CardDescription>Share, learn, and connect with fellow eco-warriors.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
                {isLoading ? (
                    <div className="flex justify-center items-center h-96">
                        <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    </div>
                ) : (
                    posts && posts.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
                            {posts.map(post => <PostCard key={post.id} post={post} />)}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground">
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
