import React, { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ToggleSwitch } from "@/components/features/toggleSwitchProps";

interface Category {
    id: string;
    name: string;
}

interface ArtworkFilterProps {
    label: string;
    placeholder: string;
    onCategoryChange: (value: string | undefined) => void;
}

const fetchCategories = async (): Promise<Category[]> => {
    try {
        const res = await fetch("http://localhost:5000/api/admin/category");
        const data = await res.json();
        if (Array.isArray(data.data)) {
            console.log("Fetched categories:", JSON.stringify(data.data, null, 2));
            return data.data;
        } else {
            console.error("Data fetched is not an array:", data.data);
            return [];
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

const ArtworkFilter: React.FC<ArtworkFilterProps> = ({ label, placeholder, onCategoryChange }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isFilterEnabled, setIsFilterEnabled] = useState<boolean>(true);

    useEffect(() => {
        const loadCategories = async () => {
            setIsLoading(true);
            const categoriesData = await fetchCategories();
            setCategories(categoriesData);
            setIsLoading(false);
        };
        loadCategories();
    }, []);

    const handleCategoryChange = (value: string | undefined) => {
        if (value === "none") {
            setSelectedCategory(undefined);
            onCategoryChange(undefined);
        } else if (isFilterEnabled) {
            setSelectedCategory(value);
            onCategoryChange(value);
        }
    };

    const handleFilterToggle = (enabled: boolean) => {
        setIsFilterEnabled(enabled); // Cập nhật trạng thái filter
        if (!enabled) {
            setSelectedCategory(undefined);
            onCategoryChange(undefined);
        } else {
            if (selectedCategory) {
                onCategoryChange(selectedCategory);
            } else {
                onCategoryChange(undefined);
            }
        }
    };


    return (
        <div className="ml-[50px]">
            <div className="flex space-x-3 mb-3 ">
                <label htmlFor="category" className="block mb-2 font-semibold">
                    {label}
                </label>
                <ToggleSwitch label="" onToggle={handleFilterToggle} />
            </div>

            <Select
                value={selectedCategory}
                onValueChange={handleCategoryChange}
                disabled={!isFilterEnabled} // Disable Select nếu filter bị tắt
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {isLoading ? (
                        <SelectItem value="loading">Loading...</SelectItem>
                    ) : (
                        <>
                            {/* Thêm giá trị "None" để reset filter */}
                            <SelectItem value="none">None</SelectItem>
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                    </SelectItem>
                                ))
                            ) : (
                                <SelectItem value="no-category">No categories available</SelectItem>
                            )}
                        </>
                    )}
                </SelectContent>
            </Select>
        </div>
    );
};

export default ArtworkFilter;
