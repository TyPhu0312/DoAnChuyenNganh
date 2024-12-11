"use client";
import { useEffect } from "react";
import { SignUp, useUser } from "@clerk/nextjs";
import axios from "axios";

export default function Page() {
  const { isSignedIn, user } = useUser();

  const handleSaveUser = async (user: any) => {
    if (!user) return;

    const userData = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.primaryEmailAddress?.emailAddress,
      phone: user.phoneNumbers[0]?.phoneNumber || "",
      provider: user.externalAccounts[0]?.provider || "email",
      role: "ceb09234-2b63-4ca1-89b3-3aab90d9f716",
    };
    
    try {
      const response = await axios.post("http://localhost:5000/api/admin/user/create", userData);
      console.log("User saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  useEffect(() => {
    if (isSignedIn && user) {
      handleSaveUser(user);
    }
  }, [isSignedIn, user]);

  return (
    <div className="flex items-center justify-center flex-col gap-10">
      <SignUp
        appearance={{
          elements: {
            footer: { display: "none" }, // Ẩn phần chân trang
          },
        }}
      />
    </div>
  );
}
