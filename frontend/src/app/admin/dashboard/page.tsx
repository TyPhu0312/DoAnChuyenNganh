'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaUsers, FaPaintBrush, FaShoppingCart, FaDollarSign } from 'react-icons/fa';
import Admin from '@/app/admin/page';
import { formatCurrencyVND } from '@/lib/utils/currencyFormatter';

type Statistics = {
  products: number;
  users: number;
  customPaintings: number;
  orders: number;
  revenue: number;
  revenueByYear: { year: number; revenue: number }[];
  topProducts: { name: string; quantity: number }[];
  topCustomersByOrders: { name: string; totalSpent: number }[];
  topCustomersByPaintings: { name: string; totalOrders: number }[];
};

const AdminDashboard: React.FC = () => {
  // State to store the statistics data
  const [statistics, setStatistics] = useState<Statistics | null>(null);

  // Function to fetch the statistics data
  const fetchStatistics = async () => {
    try {
      const requests = [
        axios.get('http://localhost:5000/api/admin/products').catch((err) => err),
        axios.get('http://localhost:5000/api/admin/user').catch((err) => err),
        axios.get('http://localhost:5000/api/admin/custompainting').catch((err) => err),
        axios.get('http://localhost:5000/api/admin/order').catch((err) => err),
        axios.get('http://localhost:5000/api/admin/order/getRevenue/year').catch((err) => err), // Get current year revenue
        axios.get('http://localhost:5000/api/admin/order/getRevenue/over-years').catch((err) => err), // Get revenue over the years
        axios.get('http://localhost:5000/api/admin/top-10-products').catch((err) => err), // Get top 10 products
        axios.get('http://localhost:5000/api/admin/top-customers-orders').catch((err) => err), // Get top 5 customers by orders
        axios.get('http://localhost:5000/api/admin/top-customers-paintings').catch((err) => err), // Get top 5 customers by custom paintings orders
      ];

      const [
        productsResponse,
        usersResponse,
        customPaintingsResponse,
        ordersResponse,
        revenueResponse,
        revenueByYearResponse,
        topProductsResponse,
        topCustomersOrdersResponse,
        topCustomersPaintingsResponse,
      ] = await Promise.all(requests);

      const statisticsData: Statistics = {
        products: productsResponse?.status === 200 ? productsResponse.data.data?.length || 0 : 0,
        users: usersResponse?.status === 200 ? usersResponse.data.data?.length || 0 : 0,
        customPaintings: customPaintingsResponse?.status === 200 ? customPaintingsResponse.data.data?.length || 0 : 0,
        orders: ordersResponse?.status === 200 ? ordersResponse.data.data?.length || 0 : 0,
        revenue: revenueResponse?.status === 200 ? revenueResponse.data.data[0].revenue || 0 : 0,
        revenueByYear: revenueByYearResponse?.status === 200 ? revenueByYearResponse.data.data || [] : [],
        topProducts: topProductsResponse?.status === 200 ? topProductsResponse.data || [] : [],
        topCustomersByOrders: topCustomersOrdersResponse?.status === 200 ? topCustomersOrdersResponse.data || [] : [],
        topCustomersByPaintings: topCustomersPaintingsResponse?.status === 200 ? topCustomersPaintingsResponse.data || [] : [],
      };

      setStatistics(statisticsData);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      setStatistics({
        products: 0,
        users: 0,
        customPaintings: 0,
        orders: 0,
        revenue: 0,
        revenueByYear: [],
        topProducts: [],
        topCustomersByOrders: [],
        topCustomersByPaintings: [],
      });
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (!statistics) {
    return <div>Loading...</div>;
  }

  if (
    statistics.products === 0 &&
    statistics.users === 0 &&
    statistics.customPaintings === 0 &&
    statistics.orders === 0 &&
    statistics.revenue === 0 &&
    statistics.topProducts.length === 0 &&
    statistics.topCustomersByOrders.length === 0 &&
    statistics.topCustomersByPaintings.length === 0
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

          {/* Card 5 - Revenue */}
          <div className="bg-red-500 p-6 rounded-lg shadow-lg text-white">
            <div className="flex items-center">
              <div className="text-4xl mr-4"><FaDollarSign /></div>
              <div>
                <h4 className="text-lg font-semibold">Revenue</h4>
                <p className="text-2xl font-bold">{formatCurrencyVND(statistics.revenue)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Year */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Revenue Over the Years</h2>
          <ul className="mt-4">
            {statistics.revenueByYear.length > 0 ? (
              statistics.revenueByYear.map((item, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-md mb-2">
                  <p className="font-semibold">Year: {item.year}</p>
                  <p>Revenue: {formatCurrencyVND(item.revenue)}</p>
                </li>
              ))
            ) : (
              <p>No revenue data available.</p>
            )}
          </ul>
        </div>

        {/* Top Products */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Top 10 Products of the Year</h2>
          <ul className="mt-4">
            {statistics.topProducts.length > 0 ? (
              statistics.topProducts.map((product, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-md mb-2">
                  <p className="font-semibold">{product.name}</p>
                  <p>Sold: {product.quantity}</p>
                </li>
              ))
            ) : (
              <p>No top products data available.</p>
            )}
          </ul>
        </div>

        {/* Top Customers by Orders */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Top 5 Customers by Orders</h2>
          <ul className="mt-4">
            {statistics.topCustomersByOrders.length > 0 ? (
              statistics.topCustomersByOrders.map((customer, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-md mb-2">
                  <p className="font-semibold">{customer.name}</p>
                  <p>Total Spent: {customer.totalSpent} VND</p>
                </li>
              ))
            ) : (
              <p>No data available for top customers by orders.</p>
            )}
          </ul>
        </div>

        {/* Top Customers by Custom Paintings */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Top 5 Customers by Custom Paintings Orders</h2>
          <ul className="mt-4">
            {statistics.topCustomersByPaintings.length > 0 ? (
              statistics.topCustomersByPaintings.map((customer, index) => (
                <li key={index} className="bg-gray-100 p-4 rounded-md mb-2">
                  <p className="font-semibold">{customer.name}</p>
                  <p>Total Orders: {customer.totalOrders}</p>
                </li>
              ))
            ) : (
              <p>No data available for top customers by paintings orders.</p>
            )}
          </ul>
        </div>
      </div>
    </Admin>
  );
};

export default AdminDashboard;
