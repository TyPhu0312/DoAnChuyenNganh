"use client";
import { useEffect, useState } from "react";
import { SiTicktick } from "react-icons/si";
import { ImCancelCircle } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function StatusPayment() {
    const [params, setParams] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Lấy tham số từ URL
        const urlParams = new URLSearchParams(window.location.search);
        const extractedParams: Record<string, string> = {};
        urlParams.forEach((value, key) => {
            extractedParams[key] = value;
        });
        setParams(extractedParams);

        // Thanh toan thanh cong 
        if (extractedParams.vnp_TransactionStatus === "00") {
            createOrder(extractedParams);  // Truyền extractedParams ngay
        }
    }, []);

    const createOrder = async (paymentParams: Record<string, string>) => {
        setLoading(true);
        const cartItems = JSON.parse(localStorage.getItem("cart") || "[]");
        const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
        const totalPrice = parseInt(paymentParams.vnp_Amount) / 100; // vnp_Amount tính theo đơn vị nhỏ
        const orderData = {
            userId: userInfo.id, 
            note: userInfo.note,
            status: "Paid",
            paymentMethod: "banking", 
            customerName: userInfo.name,
            customerPhone: userInfo.phone,
            customerEmail: userInfo.email, 
            customerNote: userInfo.note,
            customerAddress: userInfo.address,
            paymentInfo: {
                bankCode: paymentParams.vnp_BankCode,
                transactionNo: paymentParams.vnp_TransactionNo,
                orderInfo: paymentParams.vnp_OrderInfo,
                payDate: paymentParams.vnp_PayDate,
            },
            orderDetails: cartItems.map((item: any) => ({
                productId: item.id,
                quantity: item.quantity,
                price: item.price,
            })),
        };

        try {
            await axios.post("http://localhost:5000/api/admin/order/create", orderData);
            localStorage.removeItem("cart");
        } catch (err) {
            console.error("Lỗi khi tạo đơn hàng:", err);
            setError("Không thể tạo đơn hàng. Vui lòng liên hệ hỗ trợ.");
        } finally {
            setLoading(false);
        }
    };

    const goHome = () => {
        alert("Cảm ơn đã mua hàng");
        router.push("/");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="text-center p-6 bg-white shadow-lg rounded-lg w-full max-w-md">
                {params.vnp_TransactionStatus === "00" ? (
                    <>
                        <div className="flex justify-center mb-4">
                            <SiTicktick className="text-9xl text-green-600" />
                        </div>
                        <h2 className="text-xl font-bold text-green-600">Thanh toán thành công!</h2>
                        <p className="text-gray-500">Cảm ơn bạn đã mua hàng.</p>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                        <Button
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                            onClick={goHome}
                            disabled={loading}
                        >
                            {loading ? "Đang xử lý..." : "Về trang chủ"}
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <ImCancelCircle className="text-9xl  text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-red-600">Thanh toán thất bại!</h2>
                        <p className="text-gray-500">Rất tiếc, đơn hàng của bạn thanh toán gặp trục trặc!</p>
                        <Button
                            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            onClick={goHome}
                        >
                            Về trang chủ
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
