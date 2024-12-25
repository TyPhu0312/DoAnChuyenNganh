"use client";
import Admin from "@/app/admin/page";
import OrderDetailsDialog from "@/components/features/OrderDetailsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCurrencyVND } from "@/lib/utils/currencyFormatter";
import axios from "axios";
import { MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";

export default function OrderManagement() {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setDetailDialogOpen] = useState(false);

  const [orderDetails, setOrderDetails] = useState<any[]>([]); // For storing order details
  const [productDetails, setProductDetails] = useState<any>({}); //


  useEffect(() => {
    fetchOrders();  // Fetch orders on component mount
  }, []);

  // Fetch orders from the API
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/order/");
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setOrders(data);
      } else {
        console.error("API response is not an array", response.data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Error loading orders.");
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




  // Handle saving order status
  const handleSaveStatus = (id: string, newStatus: string) => {
    if (!newStatus.trim()) return;

    // Update status in the local state before API call
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status: newStatus } : order
      )
    );

    // Send the updated status to the server
    axios
      .put(`http://localhost:5000/api/admin/order/updatestatus/${id}`, { status: newStatus })
      .then((response) => {
      })
      .catch((error) => {
        console.error("Error updating status", error);
        alert("There was an error updating the status.");
      })
      .finally(() => {
        setDialogOpen(false);
        setSelectedOrder(null);
      });
  };
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/order/delete/${orderId}`);

      fetchOrders(); // Refresh products
      alert("Order deleted successfully!");
      // setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Failed to delete the order. Please try again.");
    }
  };

  // Handle viewing order details
  const handleViewDetails = (order: any) => {
    setSelectedOrder(order)
    fetchOrderDetails(order.id);  // Fetch order details and products
    setDetailDialogOpen(true); // Open the details dialog
  };

  return (
    <Admin>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Order Management</CardTitle>
          <CardDescription>List of all orders in your store.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Customer Email</TableHead>
                <TableHead>Customer Phone</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customerName}</TableCell>
                  <TableCell>{formatCurrencyVND(order.total_amount)}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.customerEmail}</TableCell>
                  <TableCell>{order.customerPhone}</TableCell>
                  <TableCell>{order.paymentMethod}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right space-x-2">
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
                        <DropdownMenuItem onClick={() => { setSelectedOrder(order); setDialogOpen(true); }}>
                          Edit Status
                        </DropdownMenuItem>
                        {/* <DropdownMenuItem onClick={() => handleDeleteOrder(order.id)}>
                          Delete
                        </DropdownMenuItem> */}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog for Edit Status */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <OrderForm
              orderId={selectedOrder.id}
              currentStatus={selectedOrder.status}
              onSave={handleSaveStatus}
              onCancel={() => setDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Delete Order */}
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc muốn xóa đơn hàng này?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>Hủy</Button>
            <Button variant="destructive" onClick={() => selectedOrder && handleDeleteOrder(selectedOrder.id)}>Xóa</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Dialog for View Order Details */}

      <OrderDetailsDialog
        isDetailDialogOpen={isDetailDialogOpen}
        setDetailDialogOpen={setDetailDialogOpen}
        selectedOrder={selectedOrder}
        orderDetails={orderDetails}
        productDetails={productDetails}
      />


    </Admin>
  );
}

// Order Form for updating order status
function OrderForm({
  orderId,
  currentStatus,
  onSave,
  onCancel,
}: {
  orderId: string;
  currentStatus: string;
  onSave: (id: string, status: string) => void;
  onCancel: () => void;
}) {
  const [status, setStatus] = useState(currentStatus); // Set the initial status from currentStatus

  const statuses = ["pending", "paid", "completed", "processing", "cancelled"];

  const handleSubmit = () => {
    if (!status.trim()) return;
    onSave(orderId, status);
  };

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Order Status</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-2 block w-full border-gray-300 rounded-md shadow-sm"
        >
          {statuses.map((statusOption) => (
            <option key={statusOption} value={statusOption}>
              {statusOption}
            </option>
          ))}
        </select>
      </div>
      <DialogFooter>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogFooter>
    </div>
  );
}
