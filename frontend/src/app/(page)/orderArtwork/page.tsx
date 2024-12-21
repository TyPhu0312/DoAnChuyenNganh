// pages/upload.tsx

"use client";

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function CustomPainting() {
  const { user, isSignedIn, isLoaded } = useUser();
  const [newPainting, setNewPainting] = useState({
    name: "",
    size_width: "", // Khởi tạo là chuỗi rỗng
    size_height: "", // Khởi tạo là chuỗi rỗng
    picture_frame: "",
    note: "",
    userId: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null); // Trạng thái lưu file ảnh
  const router = useRouter();

  // Đồng bộ thông tin người dùng khi đã đăng nhập
  useEffect(() => {
    if (isSignedIn && user && isLoaded) {
      setNewPainting((prev) => ({
        ...prev,
        userId: user.id, // Lấy userId từ Clerk
      }));
    }
  }, [isSignedIn, user, isLoaded]);

  // Xử lý thay đổi các trường dữ liệu
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewPainting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý file ảnh
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]); // Lưu file ảnh vào state
    }
  };

  // Xử lý gửi form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Kiểm tra nếu tên bức tranh hoặc file ảnh chưa được điền
    if (!newPainting.name || !imageFile) {
      alert("Vui lòng điền đầy đủ thông tin và tải lên một ảnh.");
      return;
    }

    const formData = new FormData();
    formData.append("name", newPainting.name);
    // Chuyển đổi size_width và size_height thành số nguyên trước khi gửi
    formData.append("size_width", parseInt(newPainting.size_width || "0").toString());
    formData.append("size_height", parseInt(newPainting.size_height || "0").toString());
    formData.append("picture_frame", newPainting.picture_frame);
    formData.append("note", newPainting.note);
    formData.append("userId", newPainting.userId);

    if (imageFile) {
      formData.append("image", imageFile);  // Đảm bảo rằng bạn gửi đúng file ảnh
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/custompainting/create", // URL API tạo custom painting
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.status === 201) {
        alert("Tạo tranh thành công!");
        setNewPainting({
          name: "",
          size_width: "",
          size_height: "",
          picture_frame: "",
          note: "",
          userId: "",
        });
        setImageFile(null); // Xóa file ảnh khỏi state
        setTimeout(() => {
          router.push('/'); // Chuyển hướng về trang chủ
        }, 1000);
      }
    } catch (error) {
      console.error("Lỗi khi tạo tranh:", error);
      alert("Có lỗi xảy ra khi tạo tranh. Vui lòng thử lại.");
    }
  };

  return (
    <div className="sm:max-w-[425px] mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-10">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Thông tin tranh theo yêu cầu</h1>

          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="image" className="text-right col-span-2">Image</Label>
            <Input
              onChange={handleFileChange}
              id="image"
              type="file"
              name="image"
              accept="image/*"
              className="col-span-4 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="name" className="text-right col-span-2">Name</Label>
            <Input
              onChange={handleInputChange}
              id="name"
              type="text"
              name="name"
              value={newPainting.name}
              className="col-span-4 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="size_width" className="text-right col-span-2">Size width</Label>
            <Input
              onChange={handleInputChange}
              id="size_width"
              type="number"
              name="size_width"
              value={newPainting.size_width}
              className="col-span-4 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="size_height" className="text-right col-span-2">Size height</Label>
            <Input
              onChange={handleInputChange}
              id="size_height"
              type="number"
              name="size_height"
              value={newPainting.size_height}
              className="col-span-4 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="picture_frame" className="text-right col-span-2">Picture frame</Label>
            <Input
              onChange={handleInputChange}
              id="picture_frame"
              type="text"
              name="picture_frame"
              value={newPainting.picture_frame}
              className="col-span-4 p-2 border border-gray-300 rounded-md"
            />
          </div>

          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="note" className="text-right col-span-2">Note</Label>
            <Input
              onChange={handleInputChange}
              id="note"
              type="text"
              name="note"
              value={newPainting.note}
              className="col-span-4 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="text-center">
          <Button type="submit" className="w-full py-2 text-white rounded-md">Lưu thay đổi</Button>
        </div>
      </form>
    </div>
  );
}
