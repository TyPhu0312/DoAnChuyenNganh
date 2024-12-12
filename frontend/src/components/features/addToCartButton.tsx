'use client';
import { useCart } from '@/components/features/cartContext';
import { useToast } from "@/components/features/toastContext"; // Import useToast

export function AddToCartButton({ product }: { product: { id: string; title: string; price: number; thumbnail: string } }) {
  const { cart, addToCart } = useCart();
  const { showToast } = useToast(); 

  const handleAddToCart = () => {
    const existingItem = cart.find((cartItem) => cartItem.id === product.id);
    if (existingItem) {
      addToCart({
        ...existingItem,
        quantity: existingItem.quantity++,  
      });
      showToast(`Sản phẩm ${product.title} đã được cập nhật số lượng!`, 'top-right', 'success');
    } else {
      try {
        addToCart({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1, 
          image: product.thumbnail,
        });
        showToast(`Đã thêm ${product.title} vào giỏ hàng!`, 'top-right', 'success');
      } catch (error) {
        showToast(`Không thể thêm ${product.title} vào giỏ hàng. Vui lòng thử lại!`, 'top-right', 'error');
      }
    }
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
