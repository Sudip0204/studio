
'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { addDoc, collection, doc, getDoc, serverTimestamp, query, orderBy, Timestamp } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Users, Loader2, Paperclip, XCircle } from 'lucide-react';
import type { ForumPost, UserProfile } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

const samplePosts: (ForumPost & { id: string, author: UserProfile })[] = [
  {
    id: 'sample1',
    authorId: 'user1',
    content: "Just finished our weekend beach cleanup drive at Juhu Beach! We collected over 50kg of plastic waste. It was tiring but so rewarding. Huge thanks to everyone who joined. Let's plan the next one for Bandra Bandstand!",
    createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 7200, 0),
    likeCount: 25,
    commentCount: 7,
    imageUrl: 'https://picsum.photos/seed/beachcleanup/600/400',
    author: {
        id: 'user1',
        name: 'Green Warrior Priya',
        email: 'priya@example.com',
        photoURL: 'https://i.pravatar.cc/40?u=user1',
    }
  },
  {
    id: 'sample2',
    authorId: 'user2',
    content: "Quick question: I've been collecting all my plastic bags, but my local recycling center doesn't accept them. Any ideas for upcycling or proper disposal in the Mumbai area?",
    createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 5400, 0),
    likeCount: 12,
    commentCount: 8,
    author: {
        id: 'user2',
        name: 'Recycle Rohan',
        email: 'rohan@example.com',
        photoURL: 'https://i.pravatar.cc/40?u=user2',
    }
  },
  {
    id: 'sample3',
    authorId: 'user3',
    content: "Blog Post: My Journey to a Zero-Waste Kitchen! Hey everyone, I wrote a short blog about the simple swaps I made to drastically reduce waste in my kitchen. From composting to reusable wraps, it's been a game-changer. Hope it inspires some of you! [link-to-blog]",
    createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 3600, 0),
    likeCount: 38,
    commentCount: 12,
    author: {
        id: 'user3',
        name: 'Sustainable Sarah',
        email: 'sarah@example.com',
        photoURL: 'https://i.pravatar.cc/40?u=user3',
    }
  },
  {
    id: 'sample4',
    authorId: 'user4',
    content: "Composting workshop this Sunday at the community garden! We'll cover the basics of setting up your own compost bin. Limited spots available, DM me to register. #composting #organicwaste",
    createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 1800, 0),
    likeCount: 18,
    commentCount: 5,
    author: {
        id: 'user4',
        name: 'EcoAnand',
        email: 'anand@example.com',
        photoURL: 'https://i.pravatar.cc/40?u=user4',
    }
  },
  {
    id: 'sample5',
    authorId: 'user5',
    content: "I have so many glass jars! Any creative ideas on how to reuse them around the house, other than for storage?",
    createdAt: new Timestamp(Math.floor(Date.now() / 1000) - 600, 0),
    likeCount: 9,
    commentCount: 11,
    author: {
        id: 'user5',
        name: 'CreativeMeena',
        email: 'meena@example.com',
        photoURL: 'https://i.pravatar.cc/40?u=user5',
    }
  }
];


// Component to display a single post author's details
function PostAuthor({ authorId, preloadedAuthor }: { authorId: string, preloadedAuthor?: UserProfile }) {
  const [author, setAuthor] = useState<UserProfile | null>(preloadedAuthor || null);
  const firestore = useFirestore();

  useEffect(() => {
    if (preloadedAuthor) return;
    if (!authorId) return;
    const userDocRef = doc(firestore, 'users', authorId);
    getDoc(userDocRef).then(docSnap => {
      if (docSnap.exists()) {
        setAuthor(docSnap.data() as UserProfile);
      }
    });
  }, [authorId, firestore, preloadedAuthor]);

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
        <AvatarImage src={author.photoURL} alt={author.name} />
        <AvatarFallback>{author.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
      </Avatar>
      <span className="font-semibold text-sm">{author.name}</span>
    </div>
  );
}


