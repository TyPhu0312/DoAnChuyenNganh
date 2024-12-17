"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import axios from "axios";

export default function UpdateUserPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [userData, setUserData] = useState({
    id: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address:"",
    providerId: "43e41e65-7d2f-4d0e-a4b5-6d649cc67c70",
    roleId: "ceb09234-2b63-4ca1-89b3-3aab90d9f716",
  });

  // Load dữ liệu từ Clerk vào state
  useEffect(() => {
    if (isSignedIn && user && isLoaded) {
      setUserData({
        id: user.id,
        firstname: user.firstName || "",
        lastname: user.lastName || "",
        email: user.primaryEmailAddress?.emailAddress || "",
        phone: user.phoneNumbers[0]?.phoneNumber || "",
        address:"",
        providerId: "43e41e65-7d2f-4d0e-a4b5-6d649cc67c70",
        roleId: "ceb09234-2b63-4ca1-89b3-3aab90d9f716",
      });
    }
  }, [isSignedIn, user, isLoaded]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    console.log("userdata:", userData);
    try {
      await axios.post("http://localhost:5000/api/admin/user/create", userData);
      alert("Cập nhật thông tin thành công!");
      window.location.href = "/checkout";
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Có lỗi xảy ra khi cập nhật thông tin!");
    }
  };

  if (!isSignedIn || !isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10 pt-20">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Cập nhật thông tin</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div style={{ visibility: "hidden" }}>
            <input
              type="text"
              value={userData.id}
              onChange={(e) => setUserData({ ...userData, id: e.target.value })}
              className=" block w-full  border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="ID người dùng"
              readOnly
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tên</label>
            <input
              type="text"
              value={userData.firstname}
              onChange={(e) => setUserData({ ...userData, firstname: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Nhập tên"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Họ</label>
            <input
              type="text"
              value={userData.lastname}
              onChange={(e) => setUserData({ ...userData, lastname: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Nhập họ"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Nhập email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Số điện thoại</label>
            <input
              type="text"
              value={userData.phone}
              onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Nhập số điện thoại"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Địa chỉ</label>
            <input
              type="text"
              value={userData.address}
              onChange={(e) => setUserData({ ...userData, address: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:outline-none"
              placeholder="Nhập đại chỉ"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 focus:ring focus:ring-blue-200 focus:outline-none"
          >
            Cập nhật
          </button>
        </form>
      </div>
    </div>
  );
}
