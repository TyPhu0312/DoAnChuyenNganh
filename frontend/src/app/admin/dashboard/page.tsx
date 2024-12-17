'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaUsers, FaPaintBrush, FaShoppingCart } from 'react-icons/fa';
import Admin from '@/app/admin/page';

type Statistics = {
  products: number;
  users: number;
  customPaintings: number;
  orders: number;
};

const AdminDashboard: React.FC = () => {
  // State để lưu dữ liệu thống kê
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  // Hàm để lấy thống kê sản phẩm
  const fetchStatistics = async () => {
    try {
      const requests = [
        axios.get('http://localhost:5000/api/admin/products').catch((err) => err),
        axios.get('http://localhost:5000/api/admin/user').catch((err) => err),
        axios.get('http://localhost:5000/api/admin/custompainting').catch((err) => err),
        axios.get('http://localhost:5000/api/admin/order').catch((err) => err),
      ];

      const [productsResponse, usersResponse, customPaintingsResponse, ordersResponse] = await Promise.all(requests);

      const statisticsData: Statistics = {
        products: productsResponse?.status === 200 ? productsResponse.data.data?.length || 0 : 0,
        users: usersResponse?.status === 200 ? usersResponse.data.data?.length || 0 : 0,
        customPaintings: customPaintingsResponse?.status === 200 ? customPaintingsResponse.data.data?.length || 0 : 0,
        orders: ordersResponse?.status === 200 ? ordersResponse.data.data?.length || 0 : 0,
      };

      setStatistics(statisticsData);

    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics({
        products: 0,
        users: 0,
        customPaintings: 0,
        orders: 0,
      });
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  // Kiểm tra nếu statistics chưa có dữ liệu thì không hiển thị thông tin
  if (!statistics) {
    return <div>Loading...</div>;
  }

  if (
    statistics.products === 0 &&
    statistics.users === 0 &&
    statistics.customPaintings === 0 &&
    statistics.orders === 0
  ) {
    return <div>No data available at the moment.</div>;
  }

  return (
    <Admin>
      <div className="p-8">
        <h1 className="text-3xl font-semibold mb-6">Dashboard</h1>

        {/* Row of Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1 - Products */}
          <div className="bg-blue-500 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4"><FaBox /></div>
              <div>
                <h4 className="text-lg font-semibold">Products</h4>
                <p className="text-2xl font-bold">{statistics.products}</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Users */}
          <div className="bg-green-500 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4"><FaUsers /></div>
              <div>
                <h4 className="text-lg font-semibold">Users</h4>
                <p className="text-2xl font-bold">{statistics.users}</p>
              </div>
            </div>
          </div>

          {/* Card 3 - Custom Paintings */}
          <div className="bg-purple-500 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4"><FaPaintBrush /></div>
              <div>
                <h4 className="text-lg font-semibold">Custom Paintings</h4>
                <p className="text-2xl font-bold">{statistics.customPaintings}</p>
              </div>
            </div>
          </div>

          {/* Card 4 - Orders */}
          <div className="bg-yellow-500 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4"><FaShoppingCart /></div>
              <div>
                <h4 className="text-lg font-semibold">Orders</h4>
                <p className="text-2xl font-bold">{statistics.orders}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
};

export default AdminDashboard;
