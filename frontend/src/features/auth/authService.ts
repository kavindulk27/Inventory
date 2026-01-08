import api from '../../services/api';
import { AuthResponse, LoginCredentials } from './authTypes';

const authService = {
    login: (credentials: LoginCredentials) => api.post<AuthResponse>('/auth/login', credentials),
    register: (data: any) => api.post<AuthResponse>('/auth/register', data),
    logout: () => api.post('/auth/logout', {}),
};

export default authService;
