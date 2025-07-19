import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

// Helper function moved outside component to avoid dependency issues
const calculateSellersData = (products, orders) => {
  const sellersMap = {};

  // Initialize sellers from products
  products.forEach(product => {
    if (!sellersMap[product.sellername]) {
      sellersMap[product.sellername] = {
        name: product.sellername,
        phone: product.sellerphone,
        products: [],
        totalProducts: 0,
        totalRevenue: 0,
        totalOrders: 0,
        categories: new Set(),
        averagePrice: 0,
        joinDate: product.date || Date.now()
      };
    }
    
    sellersMap[product.sellername].products.push(product);
    sellersMap[product.sellername].totalProducts++;
    sellersMap[product.sellername].categories.add(product.category);
  });

  // Calculate revenue and orders from order data
  orders.forEach(order => {
    if (order.items && Array.isArray(order.items)) {
      order.items.forEach(item => {
        const product = products.find(p => 
          p._id === (item.product || item._id) || p.name === item.name
        );
        
        if (product && sellersMap[product.sellername]) {
          const itemRevenue = (item.price || 0) * (item.quantity || 0);
          sellersMap[product.sellername].totalRevenue += itemRevenue;
          sellersMap[product.sellername].totalOrders++;
        }
      });
    }
  });

  // Calculate average price and format data
  return Object.values(sellersMap).map(seller => {
    const totalPrice = seller.products.reduce((sum, product) => sum + product.price, 0);
    seller.averagePrice = seller.totalProducts > 0 ? totalPrice / seller.totalProducts : 0;
    seller.categories = Array.from(seller.categories);
    seller.joinDate = new Date(seller.joinDate);
    
    return seller;
  });
};

const Sellers = ({ token }) => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue'); // revenue, products, orders, name

  useEffect(() => {
    const fetchSellersData = async () => {
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
          
          const sellersData = calculateSellersData(products, orders);
          setSellers(sellersData);
          setFilteredSellers(sellersData);
        } else {
          toast.error('Failed to load sellers data');
        }
      } catch (error) {
        console.error('Error fetching sellers data:', error);
        toast.error('Failed to load sellers data: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSellersData();
  }, [token]);

  useEffect(() => {
    const filterAndSortSellers = () => {
      let filtered = [...sellers];

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(seller =>
          seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seller.phone.includes(searchTerm)
        );
      }

      // Apply sorting
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'revenue':
            return b.totalRevenue - a.totalRevenue;
          case 'products':
            return b.totalProducts - a.totalProducts;
          case 'orders':
            return b.totalOrders - a.totalOrders;
          case 'name':
            return a.name.localeCompare(b.name);
          case 'joinDate':
            return b.joinDate - a.joinDate;
          default:
            return b.totalRevenue - a.totalRevenue;
        }
      });

      setFilteredSellers(filtered);
    };

    filterAndSortSellers();
  }, [searchTerm, sortBy, sellers]);

  const getPerformanceRating = (seller) => {
    const avgRevenue = sellers.reduce((sum, s) => sum + s.totalRevenue, 0) / sellers.length;
    const avgProducts = sellers.reduce((sum, s) => sum + s.totalProducts, 0) / sellers.length;
    
    if (seller.totalRevenue > avgRevenue * 1.5 && seller.totalProducts > avgProducts) {
      return { rating: 'Excellent', color: 'bg-green-100 text-green-800' };
    } else if (seller.totalRevenue > avgRevenue && seller.totalProducts >= avgProducts * 0.8) {
      return { rating: 'Good', color: 'bg-blue-100 text-blue-800' };
    } else if (seller.totalRevenue > avgRevenue * 0.5) {
      return { rating: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { rating: 'Below Average', color: 'bg-red-100 text-red-800' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading sellers...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Seller Management</h1>
          <p className="text-gray-600">Manage and monitor seller performance</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sellers</p>
                <p className="text-3xl font-bold text-gray-800">{sellers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-800">
                  LKR {sellers.reduce((sum, s) => sum + s.totalRevenue, 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Products</p>
                <p className="text-3xl font-bold text-gray-800">
                  {sellers.length > 0 ? Math.round(sellers.reduce((sum, s) => sum + s.totalProducts, 0) / sellers.length) : 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Top Performer</p>
                <p className="text-lg font-bold text-gray-800">
                  {sellers.length > 0 ? sellers.sort((a, b) => b.totalRevenue - a.totalRevenue)[0]?.name.split(' ')[0] : 'N/A'}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Sellers</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or phone..."
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="revenue">Total Revenue</option>
                <option value="products">Total Products</option>
                <option value="orders">Total Orders</option>
                <option value="name">Name (A-Z)</option>
                <option value="joinDate">Join Date</option>
              </select>
            </div>
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                Showing {filteredSellers.length} of {sellers.length} sellers
              </div>
            </div>
          </div>
        </div>

        {/* Sellers List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 gap-4 p-6">
            {filteredSellers.length > 0 ? (
              filteredSellers.map((seller, index) => {
                const performance = getPerformanceRating(seller);
                return (
                  <div 
                    key={index} 
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                      {/* Seller Info */}
                      <div className="lg:col-span-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-lg">
                              {seller.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{seller.name}</h3>
                            <p className="text-gray-600">{seller.phone}</p>
                            <p className="text-sm text-gray-500">
                              Joined: {seller.joinDate.toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="lg:col-span-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">{seller.totalProducts}</p>
                          <p className="text-sm text-gray-600">Products</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">{seller.totalOrders}</p>
                          <p className="text-sm text-gray-600">Orders</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">LKR {seller.totalRevenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Revenue</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-800">LKR {seller.averagePrice.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Avg Price</p>
                        </div>
                      </div>

                      {/* Performance & Categories */}
                      <div className="lg:col-span-2 text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${performance.color} mb-2`}>
                          {performance.rating}
                        </span>
                        <div className="text-sm text-gray-600">
                          <p>Categories:</p>
                          <p className="font-medium">{seller.categories.join(', ')}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                {sellers.length === 0 ? 'No sellers found' : 'No sellers match your search criteria'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sellers;