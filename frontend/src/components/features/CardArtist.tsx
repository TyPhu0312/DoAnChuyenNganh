"use client";
import Image from "next/image";

interface CardArtistProps {
  name: string;
  thumbnail: string; 
  description: string; 
}

const CardArtist: React.FC<CardArtistProps> = ({ name, thumbnail, description }) => {
  return (
    <div className="flex items-center p-4 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow duration-300">
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-800 font-robotoSlab">{name}</h3>
        <p className="text-sm text-gray-600 mt-2 font-thin">{description}</p>
      </div>
      <div className="w-36 h-24 relative ml-4 overflow-hidden">
        <Image
          src={`/images/${thumbnail || "default-art.jpg"}`}
          alt={name}
          layout="intrinsic" // Sử dụng layout intrinsic cho ảnh
          objectFit="cover"
          className="rounded-full"
          width={144} // Đảm bảo ảnh có kích thước cố định
          height={96} // Đảm bảo ảnh có kích thước cố định
        />
      </div>
    </div>
  );
};

export default CardArtist;
