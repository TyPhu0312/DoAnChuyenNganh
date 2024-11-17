"use client"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import Link from 'next/link';
import Image from 'next/image';
import React from 'react'

export default function scrollart() {
    return (
        <div className="p-4">
            <ScrollArea className="w-96 whitespace-nowrap rounded-md border">
            <div className="flex w-max space-x-4 p-4">
                <figure className="shrink-0">
                    <div className="overflow-hidden rounded-md">
                        <Link href={'/'} className="flex items-center">
                        <Image
                            src='/images/hero2.jpg'
                            alt='anh'
                            className="aspect-[3/4] h-fit w-fit object-cover"
                            width={100}
                            height={160}
                            quality={100}
                        />
                        </Link>
                    </div>
                    <figcaption className="pt-2 text-xs text-muted-foreground">
                        Photo by{" "}
                        <span className="font-semibold text-foreground">
                            anh
                        </span>
                    </figcaption>
                </figure>
                <figure className="shrink-0">
                    <div className="overflow-hidden rounded-md">
                    <Link href={'/'} className="flex items-center">
                        <Image
                            src='/images/hero5.png'
                            alt='anh'
                            className="aspect-[3/4] h-fit w-fit object-cover"
                            width={100}
                            height={160}
                            quality={100}
                        />
                    </Link>
                    </div>
                    <figcaption className="pt-2 text-xs text-muted-foreground">
                        Photo by{" "}
                        <span className="font-semibold text-foreground">
                            anh
                        </span>
                    </figcaption>
                </figure>
                <figure className="shrink-0">
                    <div className="overflow-hidden rounded-md">
                    <Link href={'/'} className="flex items-center">
                        <Image
                            src='/images/hero6.png'
                            alt='anh'
                            className="aspect-[3/4] h-fit w-fit object-cover"
                            width={100}
                            height={160}
                            quality={100}
                        />
                    </Link>
                    </div>
                    <figcaption className="pt-2 text-xs text-muted-foreground">
                        Photo by{" "}
                        <span className="font-semibold text-foreground">
                            anh
                        </span>
                    </figcaption>
                </figure>
            </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}




