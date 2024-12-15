"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useUsers } from '@/components/features/userContext';
import { useUser } from "@clerk/nextjs";
import { formatCurrencyVND } from "@/lib/utils/currencyFormatter"
import Hero from "@/components/features/hero";
import { redirect } from 'next/navigation';
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
  id: string;
}

export default function Checkout() {
  const { appUser } = useUsers();
  const { user } = useUser();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    phone: "",
    address: "",
    id: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    calculateTotal(savedCart);

    if (appUser) {
      setUserInfo({
        name: appUser.name || "",
        phone: appUser.phone || "",
        address: appUser.address || "",
        id: user?.id || "",
      });
    }
  }, [appUser, user]);

  const calculateTotal = (cart: CartItem[]) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  const handleCheckout = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.address) {
      alert("Please fill out all user information.");
      return;
    }
    setLoading(true);
    const orderData = {
      userId: user?.id,
      note: "Thank you for your purchase!",
      status: "Pending",
      orderDetails: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    console.log("Order Data:", orderData);
    try {
      const response = await axios.post("http://localhost:5000/api/admin/order/create", orderData);
      alert("Order placed successfully!");
      localStorage.removeItem("cart");
      setCartItems([]);
      window.location.href = `/order/${response.data.data.orderId}`;
    } catch (err) {
      setError("Error placing order. Please try again.");
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };
  const isAuth = false; // Giả sử giá trị này đến từ trạng thái đăng nhập của bạn

    if (!isAuth) {
        redirect('/sign-in'); // Chuyển hướng đến trang đăng nhập
    }

  return (
    <main className="flex flex-1 flex-col m-0 bg-[#e0e0e0ee]">
              <Hero/>
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Checkout</CardTitle>
            <CardDescription className="text-gray-600">Xác nhận đơn hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Table className="w-full table-auto">
              <TableHeader>
                <TableRow>
                  <TableHead>Tác phẩm</TableHead>
                  <TableHead>Giá</TableHead>
                  <TableHead>Số lượng</TableHead>
                  <TableHead>Thành tiền</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cartItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.title}</TableCell>
                    <TableCell>{formatCurrencyVND(item.price)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{formatCurrencyVND(item.price * item.quantity)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="mt-4">
              <p className="font-medium text-lg">
                <span className="font-bold">Total Price: </span>
                <span className="text-red-500">{formatCurrencyVND(totalPrice)}</span>
              </p>
            </div>

            <div className="mt-4 space-y-4 ">
              <h3 className="font-medium text-lg">Thông tin nhận hàng</h3>
              <Input
                placeholder="Name"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <Input
                placeholder="Phone"
                value={userInfo.phone}
                onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
              <Input
                placeholder="Address"
                value={userInfo.address}
                onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mt-4">
              <h3 className="font-medium text-lg">Payment Method</h3>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <span>Credit Card</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  <span>Cash on Delivery</span>
                </label>
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <Button
                variant="secondary"
                onClick={() => {
                  localStorage.removeItem("cart");
                  window.location.href = "/";
                }}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full sm:w-auto"
              >
                {loading ? "Processing..." : "Proceed to Payment"}
              </Button>
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}
          </CardContent>
        </Card>
      </div>
    </main>


  );
}
