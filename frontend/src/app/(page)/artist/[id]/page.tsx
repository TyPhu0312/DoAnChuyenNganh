"use client";
import Image from 'next/image';
import { useParams } from "next/navigation"; // Thay thế useRouter
import React, { useEffect, useState } from 'react';

interface Artwork {
  id: string;
  title: string;
  thumbnail: string;
}

interface Artist {
  id: string;
  name: string;
  email: string;
}

const ArtistDetailPage: React.FC = () => {
  const params = useParams(); // Lấy tham số từ URL
  const id = params?.id as string; // ID của artist được lấy từ URL

  const [artist, setArtist] = useState<Artist | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>([]);

  useEffect(() => {
    if (id) {
      const fetchArtistData = async () => {
        try {
          const userRes = await fetch(`http://localhost:5000/api/admin/user/${id}`);
          const artworksRes = await fetch(`http://localhost:5000/api/admin/products/artist/${id}`);
          const userData = await userRes.json();
          const artworksData = await artworksRes.json();
          if (userData.success) setArtist(userData.data);
          if (artworksData.success) setArtworks(artworksData.data);
        } catch (error) {
          console.error('Error fetching artist data:', error);
        }
      };

      fetchArtistData();
    }
  }, [id]);

  if (!artist) return <p>Loading...</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">{artist.name}</h2>
      <p>Email: {artist.email}</p>

      <h3 className="text-2xl font-semibold mt-6">Artworks</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((art) => (
          <div key={art.id} className="border rounded-lg shadow-lg p-4">
            <Image
              src={art.thumbnail || '/default-art.jpg'}
              alt={art.title}
              width={500}
              height={300}
              className="w-full h-48 object-cover"
            />
            <h4 className="text-lg font-medium mt-2">{art.title}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtistDetailPage;
