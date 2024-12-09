// app/ProductDetail/[id]/page.tsx
import axios from 'axios';
import { notFound } from 'next/navigation';
import Hero from '@/components/features/hero'; // Đảm bảo rằng bạn đã tạo Hero component
import Breadcrumb from '@/components/features/Breadcrumb';
import Footer from '@/components/features/footer';

type Product = {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  price: number;
  description: string;
};

interface ProductDetailProps {
  params: {
    id: string;
  };
}

const ProductDetail = async ({ params }: ProductDetailProps) => {
  const { id } = params;

  try {
    const response = await axios.get(`http://localhost:5000/api/admin/products/${id}`);
    const product: Product = response.data.ProductDetail;

    return (
      <>
        <main className="flex flex-1 flex-col  m-0 bg-[#e0e0e0ee] ">
          <Hero />
          <div className="flex flex-col space-y-[50px]">
            {/*TAB VI TRI NGUOI DUNG */}
            <div className="tabIndex mt-[50px] ml-[20px]">
              <Breadcrumb
                links={[
                  
                  { label: "All Product", href: "/allProduct" },
                  { label: "Product Detail", href: "#" },
                ]}
              />
            </div>
            <div className="container mx-auto px-6 py-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="flex justify-center">
                  <img
                    src={`/images/${product.thumbnail}`}
                    alt={product.title}
                    width={500}
                    height={500}
                    className="rounded-lg shadow-lg object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex flex-col space-y-6">
                  <h1 className="text-3xl font-extrabold text-gray-800">{product.title}</h1>
                  
                  <p className="text-xl text-gray-800 font-semibold">Author: {product.author}</p>
                  <p className="text-2xl text-red-600 font-bold">${product.price}</p>

                  <div className="flex space-x-4">
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all">
                      Add to Cart
                    </button>
                    <button className="px-6 py-3 border-2 border-gray-600 text-gray-600 rounded-lg hover:bg-gray-100 transition-all">
                      Buy Now
                    </button>
                  </div>
                  <p className="text-lg text-gray-600">{product.description}</p>
                </div>
              </div>
            </div>
          </div>
          <Footer/>
        </main>
      </>
    );
  } catch (error) {
    console.error('Error fetching product details:', error);
    return notFound(); // Trả về 404 nếu không tìm thấy sản phẩm
  }
};

export default ProductDetail;
