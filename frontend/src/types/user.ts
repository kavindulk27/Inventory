import { BaseEntity } from './common';

export interface User extends BaseEntity {
    name: string;
    email: string;
    role: 'admin' | 'staff' | 'manager';
}
