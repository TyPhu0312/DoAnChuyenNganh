"use client";

import { redirect } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";
import { parseCookies } from "nookies";

interface AuthGuardProps {
    children: React.ReactNode; // Nội dung con (component con)
}

const AuthGuard = ({ children }: AuthGuardProps) => {
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [isAuthorized, setIsAuthorized] = useState(false); // Trạng thái xác thực

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                // Lấy userId từ cookies
                const cookies = parseCookies();
                const userId = cookies.userId;

                // Nếu không có userId, chuyển hướng đến trang login
                if (!userId) {
                    redirect("/login");
                    return;
                }

                // Gọi API để lấy thông tin user từ database
                const response = await axios.get(`http://localhost:5000/api/admin/user/${userId}`);
                const user = response.data;


                // Kiểm tra đã hoàn thành profile hay chưa
                if(!user.address || user.phone)
                if (!user.hasCompletedProfile) {
                    redirect("/update-profile");
                    return;
                }

                // Nếu thoả mãn điều kiện
                setIsAuthorized(true);
            } catch (error) {
                console.error("Error fetching user data:", error);
                redirect("/login"); // Chuyển đến trang login khi gặp lỗi
            } finally {
                setIsLoading(false); // Dừng loading
            }
        };

        checkAuthStatus();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Hiển thị trạng thái loading
    }

    if (!isAuthorized) {
        return null; // Không render gì nếu chưa xác thực
    }

    return <>{children}</>;
};

export default AuthGuard;
