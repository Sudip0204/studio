
'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase';
import { addDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Send, Image as ImageIcon, X, Heart, MessageSquare, Hash, Plus, ArrowLeft } from 'lucide-react';
import { collection, query, orderBy, limit, serverTimestamp, doc, arrayUnion, arrayRemove } from 'firebase/firestore';
import type { ForumPost, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const channels = [
  { id: 'general', name: 'General Discussion', icon: Hash },
  { id: 'project-ideas', name: 'Project Ideas', icon: Hash },
  { id: 'event-planning', name: 'Event Planning', icon: Hash },
  { id: 'success-stories', name: 'Success Stories', icon: Hash },
];

function PostAuthor({ authorId }: { authorId: string }) {
    const firestore = useFirestore();
    const authorRef = useMemoFirebase(() => authorId ? doc(firestore, 'users', authorId) : null, [firestore, authorId]);
    const { data: author } = useDoc<UserProfile>(authorRef);
    const { user } = useUser();

    const isCurrentUser = user?.uid === authorId;

    if (!author) {
        return (
            <div className={cn("flex items-center gap-3", isCurrentUser ? "flex-row-reverse" : "")}>
                <Avatar className="h-8 w-8">
                    <AvatarFallback>?</AvatarFallback>
                </Avatar>
                <div className='w-24 h-4 bg-muted rounded-md animate-pulse'></div>
            </div>
        );
    }

    return (
        <div className={cn("flex items-center gap-3", isCurrentUser ? "flex-row-reverse" : "")}>
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
    const isCurrentUser = user?.uid === post.authorId;

    return (
        <div className={cn("flex items-start gap-3 w-full", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
             <div className="flex-shrink-0 mt-4">
                 <PostAuthor authorId={post.authorId} />
             </div>
            <div className={cn(
                "max-w-xl rounded-lg p-3 space-y-2",
                isCurrentUser ? "bg-primary text-primary-foreground rounded-br-none" : "bg-muted rounded-bl-none"
            )}>
                {post.title && <h3 className='font-bold'>{post.title}</h3>}
                <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                {post.imageUrl && (
                    <div className="relative aspect-video rounded-md overflow-hidden mt-2">
                        <Image src={post.imageUrl} alt="Post image" fill className="object-cover"/>
                    </div>
                )}
                <p className={cn("text-xs", isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    {post.createdAt && formatDistanceToNow((post.createdAt as any).toDate(), { addSuffix: true })}
                </p>
            </div>
        </div>
    );
}

function PostComposer({ onPost, isPosting }: { onPost: (title: string, content: string) => void, isPosting: boolean }) {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');

  const handlePost = () => {
    if (!content.trim()) return;
    onPost(title, content);
    setTitle('');
    setContent('');
  };

  return (
    <div className="border-t p-4 bg-background space-y-2">
        <Input 
            placeholder="Title (optional)" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            className="bg-muted border-none"
        />
        <div className="relative">
            <Textarea
                placeholder="Type your message..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="pr-20 bg-muted border-none"
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handlePost();
                    }
                }}
            />
            <Button 
                size="icon" 
                className="absolute right-2 bottom-2 h-10 w-10" 
                onClick={handlePost} 
                disabled={isPosting || !content.trim()}
            >
                {isPosting ? <Loader2 className="animate-spin" /> : <Send />}
            </Button>
        </div>
    </div>
  );
}

export default function ForumPage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeChannel, setActiveChannel] = useState('general');

  const postsQuery = useMemoFirebase(
    () => query(collection(firestore, 'communityPosts'), orderBy('createdAt', 'asc'), limit(100)),
    [firestore]
  );
  const { data: posts, isLoading: isPostsLoading } = useCollection<ForumPost>(postsQuery);

  const handlePostSubmit = (title: string, content: string) => {
    if (!user) {
      toast({ variant: "destructive", title: "Not Logged In", description: "You must be logged in to post."});
      return;
    }
    setIsSubmitting(true);
    const postsCollection = collection(firestore, 'communityPosts');
    addDocumentNonBlocking(postsCollection, {
      authorId: user.uid,
      title,
      content,
      imageUrl: '', // For simplicity, image upload is not in this version of composer
      likes: [],
      commentCount: 0,
      createdAt: serverTimestamp(),
      channel: activeChannel,
    });

    toast({ title: "Post Created!", description: "Your message is now live in the forum." });
    setIsSubmitting(false);
  };
  
  const isLoading = isUserLoading || isPostsLoading;

  return (
    <div className="container mx-auto py-8 px-4">
        <Card className="h-[80vh] w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 overflow-hidden">
            {/* Sidebar */}
            <div className={cn(
                "col-span-1 border-r bg-muted/50 p-4 flex-col",
                activeChannel && "hidden md:flex"
            )}>
                 <CardTitle className="font-headline text-2xl px-2">Channels</CardTitle>
                 <div className="mt-4 space-y-1">
                     {channels.map(channel => (
                        <Button
                            key={channel.id}
                            variant={activeChannel === channel.id ? "secondary" : "ghost"}
                            className="w-full justify-start gap-2"
                            onClick={() => setActiveChannel(channel.id)}
                        >
                            <channel.icon className="h-5 w-5" />
                            {channel.name}
                        </Button>
                     ))}
                 </div>
                 <div className="mt-auto">
                    <Button variant="outline" className="w-full">
                        <Plus className="mr-2" /> New Channel
                    </Button>
                 </div>
            </div>

            {/* Main Chat Area */}
            <div className={cn(
                "col-span-1 md:col-span-3 flex flex-col",
                !activeChannel && "hidden md:flex"
            )}>
                <div className="border-b p-4 flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setActiveChannel('')}>
                        <ArrowLeft />
                    </Button>
                    <Hash className="h-6 w-6 text-muted-foreground" />
                    <h2 className="font-semibold text-lg">{channels.find(c => c.id === activeChannel)?.name}</h2>
                </div>
                <div className="flex-1 p-6 space-y-6 overflow-y-auto">
                     {isLoading ? (
                         <div className="flex justify-center items-center h-full">
                             <Loader2 className="h-8 w-8 animate-spin text-primary"/>
                         </div>
                     ) : (
                         posts && posts.length > 0 ? (
                             posts.map(post => <PostCard key={post.id} post={post} />)
                         ) : (
                              <div className="text-center text-muted-foreground mt-20">
                                <MessageSquare className="h-12 w-12 mx-auto mb-2"/>
                                <p>No posts in this channel yet.</p>
                                <p className="text-sm">Be the first to start a conversation!</p>
                            </div>
                         )
                     )}
                </div>
                {user ? (
                     <PostComposer onPost={handlePostSubmit} isPosting={isSubmitting} />
                ) : (
                    <div className="border-t p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">Please log in to join the conversation.</p>
                        <Button asChild size="sm">
                            <Link href="/login">Login or Sign Up</Link>
                        </Button>
                    </div>
                )}
            </div>
        </Card>
    </div>
  );
}
