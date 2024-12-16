"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Admin from "../page"; // Layout Admin
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";
import Image from "next/image";

// Interfaces for Product and Category
interface Product {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  price: number;
  description: string;
  categoryId: string;
  // status: string;
  // discount: number;
}

interface Category {
  id: string;
  name: string;
}

// Product Form Component
interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}

function ProductForm({ product, categories, onSave, onCancel }: ProductFormProps) {
  const [title, setTitle] = useState(product ? product.title : "");
  const [author, setAuthor] = useState(product ? product.author : "");
  const [price, setPrice] = useState<number>(product ? product.price : 0);
  const [description, setDescription] = useState(product ? product.description : "");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [categoryId, setCategoryId] = useState(product ? product.categoryId : "");
  const [existingThumbnail, setExistingThumbnail] = useState(product ? product.thumbnail : "");
  // const [status, setStatus] = useState(product ? product.status : "available");
  // const [discount, setDiscount] = useState<number>(product ? product.discount : 0);

  useEffect(() => {
    if (product) {
      setTitle(product.title);
      setAuthor(product.author);
      setPrice(product.price);
      setDescription(product.description);
      setCategoryId(product.categoryId);
      setExistingThumbnail(product.thumbnail);
      // setStatus(product.status);
      // setDiscount(product.discount);
    }
  }, [product]);

  const handleSubmit = async () => {
    if (!title) {
      alert("Title are required!");
      return;
    }
    if (!price) {
      alert("Price are required!");
      return;
    }
    if (!categoryId) {
      alert("Category are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("categoryId", categoryId);

    if (thumbnail) {
      formData.append("thumbnail", thumbnail);  // Đảm bảo rằng bạn gửi đúng file
    }


    try {
      if (product?.id) {
        // Update Product
        await axios.put(
          `http://localhost:5000/api/admin/products/update/${product.id}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else {
        // Add Product
        await axios.post(
          "http://localhost:5000/api/admin/products/create",
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }
      onSave(product || ({} as Product));
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Failed to save the product. Please try again.");
    }
  };


  return (
    <div className="space-y-4">
      <Input placeholder="Product Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Input placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
      <Input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(parseFloat(e.target.value))} required />
      <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      {/* <Input type="number" placeholder="Discount" value={discount} onChange={(e) => setDiscount(parseFloat(e.target.value))} /> */}
      {/* <select value={status} onChange={(e) => setStatus(e.target.value)} required>
        <option value="available">Available</option>
        <option value="unavailable">Unavailable</option>
      </select> */}
      <input type="file" onChange={(e) => e.target.files && setThumbnail(e.target.files[0])} />
      {existingThumbnail && !thumbnail && (
        <Image src={`/images/${existingThumbnail}`} alt="Existing Thumbnail" width={100} height={100} />
      )}
      <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>
      <DialogFooter>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Save</Button>
      </DialogFooter>
    </div>
  );
}


// Product Management Component
export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null); // Thêm state error

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(() => {
    setLoading(true); // Bắt đầu trạng thái loading
    axios
      .get("http://localhost:5000/api/admin/products/")
      .then((response) => {
        setProducts(response.data.data || []); // Lấy dữ liệu từ API
        setLoading(false); // Kết thúc loading
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        setLoading(false); // Dù lỗi cũng cần dừng loading
      });
  }, []);


  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/category/");
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("API response is not an array", response.data);
        setCategories([]); // Cập nhật categories là một mảng trống nếu API không trả về mảng
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Error loading categories."); // Lưu thông báo lỗi vào state
    }
  };




  const handleAddOrEdit = (product: Product) => {
    fetchProducts();
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/delete/${productId}`);
      fetchProducts(); // Refresh products
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete the product. Please try again.");
    }
  };

  return (
    <Admin>
      <Card>
        <CardHeader className="px-7">
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your store's products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex justify-end">
            <Button onClick={() => {
              setEditingProduct(null); // Reset editingProduct về null khi bấm "Add Product"
              setDialogOpen(true);      // Mở modal
            }}>Add Product</Button>

          </div>
          <Dialog open={isDialogOpen} onOpenChange={setDialogOpen} modal>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
              </DialogHeader>
              <ProductForm
                product={editingProduct}  // Nếu không có dữ liệu (null), form sẽ để trống
                categories={categories}
                onSave={(product) => {
                  handleAddOrEdit(product);
                  setDialogOpen(false);
                }}
                onCancel={() => {
                  setDialogOpen(false);
                  setEditingProduct(null); // Reset lại editingProduct sau khi cancel
                }}
              />


            </DialogContent>
          </Dialog>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                // Show Loading State
                <TableRow>
                  <TableCell colSpan={7} className="text-center">Loading...</TableCell>
                </TableRow>
              ) : products.length > 0 ? (
                // Map over Products
                products.map((product) => (
                  <TableRow key={product.id}>
                    {/* Product Thumbnail */}
                    <TableCell>
                      {product.thumbnail ? (
                        <Image
                          src={`/images/${product.thumbnail}`}
                          alt={product.title}
                          width={50}
                          height={50}
                          className="object-cover rounded"
                        />
                      ) : (
                        <span>No Image</span> // Fallback for Missing Thumbnail
                      )}
                    </TableCell>

                    {/* Product Details */}
                    <TableCell>{product.title}</TableCell>
                    <TableCell>{product.author}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.description}</TableCell>

                    {/* Category Name */}
                    <TableCell>
                      {categories.find((category) => category.id === product.categoryId)?.name || 'N/A'}
                    </TableCell>

                    {/* Actions */}
                    <TableCell>
                      <Button
                        variant="default"
                        onClick={() => {
                          setEditingProduct(product);
                          setDialogOpen(true);
                        }}
                        className="mr-2"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleDelete(product.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // No Products Available
                <TableRow>
                  <TableCell colSpan={7} className="text-center">No products available.</TableCell>
                </TableRow>
              )}
            </TableBody>

          </Table>
        </CardContent>
      </Card>
    </Admin>

  );
}


