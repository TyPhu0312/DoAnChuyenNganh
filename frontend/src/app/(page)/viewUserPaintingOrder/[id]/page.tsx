"use client";
import React, { useEffect, useState } from "react";
import { useUser } from '@clerk/clerk-react';
import axios from "axios";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Định nghĩa kiểu dữ liệu
type Request = {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export default function CustomPaintingList() {
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isSignedIn, user, isLoaded } = useUser();

    useEffect(() => {
        const userId = user?.id;
        axios
            .get(`http://localhost:5000/api/admin/custompainting/user/${userId}`)
            .then((response) => {
                const { data } = response.data; // Lấy dữ liệu từ API
                setRequests(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi tải yêu cầu đặt vẽ tranh:", err);
                setError("Không thể tải danh sách yêu cầu.");
                setLoading(false);
            });
    }, [isLoaded, isSignedIn]);  // Chạy khi người dùng đã đăng nhập và dữ liệu đã sẵn sàng
    const handleClickCard = (id: string) => {
        // Chuyển hướng người dùng đến trang chi tiết của yêu cầu vẽ tranh
        window.location.href = `/viewDetailCustomPainting/${id}`;
    };

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="p-5 bg-white shadow rounded-lg mt-48">
            <h1 className="text-2xl font-bold mb-4">Các yêu cầu đặt tranh</h1>
            {requests.length === 0 ? (
                <p>Bạn chưa có yêu cầu nào.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {requests.map((request) => (
                        <div
                            key={request.id}
                            className="p-4 border rounded-lg shadow cursor-pointer hover:shadow-lg transition-transform duration-300"
                            onClick={() => handleClickCard(request.id)}
                        >
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="font-bold">Tên tranh</TableHead>
                                        <TableHead className="font-bold">Ngày Đặt</TableHead>
                                        <TableHead className="font-bold">Giờ Đặt</TableHead>
                                        {/* Add other headers if needed */}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>{request.name}</TableCell>
                                            <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(request.createdAt).toLocaleTimeString()}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
