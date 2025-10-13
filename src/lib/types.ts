
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    ecoPoints?: number;
    level?: string;
}

export interface ForumPost {
    id: string;
    authorId: string;
    content: string;
    mediaUrl?: string;
    mediaType?: 'image' | 'video';
    likeCount: number;
    commentCount: number;
    createdAt: Timestamp;
}

export interface PostComment {
    id: string;
    authorId: string;
    content: string;
    createdAt: Timestamp;
}

export interface PostLike {
    userId: string;
}

    