"use client"
import { CircleUser, Menu, Package2, } from 'lucide-react'
import { Button } from '../ui/button'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { ModeToggle } from '../ui/mode-toggle'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu'
import AdminSearch from './admin-search'
import Link from 'next/link'
// import {
//     Breadcrumb,
//     BreadcrumbItem,
//     BreadcrumbLink,
//     BreadcrumbList,
//     BreadcrumbPage,
//     BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb"


export default function AdminHeader() {
    return (
        <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
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
                            className="flex items-center gap-2 text-lg font-semibold "
                        >
                            <Package2 className="h-6 w-6 " />
                            <span className="sr-only ">ArtAuct</span>
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Orders
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Products
                        </Link>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground"
                        >
                            Customers
                        </Link>
                        <Link href="#" className="hover:text-foreground">
                            Settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>

            <div className="w-full flex-1 items-center">
                <AdminSearch/>
            </div>
            {/* <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="#">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="#">Orders</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Recent Orders</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb> */}
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
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </header>
    )
}
