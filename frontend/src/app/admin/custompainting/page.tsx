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
import { useEffect, useState } from 'react';
import { any } from "zod"
import { Button } from "@/components/ui/button";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem, Label, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { MoreHorizontal } from "lucide-react";
import axios from "axios";


export default function CustomPainting() {
  const [paintings, setPaintings] = useState<any[]>([]);
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
  const [loading, setLoading] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewPainting((prevPaintings) => ({
      ...prevPaintings,
      [id]: value, // Cập nhật giá trị tương ứng với ID của input
    }));
  };

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/custompainting")
      .then((response) => {
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          setPaintings(response.data.data); // Nếu là mảng, set vào state
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
  
  // useEffect(() => {
  //   const fetchPaintings = async () => {
  //     try {
  //       const res = await fetch('/api/get-paintings');
  //       const data = await res.json();
  //       setPaintings(data);
  //     } catch (error) {
  //       console.error('Lỗi khi lấy danh sách tranh:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchPaintings();
  // }, []);
  // Hàm xử lý khi chọn status mới
  const handleStatusChange = (id: any, newStatus: any) => {
    setPaintings((prevPaintings) =>
      prevPaintings.map((painting) =>
        painting.id === id ? { ...painting, status: newStatus } : painting
      )
    );
  };

  // if (loading) return <p>Đang tải dữ liệu...</p>;
  return (
    <><Admin>

      <Tabs defaultValue="all">
        {/* <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all" className="your-tailwind-classes">All</TabsTrigger>
            <TabsTrigger value="active" className="your-tailwind-classes">Active</TabsTrigger>
            <TabsTrigger value="draft" className="your-tailwind-classes">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex your-tailwind-classes">
              Archived
            </TabsTrigger>
          </TabsList>

        </div> */}
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Custompainting</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ảnh</TableHead>
                    <TableHead>Tên Tranh</TableHead>
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
                    <TableRow key={painting.id}>
                      <TableCell>
                        <img
                          src={painting.image}
                          alt={painting.name}
                          className="w-16 h-16 object-cover rounded-md" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{painting.name}</div>
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
                        {/* Dropdown select để chọn status */}
                        <Select value={painting.status || "Chờ xử lý"} onValueChange={(newStatus: any) => handleStatusChange(painting.id, newStatus)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                            <SelectItem value="Hoàn thành">Hoàn thành</SelectItem>
                            <SelectItem value="Hủy">Hủy</SelectItem>
                            <SelectItem value="Chờ xử lý">Chờ xử lý</SelectItem>
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
                            <DropdownMenuItem>
                              <Button>
                              Edit
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
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
