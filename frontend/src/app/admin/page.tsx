"use client"
import AdminHeader from "@/components/features/admin-header"
import AdminSidebar from "@/components/features/admin-sidebar"
import { redirect } from "next/navigation";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";

export default function Admin({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    useEffect(() => {
        // Kiểm tra xem token có trong localStorage hay không
        const token = localStorage.getItem('authToken');
        if (!token) {
            // Redirect về trang login nếu không có token
            router.push('/admin/login');
        }
    }, [router]);
    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-muted/40 md:block">
                <AdminSidebar />
            </div>
            <div className="flex flex-col">
                <AdminHeader />
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
