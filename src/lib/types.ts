
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
