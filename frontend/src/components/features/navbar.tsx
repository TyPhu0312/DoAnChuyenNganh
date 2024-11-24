"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useAuth } from "@clerk/nextjs";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  const { userId } = useAuth(); //getToken thêm vào để xử lý
  return (
    <nav
      className={`${
        isScrolled ? "bg-[#202020] shadow-lg" : "bg-transparent"
      } fixed top-0 left-0 w-full z-10 transition-all duration-300 ${
        isScrolled ? "h-16 rounded-full" : "h-30"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between max-w-screen-xl px-4 mx-auto mt-5">
        <Link href="/" className="flex items-center justify-center w-full">
          <Image
            src="/images/logo-main.png"
            alt="logo"
            width={isScrolled ? 50 : 80}
            height={isScrolled ? 50 : 80}
            quality={100}
            className={`object-cover rounded-full transition-all duration-300 ${
              isScrolled ? "scale-75" : "scale-100"
            }`}
          />
          <span
            className={`font-serif self-center text-4xl font-semibold whitespace-nowrap text-white font-robotoSerif ml-3 transition-all duration-300 ${
              isScrolled ? "opacity-0" : "opacity-100"
            }`}
          >
            Artauct
          </span>
        </Link>

        {/* Button mở menu */}
        <button
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu
          className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className={`w-6 h-6 transform ${
              isMenuOpen ? "rotate-90" : ""
            } transition-transform duration-200`}
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

        {/* Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } items-center justify-between w-full lg:flex lg:w-auto`}
        >
          <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0 lg:justify-center">
            <li>
              <a
                href="#"
                className="block font-serif py-2 pl-3 pr-4 text-lg text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block font-serif py-2 pl-3 pr-4 text-lg text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
              >
                Company
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block font-serif py-2 pl-3 pr-4 text-lg text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
              >
                Marketplace
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block font-serif py-2 pl-3 pr-4 text-lg text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
              >
                Features
              </a>
            </li>
            <li>
              {userId ? (
                <li>
                  <UserButton 
                      appearance={{
                        elements: {
                          footer: { display: "none" }, // Ẩn phần footer
                        },
                      }}
                  />
                </li>
              ) : (
                <>
                  <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
                    <li>
                      <a
                        href="/sign-in"
                        className="block py-2 pl-3 pr-4 text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >
                        Sign In
                      </a>
                    </li>
                    <li>
                      <a
                        href="/sign-up"
                        className="block py-2 pl-3 pr-4 text-white border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-300 lg:p-0 dark:text-gray-400 lg:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white lg:dark:hover:bg-transparent dark:border-gray-700"
                      >
                        Sign Up
                      </a>
                    </li>
                  </ul>
                </>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
