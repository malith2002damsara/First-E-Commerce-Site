import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Dashboard = ({ token }) => {
  console.log('Dashboard component rendered with token:', token ? 'present' : 'missing');
  console.log('Backend URL:', backendUrl);
  
  const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalSellers: 0,
    recentOrders: [],
    topSellers: [],
    monthlyRevenue: [],
    categoryStats: [],
    weeklyStats: [],
    yearlyStats: []
  });
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('monthly');

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const fetchDashboardData = React.useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsRes = await axios.get(`${backendUrl}/api/product/list`);
      
      // Fetch orders
      const ordersRes = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        { headers: { token } }
      );

      if (productsRes.data.success && ordersRes.data.success) {
        const products = productsRes.data.products || [];
        const orders = ordersRes.data.orders || [];

        // Calculate analytics
        const analytics = calculateAnalytics(products, orders);
        setDashboardData(analytics);
      } else {
        console.error('API Error:', { 
          products: productsRes.data, 
          orders: ordersRes.data 
        });
        toast.error('Failed to load dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [token, calculateAnalytics]);

  const calculateAnalytics = React.useCallback((products, orders) => {
    // Ensure we have arrays to work with
    const safeProducts = Array.isArray(products) ? products : [];
    const safeOrders = Array.isArray(orders) ? orders : [];
    
    // Basic stats
    const totalProducts = safeProducts.length;
    const totalOrders = safeOrders.length;
    const totalRevenue = safeOrders.reduce((sum, order) => {
      return sum + (order.amount || 0);
    }, 0);
    
    // Get unique sellers
    const sellers = {};
    safeProducts.forEach(product => {
      if (product.sellername) {
        if (!sellers[product.sellername]) {
          sellers[product.sellername] = {
            name: product.sellername,
            phone: product.sellerphone || '',
            products: 0,
            revenue: 0
          };
        }
        sellers[product.sellername].products++;
      }
    });

    // Calculate seller revenue from orders
    safeOrders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          const product = safeProducts.find(p => 
            p._id === (item.product || item._id) || p.name === item.name
          );
          if (product && product.sellername && sellers[product.sellername]) {
            const itemRevenue = (item.price || 0) * (item.quantity || 0);
            sellers[product.sellername].revenue += itemRevenue;
          }
        });
      }
    });

    const topSellers = Object.values(sellers)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Monthly revenue (last 6 months)
    const monthlyRevenue = calculateMonthlyRevenue(safeOrders);
    
    // Weekly revenue (last 4 weeks)
    const weeklyStats = calculateWeeklyStats(safeOrders);
    
    // Yearly revenue (last 2 years)
    const yearlyStats = calculateYearlyStats(safeOrders);

    // Category stats
    const categoryStats = calculateCategoryStats(safeProducts);

    // Recent orders (last 5)
    const recentOrders = safeOrders
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5);

    return {
      totalProducts,
      totalOrders,
      totalRevenue,
      totalSellers: Object.keys(sellers).length,
      recentOrders,
      topSellers,
      monthlyRevenue,
      categoryStats,
      weeklyStats,
      yearlyStats
    };
  }, []);

  const calculateMonthlyRevenue = (orders) => {
    const months = {};
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      months[key] = 0;
    }

    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const key = orderDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      if (Object.prototype.hasOwnProperty.call(months, key)) {
        months[key] += order.amount;
      }
    });

    return Object.entries(months).map(([month, revenue]) => ({ month, revenue }));
  };

  const calculateWeeklyStats = (orders) => {
    const weeks = {};
    const now = new Date();
    
    // Initialize last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - (i * 7) - now.getDay());
      const key = `Week ${4 - i}`;
      weeks[key] = 0;
    }

    orders.forEach(order => {
      const orderDate = new Date(order.date);
      const daysDiff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));
      const weekIndex = Math.floor(daysDiff / 7);
      
      if (weekIndex < 4) {
        const key = `Week ${4 - weekIndex}`;
        if (weeks[key] !== undefined) {
          weeks[key] += order.amount;
        }
      }
    });

    return Object.entries(weeks).map(([week, revenue]) => ({ week, revenue }));
  };

  const calculateYearlyStats = (orders) => {
    const years = {};
    const currentYear = new Date().getFullYear();
    
    // Initialize last 2 years
    years[currentYear - 1] = 0;
    years[currentYear] = 0;

    orders.forEach(order => {
      const orderYear = new Date(order.date).getFullYear();
      if (Object.prototype.hasOwnProperty.call(years, orderYear)) {
        years[orderYear] += order.amount;
      }
    });

    return Object.entries(years).map(([year, revenue]) => ({ year, revenue }));
  };

  const calculateCategoryStats = (products) => {
    const categories = {};
    products.forEach(product => {
      categories[product.category] = (categories[product.category] || 0) + 1;
    });
    return Object.entries(categories).map(([category, count]) => ({ category, count }));
  };

  const getTimeFilteredData = () => {
    switch (timeFilter) {
      case 'weekly':
        return {
          labels: dashboardData.weeklyStats.map(item => item.week),
          data: dashboardData.weeklyStats.map(item => item.revenue)
        };
      case 'yearly':
        return {
          labels: dashboardData.yearlyStats.map(item => item.year),
          data: dashboardData.yearlyStats.map(item => item.revenue)
        };
      default:
        return {
          labels: dashboardData.monthlyRevenue.map(item => item.month),
          data: dashboardData.monthlyRevenue.map(item => item.revenue)
        };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your business performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalOrders}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">LKR {dashboardData.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sellers</p>
                <p className="text-3xl font-bold text-gray-800">{dashboardData.totalSellers}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Section - Visual Data Representation */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Revenue Trends</h3>
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
            <div className="space-y-3">
              {getTimeFilteredData().labels.map((label, index) => {
                const data = getTimeFilteredData().data;
                const maxValue = Math.max(...data);
                const percentage = maxValue > 0 ? (data[index] / maxValue) * 100 : 0;
                return (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600 w-16">{label}</span>
                    <div className="flex-1 mx-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-800 w-20 text-right">
                      LKR {data[index].toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Category Distribution */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Products by Category</h3>
            <div className="space-y-4">
              {dashboardData.categoryStats.map((item, index) => {
                const maxCount = Math.max(...dashboardData.categoryStats.map(s => s.count));
                const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                return (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm font-semibold text-gray-800">{item.count} products</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${colors[index % colors.length]}`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Sellers */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Sellers</h3>
            <div className="space-y-4">
              {dashboardData.topSellers.map((seller, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-semibold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{seller.name}</p>
                      <p className="text-sm text-gray-600">{seller.phone}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">LKR {seller.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-600">{seller.products} products</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
            <div className="space-y-4">
              {dashboardData.recentOrders.map((order, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Order #{index + 1}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.date).toLocaleDateString()} • {order.items.length} items
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">LKR {order.amount.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'Delivered' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'Order Placed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
