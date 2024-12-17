"use client"
import { Badge } from "@/components/ui/badge"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import Admin from "../page"
import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"

export default function User() {
    const [users, setUsers] = useState([]); // Khởi tạo là mảng rỗng
    const [showAlert, setShowAlert] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/api/admin/user")
            .then(response => {
                const data = response.data.data || response.data;
                if (Array.isArray(data)) {
                    setUsers(response.data.data); // Nếu là mảng, set vào state
                } else {
                    console.error("API response is not an array", response.data);
                    setUsers([]); // Nếu không phải mảng, set là mảng rỗng
                }
            })
            .catch(err => {
                console.log(err);
                setUsers([]); // Nếu có lỗi, fallback về mảng rỗng
            });
    }, []);

    const handleDeleteClick = (user: any) => {
        setSelectedUser(user);
        setShowAlert(true);
    }

    return (
        <Admin>
            <Card>
                <CardHeader className="px-7">
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>All User Here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="hidden sm:table-cell">Password</TableHead>
                                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                                <TableHead className="hidden md:table-cell">Provider</TableHead>
                                <TableHead className="hidden md:table-cell">Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user: any) => (
                                <TableRow key={user._id}>
                                    <TableCell className="hidden sm:table-cell">
                                        <Image
                                            alt="Product image"
                                            className="aspect-square rounded-md object-cover"
                                            height="32"
                                            src="/images/logo.png"
                                            width="32"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{user.firstname} {user.lastname}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {user.email}
                                        </div>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell" >
                                        ********
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        {user.phone}
                                    </TableCell>
                                    <TableCell>{user.providerName || "N/A"}</TableCell>
                                    <TableCell>{user.roleName || "N/A"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </Admin>
    )
}
