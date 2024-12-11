"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/features/hero";
import axios from "axios";
import Breadcrumb from "@/components/features/Breadcrumb";
import SortBar from "@/components/features/artworkFilter";
import SearchBox from "@/components/features/searchBox";

export default function AllProduct() {
    type Product = {
        id: string;
        title: string;
        author: string;
        thumbnail: string;
        price: number;
        image: string;
    };

    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
    const [searchResults, setSearchResults] = useState<string>("");

    // Hàm lấy toàn bộ sản phẩm
    const fetchProducts = useCallback(() => {
        axios
            .get("http://localhost:5000/api/admin/products/")
            .then((response) => setProducts(response.data.data || []))
            .catch((err) => console.error("Error fetching products:", err));
    }, []);

    // Lấy sản phẩm và danh mục khi component render lần đầu
    useEffect(() => {
        fetchProducts();
        axios
            .get("http://localhost:5000/api/admin/category")
            .then((response) => setCategories(response.data.data))
            .catch((err) => console.error("Error fetching categories:", err));
    }, [fetchProducts]);

    // Cập nhật sản phẩm theo danh mục
    useEffect(() => {
        if (selectedCategory) {
            axios
                .get(`http://localhost:5000/api/admin/products/category/${selectedCategory}`)
                .then((response) => setProducts(response.data.data || []))
                .catch((err) => console.error("Error fetching products by category:", err));
        } else {
            fetchProducts();
        }
    }, [selectedCategory, fetchProducts]);

    // Xử lý logic tìm kiếm
    const handleSearch = useCallback((query: string) => {
        setSearchResults(query.toLowerCase());
    }, []);

    const filteredProducts = searchResults
        ? products.filter((product) =>
              product.title.toLowerCase().includes(searchResults) ||
              product.author.toLowerCase().includes(searchResults)
          )
        : products; // Hiển thị tất cả sản phẩm khi searchResults rỗng

    return (
        <main className="flex flex-1 flex-col m-0 bg-[#e0e0e0ee]">
            <Hero />
            <div className="flex flex-col space-y-[50px]">
                <Breadcrumb
                    links={[
                        { label: "Home", href: "/" },
                        { label: "All Product", href: "/allProduct" },
                    ]}
                />
                <SortBar
                    label="Filter by Category"
                    placeholder="Select category"
                    onCategoryChange={setSelectedCategory}
                />
                <div className="w-full max-w-md lg:ml-10 mx-3">
                    <SearchBox onSearch={handleSearch} />
                </div>
                <div className="AllNewArtWork">
                    <p className="text-2xl font-robotoCondensed text-left ml-[40px] mb-[30px] font-bold">
                        All new artwork
                    </p>
                    <div className="mx-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="mb-3 max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-md shadow overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                                >
                                    <div className="h-[220px]">
                                        <Link href={`/ProductDetail/${product.id}`}>
                                            <Image
                                                src={`/images/${product.thumbnail}`}
                                                alt={product.title}
                                                width={200}
                                                height={200}
                                                quality={100}
                                                className="rounded-t-md w-full h-full object-cover"
                                            />
                                        </Link>
                                    </div>
                                    <div className="p-5">
                                        <Link href={`/ProductDetail/${product.id}`}>
                                            <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900">
                                                {product.title}
                                            </h5>
                                        </Link>
                                        <p className="mb-3 font-normal text-gray-700">
                                            {product.author}
                                        </p>
                                        <p className="mb-3 text-[#A1516F] font-bold">
                                            ${product.price}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-6 text-center">No products available</div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
