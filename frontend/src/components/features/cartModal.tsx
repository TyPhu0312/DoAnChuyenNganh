import React from "react";
import { useCart } from "@/components/features/cartContext";

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, clearCart } = useCart();

  return (
    <div className="cart-container p-4 bg-white shadow-md rounded-md">
      <h2 className="text-lg font-bold mb-4">Your Cart</h2>
      {cartItems.length > 0 ? (
        <ul className="space-y-2">
          {cartItems.map((item) => (
            <li
              key={item.id}
              className="flex justify-between items-center border-b py-2"
            >
              <div>
                <span className="font-semibold">{item.title}</span>
                <span className="text-gray-500"> - ${item.price.toFixed(2)}</span>
              </div>
              <span
                className="text-blue-500 cursor-pointer"
                onClick={() => removeFromCart(item.id)}
              >
                Remove
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-center mt-4">No items in the cart</p>
      )}
      <div className="mt-4 text-center">
        <button
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          onClick={clearCart}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
};

export default Cart;
