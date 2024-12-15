import React, { useRef, useEffect, useState } from "react";
import { useCart } from "@/components/features/cartContext";
import { FaRegTrashAlt } from "react-icons/fa";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
interface CartSidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}
const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, closeSidebar }) => {
  const { cart, removeFromCart } = useCart();
  const [isClosing, setIsClosing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        closeSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeSidebar]);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(true);
      setTimeout(() => {
        setIsClosing(false);
      }, 300);
    }
  }, [isOpen]);

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div
            ref={sidebarRef}
            className={`fixed right-0 top-0 w-80 bg-white h-full shadow-lg z-30 transition-all ${isClosing ? "cart-sidebar-closing" : "cart-sidebar"
              }`}
          >
            <div className="flex justify-between items-center p-4">
              <center><h2 className="text-xl font-semibold">Your Cart</h2></center>
              <button
                onClick={closeSidebar}
                className="text-gray-700 hover:text-black"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <div className="px-4 py-2">
              <ul>
                {cart.map((item) => (
                  <li key={item.id} className="flex justify-between items-center py-2">
                    <Image
                      src={`/images/${item.image}`}
                      alt={item.title}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                    <div className="flex-1 ml-3">
                      <p className="text-sm font-semibold">{item.title}</p>
                      <p className="text-xs text-gray-500">Đơn giá: {formatCurrency(item.price)}</p>
                      <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                      <p className="text-xs text-gray-500">
                        Giá tổng: {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 hover:scale-110 transition-all duration-100">
                      <FaRegTrashAlt />
                    </button>
                  </li>
                ))}
              </ul>
              <div><hr /></div>
              <div className="mt-4 flex justify-between items-center">
                <span className="font-semibold">Total price:</span>
                <span className="font-semibold text-xl">
                  {formatCurrency(cart.reduce((total, item) => total + item.price * item.quantity, 0))}
                </span>
              </div>
              <Link href={'/checkout'}>
                <button className="bg-gradient-to-r from-[#59a83e] to-[#3f9b1b] mt-6 text-white font-bold py-2 px-4 rounded hover:opacity-80 hover:scale-105 transition-all duration-200"
                >
                  Check out
                </button>
              </Link>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;
