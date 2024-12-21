"use client";
import { useEffect, useState } from "react";
import { SiTicktick } from "react-icons/si";
import { ImCancelCircle } from "react-icons/im";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function StatusPayment() {
    const [params, setParams] = useState<Record<string, string>>({});
    const router= useRouter();
    useEffect(() => {
        // Lấy phần query string từ URL hiện tại
        const urlParams = new URLSearchParams(window.location.search);

        // Khai báo extractedParams có kiểu Record<string, string>
        const extractedParams: Record<string, string> = {};

        // Chuyển các tham số URL thành một object
        urlParams.forEach((value, key) => {
            extractedParams[key] = value;
        });

        // Lưu các tham số vào state
        setParams(extractedParams);
    }, []);

    const goHome = async () => {
        alert("Cảm ơn đã mua hàng");
        localStorage.removeItem("cart");
        router.push('/');
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
                        <Button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600" onClick={goHome}>
                            Về trang chủ
                        </Button>
                    </>
                ) : (
                    <>
                        <div className="flex justify-center mb-4">
                            <ImCancelCircle className="text-9xl  text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-red-600">Thanh toán thất bại!</h2>
                        <p className="text-gray-500">Cảm ơn bạn đã mua hàng.</p>
                        <Button className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"  onClick={goHome}>
                            Về trang chủ
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
