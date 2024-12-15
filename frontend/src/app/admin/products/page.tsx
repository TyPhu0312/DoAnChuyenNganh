"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Admin from "../page"; // Layout Admin
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import ProductForm from "@/components/features/ProductForm";
import Image from "next/image";

// Define Product interface with additional attributes
interface Product {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  price: number;
  description: string;
  categoryId: string;
  status: string;
  discount: number;
}

interface Category {
  id: string;
  name: string;
}



export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]); // Categories state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isDialogOpen, setDialogOpen] = useState(false); // Manage dialog state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null); // Product to edit

  useEffect(() => {
    fetchProducts();
    fetchCategories(); // Fetch categories on component mount
  }, []);

  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/products/");
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setProducts(data);
      } else {
        console.error("API response is not an array", response.data);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error loading products.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from the API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/admin/category/");
      const data = response.data.data || response.data;
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        console.error("API response is not an array", response.data);
        setCategories([]);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Error loading categories.");
    }
  };

  // Save product (Add/Edit)
  const handleAddOrEdit = async (product: Product) => {
    if (!product.title.trim()) {
      alert("Please enter a product title.");
      return;
    }

    try {
      if (product.id) {
        // Update existing product
        const response = await axios.put(`http://localhost:5000/api/admin/products/update/${product.id}`, product);
        // Update product in the state
        setProducts((prevProducts) =>
          prevProducts.map((p) => (p.id === product.id ? { ...p, title: product.title, price: product.price, author: product.author, description: product.description, discount: product.discount } : p))
        );
        alert("Product updated successfully!");
      } else {
        // Add new product
        const response = await axios.post("http://localhost:5000/api/admin/products/create", product);
        setProducts((prevProducts) => [
          ...prevProducts,
          { ...product, id: response.data.id },
        ]);
        alert("Product added successfully!");
      }
      fetchProducts();
      setDialogOpen(false); // Close dialog after saving
      setEditingProduct(null); // Reset editing state
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Unable to save product. Please try again.");
    }
  };

  // Delete product
  const handleDelete = async (productId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/products/delete/${productId}`);
      // Remove deleted product from the state
      setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
      fetchProducts();
      alert("Product deleted successfully!");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert("Unable to delete product. Please try again.");
    }
  };

  return (
    <Admin>

      <Card>

        <CardHeader className="px-7">
          <CardTitle>Product Management</CardTitle>
          <CardDescription>List of all products in your store.</CardDescription>
        </CardHeader>

        <CardContent>

          <div className="mb-4 flex justify-end">
            <Button onClick={() => { setEditingProduct(null); setDialogOpen(true); }}>
              Add Product
            </Button>

          </div>
          <div className="">
            <Dialog open={isDialogOpen} onOpenChange={setDialogOpen} modal>
              <DialogContent >
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </DialogTitle>
                </DialogHeader>
                <ProductForm
                  product={editingProduct}
                  categories={categories} // Pass categories to the form
                  onSave={handleAddOrEdit}
                  onCancel={() => setDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
          {/* Dialog for Add/Edit */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Title</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div>
                      <Image
                        src={`/images/${product.thumbnail}`}
                        alt={product.title}
                        width={100}
                        height={100}
                        quality={100}
                        className="rounded-t-md w-full h-full object-cover"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{product.title}</div>
                  </TableCell>
                  <TableCell>
                    <div>{product.author}</div>
                  </TableCell>

                  <TableCell>
                    <div>{product.price}</div>
                  </TableCell>
                  <TableCell>
                    <div>{product.description}</div>
                  </TableCell>
                  <TableCell>
                    {/* Display category name */}
                    <div>
                      {categories.find((category) => category.id === product.categoryId)?.name || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" onClick={() => { setEditingProduct(product); setDialogOpen(true); }}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(product.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>


    </Admin>

  );
};





