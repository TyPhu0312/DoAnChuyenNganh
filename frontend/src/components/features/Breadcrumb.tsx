// src/components/Breadcrumb.tsx
import React from "react";
import Link from "next/link";
interface BreadcrumbProps {
  links: { label: string; href: string }[]; // Mảng chứa các đối tượng link
}
const Breadcrumb: React.FC<BreadcrumbProps> = ({ links }) => {
  return (
    <div className="text-left mx-10">

      <p className="text-lg text-gray-600">
        {links.map((link, index) => (
          <span key={index}>
            <Link href={link.href}>
              <span className="text-grey-600 font-robotoCondensed text-[14px] hover:underline cursor-pointer lg:hover:text-[#1F160F] lg:hover:font-bold">
                {link.label}
              </span>
            </Link>
            {index < links.length - 1 && " / "}
          </span>
        ))}
      </p>
    </div>
  );
};
export default Breadcrumb;
