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
  const [selectedPainting, setSelectedPainting] = useState<Painting | null>(null);
  const [takeUserId, setTakeUserId] = useState("");
  const [takecustompainting, setTakeCustompainting] = useState("");
  const [contacts, setContacts] = useState<any[]>([]);
  const [userInfo, setUserInfo] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPainting((prevPaintings) => ({
      ...prevPaintings,
      [id]: value, // Cập nhật giá trị tương ứng với ID của input
    }));
  };
  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/user/${userId}`);
      console.log(response.data.data);
      setUserInfo(response.data.data[0]); // Đảm bảo response.data.data chứa thông tin người dùng
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
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
  const fetchContacts = async (userId: string, custompaintingId: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/contact/${userId}/${custompaintingId}`);
      console.log(response.data); // Kiểm tra dữ liệu trả về
      const contactsData = Array.isArray(response.data.data) ? response.data.data : [response.data.data];
      console.log(contactsData); // Kiểm tra dữ liệu đã được chuẩn hóa thành mảng chưa
      setContacts(contactsData);  // Lưu vào state
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setContacts([]); // Set mảng rỗng nếu có lỗi
    }
  };


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
    formData.append("userId", takeUserId); // Lấy userId từ state
    formData.append("customPaintingId", takecustompainting); // Lấy customPaintingId từ state

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
  interface Painting {
    id: string;
    image: string;
    name: string;
    status: 'processing' | 'completed' | 'cancelled' | 'pending'; // Định nghĩa kiểu cho status
    size_width: number;
    size_height: number;
    picture_frame: string | null;
    note: string | null;
    userId: string;
  }


  const handleView = (newPainting: Painting) => {
    setSelectedPainting(newPainting);
    setTakeUserId(newPainting.userId);  // Cập nhật userId từ painting
    setTakeCustompainting(newPainting.id);  // Cập nhật custom painting ID
    fetchContacts(newPainting.userId, newPainting.id);  // Lấy contacts cho painting
    fetchUserInfo(newPainting.userId);  // Lấy thông tin user cho painting
    setIsDialogOpen(true);  // Mở dialog
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
                          width={50}
                          height={50}
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
                            <DropdownMenuItem onClick={() => handleView(painting)}>
                              View
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>

                      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <ScrollArea className="h-[70%] w-[100%] rounded-md border">
                          <AlertDialogContent className="md:max-w-[90%] xs:h-[50%] md:h-[80%]">
                            {selectedPainting && (
                              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-1 rounded-xl">
                                  <AlertDialogDescription>
                                    <div className="space-y-4">
                                      <p><strong>Thông tin tranh</strong></p>
                                      <p><strong>Name:</strong> {selectedPainting.name}</p>
                                      <p><strong>Size:</strong> {selectedPainting.size_width} x {selectedPainting.size_height} cm</p>
                                      <p><strong>Picture Frame:</strong> {selectedPainting.picture_frame || "No frame"}</p>
                                      <p><strong>Note:</strong> {selectedPainting.note || "No notes"}</p>
                                    </div>
                                  </AlertDialogDescription>
                                  <AlertDialogDescription>
                                    <div className="space-y-4 my-4">
                                      <p><strong>Thông tin khách hàng</strong></p>
                                      {userInfo ? (
                                        <>
                                          <p><strong>Name:</strong>{userInfo.lastname} {userInfo.firstname}</p>
                                          <p><strong>Email:</strong> {userInfo.email}</p>
                                          <p><strong>Phone:</strong> {userInfo.phone}</p>
                                          <p><strong>Address:</strong> {userInfo.address}</p>
                                        </>
                                      ) : (
                                        <p>Loading user info...</p>  // Đợi dữ liệu từ API
                                      )}
                                    </div>
                                  </AlertDialogDescription>
                                  <div className="my-4">
                                    <Select
                                      value={selectedPainting.status || "pending"} // Nếu không có trạng thái, mặc định là "pending"
                                      onValueChange={(newStatus: string) => handleStatusChange(selectedPainting.id, newStatus)} // Cập nhật trạng thái
                                    >
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
                                {/* Form liên hệ */}
                                <div className="col-span-3 rounded-xl">
                                  <ScrollArea className="h-[70%] w-[100%] rounded-md border">
                                    <div className="p-4 space-y-4">
                                      {contacts.length > 0 ? (
                                        contacts.map((contact) => (
                                          <div key={contact.id} className="p-4 bg-gray-100 rounded-md shadow">
                                            <p><strong>Name:</strong>{userInfo.lastname} {userInfo.firstname}</p>
                                            <p><strong>Note:</strong> {contact.note}</p>
                                            {contact.image && (
                                              <Image
                                                src={`/images/${contact.image}`}
                                                alt="Contact Image"
                                                width={100}
                                                height={100}
                                                className="rounded-md"
                                              />
                                            )}
                                            <p><strong>Date:</strong> {new Date(contact.createAt).toLocaleString()}</p>
                                          </div>
                                        ))
                                      ) : (
                                        <p className="text-center text-gray-500">No contacts found</p>
                                      )}
                                    </div>
                                  </ScrollArea>

                                  <div className="flex">
                                    <Input
                                      type="file"
                                      name="image"
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
                            )}
                          </AlertDialogContent>
                        </ScrollArea>
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
