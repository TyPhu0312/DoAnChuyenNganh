
import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import Hero from '@/components/features/hero';
import ScrollArt from '@/components/features/scrollart';
import CircleLine from '@/components/features/circle-line';

export default function Home({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    // if(!isAuth){
    //     redirect('/login');
    // }


    return (
        <>

            <main className="flex flex-1 flex-col  m-0 bg-[#F3EEE1] " >
                <Hero />

                <div className='mt-32'>
                    <p className='text-3xl text-center mb-20 font-bold'>Explore the latest collection</p>
                    <div id='list-art' className='mx-10 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4' >
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                        <div className="mb-3  max-w-[200px] max-h-[400px] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                            <Link href="#">
                                <Image src='/images/hero.jpg'
                                    alt='logo'
                                    width={200}
                                    height={200}
                                    quality={100}
                                    className='rounded-lg object-cover ' />

                            </Link>
                            <div className="p-5">
                                <Link href="#">
                                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Author King</h5>
                                </Link>
                                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">Alexander Graham</p>
                                <p className="mb-3  text-[#A1516F] dark:text-gray-400 font-bold">$1900</p>
                            </div>
                        </div>
                    </div>

                    <div className='text-center  m-20 text-xl'>
                        <Link href={"#"} > <span className='underline'>See All </span> <span></span> </Link>
                        {/* // kiếm cái hình khác bỏ dô */}

                    </div>

                </div>
                <div className='bg-[#40342E]'>
                    <p className='text-3xl text-center my-20 font-bold text-[#C8C8C8]'>Collections on trending</p>
                    <div>
                        <div className="relative w-full bg-brown-900 p-4">
                            {/* Tiêu đề */}
                            <h1 className="text-white text-xl font-semibold">
                                Old things collections
                            </h1>
                            {/* Đường ngang với hình tròn */}
                            <CircleLine />
                            
                        </div>
                        <ScrollArt />
                    </div>
                    <div className='bg-[#6A4D41]'>
                        <div className="relative w-full bg-brown-900 p-4">
                            {/* Tiêu đề */}
                            <h1 className="text-white text-xl font-semibold">
                                Old things collections
                            </h1>
                            {/* Đường ngang với hình tròn */}
                            <CircleLine />
                            
                        </div>
                        <ScrollArt />
                    </div>

                </div>

                {children}
            </main>
        </>

    )
}
