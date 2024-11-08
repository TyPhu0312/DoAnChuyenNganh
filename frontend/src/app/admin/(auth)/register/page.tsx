"use client"; // Đánh dấu là Client Component

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Sử dụng next/navigation thay vì next/router
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

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [username] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false); // Trạng thái loading
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true); // Bắt đầu loading
        try {
            await login(email, password);
            setTimeout(() => {
                router.push('/admin/login'); // Redirect sau khi đăng nhập thành công
            }, 2000);
        } catch (err) {
            setError((err as Error).message);
            setLoading(false); // Kết thúc loading
        } 
    };

    return (

        <div className="flex items-center justify-center min-h-screen">
          {loading && <Spinner />}
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
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
                            <Label htmlFor="password">UserName</Label>
                            <Input
                                type="username"
                                id="username"
                                value={username}
                                // onChange={(e) => setPassword(e.target.value)}
                                placeholder="username"
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

export default RegisterPage;
