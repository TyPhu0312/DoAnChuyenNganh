// ProductFormModal.tsx
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

// Định nghĩa các interface
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

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product | null;
    categories: Category[];
    onSave: (product: Product) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
    isOpen,
    onClose,
    product,
    categories,
    onSave,
}) => {
    const [formProduct, setFormProduct] = useState<Product | null>(product);

    useEffect(() => {
        setFormProduct(product);
    }, [product]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formProduct) {
            onSave(formProduct);
        }
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: keyof Product
    ) => {
        if (formProduct) {
            setFormProduct({ ...formProduct, [field]: e.target.value });
        }
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (formProduct) {
            setFormProduct({ ...formProduct, categoryId: e.target.value });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal>
            <DialogContent>
                <DialogTitle>
                    <DialogTitle>{product ? "Edit Product" : "Add Product"}</DialogTitle>
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title</label>
                        <input
                            type="text"
                            value={formProduct?.title || ""}
                            onChange={(e) => handleChange(e, "title")}
                            required
                        />
                    </div>

                    <div>
                        <label>Price</label>
                        <input
                            type="number"
                            value={formProduct?.price || 0}
                            onChange={(e) => handleChange(e, "price")}
                            required
                        />
                    </div>

                    <div>
                        <label>Author</label>
                        <input
                            type="text"
                            value={formProduct?.author || ""}
                            onChange={(e) => handleChange(e, "author")}
                        />
                    </div>

                    <div>
                        <label>Description</label>
                        <textarea
                            value={formProduct?.description || ""}
                            onChange={(e) => handleChange(e, "description")}
                        />
                    </div>

                    <div>
                        <label>Category</label>
                        <select
                            value={formProduct?.categoryId || ""}
                            onChange={handleCategoryChange}
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-end mt-4">
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button type="submit" className="ml-2">
                            Save
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
