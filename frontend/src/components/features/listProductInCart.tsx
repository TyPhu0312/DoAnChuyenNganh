// src/components/ui/ListProductInCart.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/features/cartContext";

interface Product {
  id: string;
  title: string;
  author: string;
  price: number;
  thumbnail: string;
}

interface Props {
  products: Product[];
}

const ListProductInCart: React.FC<Props> = ({ products }) => {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {products.length > 0 ? (
        products.map((product) => (
          <div
            key={product.id}
            className="max-w-[200px] max-h-[400px] bg-white border rounded-md shadow"
          >
            <div className="h-[220px]">
              <Link href="#">
                <Image
                  src={`/images/${product.thumbnail}`}
                  alt={product.title}
                  width={200}
                  height={200}
                  className="rounded-t-md w-full h-full object-cover"
                />
              </Link>
            </div>

            <div className="p-4">
              <h5 className="text-md font-bold">{product.title}</h5>
              <p className="text-gray-500">{product.author}</p>
              <p className="text-blue-600">${product.price}</p>
              <button
                className="mt-2 w-full bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                onClick={() =>
                  addToCart({
                    id: product.id,
                    title: product.title,
                    price: product.price,
                  })
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-6 text-center">No products found</div>
      )}
    </div>
  );
};

export default ListProductInCart;
