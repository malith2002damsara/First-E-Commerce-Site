import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { FiFilter, FiX, FiSearch, FiTrash2 } from 'react-icons/fi';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    name: '',
    category: '',
    subcategory: ''
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const fetchList = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        const products = response.data.products;
        setList(products);
        setFilteredList(products);
        
        // Extract unique categories and subcategories
        const uniqueCategories = [...new Set(products.map(item => item.category))];
        setCategories(uniqueCategories);
        
        const uniqueSubcategories = [...new Set(products.map(item => item.subcategory))];
        setSubcategories(uniqueSubcategories);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await axios.post(
        backendUrl + '/api/product/remove',
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const applyFilters = React.useCallback(() => {
    let result = [...list];

    if (filters.name) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.category) {
      result = result.filter(item => 
        item.category.toLowerCase() === filters.category.toLowerCase()
      );
    }

    if (filters.subcategory) {
      result = result.filter(item => 
        item.subcategory.toLowerCase() === filters.subcategory.toLowerCase()
      );
    }

    setFilteredList(result);
  }, [list, filters]);

  const resetFilters = () => {
    setFilters({
      name: '',
      category: '',
      subcategory: ''
    });
    setFilteredList(list);
  };

  // Update subcategories when category changes
  useEffect(() => {
    if (filters.category) {
      const filteredSubcategories = [...new Set(
        list
          .filter(item => item.category === filters.category)
          .map(item => item.subcategory)
      )];
      setSubcategories(filteredSubcategories);
      // Reset subcategory filter when category changes
      setFilters(prev => ({ ...prev, subcategory: '' }));
    } else {
      // Show all subcategories when no category is selected
      const allSubcategories = [...new Set(list.map(item => item.subcategory))];
      setSubcategories(allSubcategories);
    }
  }, [filters.category, list]);

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">All Products List</h1>
        <div className="flex items-center gap-4">
          {(filters.name || filters.category || filters.subcategory) && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700"
            >
              <FiX /> Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Name Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search by Name</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.name}
                onChange={(e) => setFilters({...filters, name: e.target.value})}
                placeholder="Product name..."
                className="pl-10 w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Category</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters({...filters, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Subcategory</label>
            <select
              value={filters.subcategory}
              onChange={(e) => setFilters({...filters, subcategory: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              disabled={!filters.category && subcategories.length === 0}
            >
              <option value="">All Subcategories</option>
              {subcategories.map((subcategory, index) => (
                <option key={index} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(filters.name || filters.category || filters.subcategory) && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.name && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Name: {filters.name}
              <button 
                onClick={() => setFilters({...filters, name: ''})}
                className="ml-1.5 text-blue-600 hover:text-blue-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {filters.category && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Category: {filters.category}
              <button 
                onClick={() => setFilters({...filters, category: ''})}
                className="ml-1.5 text-green-600 hover:text-green-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
          {filters.subcategory && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Subcategory: {filters.subcategory}
              <button 
                onClick={() => setFilters({...filters, subcategory: ''})}
                className="ml-1.5 text-purple-600 hover:text-purple-800"
              >
                <FiX size={14} />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Results Count */}
      <div className="mb-4 text-sm text-gray-500">
        Showing {filteredList.length} of {list.length} products
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Table Header - Desktop */}
          <div className="hidden md:flex items-center py-3 px-4 bg-gray-50 text-gray-700 font-semibold border-b">
            <div className="w-16 flex-shrink-0">Image</div>
            <div className="flex-1 min-w-[200px] px-2">Product Name</div>
            <div className="flex-1 min-w-[120px] px-2">Category</div>
            <div className="flex-1 min-w-[120px] px-2">Subcategory</div>
            <div className="flex-1 min-w-[150px] px-2">Seller Name</div>
            <div className="flex-1 min-w-[120px] px-2">Seller Phone</div>
            <div className="w-24 px-2 text-right">Price</div>
            <div className="w-16 px-2 text-center">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200">
            {filteredList.length > 0 ? (
              filteredList.map((item, index) => (
                <div 
                  key={index} 
                  className="flex flex-col md:flex-row items-start md:items-center py-4 px-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Mobile View */}
                  <div className="md:hidden w-full">
                    <div className="flex items-start space-x-3 mb-3">
                      <img 
                        src={item.image[0]} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-md flex-shrink-0" 
                      />
                      <div className="flex-1">
                        <h3 className="text-gray-800 font-medium">{item.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className="text-sm text-gray-600 capitalize mr-2">{item.category}</span>
                          <span className="text-gray-800 font-medium ml-auto">
                            {currency}{item.price.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <p className="text-gray-500">Subcategory</p>
                        <p className="capitalize">{item.subcategory}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Seller</p>
                        <p>{item.sellername}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Phone</p>
                        <p>{item.sellerphone}</p>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={() => removeProduct(item._id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1 rounded hover:bg-red-50 flex items-center"
                          title="Delete product"
                        >
                          <FiTrash2 size={16} className="mr-1" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Desktop View */}
                  <div className="hidden md:flex w-full items-center">
                    <div className="w-16 flex-shrink-0">
                      <img 
                        src={item.image[0]} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-md" 
                      />
                    </div>
                    <div className="flex-1 min-w-[200px] px-2 text-gray-800 font-medium truncate">
                      {item.name}
                    </div>
                    <div className="flex-1 min-w-[120px] px-2 text-gray-600 capitalize">
                      {item.category}
                    </div>
                    <div className="flex-1 min-w-[120px] px-2 text-gray-600 capitalize">
                      {item.subcategory}
                    </div>
                    <div className="flex-1 min-w-[150px] px-2 text-gray-600">
                      {item.sellername}
                    </div>
                    <div className="flex-1 min-w-[120px] px-2 text-gray-600">
                      {item.sellerphone}
                    </div>
                    <div className="w-24 px-2 text-right text-gray-800 font-medium">
                      {currency}{" "}{item.price.toLocaleString()}
                    </div>
                    <div className="w-16 px-2 flex justify-center">
                      <button
                        onClick={() => removeProduct(item._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2 rounded hover:bg-red-50"
                        title="Delete product"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-gray-500">
                {list.length === 0 ? 'No products found' : 'No products match your filters'}
                {list.length > 0 && (
                  <button
                    onClick={resetFilters}
                    className="mt-2 block mx-auto px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default List;