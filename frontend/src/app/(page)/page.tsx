import React from 'react'
import Navbar from '@/components/features/navbar'
export default function Home({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className=''>
            <Navbar/>
        </div>

    )
}
