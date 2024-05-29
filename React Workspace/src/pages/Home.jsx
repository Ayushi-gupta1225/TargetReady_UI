import React, { useState } from 'react';
import Planogram from '../components/Planogram';

const Home = () => {
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    breadth: '',
    width: '',
    quantity: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  const products = [
    // { id: '1', name: 'Product 1', length: 10, breadth: 5, quantity: 20, position: '1' },
    // { id: '2', name: 'Product 2', length: 15, breadth: 10, quantity: 30, position: '2' },
    // Add more products as needed
  ];

  return (
    <div className="flex mt-10">
      <div className="max-w-md bg-white shadow-md rounded p-6 mr-10">
        <h2 className="text-2xl font-bold mb-4">Home Page</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Product Name:</label>
            <input
              type="text"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Product ID:</label>
            <input
              type="text"
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Breadth:</label>
            <input
              type="text"
              name="breadth"
              value={formData.breadth}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Width:</label>
            <input
              type="text"
              name="width"
              value={formData.width}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div>
            <label className="block text-gray-700">Quantity:</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 text-white font-bold rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Submit
          </button>
        </form>
      </div>
      <div className="flex-1">
        <Planogram products={products}/>
      </div>
    </div>
  );
}

export default Home;
