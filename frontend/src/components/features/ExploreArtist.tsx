"use client";
import React, { useEffect, useState } from "react";
import CardArtist from "@/components/features/CardArtist";
import axios from "axios";

interface Artwork {
  id: string;
  title: string;
  thumbnail: string;
  artistId: string;
  author: string; // artist's name
}

interface GroupedArtists {
  [artistId: string]: {
    artistName: string;
    thumbnail: string; // Thumbnail của tác phẩm đại diện
  };
}

const ExploreArtist: React.FC = () => {
  const [groupedArtists, setGroupedArtists] = useState<GroupedArtists>({});

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/admin/products/");
        const data: Artwork[] = response.data.data || [];
        const artistGroups: GroupedArtists = {};
        data.forEach((artwork) => {       
          if (!artistGroups[artwork.artistId]) {
            artistGroups[artwork.artistId] = {
              artistName: artwork.author,
              thumbnail: artwork.thumbnail, 
            };
          }
        });

        setGroupedArtists(artistGroups);
        console.log(artistGroups);
      } catch (error) {
        console.error("Error fetching artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  return (
    <div className="space-y-6 p-8">
      <h2 className="text-3xl font-thin text-center text-white mb-10 font-robotoSerif">Explore Artists</h2>

      {/* Render danh sách artist */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(groupedArtists).map(([artistId, artistInfo]) => (
          <div key={artistId}>
            <CardArtist
              name={artistInfo.artistName}
              thumbnail={artistInfo.thumbnail} // Hiển thị bức tranh đại diện của tác giả
              description="Một tác giả sở hữu số lượng kiến thức khủng nhờ vào sự chăm chỉ và nỗ lực của mình, Ánh Trăng mang đến cho người xem những tác phẩm có cái tôi cao đẹp của kiến thức."
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreArtist;
