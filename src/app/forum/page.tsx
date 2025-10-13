
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Users, Loader2 } from 'lucide-react';
import type { ForumPost, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

// Component to display a single post author's details
function PostAuthor({ authorId }: { authorId: string }) {
  const [author, setAuthor] = useState<UserProfile | null>(null);
  const firestore = useFirestore();

  useEffect(() => {
    if (!authorId) return;
    const userDocRef = doc(firestore, 'users', authorId);
    getDoc(userDocRef).then(docSnap => {
      if (docSnap.exists()) {
        setAuthor(docSnap.data() as UserProfile);
      }
    });
  }, [authorId, firestore]);

  if (!author) {
    return (
      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-sm">Loading...</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-8 w-8">
        <AvatarImage src={author.photoURL} />
        <AvatarFallback>{author.name?.[0] || 'U'}</AvatarFallback>
      </Avatar>
      <span className="font-semibold text-sm">{author.name}</span>
    </div>
  );
}


// Component for a single post card
function PostCard({ post, isCurrentUser }: { post: ForumPost & { id: string }, isCurrentUser: boolean }) {
  
  const postDate = post.createdAt instanceof Timestamp ? post.createdAt.toDate() : new Date();

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
       {!isCurrentUser && (
         <Avatar className="h-8 w-8 self-start">
             {/* This will be replaced by a proper author component later */}
         </Avatar>
       )}
        <div className={`max-w-xl rounded-lg px-4 py-2 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {!isCurrentUser && <PostAuthor authorId={post.authorId} />}
            <p className="text-sm mt-1 whitespace-pre-wrap">{post.content}</p>
            <p className="text-xs opacity-70 mt-2 text-right">
                {postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        </div>
    </div>
  );
}

// Component for the message composer
function MessageComposer() {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(firestore, 'forumposts'), {
        authorId: user.uid,
        content: content,
        createdAt: serverTimestamp(),
        likeCount: 0,
        commentCount: 0,
      });
      setContent('');
    } catch (error) {
      console.error("Error adding document: ", error);
       toast({
        variant: "destructive",
        title: "Post Failed",
        description: "Could not send your message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t p-4 bg-background">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your experience, ask a question, or start a campaign..."
        className="flex-1 resize-none"
        rows={1}
        onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
            }
        }}
      />
      <Button type="submit" size="icon" disabled={isSubmitting || !content.trim()}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
      </Button>
    </form>
  );
}


export default function ForumPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const scrollRef = useRef<HTMLDivElement>(null);

  const postsQuery = useMemoFirebase(() =>
    query(collection(firestore, 'forumposts'), orderBy('createdAt', 'asc')),
    [firestore]
  );
  const { data: posts, isLoading } = useCollection<ForumPost>(postsQuery);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [posts]);

  return (
    <div className="container mx-auto py-12 px-4 flex justify-center">
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
             <CardHeader className="text-center border-b">
                <div className="mx-auto bg-primary/10 rounded-full p-3 w-fit mb-2">
                    <Users className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="font-headline text-2xl">Community Forum</CardTitle>
                <CardDescription>Share experiences and organize for a greener world.</CardDescription>
            </CardHeader>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {isLoading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {!isLoading && posts && posts.map(post => (
                    <PostCard key={post.id} post={post} isCurrentUser={user?.uid === post.authorId} />
                ))}
                 {!isLoading && !posts?.length && (
                    <div className="text-center text-muted-foreground pt-16">
                        <p>No messages yet. Be the first to start a conversation!</p>
                    </div>
                )}
            </div>

            {user ? (
                <MessageComposer />
            ) : (
                <div className="border-t p-4 text-center bg-muted">
                    <p className="text-sm text-muted-foreground">
                        <Link href="/login" className="text-primary font-semibold hover:underline">Log in</Link> to join the conversation.
                    </p>
                </div>
            )}
        </Card>
    </div>
  );
}
