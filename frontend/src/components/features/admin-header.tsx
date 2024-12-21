'use client';

import { CircleUser, Menu, Package2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { ModeToggle } from '../ui/mode-toggle';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import AdminSearch from './admin-search';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function AdminHeader() {
    const router = useRouter();

    useEffect(() => {
        // Kiểm tra xem token có trong localStorage hay không
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Redirect về trang login nếu không có token
            router.push('/admin/login');
        }
    }, [router]);

    const handleLogout = () => {
        // Xóa token khỏi localStorage
        localStorage.removeItem('authToken');
        localStorage.removeItem('user'); // Xóa thông tin user nếu có

        // Redirect về trang login
        router.push('/admin/login');
    };

    return (
        <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-transparent z-10 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 md:hidden"
                    >
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle navigation menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Link
                            href="#"
                            className="flex items-center gap-2 text-lg font-semibold"
                        >
                            <Package2 className="h-6 w-6" />
                            <span className="sr-only">Artauct</span>
                        </Link>
                        <Link
                            href="/"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/categories"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Categories
                        </Link>
                        <Link
                            href="/custompainting"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            CustomPainting
                        </Link>
                        <Link
                            href="/products"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Products
                        </Link>
                        <Link
                            href="/user"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            User
                        </Link>
                        <Link
                            href="/orders"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Orders
                        </Link>
                        <Link href="#" className="hover:text-foreground">
                            Settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>

            <div className="w-full flex-1">
                <AdminSearch />
            </div>
            <ModeToggle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="rounded-full">
                        <CircleUser className="h-5 w-5" />
                        <span className="sr-only">Toggle user menu</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <button onClick={handleLogout}>
                            Logout
                        </button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
