
import type { Timestamp } from 'firebase/firestore';

export interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    phoneNumber?: string;
    createdAt?: Timestamp;
    // privacySettings?: object; // Define further if needed
    rewardPoints?: number;
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
    title?: string;
    content: string;
    imageUrl?: string;
    likes: string[];
    commentCount: number;
    createdAt: Timestamp | Date;
}

export interface PostComment {
    id: string;
    authorId: string;
    content: string;
    likes?: string[];
    createdAt: Timestamp;
}

export interface PostLike {
    userId: string; // The ID of the user who liked the post/comment
}

export interface LeaderboardEntry {
    userId: string;
    username: string;
    score: number;
    timestamp: Timestamp;
}
