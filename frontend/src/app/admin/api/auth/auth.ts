'use client';
import axios from 'axios';
import { setCookie } from 'nookies';

export const login = async (email: string, password: string): Promise<any> => {
    try {
        const response = await axios.post('http://localhost:5000/api/auth/adminlogin', {
            email,
            password
        });
        
        const { token } = response.data;

        // Lưu token vào cookie
        setCookie(null, 'token', token, { path: '/' });

        return response.data;
    } catch (error) {
        throw new Error('Đăng nhập không thành công');
    }
};
