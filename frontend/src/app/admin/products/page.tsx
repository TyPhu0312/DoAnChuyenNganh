"use client";
import { useEffect, useState } from "react";
import React from "react";
import Image from "next/image";
const cors = require("cors");
import { File, ListFilter, MoreHorizontal, PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import Admin from "../page";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/components/ui/use-toast";

export default function Products() {
  const [products, setProducts] = useState<any[]>([]); // Khởi tạo là mảng rỗng
  const [showAlert, setShowAlert] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedUpdateProduct, setSelectedUpdateProduct] =
    useState<Product | null>(null);
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false); // Mặc định modal mở
  const [newProduct, setNewProduct] = useState({
    title: "",
    author: "",
    price: "",
    thumbnail: "",
    description: "",
    category: "",
  });
  interface Product {
    id: string;
    title: string;
    author: string;
    price: number;
    thumbnail: string;
    description: string;
    categoryId: string;
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [id]: value, // Cập nhật giá trị tương ứng với ID của input
    }));
  };
  
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/admin/products/")
      .then((response) => {
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          setProducts(response.data.data); // Nếu là mảng, set vào state
        } else {
          console.error("API response is not an array", response.data);
          setProducts([]); // Nếu không phải mảng, set là mảng rỗng
        }
      })
      .catch((err) => {
        console.error(
          "Chi tiết lỗi:",
          err.response ? err.response.data : err.message
        );
        alert("Có lỗi xảy ra, vui lòng thử lại.");
        setProducts([]); // Nếu có lỗi, fallback về mảng rỗng
      });
  }, []);
  const handleDelete = (productId: string) => {
    setSelectedProduct({
      id: productId,
      title: "",
      author: "",
      price: 0,
      thumbnail: "",
      description: "",
      categoryId: "",
    });
    setShowAlert(true); // Mở modal xác nhận
  };
  const handleCancelEditText = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);                    ``
    setNewProduct({
      title: "",
      author: "",
      price: "",
      thumbnail: "",
      description: "",
      category: "",
    });
  }
  const handleConfirmDelete = () => {
    if (selectedProduct && selectedProduct.id) {
      // Thực hiện xóa sản phẩm khi người dùng xác nhận
      axios
        .delete(
          `http://localhost:5000/api/admin/products/delete/${selectedProduct.id}` // Dùng selectedProduct.id để gọi API
        )
        .then((response) => {
          console.log("Sản phẩm đã được xóa thành công:", response.data);
          toast({
            title: "Product Deleted",
            description: `Product with ID ${selectedProduct.id} has been deleted.`,
          });
          fetchProducts(); // Tải lại danh sách sản phẩm
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm:", error);
          toast({
            title: "Delete Failed",
            description: "An error occurred while deleting the product.",
          });
        });
    }
    setShowAlert(false); // Đóng modal sau khi xóa thành công
  };
  const handleAlertClose = () => {
    setShowAlert(false);
  };
  const handleCreateProduct = () => {
    // Đặt lại selectedProduct về null khi tạo mới
    setSelectedProduct(null);
    setNewProduct({
      title: "",
      author: "",
      price: "",
      thumbnail: "",
      description: "",
      category: "",
    });
    //console.log(selectedProduct);
    // Kiểm tra các trường dữ liệu bắt buộc trước khi gửi
    if (!newProduct.title || !newProduct.author || !newProduct.price) {
      alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }
    axios
      .post("http://localhost:5000/api/admin/products/create", newProduct)
      .then((response) => {
        console.log("Sản phẩm được tạo thành công:", response.data);
        alert("Sản phẩm đã được tạo thành công!");
        fetchProducts(); // Reload lại danh sách sản phẩm sau khi tạo thành công
        setIsModalOpen(false); // Đóng modal sau khi thêm thành công
      })
      .catch((error) => {
        console.error("Lỗi khi tạo sản phẩm:", error);
        if (error.response) {
          console.log("Phản hồi từ server:", error.response.data);
          console.log("Mã trạng thái:", error.response.status);
          console.log("Tiêu đề lỗi:", error.response.statusText);
        } else if (error.request) {
          console.log(
            "Yêu cầu đã được gửi nhưng không nhận được phản hồi:",
            error.request
          );
        } else {
          console.log("Lỗi trong khi thiết lập yêu cầu:", error.message);
        }
      });
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/admin/products")
      .then((response) => {
        const data = response.data.data || response.data;
        // Kiểm tra dữ liệu là mảng hợp lệ trước khi set vào state
        if (Array.isArray(data)) {
          setProducts(data); // Cập nhật lại danh sách sản phẩm
        } else {
          console.error("Dữ liệu không hợp lệ", response.data);
          setProducts([]); // Nếu không phải mảng, set là mảng rỗng
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy sản phẩm:", err);
        setProducts([]); // Nếu có lỗi, fallback về mảng rỗng
      });
  };
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product); // Cập nhật sản phẩm đang chọn
    setNewProduct({
      title: product.title,
      author: product.author,
      price: product.price,
      thumbnail: product.thumbnail,
      description: product.description,
      category: product.category,
    }); // Cập nhật form với thông tin sản phẩm cần chỉnh sửa
    setIsModalOpen(true); // Mở modal chỉnh sửa
  };
  const handleUpdateProduct = () => {
    if (!selectedProduct) return;
    axios
      .put(
        `http://localhost:5000/api/admin/products/update/${selectedProduct.id}`,
        selectedProduct
      )
      .then((response) => {
        console.log("Sản phẩm đã được cập nhật thành công:", response.data);
        toast({
          title: "Product Updated",
          description: `Product with ID ${selectedProduct} has been updated.`,
        });
        fetchProducts(); // Tải lại danh sách sản phẩm
        setIsModalOpen(false); // Đóng modal sau khi cập nhật
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        toast({
          title: "Update Failed",
          description: "An error occurred while updating the product.",
        });
      });
  };

  return (
    <Admin>
      <Tabs defaultValue="all">
        <div className="flex items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="archived" className="hidden sm:flex">
              Archived
            </TabsTrigger>
          </TabsList>
          <div className="ml-auto flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Filter
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem checked>
                  Active
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Draft</DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem>Archived</DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="h-7 gap-1"
                  onClick={() => setSelectedProduct(null)}
                >
                  <PlusCircle className="h-3.5 w-3.5" />
                  <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Product
                  </span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    {selectedProduct ? "Edit Artwork" : "Add New Artwork"}
                  </DialogTitle>
                  <DialogDescription>
                    {selectedProduct
                      ? "Edit product details"
                      : "Add a new product to store catalog."}
                  </DialogDescription>
                </DialogHeader>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleCreateProduct();
                  }}
                >
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-6 items-center gap-4">
                      <Label htmlFor="title" className="text-right col-span-2">
                        Artwork Title
                      </Label>
                      <Input
                        onChange={handleInputChange}
                        id="title"
                        type="text"
                        value={newProduct.title}
                        className="col-span-4"
                      />
                    </div>
                    <div className="grid grid-cols-6 items-center gap-4">
                      <Label htmlFor="author" className="text-right col-span-2">
                        Author
                      </Label>
                      <Input
                        onChange={handleInputChange}
                        id="author"
                        type="text"
                        value={newProduct.author}
                        className="col-span-4"
                      />
                    </div>
                    <div className="grid grid-cols-6 items-center gap-4">
                      <Label htmlFor="price" className="text-right col-span-2">
                        Price
                      </Label>
                      <Input
                        onChange={handleInputChange}
                        id="price"
                        type="number"
                        value={newProduct.price}
                        className="col-span-4"
                      />
                    </div>
                    <div className="grid grid-cols-6 items-center gap-4">
                      <Label
                        htmlFor="thumbnail"
                        className="text-right col-span-2"
                      >
                        Thumbnail
                      </Label>
                      <Input
                        onChange={handleInputChange}
                        id="thumbnail"
                        type="text"
                        value={newProduct.thumbnail}
                        className="col-span-4"
                      />
                    </div>
                    <div className="grid grid-cols-6 items-center gap-4">
                      <Label
                        htmlFor="category"
                        className="text-right col-span-2"
                      >
                        Category
                      </Label>
                      <Input
                        onChange={handleInputChange}
                        id="category"
                        type="text"
                        value={newProduct.category}
                        className="col-span-4"
                      />
                    </div>
                    <div className="grid grid-cols-6 items-center gap-4">
                      <Label
                        htmlFor="description"
                        className="text-right col-span-2"
                      >
                        Description
                      </Label>
                      <Input
                        onChange={handleInputChange}
                        id="description"
                        type="text"
                        value={newProduct.description}
                        className="col-span-4"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{"Save changes"}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <TabsContent value="all">
          <Card x-chunk="dashboard-06-chunk-0">
            <CardHeader>
              <CardTitle>Artworks</CardTitle>
              <CardDescription>
                Manage your products and view their sales performance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="hidden w-[100px] sm:table-cell">
                      <span className="sr-only">Image</span>
                    </TableHead>
                    <TableHead>Artwork Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Thumbnail</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Created at
                    </TableHead>
                    <TableHead className="hidden md:table-cell">
                      Updated at
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product: any) => (
                    <TableRow key={product._id}>
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="32"
                          src="/images/logo.png"
                          width="32"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.title}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.author}
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.thumbnail}
                        <Image
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="32"
                          src="/images/logo.png"
                          width="32"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.category}
                      </TableCell>
                      <TableCell className="font-medium">
                        {product.description}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.createdAt}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {product.updatedAt}
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
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditProduct(product)}
                            >
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(product.id)}
                            >
                              Delete
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

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleAlertClose}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Modal Edit Product */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h3 className="text-lg font-bold mb-4">Edit Product</h3>
            <form>
              <div className="mb-4">
                <label htmlFor="title" className="block">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={selectedProduct?.title || ""} // Sử dụng giá trị mặc định nếu selectedUpdateProduct là null
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      title: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="author" className="block">
                  Author
                </label>
                <input
                  id="author"
                  type="text"
                  value={selectedProduct.author}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      author: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="price" className="block">
                  Price
                </label>
                <input
                  id="price"
                  type="number"
                  value={selectedProduct.price}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              {/* Thêm các trường để sửa các thuộc tính khác của product */}
              <div className="mb-4">
                <label htmlFor="thumbnail" className="block">
                  Thumbnail URL
                </label>
                <input
                  id="thumbnail"
                  type="text"
                  value={selectedProduct.thumbnail}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      thumbnail: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block">
                  Description
                </label>
                <textarea
                  id="description"
                  value={selectedProduct.description}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block">
                  Category
                </label>
                <input
                  id="category"
                  type="text"
                  value={selectedProduct.categoryId}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      categoryId: e.target.value,
                    })
                  }
                  className="border p-2 w-full"
                />
              </div>

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={handleCancelEditText} // Đóng modal
                  className="bg-gray-500 text-white p-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateProduct} // Gọi hàm cập nhật khi nhấn Save
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Admin>
  );
}
