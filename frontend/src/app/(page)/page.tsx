"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/features/hero";
import ScrollArt from "@/components/features/scrollart";
import axios from "axios";
import { useUser } from '@clerk/clerk-react'
export default function Home({
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
    const { isSignedIn, user, isLoaded } = useUser()
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
            <main className="flex flex-1 flex-col m-0 bg-[#e0e0e0ee] ">
                <Hero />
                <div className="mt-[40px]">
                    <a href='/updateProfileUser'>
                    <p className="text-2xl font-robotoCondensed text-left ml-[40px] mb-[30px] font-bold">
                        All new artwork
                    </p>
                    </a>
            
                    <p className="text-2xl font-robotoCondensed text-left ml-[40px] mb-[30px] font-bold">
                        All new artwork
                    </p>
                    <div
                        id="list-art"
                        className="mx-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 "
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="mb-3 max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                            >
                                <div className="h-[220px]"> {/* Đặt chiều cao cố định cho ảnh */}
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
                                        <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                                            {product.title}
                                        </h5>
                                    </Link>
                                    <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                        {product.author}
                                    </p>
                                    <p className="mb-3 text-[#A1516F] dark:text-gray-400 font-bold">
                                        ${product.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="text-center  m-20 text-xl">
                        <Link href={"/allProduct"}>
                            {" "}
                            <span className="underline">See All </span>{" "}
                            <span></span>{" "}
                        </Link>
                        {/* // kiếm cái hình khác bỏ dô */}
                    </div>
                </div>
                <ScrollArt/>
                <div className="text-center  m-20 text-xl">
                        <Link href={"/Collection"}>
                            {" "}
                            <span className="underline">See All </span>{" "}
                            <span></span>{" "}
                        </Link>
                        {/* // kiếm cái hình khác bỏ dô */}
                    </div>
                {children}
            </main>
        </>
    );
}
