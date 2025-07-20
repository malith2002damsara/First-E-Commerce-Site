import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import EditSeller from '../components/EditSeller';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiUsers } from 'react-icons/fi';

const Sellers = ({ token }) => {
  const [sellers, setSellers] = useState([]);
  const [filteredSellers, setFilteredSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newSeller, setNewSeller] = useState({
    name: '',
    phone: ''
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchSellers = async () => {
    try {
      setIsLoading(true);
      // Get sellers from products
      const response = await axios.get(`${backendUrl}/api/product/list`);
      
      if (response.data.success) {
        const products = response.data.products;
        // Extract unique sellers from products
        const sellersMap = {};
        
        products.forEach(product => {
          if (product.sellername && !sellersMap[product.sellername]) {
            sellersMap[product.sellername] = {
              name: product.sellername,
              phone: product.sellerphone || '',
              productCount: 0,
              totalRevenue: 0
            };
          }
          if (product.sellername) {
            sellersMap[product.sellername].productCount++;
            sellersMap[product.sellername].totalRevenue += Number(product.price) || 0;
          }
        });

        const sellersArray = Object.values(sellersMap);
        setSellers(sellersArray);
        setFilteredSellers(sellersArray);
      } else {
        toast.error('Failed to fetch sellers');
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Error fetching sellers: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (!term.trim()) {
      setFilteredSellers(sellers);
    } else {
      const filtered = sellers.filter(seller =>
        seller.name.toLowerCase().includes(term.toLowerCase()) ||
        seller.phone.includes(term)
      );
      setFilteredSellers(filtered);
    }
  };

  const handleEditSeller = (seller) => {
    setSelectedSeller(seller);
    setIsEditModalOpen(true);
  };

  const handleAddSeller = async (e) => {
    e.preventDefault();
    
    if (!newSeller.name.trim()) {
      toast.error('Seller name is required');
      return;
    }
    if (!/^\d{10}$/.test(newSeller.phone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    // Check if seller already exists
    const existingSeller = sellers.find(s => s.name.toLowerCase() === newSeller.name.toLowerCase());
    if (existingSeller) {
      toast.error('Seller with this name already exists');
      return;
    }

    try {
      // For now, we'll add it to local state since we don't have a dedicated sellers API
      const newSellerData = {
        name: newSeller.name.trim(),
        phone: newSeller.phone.trim(),
        productCount: 0,
        totalRevenue: 0
      };

      setSellers(prev => [...prev, newSellerData]);
      setFilteredSellers(prev => [...prev, newSellerData]);
      
      setNewSeller({ name: '', phone: '' });
      setShowAddForm(false);
      toast.success('Seller added successfully');
    } catch (error) {
      console.error('Error adding seller:', error);
      toast.error('Error adding seller');
    }
  };

  const handleDeleteSeller = async (sellerName) => {
    if (!window.confirm(`Are you sure you want to delete seller "${sellerName}"? This will also affect all products by this seller.`)) {
      return;
    }

    try {
      // Check if seller has products
      const sellerProducts = sellers.find(s => s.name === sellerName);
      if (sellerProducts && sellerProducts.productCount > 0) {
        toast.warning('Cannot delete seller with existing products. Please remove all products first.');
        return;
      }

      // Remove from local state
      setSellers(prev => prev.filter(s => s.name !== sellerName));
      setFilteredSellers(prev => prev.filter(s => s.name !== sellerName));
      toast.success('Seller deleted successfully');
    } catch (error) {
      console.error('Error deleting seller:', error);
      toast.error('Error deleting seller');
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  if (isLoading) {
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Seller Management</h1>
            <p className="text-gray-600">Manage your sellers and their information</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiPlus /> Add Seller
          </button>
        </div>

        {/* Add Seller Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Seller</h3>
            <form onSubmit={handleAddSeller} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seller Name *
                </label>
                <input
                  type="text"
                  value={newSeller.name}
                  onChange={(e) => setNewSeller(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter seller name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newSeller.phone}
                  onChange={(e) => setNewSeller(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter 10-digit phone number"
                  pattern="[0-9]{10}"
                  maxLength="10"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                >
                  Add Seller
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search sellers by name or phone..."
              className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sellers</p>
                <p className="text-3xl font-bold text-gray-800">{sellers.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sellers</p>
                <p className="text-3xl font-bold text-gray-800">
                  {sellers.filter(s => s.productCount > 0).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-3xl font-bold text-gray-800">
                  {sellers.reduce((sum, seller) => sum + seller.productCount, 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Sellers Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Sellers ({filteredSellers.length})
            </h3>
          </div>

          {filteredSellers.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              {sellers.length === 0 ? 'No sellers found' : 'No sellers match your search'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Seller Information
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Products
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenue
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSellers.map((seller, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {seller.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            📞 {seller.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {seller.productCount} products
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          LKR {seller.totalRevenue.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditSeller(seller)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit seller"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteSeller(seller.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete seller"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Edit Seller Modal */}
        {isEditModalOpen && selectedSeller && (
          <EditSeller
            seller={selectedSeller}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedSeller(null);
            }}
            onUpdate={() => {
              fetchSellers();
              setIsEditModalOpen(false);
              setSelectedSeller(null);
            }}
            token={token}
          />
        )}
      </div>
    </div>
  );
};

export default Sellers;
