
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    ecoPoints?: number;
    level?: string;
    highestScore?: number;
    lastRunScore?: number;
    lastRunTimestamp?: Timestamp;
    totalWasteCollected?: {
        plastic?: number;
        cans?: number;
        paper?: number;
        organic?: number;
    };
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

export interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    timestamp: Timestamp;
}
    

    