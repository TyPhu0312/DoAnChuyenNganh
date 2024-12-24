"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserButton, useAuth } from "@clerk/nextjs";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import CartSidebar from "@/components/features/cartSideBar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

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
      className={`${isScrolled ? "" : "bg-slate-100 shadow-lg "} 
    fixed top-0 left-0 w-full z-10 transition-all duration-300 ${isScrolled ? "h-16 rounded-b-[100px]" : "h-30"}`}
    >
      <div className={`flex flex-col h-full items-center justify-between max-w-screen-xl px-4 mx-auto mt-5 ${isScrolled ? "mt-1" : ""} rounded-tl-[30px] rounded-tr-[30px]`}>
        {/* Logo, Artwork */}
        <div className={`flex items-center pl-[25px] pr-[25px] justify-center ${isScrolled ? "bg-[#140d07f8] rounded-[20px] sticky top-0 left-1/2 transform -translate-x-1/2 mt-" : "bg-transparent mb-[20px]"}`}>
          <Link href="/" className={`flex items-center transition-all duration-300`}>
            <Image
              src={isScrolled ? "/images/logo-main.png" : "/images/BlackLogo-NoBG.png"}
              alt="logo"
              width={isScrolled ? 30 : 80}
              height={isScrolled ? 30 : 80}
              quality={100}
              className={`object-cover rounded-full transition-all duration-300 ${isScrolled ? "scale-80" : "scale-100"}`}
            />
            <span className={`self-center text-4xl font-semibold whitespace-nowrap text-black font-robotoSerif ml-3 transition-all duration-300 ${isScrolled ? " text-xl text-white" : "opacity-100"}`}>
              Artauct
            </span>
          </Link>

          {/* Button to open Cart Sidebar */}
          <Button
            onClick={toggleSidebar}
            className={`ml-4 p-2 rounded-lg bg-transparent hover:border-b-black focus:outline-none focus:ring-2 focus:ring-gray-200 hover:bg-white${isScrolled ? " hover:text-black hover:shadow-lg" : ""}`}
          >
            <ShoppingCartIcon className={`w-6 h-6 font-bold  cursor-pointer text-black ${isScrolled ? "text-white hover:text-black hover:stroke-black" : ""}`} />
          </Button>

          {/* User Button / Sign In/Up */}
          <div className={`${isScrolled ? "flex justify-center items-center ml-2" : "hidden"}`}>
            {userId ? (
              <UserButton
                appearance={{
                  elements: { footer: { display: "none" } }, // Hide footer
                }}
              />
            ) : (
              <ul className="flex mt-1 font-medium lg:flex-row lg:space-x-1 lg:mt-0">
                <li className=" hover:text-black">
                  <a href="/sign-in" className="text-[18px] font-robotoSlab block py-2 pl-3 pr-2 text-white  hover:text-black hover:bg-white">Sign In</a>
                </li>
                <li>
                  <a href="/sign-up" className="text-[18px] font-robotoSlab block py-2 pl-2 pr-4 text-white hover:text-black hover:bg-white">Sign Up</a>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* CART SIDE BAR MODAL */}
        <CartSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

        {/* Menu on the Bottom */}
        <div className="flex items-center justify-between w-full lg:flex lg:w-auto opacity-100">
          <div className={`${isMenuOpen ? "block" : "hidden"} items-center justify-between w-full lg:flex lg:w-auto`}>
            <ul
              className={`flex flex-col font-medium lg:flex-row lg:space-x-2 lg:mt-0 lg:justify-center ${isScrolled ? "lg:hidden" : ""
                }`}
            >
              <li>
                <a
                  href="/"
                  className="text-[18px] font-serif block py-2 pl-3 pr-4 bg-white hover:bg-gray-200 hover:text-black hover:rounded-sm lg:bg-transparent lg:text-black"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/allProduct"
                  className="text-[18px] font-robotoSlab block py-2 pl-3 pr-4 bg-white hover:bg-gray-200 hover:text-black hover:rounded-sm lg:bg-transparent lg:text-black"
                >
                  All Artwork
                </a>
              </li>
              <li>
                <a
                  href="/Collection"
                  className="text-[18px] font-robotoSlab block py-2 pl-3 pr-4 bg-white hover:bg-gray-200 hover:text-black hover:rounded-sm lg:bg-transparent lg:text-black"
                >
                  Collection
                </a>
              </li>
              <li>
                <a
                  href="/orderArtwork"
                  className="text-[18px] font-robotoSlab block py-2 pl-3 pr-4 bg-white hover:bg-gray-200 hover:text-black hover:rounded-sm lg:bg-transparent lg:text-black"
                >
                  Order Artwork
                </a>
              </li>
              <li>
                {userId ? (
                  <UserButton
                    appearance={{
                      elements: { footer: { display: "none" } },
                    }}
                  />
                ) : (
                  <ul className="flex flex-col mt-1 font-medium lg:flex-row lg:space-x-2 lg:mt-0">
                    <li>
                      <a
                        href="/sign-in"
                        className="text-[18px] font-robotoSlab block py-2 pl-3 pr-4 text-black bg-white hover:bg-gray-300 rounded-md lg:bg-transparent lg:text-black hover:text-black"
                      >
                        Sign In
                      </a>
                    </li>
                    <li>
                      <a
                        href="/sign-up"
                        className="text-[18px] font-robotoSlab block py-2 pl-3 pr-4 text-black bg-white hover:bg-gray-300 rounded-md lg:bg-transparent lg:text-black hover:text-black"
                      >
                        Sign Up
                      </a>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                {userId ? (
                  <NavigationMenu>
                    <NavigationMenuList>

                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <a
                              href="/updateProfileUser"
                              className="text-[15px] font-robotoSlab"
                            >
                              Update Profile
                            </a>
                          </NavigationMenuLink>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <a
                              href="/viewUserOrder"
                              className="text-[15px] font-robotoSlab"
                            >
                              My Order
                            </a>
                          </NavigationMenuLink>
                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <a
                              href={`/viewUserPaintingOrder/${userId}`}
                              className="text-[15px] font-robotoSlab"
                            >
                              My Custom Painting
                            </a>
                          </NavigationMenuLink>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                ) : (
                  <NavigationMenu className="hidden font-robotoCondensed">
                    <NavigationMenuList>

                      <NavigationMenuItem>
                        <NavigationMenuTrigger>Profile</NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <Link href={"/updateProfileUser"} legacyBehavior passHref>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              Update Profile
                            </NavigationMenuLink>
                          </Link>

                          <Link href={"/viewUserOrder"}>
                            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                              My Order
                            </NavigationMenuLink>
                          </Link>

                          <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            <a
                              href={`/viewUserPaintingOrder/${userId}`}
                              className="text-[15px] font-robotoSlab"
                            >
                              My Custom Painting
                            </a>
                          </NavigationMenuLink>
                        </NavigationMenuContent>
                      </NavigationMenuItem>
                    </NavigationMenuList>
                  </NavigationMenu>
                )}
              </li>
            </ul>
          </div>


          {/* Hamburger Menu Button */}
          <Button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)} // Toggle menu
            className={`inline-flex items-center p-2 ml-1 text-sm rounded-lg lg:hidden focus:outline-none focus:ring-2 focus:ring-gray-200 
              ${isScrolled ? "absolute top-3 left-2 z-20 transition-all duration-300" : "absolute top-7 left-2 z-20 transition-all duration-300"}
              bg-white hover:bg-white`}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="100"
              height="100"
              viewBox="0 0 50 50"
              className={`w-6 h-6 transition-transform duration-300 ${isMenuOpen ? "rotate-90" : "rotate-0"
                } text-white`}
            >
              <path
                d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z"
              ></path>
            </svg>

          </Button>

        </div>
      </div>
    </nav>

  );
}
