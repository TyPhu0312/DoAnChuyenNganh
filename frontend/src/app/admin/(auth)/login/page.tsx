"use client"; 

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '../../api/auth/auth';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from '@/components/features/spinner';
import { useUsers } from '@/components/features/userContext'; // Import UserContext

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();
    const { setUser } = useUsers(); // Access setUser from context

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await login(email, password);
            const userData = response.data; // Giả sử response trả về thông tin người dùng

            // Lưu thông tin người dùng vào context
            setUser({
                email: userData.email,
                name: userData.name,
                phone: userData.phone,
                address: userData.address,
            });

            setTimeout(() => {
                router.push('/admin/dashboard');
            }, 2000);
        } catch (err) {
            setError((err as Error).message);
            setLoading(false);
        } 
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            {loading && <Spinner />}
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email below to login to your account.
                        {error && <p className="text-red-500">{error}</p>}
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <form onSubmit={handleSubmit} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="m@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="password"
                                required
                            />
                        </div>
                        <CardFooter>
                            <Button type="submit" className="w-full" disabled={loading}>
                                Login
                            </Button>
                        </CardFooter>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default LoginPage;
