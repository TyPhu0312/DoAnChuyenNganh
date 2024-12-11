"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useUser } from '@/components/features/userContext';
// Định nghĩa giao diện cho sản phẩm và thông tin người dùng
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

interface UserInfo {
  name: string;
  phone: string;
  address: string;
}

export default function Checkout() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]); 
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    phone: "",
    address: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "">(""); // Lựa chọn phương thức thanh toán
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser(); // Lấy thông tin người dùng từ context

  useEffect(() => {
    // lấy giỏ hàng từ localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    calculateTotal(savedCart);

    // Nếu đã có thông tin người dùng, tự động điền vào form
    if (user) {
      setUserInfo({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      });
    }
  }, [user]); // Chạy lại khi thông tin người dùng thay đổi

  const calculateTotal = (cart: CartItem[]) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleCheckout = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.address) {
      alert("Please fill out all user information.");
      return;
    }

    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    setLoading(true);

    const orderData = {
      userInfo,
      items: cartItems,
      total: totalPrice,
      paymentMethod,
    };

    try {
      const response = await axios.post("http://localhost:5000/api/checkout", orderData);
      alert("Order placed successfully!");
      // Sau khi tạo đơn hàng, có thể xóa giỏ hàng và chuyển hướng người dùng
      localStorage.removeItem("cart");
      setCartItems([]);
    } catch (err) {
      setError("Error placing order. Please try again.");
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
          <CardDescription>Review your order and proceed with payment.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.price * item.quantity}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <p className="font-medium">Total Price: {totalPrice}</p>
          </div>
            
          <div className="mt-4">
            <h3 className="font-medium">User Information</h3>
            <Input
              placeholder="Name"
              value={userInfo.name}
              onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={userInfo.phone}
              onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
            />
            <Input
              placeholder="Address"
              value={userInfo.address}
              onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
            />
          </div>

          <div className="mt-4">
            <h3 className="font-medium">Payment Method</h3>
            <div>
              <label>
                <input
                  type="radio"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                />
                Credit Card
              </label>
              <label className="ml-4">
                <input
                  type="radio"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                Cash on Delivery
              </label>
            </div>
          </div>

          <div className="mt-4 flex space-x-4">
            <Button variant="secondary" onClick={() => { localStorage.removeItem("cart"); window.location.href = "/"; }}>
              Cancel
            </Button>
            <Button
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Processing..." : "Proceed to Payment"}
            </Button>
          </div>

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
