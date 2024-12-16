"use client"
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Admin from "../page"; // Layout Admin
import axios from "axios";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "@/components/ui/input";

// Define Category interface
interface Category {
    id: string;
    name: string;
}

interface CategoryFormProps {
    category: Category | null; // Category to edit or add
    onSave: (category: Category) => void; // Save handler
    onCancel: () => void; // Cancel handler
}

export default function Category() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isDialogOpen, setDialogOpen] = useState(false); // Manage dialog state
    const [editingCategory, setEditingCategory] = useState<Category | null>(null); // Category to edit

    useEffect(() => {
        fetchCategories();
    }, []);

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
        } finally {
            setLoading(false);
        }
    };

    // Save category (Add/Edit)
    const handleAddOrEdit = async (category: Category) => {
        if (!category.name.trim()) {
            alert("Please enter a category name.");
            return;
        }

        try {
            if (category.id) {
                // Update existing category
                const response = await axios.put(`http://localhost:5000/api/admin/category/update/${category.id}`, {
                    name: category.name,
                });
                // Update category in the state
                setCategories((prevCategories) =>
                    prevCategories.map((c) => (c.id === category.id ? { ...c, name: category.name } : c))
                );
                alert("Category updated successfully!");
            } else {
                // Add new category
                const response = await axios.post("http://localhost:5000/api/admin/category/create", {
                    name: category.name,
                });
                setCategories((prevCategories) => [
                    ...prevCategories,
                    { ...category, id: response.data.id },
                ]);
                alert("Category added successfully!");
            }
            setDialogOpen(false); // Close dialog after saving
            setEditingCategory(null); // Reset editing state
        } catch (err) {
            console.error("Error saving category:", err);
            alert("Unable to save category. Please try again.");
        }
    };

    // Delete category
    const handleDelete = async (categoryId: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/admin/category/delete/${categoryId}`);
            // Remove deleted category from the state
            setCategories((prevCategories) => prevCategories.filter((category) => category.id !== categoryId));
            alert("Category deleted successfully!");
        } catch (err) {
            console.error("Error deleting category:", err);
            alert("Unable to delete category. Please try again.");
        }
    };

    return (
        <Admin>
            <Card>
                <CardHeader className="px-7">
                    <CardTitle>Category</CardTitle>
                    <CardDescription>List of all product categories in your store.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="mb-4 flex justify-end">
                        <Button onClick={() => { setEditingCategory(null); setDialogOpen(true); }}>
                            Add Category
                        </Button>
                    </div>
                    {/* Dialog for Add/Edit */}
                    <Dialog open={isDialogOpen} onOpenChange={setDialogOpen} modal>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingCategory ? "Edit Category" : "Add Category"}
                                </DialogTitle>
                            </DialogHeader>
                            <CategoryForm
                                category={editingCategory}
                                onSave={handleAddOrEdit}
                                onCancel={() => setDialogOpen(false)}
                            />
                        </DialogContent>
                    </Dialog>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Category ID</TableHead>
                                <TableHead>Category Name</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell>
                                        <div className="font-medium">{category.id}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{category.name}</div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" onClick={() => { setEditingCategory(category); setDialogOpen(true); }}>
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)}>
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

// Form for Add/Edit
function CategoryForm({ category, onSave, onCancel }: CategoryFormProps) {
    const [name, setName] = useState(category ? category.name : "");

    const handleSubmit = () => {
        if (!name.trim()) return;

        // If category is null (for Add case), create a new category object
        const categoryToSave = category
            ? { ...category, name } // Edit existing category
            : { id: "", name }; // Add new category with no ID (you can handle ID generation when saving)

        onSave(categoryToSave); // Pass the category to the parent (Category)
    };

    return (
        <div className="space-y-4">
            <Input
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
            />
            <DialogFooter>
                <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSubmit}>Save</Button>
            </DialogFooter>
        </div>
    );
}
