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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface User {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    providerName: string;
    roleName: string;
    roleId: string;
    address:string;
}

export default function User() {
    const [users, setUsers] = useState<any[]>([]);
    const [roles, setRoles] = useState<any[]>([]);
    const [showAlert, setShowAlert] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null); 
    const [selectedRole, setSelectedRole] = useState<string>("");

    
    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/user");
            const data = response.data.data || response.data;
            if (Array.isArray(data)) {
                setUsers(data); // Nếu dữ liệu là mảng, set vào state
            } else {
                console.error("API response is not an array", response.data);
                setUsers([]); // Nếu không phải mảng, set về mảng rỗng
            }
        } catch (err) {
            console.log(err);
            setUsers([]); // Nếu có lỗi, fallback về mảng rỗng
        }
    };

    const fetchRoles = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/admin/role");
            const data = response.data.data || response.data;
            console.log(data);
            if (Array.isArray(data)) {
                setRoles(data);
            } else {
                console.error("API response is not an array", response.data);
                setRoles([]);
            }
        } catch (err) {
            console.error("Error fetching roles", err);
        }
    };

    const handleDeleteClick = (user: any) => {
        setSelectedUser(user);
        
    };
    const handleEditRole = (user: any) => {
        setSelectedUser(user);
        setSelectedRole(user.roleId);
    };
    const handleChangeRole = async (userId: string, newRoleId: string) => {
        try {
            // Gửi yêu cầu thay đổi role
            const response = await axios.put(`http://localhost:5000/api/admin/user/${userId}/role`, { roleId: newRoleId });
            
            if (response.status === 200) {
                // Cập nhật lại danh sách người dùng sau khi thay đổi role
                const updatedUsers = users.map(user => {
                    if (user.id === userId) {
                        // Tìm tên role từ danh sách roles
                        const newRole = roles.find(role => role.id === newRoleId);
                        return { 
                            ...user, 
                            roleId: newRoleId, 
                            roleName: newRole ? newRole.name : user.roleName // Cập nhật roleName
                        };
                    }
                    return user;
                });
                setUsers(updatedUsers); // Cập nhật lại state users
                alert("Role updated successfully!");
                setSelectedUser(null);
            }
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role.");
        }
    };


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
                                <TableRow key={user.id}>
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
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button
                                                    aria-haspopup="true"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <MoreHorizontal className="h-4 w-4" />
                                                    <span className="sr-only">Toggle menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => handleEditRole(user)}
                                                    className="mr-2">
                                                    Edit
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
            {selectedUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-4 rounded-lg">
                        <h3 className="text-lg font-bold">Change Role for {selectedUser.lastname} {selectedUser.firstname}</h3>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            className="mt-2 border p-2 rounded"
                        >
                            {roles.map(role => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </select>
                        <div className="mt-4">
                            <Button onClick={() => handleChangeRole(selectedUser.id, selectedRole)}>
                                Change Role
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => setSelectedUser(null)} // Đóng dialog
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Admin>
    )
}
