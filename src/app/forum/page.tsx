
'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useUser, useCollection, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  increment,
  orderBy,
  query,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import {
  MessageCircle,
  Heart,
  Share2,
  Plus,
  Send,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from 'lucide-react';
import type { UserProfile, ForumPost, PostLike } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

type PostWithDetails = ForumPost & {
  id: string;
  likedByUser: boolean;
};

// New component to fetch and display a single post's author information
function PostAuthor({ authorId }: { authorId: string }) {
    const firestore = useFirestore();
    const userDocRef = useMemoFirebase(() => doc(firestore, 'users', authorId), [firestore, authorId]);
    const { data: author, isLoading } = useDoc<UserProfile>(userDocRef);

    const timeAgo = 'Just now'; // Fallback, will be replaced by post time in PostCard

    if (isLoading || !author) {
        return (
            <div className="flex items-center gap-2">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-1">
                    <div className="h-4 w-24 rounded-md bg-muted animate-pulse" />
                    <div className="h-3 w-16 rounded-md bg-muted animate-pulse" />
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex items-center gap-4">
             <Avatar>
                <AvatarImage
                src={author?.photoURL || undefined}
                alt={author?.name}
                />
                <AvatarFallback>
                {author?.name?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
            </Avatar>
            <div>
                 <p className="font-semibold">{author?.name || 'Anonymous'}</p>
                 {/* This will be replaced by the actual post time passed to the parent */}
                 <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
        </div>
    );
}


// Hook to get all posts
function useForumPosts() {
  const firestore = useFirestore();
  const postsQuery = useMemoFirebase(() => query(collection(firestore, 'forumposts'), orderBy('createdAt', 'desc')), [firestore]);
  const { data: posts, isLoading } = useCollection<ForumPost>(postsQuery);
  return { posts, isLoadingPosts: isLoading };
}

// Hook to get likes for all posts for the current user
function useAllLikes(postIds: string[], userId?: string) {
    const firestore = useFirestore();
    const [likesMap, setLikesMap] = useState<Map<string, boolean>>(new Map());
    const [isLoading, setIsLoading] = useState(true);

    const memoizedPostIds = useMemo(() => postIds.join(','), [postIds]);

    useEffect(() => {
        if (!userId || postIds.length === 0) {
            setIsLoading(false);
            setLikesMap(new Map());
            return;
        }

        setIsLoading(true);
        const newLikesMap = new Map<string, boolean>();
        const unsubs: (()=>void)[] = [];

        postIds.forEach(postId => {
            const likeRef = doc(firestore, 'forumposts', postId, 'likes', userId);
            const unsub = onSnapshot(likeRef, (doc) => {
                newLikesMap.set(postId, doc.exists());
                 // This is a bit inefficient, cloning the map on every snapshot
                setLikesMap(new Map(newLikesMap));
            });
            unsubs.push(unsub);
        });

        // Simplified loading state.
        setIsLoading(false);
        
        return () => {
            unsubs.forEach(unsub => unsub());
        }

    }, [firestore, memoizedPostIds, userId]);

    return { likesMap, isLoadingLikes: isLoading };
}


function PostCard({ post, onDelete }: { post: PostWithDetails; onDelete: (postId: string) => Promise<void> }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  
  const userDocRef = useMemoFirebase(() => doc(firestore, 'users', post.authorId), [firestore, post.authorId]);
  const { data: author } = useDoc<UserProfile>(userDocRef);

  const timeAgo = post.createdAt
    ? formatDistanceToNow(new Date(post.createdAt.seconds * 1000), {
        addSuffix: true,
      })
    : 'Just now';

  const handleLike = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Please log in to like posts.',
      });
      return;
    }
    const postRef = doc(firestore, 'forumposts', post.id);
    const likeRef = doc(firestore, `forumposts/${post.id}/likes`, user.uid);
    const batch = writeBatch(firestore);

    if (post.likedByUser) {
      batch.delete(likeRef);
      batch.update(postRef, { likeCount: increment(-1) });
    } else {
      batch.set(likeRef, { userId: user.uid });
      batch.update(postRef, { likeCount: increment(1) });
    }
    await batch.commit();
  };

  const handleDelete = async () => {
     if (window.confirm("Are you sure you want to delete this post?")) {
        setIsDeleting(true);
        try {
            await onDelete(post.id);
            toast({ title: "Post deleted successfully." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Failed to delete post." });
            setIsDeleting(false);
        }
     }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex gap-4">
           <Avatar>
            <AvatarImage
              src={author?.photoURL || undefined}
              alt={author?.name}
            />
            <AvatarFallback>
              {author?.name?.[0]?.toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="w-full">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <p className="font-semibold">{author?.name || 'Anonymous'}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
                 {user?.uid === post.authorId && (
                    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isDeleting}>
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4 text-muted-foreground" />}
                    </Button>
                )}
            </div>
            <p className="mt-2 text-sm">{post.content}</p>
            {post.mediaUrl && post.mediaType === 'image' && (
              <div className="mt-4 relative aspect-video rounded-lg overflow-hidden border">
                <Image src={post.mediaUrl} alt="Forum post media" layout="fill" objectFit="cover" />
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-around p-2 border-t">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => alert('Comments coming soon!')}>
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">{post.commentCount || 0}</span>
        </Button>
        <Button variant="ghost" className="flex items-center gap-2" onClick={handleLike}>
          <Heart
            className={`h-5 w-5 ${
              post.likedByUser ? 'text-red-500 fill-current' : ''
            }`}
          />
          <span className="text-xs">{post.likeCount || 0}</span>
        </Button>
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => alert('Share functionality coming soon!')}>
          <Share2 className="h-5 w-5" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function CreatePostForm({ onPostCreated }: { onPostCreated: () => void }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [content, setContent] = useState('');
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || (!content.trim() && !mediaFile)) {
      toast({
        variant: 'destructive',
        title: 'Post content cannot be empty.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // In a real app, you would upload the file to Firebase Storage
      // and get a URL. Here, we'll just use the data URL as a placeholder.
      let mediaUrl: string | undefined = undefined;
      let mediaType: 'image' | 'video' | undefined = undefined;
      if (mediaFile) {
        mediaUrl = mediaPreview!; // Using the base64 preview for now
        mediaType = mediaFile.type.startsWith('image/') ? 'image' : undefined; // Simplified
      }

      await addDoc(collection(firestore, 'forumposts'), {
        authorId: user.uid,
        content,
        mediaUrl,
        mediaType,
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
      });

      setContent('');
      setMediaFile(null);
      setMediaPreview(null);
      onPostCreated();
      toast({ title: 'Post created!' });
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Failed to create post.',
        description: 'Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        placeholder="Share your recycling story..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
      />
      {mediaPreview && (
        <div className="relative aspect-video rounded-lg overflow-hidden border">
           <Image src={mediaPreview} alt="Media preview" layout="fill" objectFit="contain" />
           <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={() => { setMediaFile(null); setMediaPreview(null); }}>
             <Trash2 className="h-4 w-4" />
           </Button>
        </div>
      )}
      <div className="flex justify-between items-center">
        <label htmlFor="media-upload" className="cursor-pointer">
            <ImageIcon className="h-6 w-6 text-primary hover:text-primary/80" />
            <Input id="media-upload" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
        </label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Post
        </Button>
      </div>
    </form>
  );
}

export default function ForumPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [user, isUserLoading, router]);

  const { posts, isLoadingPosts } = useForumPosts();
  
  const postIds = useMemo(() => posts?.map(p => p.id) || [], [posts]);
  const { likesMap, isLoadingLikes } = useAllLikes(postIds, user?.uid);

  const combinedPosts: PostWithDetails[] = useMemo(() => {
    if (!posts) return [];
    return posts.map(post => ({
      ...post,
      likedByUser: likesMap.get(post.id) || false,
    }));
  }, [posts, likesMap]);

  const handleDeletePost = async (postId: string) => {
    // This is a simplified delete. A real app would use a batch to also delete
    // subcollections like comments and likes, or use a Cloud Function.
    await deleteDoc(doc(firestore, "forumposts", postId));
  };


  const isLoading = isLoadingPosts || isLoadingLikes || isUserLoading;

  if (isLoading || !user) {
    return (
      <div className="container mx-auto max-w-2xl py-8 px-4 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <h1 className="font-headline text-3xl font-bold text-center mb-6">
        Community Forum
      </h1>

      <main className="space-y-6">
        {user && (
            <Card>
                <CardContent className="p-6">
                    <CreatePostForm onPostCreated={() => {}} />
                </CardContent>
            </Card>
        )}
        
        {!isLoading && combinedPosts.length === 0 && (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No posts yet. Be the first to share!</p>
            </div>
        )}

        <div className="space-y-4">
            {combinedPosts.map(post => (
                <PostCard key={post.id} post={post} onDelete={handleDeletePost} />
            ))}
        </div>
      </main>

      {user && (
        <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
          <DialogTrigger asChild>
            <Button className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg">
              <Plus className="h-8 w-8" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="font-headline text-2xl">Create a New Post</DialogTitle>
            </DialogHeader>
            <Separator />
            <CreatePostForm onPostCreated={() => setIsCreatePostOpen(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

    