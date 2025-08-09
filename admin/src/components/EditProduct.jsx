import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../constants/config';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';

const EditProduct = ({ product, onClose, onUpdate, token }) => {
  const [images, setImages] = useState({
    image1: null,
    image2: null,
    image3: null,
    image4: null
  });

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    bestseller: false,
    sizes: [],
    sellername: '',
    sellerphone: ''
  });

  const [existingImages, setExistingImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sellers, setSellers] = useState([]);
  const [isLoadingSellers, setIsLoadingSellers] = useState(false);
  const [isNewSeller, setIsNewSeller] = useState(false);

  // Fetch sellers from database
  const fetchSellers = async () => {
    try {
      setIsLoadingSellers(true);
      const response = await axios.get(backendUrl + '/api/seller/list');
      if (response.data.success) {
        setSellers(response.data.sellers);
      } else {
        toast.error('Failed to fetch sellers');
      }
    } catch (error) {
      console.error('Error fetching sellers:', error);
      toast.error('Error loading sellers');
    } finally {
      setIsLoadingSellers(false);
    }
  };

  // Handle seller selection
  const handleSellerChange = (e) => {
    const selectedSeller = e.target.value;
    
    if (selectedSeller === 'new') {
      setIsNewSeller(true);
      setFormData(prev => ({
        ...prev,
        sellername: '',
        sellerphone: ''
      }));
    } else if (selectedSeller === '') {
      setIsNewSeller(false);
      setFormData(prev => ({
        ...prev,
        sellername: '',
        sellerphone: ''
      }));
    } else {
      setIsNewSeller(false);
      const seller = sellers.find(s => s.name === selectedSeller);
      if (seller) {
        setFormData(prev => ({
          ...prev,
          sellername: seller.name,
          sellerphone: seller.phone
        }));
      }
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || 'Men',
        subCategory: product.subcategory || 'Topwear',
        bestseller: product.bestseller || false,
        sizes: product.sizes || [],
        sellername: product.sellername || '',
        sellerphone: product.sellerphone || ''
      });
      setExistingImages(product.image || []);
      
      // Check if this is an existing seller or new seller
      if (product.sellername) {
        const existingSeller = sellers.find(s => s.name === product.sellername);
        setIsNewSeller(!existingSeller);
      }
    }
  }, [product, sellers]);

  const handleImageChange = (e, fieldName) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file type
      if (!file.type.match('image.*')) {
        toast.error('Please upload an image file');
        return;
      }
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setImages(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return false;
    }
    if (!formData.description.trim()) {
      toast.error('Product description is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (!formData.sellername.trim()) {
      toast.error('Seller name is required');
      return false;
    }
    if (!/^\d{10}$/.test(formData.sellerphone)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Append form data
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'sizes') {
          formDataToSend.append(key, JSON.stringify(value));
        } else {
          formDataToSend.append(key, value);
        }
      });

      // Append product ID for update
      formDataToSend.append('productId', product._id);

      // Append new images
      Object.entries(images).forEach(([key, file]) => {
        if (file) formDataToSend.append(key, file);
      });

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          'token': token
        },
        timeout: 15000
      };

      const response = await axios.post(
        `${backendUrl}/api/product/update`,
        formDataToSend,
        config
      );

      if (response.data.success) {
        toast.success('Product Updated Successfully');
        onUpdate(); // Refresh the product list
        onClose(); // Close the modal
      } else {
        toast.error(response.data.message || 'Failed to update product');
      }
    } catch (error) {
      console.error('Error:', error);
      
      if (error.response) {
        if (error.response.status === 401) {
          toast.error('Unauthorized: Please login again');
        } else if (error.response.status === 413) {
          toast.error('File size too large');
        } else {
          toast.error(error.response.data?.message || 'Server error occurred');
        }
      } else if (error.request) {
        toast.error('Network error: Please check your connection');
      } else {
        toast.error('Error: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="flex flex-col w-full items-start gap-4 p-6">
          <div className="flex justify-between items-center w-full border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="w-full">
            <div className="mb-6">
              <p className="mb-3 text-lg font-semibold text-gray-700">Product Images</p>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Current Images:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingImages.map((img, index) => (
                      <img 
                        key={index}
                        src={img} 
                        alt={`Current ${index + 1}`}
                        className="w-20 h-20 object-cover rounded-md border"
                      />
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 mb-3">Upload new images (optional):</p>
              <div className="flex flex-wrap gap-4">
                {[1, 2, 3, 4].map((num) => (
                  <label 
                    key={num} 
                    htmlFor={`edit_image${num}`}
                    className="cursor-pointer hover:scale-105 transition-transform"
                  >
                    <div className={`w-32 h-32 flex items-center justify-center rounded-lg border-2 border-dashed ${
                      images[`image${num}`] ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                    }`}>
                      <img 
                        className="w-full h-full object-contain p-2"
                        src={images[`image${num}`] ? URL.createObjectURL(images[`image${num}`]) : assets.upload_area} 
                        alt={`Preview ${num}`} 
                      />
                    </div>
                    <input 
                      onChange={(e) => handleImageChange(e, `image${num}`)}
                      type="file" 
                      id={`edit_image${num}`}
                      className="hidden"
                      accept="image/*"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="text"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description*</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Enter product description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seller*</label>
                  <select
                    value={isNewSeller ? 'new' : formData.sellername}
                    onChange={handleSellerChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Select a seller</option>
                    {isLoadingSellers ? (
                      <option disabled>Loading sellers...</option>
                    ) : (
                      sellers.map((seller, index) => (
                        <option key={index} value={seller.name}>
                          {seller.name} ({seller.phone})
                        </option>
                      ))
                    )}
                    <option value="new">+ Add New Seller</option>
                  </select>
                </div>

                {(isNewSeller || !formData.sellername) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seller Name* {isNewSeller && <span className="text-blue-600">(New Seller)</span>}
                    </label>
                    <input
                      name="sellername"
                      value={formData.sellername}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="text"
                      placeholder="Enter seller name"
                      required
                    />
                  </div>
                )}

                {(isNewSeller || !formData.sellername || !sellers.find(s => s.name === formData.sellername)) && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Seller Phone* {isNewSeller && <span className="text-blue-600">(New Seller)</span>}
                    </label>
                    <input
                      name="sellerphone"
                      value={formData.sellerphone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      type="tel"
                      placeholder="Enter 10-digit phone number"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                )}

                {formData.sellername && sellers.find(s => s.name === formData.sellername) && !isNewSeller && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Seller Phone</label>
                    <input
                      value={formData.sellerphone}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100"
                      type="tel"
                      placeholder="Phone number will be auto-filled"
                      disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">Phone number auto-filled from selected seller</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="Men">Men</option>
                      <option value="Women">Women</option>
                      <option value="Kids">Kids</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sub Category</label>
                    <select
                      name="subCategory"
                      value={formData.subCategory}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Topwear">Topwear</option>
                      <option value="Bottomwear">Bottomwear</option>
                      <option value="Winterwear">Winterwear</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price (LKR)*</label>
                  <input
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Sizes*</label>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', 'XXL', 'XXXL'].map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => handleSizeToggle(size)}
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          formData.sizes.includes(size)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={handleInputChange}
                    type="checkbox"
                    id="edit_bestseller"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="edit_bestseller" className="ml-2 block text-sm text-gray-700">
                    Mark as Bestseller
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 mt-6 w-full">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-2 rounded-md text-white font-medium ${
                  isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </span>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;