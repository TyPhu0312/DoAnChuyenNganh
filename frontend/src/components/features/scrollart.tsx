"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from 'next/link';
import Image from 'next/image';
import React, { useState, useEffect } from 'react' // Make sure useState is imported
import axios from "axios";
import CircleLine from "@/components/features/circle-line";

export default function scrollart() {
    type Product = {
        id: string;
        title: string;
        author: string;
        thumbnail: string;
        price: number;
        image: string;
    };

    const [products, setProducts] = useState<Product[]>([]); // Correctly manage state

    useEffect(() => {
        axios
            .get("http://localhost:5000/api/admin/products/")
            .then((response) => {
                const data = response.data.data || response.data;
                if (Array.isArray(data)) {
                    setProducts(data); // Set products data
                } else {
                    console.error("API response is not an array", response.data);
                    setProducts([]); // Fallback to empty array
                }
            })
            .catch((err) => {
                console.error("Error details:", err.response ? err.response.data : err.message);
                alert("An error occurred, please try again.");
                setProducts([]); // Fallback to empty array in case of error
            });
    }, []); // Fetch data once when the component is mounted

    // Group products by author
    const groupedByAuthor = products.reduce((acc, product) => {
        if (!acc[product.author]) {
            acc[product.author] = [];
        }
        acc[product.author].push(product);
        return acc;
    }, {} as Record<string, Product[]>);

    return (
        <div className=" p-4">
            {Object.keys(groupedByAuthor).length > 0 ? (
                Object.keys(groupedByAuthor).map((author) => (
                    <div key={author} className="mb-8"> {/* Center the content */}
                         <h2 className="text-2xl font-bold mb-4 text-white">Author: {author}</h2>
                        <CircleLine />
                        <ScrollArea className="w-[50%] sm:w-[100%] whitespace-nowrap rounded-md ">
                            <div className="flex w-max space-x-4 p-4 justify-center"> {/* Center the images horizontally */}
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
                <div className="col-span-6 text-center">No products available</div>
            )}
        </div>
    );
}
