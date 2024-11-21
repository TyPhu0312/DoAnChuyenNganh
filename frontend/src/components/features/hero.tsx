"use client"
import React, { useEffect, useState } from 'react';

import Link from 'next/link';
import Image from 'next/image';
import { url } from 'inspector';
import Navbar from '@/components/features/navbar';

export default function Hero() {
    const [showBackground, setShowBackground] = useState(true);

    useEffect(() => {
        // Hàm xử lý cuộn
        const handleScroll = () => {
            if (window.scrollY > 50) { // Nếu cuộn xuống quá 50px, background sẽ ẩn
                setShowBackground(false);
            } else {
                setShowBackground(true);
            }
        };

        // Gắn sự kiện cuộn vào window
        window.addEventListener('scroll', handleScroll);

        // Hủy sự kiện cuộn khi component bị unmount
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    return (
        <>
            <div
                className={`w-full h-[500px] bg-center bg-cover rounded-bl-40px rounded-br-40px transition-opacity duration-500 bg-[url("/images/museum-lighting.png")]`}
            >
                <Navbar/>
                <div className="  pl-20 ">
                    <div className=' opacity-70 max-w-2xl text-xl mt-56 text-[#EFEFEF]'>
                        <span className='font-serif'>Welcome to Artauct, your sould destination</span>

                        <span><p className='mt-8 font-serif'>Explore our curated collection of beautiful art, from timeless classics to modern masterpieces.
                            Whether for home or office, find the perfect piece to reflect your style and elevate any space.</p></span>
                    </div>

                   
                    
                </div>
                <div className='text-center mt-60'>
                    <p className='text-3xl text-[#FCF0D7] '>Explore the latest collection</p>
                    <Link href={"/"} className='underline text-[#DADADA]'>Explore now</Link>
                    </div>

            </div>

        </>

    );
}



