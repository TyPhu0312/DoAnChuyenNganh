"use client"
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Admin from "../page"; // Layout Admin
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

// Define Order interface with essential fields
interface Order {
  id: string;
  status: string;
  customer: string;
  totalAmount: number;
  orderItems: string; // Or a more complex structure, depending on your order data
}

interface OrderFormProps {
  order: Order | null;
  onSave: (order: Order) => void;
  onCancel: () => void;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false); // Manage dialog state
  const [editingOrder, setEditingOrder] = useState<Order | null>(null); // Order to edit
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false); // Delete dialog state
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null); // Order to delete

  useEffect(() => {
    fetchOrders(); // Fetch orders on component mount
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
  // Handle saving order status
  const handleSaveStatus = async (order: Order) => {
    if (!order.status) {
      alert("Please select a valid order status.");
      return;
    }
    try {
      // Gửi yêu cầu PUT để cập nhật trạng thái đơn hàng
      const response = await axios.put(
        `http://localhost:5000/api/admin/order/update/${order.id}`,
        { status: order.status }
      );
      // Cập nhật đơn hàng trong state
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.id === order.id ? { ...o, status: order.status } : o))
      );
      alert("Order status updated successfully!");
      setDialogOpen(false); // Đóng dialog sau khi lưu
      setEditingOrder(null); // Reset trạng thái chỉnh sửa
    } catch (err) {
      console.error("Error saving order:", err);
      alert("Unable to update order. Please try again.");
    }
  };
  const handleDeleteOrder = async (orderId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/order/delete/${orderId}`);
      setOrders(orders.filter(order => order.id !== orderId)); 
      setDeleteDialogOpen(false); 
      alert("Order deleted successfully!");
    } catch (err) {
      console.error("Error deleting order:", err);
      alert("Unable to delete order. Please try again.");
    }
  };
  // View order details (optional - if you need a detailed modal for the order)
  const handleViewDetails = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (order) {
      console.log("View details of order", order);
    }
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
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.totalAmount}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" onClick={() => { setEditingOrder(order); setDialogOpen(true); }}>
                      Edit Status
                    </Button>
                    <Button size="sm" onClick={() => handleViewDetails(order.id)}>
                      View Details
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() =>handleDeleteOrder(order.id)}>
                      Delete
                    </Button>
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
            <DialogTitle>Edit Order Status</DialogTitle>
          </DialogHeader>
          <OrderForm
            order={editingOrder}
            onSave={handleSaveStatus}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog for Delete Order */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen} modal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this order?</DialogTitle>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => orderToDelete && handleDeleteOrder(orderToDelete.id)}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Admin>
  );
};

// Order Form for updating order status
function OrderForm({ order, onSave, onCancel }: OrderFormProps) {
  const [status, setStatus] = useState(order ? order.status : "");

  const handleSubmit = () => {
    if (!status.trim()) return;

    const orderToSave: Order = {
      id: order ? order.id : "",
      status,
      customer: order ? order.customer : "",
      totalAmount: order ? order.totalAmount : 0,
      orderItems: order ? order.orderItems : "",
    };

    onSave(orderToSave); // Pass the order to the parent (OrderManagement)
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Order Status"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        required
      />
      <DialogFooter>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogFooter>
    </div>
  );
}
