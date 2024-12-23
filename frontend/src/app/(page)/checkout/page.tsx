"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import axios from "axios";
import { useUsers } from "@/components/features/userContext";
import { useUser } from "@clerk/nextjs";
import { formatCurrencyVND } from "@/lib/utils/currencyFormatter";
import Hero from "@/components/features/hero";
import AuthGuard from "@/components/features/authGuard";

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
  email:string;
  note: string;
}

export default function Checkout() {
  const { appUser } = useUsers();
  const { user } = useUser();

  // State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    phone: "",
    address: "",
    note: "",
    email:""
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking" | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch dữ liệu và tính tổng tiền
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(savedCart);
    calculateTotal(savedCart);

    if (appUser) {
      setUserInfo({

        name: appUser.name || "",
        phone: appUser.phone || "",
        address: appUser.address || "",
        note: "",
        email:"",
      });
    }
  }, [appUser]);

  const calculateTotal = (cart: CartItem[]) => {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotalPrice(total);
  };

  // Xử lý đặt hàng
  const handleCheckout = async () => {
    if (!userInfo.name || !userInfo.phone || !userInfo.address) {
      alert("Vui lòng điền đầy đủ thông tin nhận hàng!");
      return;
    }
  
    if (!paymentMethod) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }
  
    setLoading(true);
    let orderStatus = "Pending";
    const orderData = {
      userId: user?.id,
      status: orderStatus,
      paymentMethod,
      customerName: userInfo.name,
      customerPhone: userInfo.phone,
      customerEmail: userInfo.email,  
      customerAddress:userInfo.address,
      customerNote: userInfo.note,
      orderDetails: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    console.log(orderData);
    try {
      if (paymentMethod === "cod") {
        // COD
        await axios.post("http://localhost:5000/api/admin/order/create", orderData);
        alert("Đơn hàng đã được đặt thành công!");
        localStorage.removeItem("cart");
        setCartItems([]);
        window.location.href = "/checkout";
      } else if (paymentMethod === "banking") {
        // BANKING
        const response = await `http://localhost:5000/order/create_payment_url?amount=${totalPrice}`
        const paymentURL = response;

        const customerInfo = {
          id: user?.id,
          name: userInfo.name,
          phone: userInfo.phone,
          email: userInfo.email,
          note: userInfo.note,
          address: userInfo.address,
        };
        localStorage.setItem("userInfo", JSON.stringify(customerInfo));
        console.log(customerInfo);
        if (paymentURL) {
          window.location.href = paymentURL;
        } else {
          alert("Có lỗi xảy ra khi tạo URL thanh toán.");
        }
      }
    } catch (err) {
      setError("Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại!");
      console.error("Checkout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Render giao diện
  return (
    <AuthGuard userId={user?.id ?? null}>
      <main className="flex flex-1 flex-col m-0 bg-[#e0e0e0ee]">
        <Hero />
        <div className="p-4 space-y-6 max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Checkout</CardTitle>
              <CardDescription className="text-gray-600">Xác nhận đơn hàng</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Bảng giỏ hàng */}
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
              {/* Tổng tiền */}
              <div className="mt-4">
                <p className="font-medium text-lg">
                  <span className="font-bold">Tổng tiền: </span>
                  <span className="text-red-500">{formatCurrencyVND(totalPrice)}</span>
                </p>
              </div>

              {/* Thông tin nhận hàng */}
              <div className="mt-4 space-y-4">
                <h3 className="font-medium text-lg">Thông tin nhận hàng</h3>
                <Input
                  placeholder="Tên"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                />
                <Input
                  placeholder="Số điện thoại"
                  value={userInfo.phone}
                  onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                />
                <Input
                placeholder="Email"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                />
                <Input
                  placeholder="Địa chỉ"
                  value={userInfo.address}
                  onChange={(e) => setUserInfo({ ...userInfo, address: e.target.value })}
                />
                <Input
                  placeholder="Ghi chú"
                  value={userInfo.note}
                  onChange={(e) => setUserInfo({ ...userInfo, note: e.target.value })}
                />
              </div>

              {/* Phương thức thanh toán */}
              <div className="mt-4">
                <h3 className="font-medium text-lg">Phương thức thanh toán</h3>
                <div className="flex space-x-4 flex-col">
                  <label className="flex items-start space-x-2">
                    <input
                      type="radio"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-start space-x-2">
                    <input
                      type="radio"
                      value="banking"
                      checked={paymentMethod === "banking"}
                      onChange={() => setPaymentMethod("banking")}
                    />
                    <span>Thanh toán qua ngân hàng</span>
                  </label>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="mt-4 flex space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    localStorage.removeItem("cart");
                    window.location.href = "/";
                  }}
                >
                  Hủy
                </Button>
                <Button onClick={handleCheckout} disabled={loading}>
                  {loading ? "Đang xử lý..." : "Đặt hàng"}
                </Button>
              </div>

              {error && <p className="text-red-500 mt-2">{error}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthGuard>
  );
}
