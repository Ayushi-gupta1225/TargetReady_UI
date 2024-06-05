import React, { useState, useEffect } from 'react';
import Planogram from '../components/Planogram';

const Home = () => {
  const [initialFormData] = useState({
    productName: '',
    productId: '',
    height: '',
    width: '',
    heightPx: '',
    widthPx: '',
    quantity: 1,
    shelf: '',
    section: '',
    productImage: null
  });

  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState(initialFormData);

  const realLifeHeightCm = 44;
  const realLifeWidthCm = 90;
  
  const [scalingFactorHeight, setScalingFactorHeight] = useState(1);
  const [scalingFactorWidth, setScalingFactorWidth] = useState(1);

  useEffect(() => {
    const firstSlot = document.querySelector('.shelf-item');
    if (firstSlot) {
      const slotStyles = window.getComputedStyle(firstSlot);
      const slotHeightPx = parseFloat(slotStyles.height);
      const slotWidthPx = parseFloat(slotStyles.width);

      setScalingFactorHeight(slotHeightPx / realLifeHeightCm);
      setScalingFactorWidth(slotWidthPx / realLifeWidthCm);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, productImage: URL.createObjectURL(file) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productHeightPx = formData.height * scalingFactorHeight;
    const productWidthPx = formData.width * scalingFactorWidth;

    const updatedFormData = {
      ...formData,
      heightPx: productHeightPx,
      widthPx: productWidthPx,
    };

    setProducts([...products, updatedFormData]);
    setFormData(initialFormData);
  };

  const handleIncrement = () => {
    setFormData({ ...formData, quantity: formData.quantity + 1 });
  };

  const handleDecrement = () => {
    setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) });
  };

  return (
    <div className="flex h-auto overflow-hidden">
      <div className="w-2/5 bg-white shadow-md rounded p-6 border border-gray-300 overflow-auto">
        <h2 className="text-center text-2xl font-bold underline">New Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-gray-700">Product Name:</label>
                <input
                  type="text"
                  name="productName"
                  value={formData.productName}
                  onChange={handleChange}
                  className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700">Product ID:</label>
                <input
                  type="text"
                  name="productId"
                  value={formData.productId}
                  onChange={handleChange}
                  className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  required 
                />
              </div>
            </div>
            <div style={{ width: '150px', height: '140px' }} className="border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
              {formData.productImage ? (
                <img src={formData.productImage} alt="Product" className="object-cover w-full h-full" />
              ) : (
                <label className="cursor-pointer flex items-center justify-center w-full h-full">
                  <input type="file" name="productImage" onChange={handleImageChange} className="hidden" />
                  <span className="text-gray-500">Add Image</span>
                </label>
              )}
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700">Product Height(cm):</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-700">Product Width(cm):</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                required
              />
            </div>
          </div>
          <div>
            <label className="block py-2 text-gray-700">Select Position</label>
            <ul className="list-disc ml-6">
              <li className="flex items-center space-x-2">
                <label className="text-gray-700 text-sm flex-none">Shelf:</label>
                <select
                  name="shelf"
                  value={formData.shelf}
                  onChange={handleChange}
                  className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 flex-grow"
                  required
                >
                  <option value="">Select Shelf</option>
                  <option value="shelf1">Shelf 1</option>
                  <option value="shelf2">Shelf 2</option>
                  <option value="shelf3">Shelf 3</option>
                </select>
              </li>
              <li className="flex items-center space-x-2 mt-2">
                <label className="text-gray-700 text-sm flex-none">Section:</label>
                <select
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300 flex-grow"
                  required
                >
                  <option value="">Select Section</option>
                  <option value="section1">Section 1</option>
                  <option value="section2">Section 2</option>
                  <option value="section3">Section 3</option>
                </select>
              </li>
            </ul>
          </div>
          <div className="flex items-center space-x-2">
            <label className="block text-gray-700">Quantity:</label>
            <button
              type="button"
              onClick={handleDecrement}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
            >
              -
            </button>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              min="1"
              className="w-16 text-center px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
            <button
              type="button"
              onClick={handleIncrement}
              className="px-3 py-1 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 focus:outline-none"
            >
              +
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Add Item
          </button>
        </form>
      </div>
      <div className="w-3/5 bg-white shadow-md rounded p-6 border border-gray-300 overflow-auto">
        <Planogram products={products} scalingFactorHeight={scalingFactorHeight} scalingFactorWidth={scalingFactorWidth} />
      </div>
    </div>
  );
};

export default Home;
