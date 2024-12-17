'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
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
import axios from 'axios';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");  // Reset error before making a new attempt

        try {
            const response = await axios.post(
                'http://localhost:5000/api/admin/auth/login',
                { email, password }
            );
            
            if (response.status === 200) {
                // Lưu thông tin người dùng vào localStorage hoặc context
                localStorage.setItem("user", JSON.stringify(response.data));
                localStorage.setItem("authToken", response.data.token);

                // Redirect tới trang admin dashboard
                router.push("/admin/dashboard");
            } else {
                setError("You do not have admin privileges!");
            }
        } catch (err: any) {
            // Lỗi chung khi không thể đăng nhập
            const errorMessage = err?.response?.data?.message || "Failed to login";
            setError(errorMessage);
        } finally {
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
