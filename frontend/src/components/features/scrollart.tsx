"use client";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import axios from "axios";
import CircleLine from "@/components/features/circle-line";

export default function Scrollart() {
    type Product = {
        id: string;
        title: string;
        author: string;
        categoryId: string;
        categoryName: string; // Đảm bảo có tên danh mục trong dữ liệu
        thumbnail: string;
        price: number;
        image: string;
    };

    const [products, setProducts] = useState<Product[]>([]);

    // Fetch products
    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/products/")
            .then((response) => {
                const data = response.data.data || response.data;
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error("API response is not an array", response.data);
                    setProducts([]);
                }
            })
            .catch((err) => {
                console.error("Error details:", err.response ? err.response.data : err.message);
                alert("An error occurred, please try again.");
                setProducts([]);
            });
    }, []);

    // Group products by author and category name
    const groupedByAuthor = products.reduce((acc, product) => {
        if (!acc[product.author]) {
            acc[product.author] = [];
        }
        acc[product.author].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    const groupedByCategory = products.reduce((acc, product) => {
        if (!acc[product.categoryName]) {
            acc[product.categoryName] = [];
        }
        acc[product.categoryName].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <div className="bg-[#bc907d] mt-10">
            {/* Section grouped by Author */}
            <p className="text-3xl text-center my-20 font-bold text-[#C8C8C8]">
                Collections by Author
            </p>
            <div className="bg-[#6A4D41]">
                {Object.keys(groupedByAuthor).length > 0 ? (
                    Object.keys(groupedByAuthor).map((author) => (
                        <div key={author} className="relative w-full bg-brown-900 p-4 mb-8 ">
                            <h2 className="text-xl font-bold text-white ">Author: {author}</h2>
                            <CircleLine />
                            <ScrollArea className="lg:w-[50%] sm:w-[100%] whitespace-nowrap rounded-md">
                                <div className="flex w-max space-x-4 p-4 justify-center">
                                    {groupedByAuthor[author].map((product) => (
                                        <div key={product.id} className="shrink-0">
                                            <div className="overflow-hidden rounded-md">
                                                <Link href={`/ProductDetail/${product.id}`} className="flex items-center">
                                                    <Image
                                                        src={`/images/${product.thumbnail}`}
                                                        alt={product.title}
                                                        width={100}
                                                        height={160}
                                                        quality={100}
                                                        className="aspect-[3/4] h-fit w-fit object-cover"
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    ))
                ) : (
                    <div className="col-span-6 text-center text-white">No products available</div>
                )}
            </div>

            {/* Section grouped by Category */}
            <p className="text-3xl text-center my-20 font-bold text-[#C8C8C8]">
                Collections by Category
            </p>
            <div className="bg-[#56463e]">
                {Object.keys(groupedByCategory).length > 0 ? (
                    Object.keys(groupedByCategory).map((category) => (
                        <div key={category} className="relative w-full bg-brown-900 p-4 ">
                            <h2 className="text-xl font-bold text-white">Category: {category}</h2>
                            <CircleLine />
                            <ScrollArea className="lg:w-[50%] sm:w-[100%] whitespace-nowrap rounded-md">
                                <div className="flex w-max space-x-4 p-4 justify-center">
                                    {groupedByCategory[category].map((product) => (
                                        <div key={product.id} className="shrink-0">
                                            <div className="overflow-hidden rounded-md">
                                                <Link href={`/ProductDetail/${product.id}`} className="flex items-center">
                                                    <Image
                                                        src={`/images/${product.thumbnail}`}
                                                        alt={product.title}
                                                        width={100}
                                                        height={160}
                                                        quality={100}
                                                        className="aspect-[3/4] h-fit w-fit object-cover"
                                                    />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    ))
                ) : (
                    <div className="col-span-6 text-center text-white">No products available</div>
                )}
            </div>
        </div>
    );
}
