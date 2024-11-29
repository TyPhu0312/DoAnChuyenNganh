"use client";

import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function UploadForm() {
  const [newPainting, setNewPainting] = useState({
    image: "",
    link_image: "",
    name: "",
    size_width: "",
    size_height: "",
    picture_frame: "",
    note: "",
    userId: "",
  });
  const [message, setMessage] = useState('');
  const router = useRouter(); // Khởi tạo router

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPainting((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCreatePainting = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu tên bức tranh chưa được điền
    if (!newPainting.name) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/custompainting/create",
        newPainting
      );

      // Kiểm tra nếu phản hồi thành công
      if (response.status === 201) {
        alert("Đã đăng ký thành công!");

        // Reset form sau khi tạo thành công
        setNewPainting({
          image: "",
          link_image: "",
          name: "",
          size_width: "",
          size_height: "",
          picture_frame: "",
          note: "",
          userId: "",
        });

        // Chuyển hướng về trang chủ ngay lập tức
        setTimeout(() => {
          router.push('/'); // Chuyển hướng về trang chủ sau 2 giây
        }, 1000);
      }
    } catch (error) {
      console.error("Lỗi khi tạo sản phẩm:", error);
      alert("Có lỗi xảy ra khi tạo sản phẩm.");
    }
  };

  return (
    <div className="sm:max-w-[425px] mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200 mt-10">
      <form onSubmit={handleCreatePainting}>
        <div className="grid gap-4 py-4">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Thông tin ảnh theo yêu cầu</h1>

          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="image" className="text-right col-span-2">Image</Label>
            <Input
              onChange={handleInputChange}
              id="image"
              type="text"
              name="image"
              value={newPainting.image}
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

          <div className="grid grid-cols-6 items-center gap-4">
            <Label htmlFor="userId" className="text-right col-span-2">UserId</Label>
            <Input
              onChange={handleInputChange}
              id="userId"
              type="text"
              name="userId"
              value={newPainting.userId}
              className="col-span-4 p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="text-center">
          <Button type="submit" className="w-full py-2 text-white rounded-md">Save changes</Button>
        </div>
      </form>
    </div>
  );
}
