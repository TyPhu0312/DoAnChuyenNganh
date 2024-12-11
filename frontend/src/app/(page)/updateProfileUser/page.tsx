"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

// Giao diện trang update thông tin
export default function UpdateUserPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userData, setUserData] = useState<any>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    providerId: "43e41e65-7d2f-4d0e-a4b5-6d649cc67c70",
    roleId: "ceb09234-2b63-4ca1-89b3-3aab90d9f716", // Mặc định là customer
    username: "",
    address: "", // Trường địa chỉ cho phép nhập thủ công
  });

  useEffect(() => {
    if (isSignedIn && user && isLoaded) {
      setUserData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.primaryEmailAddress?.emailAddress || "", // Lấy email từ Clerk nhưng có thể chỉnh sửa
        phone: user.phoneNumbers[0]?.phoneNumber || "", // Lấy phone từ Clerk nhưng có thể chỉnh sửa
        providerId: "43e41e65-7d2f-4d0e-a4b5-6d649cc67c70",
        roleId: "ceb09234-2b63-4ca1-89b3-3aab90d9f716", // Mặc định là 'customer'
        username: user.username || "",
        address: "", // Địa chỉ có thể nhập thủ công
      });
    }
  }, [isSignedIn, user, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("User Data to be sent:", userData);
    console.log("Role ID of user:", userData.roleId);  // In ra roleId
    try {
      const response = await axios.post("http://localhost:5000/api/admin/user/create", userData);
      console.log("User data updated successfully:", response.data);
      alert("Cập nhật thông tin thành công!");
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  if (!isSignedIn || !isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center flex-col gap-10">
      <h1 className="text-2xl font-bold">Cập nhật thông tin người dùng</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <input
            type="text"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Họ</label>
          <input
            type="text"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Nhập email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
          <input
            type="text"
            value={userData.phone}
            onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Nhập số điện thoại"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
          <input
            type="text"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Nhập địa chỉ"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
        >
          Cập nhật
        </button>
      </form>
    </div>
  );
}
