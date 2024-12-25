"use client";

import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { formatCurrencyVND } from "@/lib/utils/currencyFormatter";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import OrderDetailsDialog from "@/components/features/OrderDetailsDialog";

export default function CustomerOrders({ userId }: { userId: string }) {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [orderDetails, setOrderDetails] = useState<any[]>([]);
    const [productDetails, setProductDetails] = useState<any>({});
    const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);

    useEffect(() => {
        fetchCustomerOrders();
    }, []);

    const fetchCustomerOrders = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/order/getbyuserid/${userId}`);
            setOrders(response.data.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
            setError("Unable to load orders. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    const fetchOrderDetails = async (orderId: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/orderdetail/byorderid/${orderId}`);
            const orderDetailsData = response.data.data; // Assuming orderDetailsData is the array of order details
            setOrderDetails(orderDetailsData);

            // Fetch product details for each product in the order
            const productFetchPromises = orderDetailsData.map((detail: any) => fetchProductDetails(detail.productId));
            await Promise.all(productFetchPromises); // Đợi tất cả API hoàn tất
            console.log("mang la", productDetails);
        } catch (err) {
            console.error("Error fetching order details:", err);
        }
    };

    // Hàm fetchProductDetails cập nhật mảng các chi tiết sản phẩm
    const fetchProductDetails = async (productId: string) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/admin/products/${productId}`);
            const productDetail = response.data.ProductDetail || response.data; // Kiểm tra cả hai trường hợp

            setProductDetails((prevDetails: any[]) => ({
                ...prevDetails,
                [productId]: productDetail,
            }));
        } catch (err) {
            console.error("Error fetching product details:", err);
        }
    };
    const handleViewDetails = (order: any) => {
        setSelectedOrder(order)
        fetchOrderDetails(order.id);  // Fetch order details and products
        setDetailDialogOpen(true); // Open the details dialog
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <main className="flex flex-col bg-[#f9f9f9] min-h-screen p-4 mt-48">
            <Card>
                <CardHeader>
                    <CardTitle>All Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    {orders.length === 0 ? (
                        <p className="text-center text-gray-500">Bạn chưa có đơn hàng nào.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold">Đơn hàng</TableHead>
                                    <TableHead className="font-bold">Total Amount</TableHead>
                                    <TableHead className="font-bold">Status</TableHead>
                                    <TableHead className="font-bold">Payment Method</TableHead>
                                    <TableHead className="font-bold">Created At</TableHead>
                                    <TableHead className="font-bold">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>Đơn hàng của bạn</TableCell>
                                        <TableCell>{formatCurrencyVND(order.total_amount)}</TableCell>
                                        <TableCell>{order.status}</TableCell>
                                        <TableCell>{order.paymentMethod}</TableCell>
                                        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => handleViewDetails(order)}>
                                                        View Details
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
            {/* Dialog for Order Details */}
            <OrderDetailsDialog
                isDetailDialogOpen={isDetailDialogOpen}
                setDetailDialogOpen={setDetailDialogOpen}
                selectedOrder={selectedOrder}
                orderDetails={orderDetails}
                productDetails={productDetails}
            />
        </main>
    );
}
