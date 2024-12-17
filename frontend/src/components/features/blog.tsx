import React from 'react';
import Link from 'next/link'; // Sử dụng Link của Next.js
import { Button } from '../ui/button'; // Tùy chỉnh Button của bạn
import Image from 'next/image';

interface BlogItem {
    title: string;
    description: string;
    imageUrl: string;
    link: string;
}

interface BlogProps {
    blogItems: BlogItem[];
}

const Blog: React.FC<BlogProps> = ({ blogItems }) => {
    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Artist Blog Resources</h2>
            <p className="text-lg">
                Our blog gives tips to help you craft your artistic identity and present your work professionally. Follow the latest trends, improve your knowledge with how-to’s, and find out how to market your work on our blog.
            </p>
            <Button variant="outline" className="mt-4">
                <Link href="#">Explore the blog &rarr;</Link>
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                {blogItems.map((item, index) => (
                    <div key={index} className="border rounded-lg overflow-hidden shadow-lg">
                        {/* Hình ảnh với fallback nếu bị lỗi */}
                        <Image
                            src={item.imageUrl}
                            alt={item.title}
                            layout='fill'
                            className="w-full h-56 object-cover"
                            onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = ''; // Fallback hình ảnh cục bộ
                            }}
                        />
                        <div className="p-4">
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                            <Link href={item.link} className="text-blue-500 hover:underline mt-2 inline-block">
                                Read more &rarr;
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Blog;