// Component for a single post card
function PostCard({ post, isCurrentUser, author }: { post: ForumPost & { id: string }, isCurrentUser: boolean, author?: UserProfile }) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (post.createdAt) {
      const postDate = post.createdAt instanceof Timestamp ? post.createdAt.toDate() : new Date();
      // This will only run on the client, preventing hydration mismatch
      setFormattedDate(postDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  }, [post.createdAt]);

  return (
    <div className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
       {!isCurrentUser && (
         <Avatar className="h-8 w-8 self-start">
             <AvatarImage src={author?.photoURL} alt={author?.name} />
             <AvatarFallback>{author?.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
         </Avatar>
       )}
        <div className={`max-w-xl rounded-lg px-4 py-2 ${isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
            {!isCurrentUser && author && <PostAuthor authorId={post.authorId} preloadedAuthor={author} />}
            {post.imageUrl && (
              <div className="relative aspect-video rounded-md overflow-hidden my-2">
                  <Image src={post.imageUrl} alt="Forum post image" layout="fill" objectFit="cover" />
              </div>
            )}
            <p className="text-sm mt-1 whitespace-pre-wrap">{post.content}</p>
            {formattedDate && (
              <p className="text-xs opacity-70 mt-2 text-right">
                  {formattedDate}
              </p>
            )}
        </div>
    </div>
  );
}

// Component for the message composer
function MessageComposer() {
  const [content, setContent] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // This is a mock function. In a real app, you'd upload the file to Firebase Storage
  // and get back a public URL.
  const uploadImageMock = async (file: File): Promise<string> => {
    toast({
        title: "Image Uploading...",
        description: "In a real app, this would upload to cloud storage."
    });
    // Simulate upload delay and return a placeholder URL
    await new Promise(res => setTimeout(res, 1500));
    // In a real app, this would be the actual URL from Firebase Storage
    return `https://picsum.photos/seed/${file.name}/600/400`; 
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !imageFile) || !user) return;

    setIsSubmitting(true);
    
    try {
      let imageUrl: string | undefined = undefined;
      if (imageFile) {
        imageUrl = await uploadImageMock(imageFile);
      }

      const postData: Omit<ForumPost, 'id' | 'createdAt'> & { createdAt: any } = {
        authorId: user.uid,
        content: content,
        likeCount: 0,
        commentCount: 0,
        createdAt: serverTimestamp(),
      };
      
      if (imageUrl) {
        postData.imageUrl = imageUrl;
      }

      await addDoc(collection(firestore, 'forumposts'), postData);

      setContent('');
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

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
  
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if(fileInputRef.current) fileInputRef.current.value = '';
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 border-t p-4 bg-background">
      {imagePreview && (
        <div className="relative w-32 h-32 mb-2">
          <Image src={imagePreview} alt="Image preview" layout="fill" className="rounded-md object-cover" />
          <Button size="icon" variant="destructive" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={removeImage}>
            <XCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div className="flex items-start gap-2">
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
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageChange} className="hidden" />
        <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Paperclip />
        </Button>
        <Button type="submit" size="icon" disabled={isSubmitting || (!content.trim() && !imageFile)}>
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
        </Button>
      </div>
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

  const [authors, setAuthors] = useState<Record<string, UserProfile>>({});
  
  useEffect(() => {
    if (posts) {
      const authorIds = new Set(posts.map(p => p.authorId));
      authorIds.forEach(authorId => {
        if (!authors[authorId]) {
          const userDocRef = doc(firestore, 'users', authorId);
          getDoc(userDocRef).then(docSnap => {
            if (docSnap.exists()) {
              setAuthors(prev => ({...prev, [authorId]: docSnap.data() as UserProfile}));
            }
          });
        }
      });
    }
  }, [posts, firestore, authors]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [posts, authors]);

  const displayPosts = (posts && posts.length > 0) ? posts : samplePosts;
  const showSamplePosts = !posts || posts.length === 0;

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
                {!isLoading && showSamplePosts && samplePosts.map(post => (
                     <PostCard 
                      key={post.id} 
                      post={post} 
                      isCurrentUser={user?.uid === post.authorId}
                      author={(post as any).author || authors[post.authorId]}
                    />
                ))}
                {!isLoading && !showSamplePosts && posts?.map(post => (
                    <PostCard 
                      key={post.id} 
                      post={post} 
                      isCurrentUser={user?.uid === post.authorId}
                      author={authors[post.authorId]}
                    />
                ))}
                 {!isLoading && showSamplePosts && (
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
