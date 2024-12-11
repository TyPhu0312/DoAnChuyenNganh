'use client';
import { useCart } from '@/components/features/cartContext';
export function AddToCartButton({ product }: { product: { id: string; title: string; price: number; thumbnail: string } }) {
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      image: product.thumbnail,
    });
  };
  return (
    <button
      onClick={handleAddToCart}
      className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all"
    >
      Add to Cart
    </button>
  );
}
