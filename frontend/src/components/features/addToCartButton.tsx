'use client';
import { useCart } from '@/components/features/cartContext';
import { useToast } from "@/components/features/toastContext";
import { useUser } from "@clerk/nextjs";
import axios from 'axios';

export function AddToCartButton({ product }: { product: { id: string; title: string; price: number; thumbnail: string } }) {
  const { cart, addToCart } = useCart();
  const { showToast } = useToast();
  const userCheck = useUser();
  //const userId = userCheck.user?.id;

  const handleAddToCart = async () => {
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
    // try {
    //   const response = await axios.get(`http://localhost:5000/api/admin/user/checkUserForOrder/${userId}`);

    //   console.log(response.data); // Kiểm tra dữ liệu trả về

    //   // Nếu API trả về failed là true
    //   if (response.data && response.data.success == 'false') {
    //     showToast('Vui lòng cập nhật thông tin trước khi mua hàng!', 'top-right', 'error');

    //     // Chuyển hướng đến trang cập nhật thông tin người dùng
    //     window.location.href = '/updateProfileUser';  // Chuyển hướng bằng window.location
    //   } else if (response.data && response.data.success) {
    //     // Xử lý thêm vào giỏ hàng khi thành công
        
    //   }
    // } catch (error) {
    //   console.error("Lỗi khi lấy dữ liệu:", error);
    //   showToast('Có lỗi xảy ra khi lấy dữ liệu!', 'top-right', 'error');
    // }
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
