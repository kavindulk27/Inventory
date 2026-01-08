import { User } from '../../types/user';

export interface AuthResponse {
    user: User;
    token: string;
}

export interface LoginCredentials {
    email: string;
}
