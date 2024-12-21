"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"



import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // Import Select
import Admin from "../page"
import { SetStateAction, useEffect, useState } from 'react';
import { any } from "zod"
import { Button } from "@/components/ui/button";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";

import Image from "next/image";

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";



export default function CustomPainting() {
  const [paintings, setPaintings] = useState<any[]>([]);
  const [newPainting, setNewPainting] = useState({
    image: "",
    name: "",
    size_width: "",
    size_height: "",
    picture_frame: "",
    note: "",
    userId: "",
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState<string>("");
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPainting((prevPaintings) => ({
      ...prevPaintings,
      [id]: value, // Cập nhật giá trị tương ứng với ID của input
    }));
  };
  const handleStatusChange = (id: any, newStatus: string) => {
    // Cập nhật trạng thái trong state trước
    setPaintings((prevPaintings) =>
      prevPaintings.map((painting) =>
        painting.id === id ? { ...painting, status: newStatus } : painting
      )
    );

    // Gửi yêu cầu API để cập nhật trạng thái
    axios
      .put(`http://localhost:5000/api/admin/custompainting/updatestatus/${id}`, { status: newStatus })
      .then((response) => {
        console.log("Status updated successfully", response.data);
      })
      .catch((error) => {
        console.error("Error updating status", error);
        // Nếu có lỗi, trả lại trạng thái cũ
        setPaintings((prevPaintings) =>
          prevPaintings.map((painting) =>
            painting.id === id ? { ...painting, status: painting.status } : painting
          )
        );
        alert("Có lỗi xảy ra khi cập nhật trạng thái");
      });
  };



  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/custompainting")
      .then((response) => {
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          setPaintings(data); // Nếu là mảng, set vào state
        } else {
          console.error("API response is not an array", response.data);
          setPaintings([]); // Nếu không phải mảng, set là mảng rỗng
        }
      })
      .catch((err) => {
        console.error(
          "Chi tiết lỗi:",
          err.response ? err.response.data : err.message
        );
        alert("Có lỗi xảy ra, vui lòng thử lại.");
        setPaintings([]); // Nếu có lỗi, fallback về mảng rỗng
      });
  }, []);
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleNoteChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNote(event.target.value);
  };

  const handleSubmitContact = async () => {
    if (!note) {
      alert("Note không được để trống");
      return;
    }

    const formData = new FormData();
    if (file) {
      formData.append("image", file); // Thêm file ảnh nếu có
    }
    formData.append("note", note); // Thêm note
    formData.append("userId", "someUserId"); // Thay bằng userId thật
    formData.append("customPaintingId", "somePaintingId"); // Thay bằng customPaintingId thật

    try {
      const response = await fetch("http://localhost:5000/api/admin/contact/create", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.success) {
        alert("Contact created successfully!");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error creating contact:", error);
      alert("Đã xảy ra lỗi khi tạo contact");
    }
  };
  

  // if (loading) return <p>Đang tải dữ liệu...</p>;
  return (
    <><Admin>

      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all" className="your-tailwind-classes">All</TabsTrigger>
            <TabsTrigger value="active" className="your-tailwind-classes">Active</TabsTrigger>
            <TabsTrigger value="draft" className="your-tailwind-classes">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex your-tailwind-classes">
              Archived
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Custom Painting Order</CardTitle>
              <CardDescription>
                All artworks request of client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ảnh</TableHead>
                    <TableHead>Tên Tranh</TableHead>
                    <TableHead>Tên Khách Hàng</TableHead>
                    <TableHead className="hidden sm:table-cell">Kích Thước</TableHead>
                    <TableHead className="hidden sm:table-cell">Khung Tranh</TableHead>
                    <TableHead className="hidden md:table-cell">Ghi chú</TableHead>
                    <TableHead className="hidden md:table-cell">Giá</TableHead>
                    <TableHead className="hidden md:table-cell">Status</TableHead> {/* Thêm cột status */}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Render dữ liệu tranh từ API */}
                  {paintings.map((painting) => (
                    <><TableRow key={painting.id}>
                      <TableCell>
                      <Image
                          src={`/images/${painting.image}`}

                          alt={painting.name}
                          className="w-16 h-16 object-cover rounded-md" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{painting.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{painting.userName}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {painting.size_width} x {painting.size_height} cm
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <div className="font-medium">{painting.picture_frame}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {painting.note || "Không có ghi chú"}
                      </TableCell>
                      <TableCell className="text-right">
                        {painting.price ? `$${painting.price.toFixed(2)}` : "Liên hệ"}
                      </TableCell>
                      <TableCell>
                        <Select value={painting.status || "Chờ xử lý"} onValueChange={(newStatus: any) => handleStatusChange(painting.id, newStatus)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="processing">Đang xử lý</SelectItem>
                            <SelectItem value="completed">Hoàn thành</SelectItem>
                            <SelectItem value="cancelled">Hủy</SelectItem>
                            <SelectItem value="pending">Chờ xử lý</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
                              View
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <AlertDialogContent className="md:max-w-[90%] md:h-[80%]">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Detail of the Painting</AlertDialogTitle>
                          </AlertDialogHeader>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
                            {/* Phần đầu chiếm 1 ô */}
                            <div className="col-span-1 rounded-xl">
                              <AlertDialogDescription>
                                <div className="space-y-4">
                                  <p><strong>Thông tin tranh</strong></p>
                                  <p><strong>Name:</strong> {painting.name}</p>
                                  <p><strong>Size:</strong> {painting.size_width} x {painting.size_height} cm</p>
                                  <p><strong>Picture Frame:</strong> {painting.picture_frame}</p>
                                  <p><strong>Note:</strong> {painting.note || "No notes"}</p>
                                </div>
                              </AlertDialogDescription>
                              <AlertDialogDescription>
                                <div className="space-y-4 mt-4">
                                  <p><strong>Thông khách hàng</strong></p>
                                  <p><strong>Name:</strong> {painting.name}</p>
                                  <p><strong>Size:</strong> {painting.size_width} x {painting.size_height} cm</p>
                                  <p><strong>Picture Frame:</strong> {painting.picture_frame}</p>
                                  <p><strong>Note:</strong> {painting.note || "No notes"}</p>
                                </div>
                              </AlertDialogDescription>

                              <div className="my-4">
                                <Select value={painting.status || "Chờ xử lý"} onValueChange={(newStatus: any) => handleStatusChange(painting.id, newStatus)}>
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="processing">Đang xử lý</SelectItem>
                                    <SelectItem value="completed">Hoàn thành</SelectItem>
                                    <SelectItem value="cancelled">Hủy</SelectItem>
                                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <AlertDialogAction onClick={() => setIsDialogOpen(false)}>Close</AlertDialogAction>
                            </div>

                            {/* Phần sau chiếm 3 ô */}
                            <div className="col-span-3  rounded-xl">
                              <ScrollArea className="h-[80%] w-[100%] rounded-md border">
                                <div className="p-4">
                                

                                </div>
                              </ScrollArea>

                              <div className="flex">
                                <Input
                                type="file"
                                name="iamge"
                                onChange={handleFileChange}
                                  accept="image/*"
                                  className="w-[20%]"
                                />
                                <Input
                                  type="text"
                                  className="flex-1"
                                  name="note"
                                  placeholder="Nhập ghi chú"
                                  value={note}
                                  onChange={handleNoteChange}
                                ></Input>
                                <Button onClick={handleSubmitContact}>Gửi</Button>
                              </div>
                            </div>
                          </div>
                        </AlertDialogContent>
                      </AlertDialog>
                    </>

                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <div className="text-xs text-muted-foreground">
                Showing <strong>1-10</strong> of <strong>32</strong> products
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

    </Admin></>
  )
}
