"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";

interface AuthGuardProps {
    userId: string | null; // userId từ dữ liệu đăng nhập
    children: React.ReactNode; // Nội dung con
}


const AuthGuard = ({ userId, children }: AuthGuardProps) => {
    const { user } = useUser();
    const userID = user?.id;
  
    if (!userID) {
        window.location.href = "/sign-in";
        return;
    }
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const [isAuthorized, setIsAuthorized] = useState(false); // Trạng thái xác thực
    
    useEffect(() => {
        
        const checkAuthStatus = async () => {
            try {
                // Gọi API để lấy thông tin user từ database
                const response = await axios.get(`http://localhost:5000/api/admin/user/${userID}`);
                // const User = response.data;
                
                // Kiểm tra đã hoàn thành profile hay chưa
                // if (!User.address || !User.phone) {
                //     window.location.href = "/updateProfileUser"; // Chuyển hướng đến trang cập nhật profile
                //     return;
                // }

                // Nếu thoả mãn điều kiện, set isAuthorized là true
                setIsAuthorized(true);
            } catch (error) {
                console.error("Error fetching user data:", error);
                window.location.href = "/updateProfileUser";
            } finally {
                setIsLoading(false); // Dừng loading sau khi hoàn thành
            }
        };

        // Chạy kiểm tra thông tin người dùng khi component render
        if (userId) {
            checkAuthStatus();
        } else {
            setIsLoading(false); // Nếu không có userId, dừng loading
        }
    }, [userId]); // Chạy lại nếu userId thay đổi

    // Nếu đang load, hiển thị trạng thái loading
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Nếu chưa được xác thực, không render gì
    if (!isAuthorized) {
        return null;
    }

    // Nếu xác thực thành công, render children (component con)
    return <>{children}</>;
};

export default AuthGuard;
