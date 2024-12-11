"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useCart } from "@/components/features/cartContext";
import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import {FaRegTrashAlt} from "react-icons/fa";
import { Button } from "../ui/button";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { cart, removeFromCart }= useCart();
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  }
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  }
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { userId } = useAuth();

  return (
    <nav
      className={`${isScrolled ? "" : "bg-transparent  shadow-lg"
        } fixed top-0 left-0 w-full z-10 transition-all duration-300 ${isScrolled ? "h-16 rounded-b-[100px]" : "h-30"
        }`}
    >
      <div className={`flex flex-col h-full items-center justify-between max-w-screen-xl px-4 mx-auto mt-2 ${isScrolled ? "mt-1" : ""} rounded-tl-[30px] rounded-tr-[30px]`}>
        {/* Logo, Artwork */}
        <div className={`flex items-center pl-[25px] pr-[25px] justify-center space-x-4 ${isScrolled ? "bg-[#140d07f8] rounded-[20px] sticky top-0 left-1/2 transform -translate-x-1/2" : "bg-transparent mb-[20px]"}`}>
          <Link href="/" className={`flex items-center transition-all duration-300`}>
            <Image
              src="/images/logo-main.png"
              alt="logo"
              width={isScrolled ? 30 : 80}
              height={isScrolled ? 30 : 80}
              quality={100}
              className={`object-cover rounded-full transition-all duration-300 ${isScrolled ? "scale-80" : "scale-100"
                }`}
            />
            <span
              className={`self-center text-4xl font-semibold whitespace-nowrap text-white font-robotoSerif ml-3 transition-all duration-300 ${isScrolled ? " text-xl" : "opacity-100"
                }`}
            >
              Artauct
            </span>
            {isSidebarOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
                <div className="fixed right-0 top-0 w-80 bg-white h-full shadow-lg z-30">
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
                    {/* chỗ sẽ xuất hiện danh sách sản phẩm đã thêm vào gio */}
                  </div>
                  <center>
                    <div className="p-4">
                      <ul>
                        {cart.map((item) => (
                          <li
                            key={item.id}
                            className="flex justify-between items-center py-2"
                          >
                            <img
                              src={item.image}
                              className="w-12 h-12 object-cover"
                            />
                            <div className="flex-1 ml-3">
                              <p className="text-sm font-semibold">{item.title}</p>
                              <p className="text-xs text-gray-500">
                                Đơn giá: {item.price} VNĐ
                              </p>
                              <p className="text-xs text-gray-500">
                                Số lượng: x{item.quantity}
                              </p>
                              <p className="text-xs text-gray-500">
                                Giá tổng: {item.price * item.quantity}   VNĐ
                              </p>
                            </div>
                            <center>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-red-500"
                              >
                                <FaRegTrashAlt />
                              </button>
                            </center>

                          </li>
                        ))}
                      </ul>
                      <div><hr /></div>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-semibold">Total price:</span>
                        <span className="font-semibold text-xl">
                          {cart.reduce((total, item) => total + item.price * item.quantity, 0)} VNĐ
                        </span>
                      </div>
                      <Link href="/cart">
                        <button
                          className="bg-gradient-to-r from-[#FFA008] to-[#FF6F00] mt-6 text-white font-bold py-2 px-4 rounded" >
                          Check out
                        </button>
                      </Link>
                    </div>
                  </center>
                </div>
              </div>
            )}

          </Link>
        </div>

        {/* Menu on the Bottom */}
        <div className="flex items-center justify-between w-full lg:flex lg:w-auto opacity-100">
          {/* Button for Menu (Hamburger) */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu
            className={`inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600   ${isScrolled ? "absolute top-3 left-2 z-20 transition-all duration-300" : "absolute top-7 left-2 z-20 transition-all duration-300"
              }`}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className={`w-6 h-6 transform ${isMenuOpen ? "rotate-90" : ""} transition-transform duration-200`}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
          {/* Menu Items */}
          <div
            className={`${isMenuOpen ? "block " : "hidden"
              } items-center justify-between w-full lg:flex lg:w-auto  `}
          >
            <ul
              className={`flex  flex-col font-medium lg:flex-row lg:space-x-8 lg:mt-0 lg:justify-center  lg:transition-all duration-300 ${isScrolled ? "lg:hidden" : ""
                }`}
            >
              <li>
                <a
                  href="/"
                  className="text-[18px] font-robotoSlab block py-2 pl-3 pr-4 text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                  aria-current="page"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/allProduct"
                  className="text-[18px] block py-2 pl-3 pr-4 font-robotoSlab text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  All Artwork
                </a>
              </li>
              <li>
                <a
                  href="/Collection"
                  className="text-[18px] block py-2 pl-3 pr-4 font-robotoSlab text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Collection
                </a>
              </li>
              <li>
                <a
                  href="/orderArtwork"
                  className="text-[18px] block py-2 pl-3 pr-4 font-robotoSlab text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                >
                  Order Artwork
                </a>
              </li>
              <li>
                {userId ? (
                  <UserButton
                    appearance={{
                      elements: {
                        footer: { display: "none" }, // Hide footer
                      },
                    }}
                  />
                ) : (
                  <ul className="flex flex-col mt-1 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                      <a
                        href="/sign-in"
                        className="text-[18px] font-robotoSlab block py-2 pl-3 pr-4 text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >
                        Sign In
                      </a>
                    </li>
                    <li>
                      <a
                        href="/sign-up"
                        className="text-[18px] font-robotoSlab block py-2 pl-3 pr-4 text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >
                        Sign Up
                      </a>
                    </li>
                  </ul>
                )}
              </li>
            </ul>
          </div>
          <div
            className="relative ml-4 cursor-pointer"

          >
            {/* Thêm biểu tượng từ Heroicons */}
            <Button onClick={toggleSidebar}>
            <ShoppingCartIcon className={`w-6 h-6 text-white cursor-pointer ${isScrolled ? "hidden" : ""}`} />
            </Button>
           
            {/* {cartItems.length > 0 && (
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {cartItems.length}
              </div>
            )} */}
          </div>
        </div>
      </div>
    </nav>
  );
}
