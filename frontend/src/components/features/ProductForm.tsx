import { useState } from "react"; // Ensure useState is imported

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axios from "axios";
import styles from "@/lib/css/Modal.module.css";
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

interface ProductFormProps {
    product: Product | null;
    onSave: (product: Product) => void;
    onCancel: () => void;
    categories: Category[];
}

function ProductForm({ product, onSave, onCancel, categories }: ProductFormProps) {
    const [title, setTitle] = useState(product ? product.title : "");
    const [author, setAuthor] = useState(product ? product.author : "");
    const [price, setPrice] = useState<number>(product ? product.price : 0);
    const [description, setDescription] = useState(product ? product.description : "");
    const [thumbnail, setThumbnail] = useState<File | null>(null); // Changed to File | null
    const [categoryId, setCategoryId] = useState(product ? product.categoryId : "");

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const numericValue = value ? parseFloat(value) : 0;
        setPrice(numericValue);
    };

    const handleSubmit = async () => {
        if (!title || !price || !categoryId) return;

        // Create FormData to submit
        const productToSave = new FormData();
        productToSave.append('title', title);
        productToSave.append('author', author);
        productToSave.append('price', price.toString());
        productToSave.append('description', description);
        productToSave.append('categoryId', categoryId);
        productToSave.append('status', ''); // Add default or set value for status
        productToSave.append('discount', '0'); // Add default or set value for discount

        if (thumbnail) { // If there is a file selected
            productToSave.append('thumbnail', thumbnail); // Add the file to the form data
        }

        try {
            const response = await axios.post("http://localhost:5000/api/admin/products/create", productToSave, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Set the content type for file upload
                }
            }).then(response => {
                const thumbnailUrl = response.data.thumbnailUrl; // Lấy URL hình ảnh trả về từ backend
                console.log("Thumbnail URL: ", thumbnailUrl);
                // Handle success (for example, notify the user or refresh the product list)
                console.log("Product uploaded successfully:", response.data);
                onSave(response.data); // Call onSave if you want to refresh the list or handle after save
                // Bạn có thể lưu URL này vào state hoặc sử dụng nó trực tiếp để hiển thị hình ảnh
            }).catch(error => {
                console.error("Error uploading product:", error);
            });

        } catch (error) {
            console.error("Error uploading product:", error);
        }
    };


    return (
        <div className="space-y-4">
            <Input
                placeholder="Product Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <Input
                placeholder="Author"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
            />
            {/* Price input with conversion to number */}
            <Input
                type="number"
                placeholder="Price"
                value={price}
                onChange={handlePriceChange}
                required
            />
            <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            {/* File input for thumbnail */}
            <input
                type="file"
                onChange={(e) => {
                    if (e.target.files) {
                        setThumbnail(e.target.files[0]); // Store the selected file
                    }
                }}
            />

            {/* Category Dropdown */}
            <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="input"
            >
                <option value="">Select Category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>

            <DialogFooter>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogFooter>
        </div>
    );
}

export default ProductForm;
