"use client";

import { SignIn, useUser } from "@clerk/nextjs";
import axios from "axios";
import { useEffect } from "react";
import { useSignIn } from '@clerk/clerk-react'
export default function Page() {
  const { isSignedIn, user } = useUser();
  const { isLoaded, signIn } = useSignIn()
  // Hàm để lưu thông tin người dùng xuống database
  const handleSaveUser = async (user: any) => {
    if (!user) return;

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.primaryEmailAddress?.emailAddress,
      phone: user.phoneNumbers[0]?.phoneNumber || "",
      provider: "43e41e65-7d2f-4d0e-a4b5-6d649cc67c70",
      role: "ceb09234-2b63-4ca1-89b3-3aab90d9f716", // Mặc định là customer
    };
    console.log(userData);
    try {
      const response = await axios.post("http://localhost:5000/api/admin/user/create", userData);
      console.log("User saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Theo dõi trạng thái đăng nhập
  useEffect(() => {
    if (signIn?.status=="complete" && user) {
      handleSaveUser(user);
    }
  }, [signIn, user]);

  return (
    <div className="flex items-center flex-col justify-center gap-10 w-screen h-screen">
      <SignIn
        appearance={{
          elements: {
            footer: { display: "none" }, // Ẩn phần chân trang
          },
        }}
      />
    </div>
  );
}
