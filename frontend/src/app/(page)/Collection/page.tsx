"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/features/hero";
import ScrollArt from "@/components/features/scrollart";
import CircleLine from "@/components/features/circle-line";
import axios from "axios";
export default function Collection({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    type Product = {
        id: string; // hoặc string, tùy theo định nghĩa trong database
        title: string;
        author: string;
        thumbnail: string;
        price: number;
        image: string;
    };

    const [products, setProducts] = useState<Product[]>([]);

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

    return (
        <>
            <main className="flex flex-1 flex-col  m-0 bg-[#e0e0e0ee] ">
                <Hero/>
                        <ScrollArt />
                {children}
            </main>
        </>
    );
}
