"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/features/hero";
import ScrollArt from "@/components/features/scrollart";
import axios from "axios";
import { useUser } from '@clerk/clerk-react';
import { formatCurrencyVND } from "@/lib/utils/currencyFormatter";
import Blog from "@/components/features/blog";
import ExploreArtist from "@/components/features/ExploreArtist"; // Import ExploreArtist

export default function Home({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    type Product = {
        id: string;
        title: string;
        author: string;
        thumbnail: string;
        price: number;
        image: string;
    };
    const [products, setProducts] = useState<Product[]>([]);
    const { isSignedIn, user, isLoaded } = useUser();

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
                console.error(
                    "Chi tiết lỗi:",
                    err.response ? err.response.data : err.message
                );
                alert("Có lỗi xảy ra, vui lòng thử lại.");
                setProducts([]);
            });
    }, []);

    return (
        <>
            <main className="flex flex-1 flex-col m-0 bg-[#f0f3f8] ">
                <Hero />
                <div className="mt-[40px]">
                    <p className="text-2xl font-robotoCondensed text-left ml-[40px] mb-[30px] font-bold">
                        All new artwork
                    </p>
                    <div
                        id="list-art"
                        className="mx-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-5"
                    >
                        {products.map((product) => (
                            <div
                                key={product.id}
                                className="relative mb-3 max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-md shadow dark:bg-gray-800 dark:border-gray-700 overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg group"
                            >
                                <div className="h-[200px]">
                                    <Link href={`/ProductDetail/${product.id}`}>
                                        <Image
                                            src={`/images/${product.thumbnail}`}
                                            alt={product.title}
                                            width={150}
                                            height={150}
                                            quality={70}
                                            className="rounded-t-md w-full h-full object-cover"
                                        />
                                    </Link>
                                </div>

                                <div className="pt-5 pl-5 pr-5">
                                    <Link href={`/ProductDetail/${product.id}`}>
                                        <h5 className="mb-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                                            {product.title}
                                        </h5>
                                    </Link>
                                    <p className="mb-3 font-normal font-serif text-gray-700 dark:text-gray-400">
                                        {product.author}
                                    </p>
                                    <p className="mb-3 text-[#dd3145] font-serif dark:text-gray-400 font-bold">
                                        {formatCurrencyVND(product.price)}
                                    </p>
                                </div>

                                <div className="text-gray-700 text-xs font-serif font-bold text-center pl-6 pb-[5px] pr-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    View Detail  <span className="ml-1">&#8594;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="text-center m-10 text-xl">
                        <Link href={"/allProduct"}>
                            <span className="relative font-robotoSerif underline inline-block px-4 py-2 border-rounded-md text-gray-950 hover:bg-gray-700 hover:text-white transition-all duration-300">
                                See All
                            </span>
                        </Link>
                    </div>
                </div>
                <div className="bg-gray-700 mt-10 mb-10 px-5">
                    <ExploreArtist />
                </div>
                {/* <div className="p-8 bg-white">
                    <Blog blogItems={blogItems} />
                </div> */}
                <ScrollArt />

                <div className="text-center m-20 text-xl">
                    <Link href={"/Collection"}>
                        <span className="underline">See All </span>
                    </Link>
                </div>

                {children}
            </main>
        </>
    );
}
