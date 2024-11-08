import React from 'react'
import Navbar from '@/components/features/navbar'
import { redirect } from 'next/navigation';

// const isAuth = true;
export default function Home({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    // if(!isAuth){
    //     redirect('/login');
    // }

  
    return (
        <main className="bg-[url('/images/museum-lighting.png')]  bg-cover bg-center bg-fixed h-screen w-full">
            <Navbar/>
            <div >
                
            </div>
        </main>
    )
}
