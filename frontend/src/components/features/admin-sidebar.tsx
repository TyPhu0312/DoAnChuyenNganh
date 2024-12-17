"use client"
import { Badge, Bell, Home, LineChart, Package, Package2, ShoppingCart, Users } from 'lucide-react'
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { DASHBOARD_SIDEBAR_LINKS } from '../../../public/const/navigations'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export default function AdminSidebar() {
    const pathname = usePathname();
    const isActive = (path: string) =>
        path === pathname;
    return (
        <div className="flex h-full max-h-screen flex-col gap-2 sticky top-0 bg-background">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold">
                    <Image src="/images/logo.png" alt="ArtAuct Logo" width={40} height={40} />
                    <span className="">Artauct</span>
                </Link>
                <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </div>
            <div className="flex-1">
                <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                    {DASHBOARD_SIDEBAR_LINKS.map((items) => (
                        <Link
                            key={items.key}
                            href={items.path}
                            className={`${isActive(items.path) ? 'text-primary bg-slate-100 dark:bg-gray-800' : ''} flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary `}
                        >
                            {items.icon}
                            {items.label}
                        </Link>
                    ))}
                </nav>
            </div>
        </div >
    )
}
