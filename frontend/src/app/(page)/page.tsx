import React from 'react'
import Navbar from '@/components/features/navbar'
import ProductCard from '@/components/features/product-card';

export default function Home({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className='w-full h-[500px]'>
            <Navbar/>
            {/* <ProductCard/> */}
        </div>
    )
}
