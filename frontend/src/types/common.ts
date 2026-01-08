export interface BaseEntity {
    id: string;
    createdAt: string;
    updatedAt: string;
}

export type Status = 'idle' | 'loading' | 'succeeded' | 'failed';
