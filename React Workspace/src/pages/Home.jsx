import { useState, useEffect } from 'react';
import axios from 'axios';
import Planogram from '../components/Planogram';

const Home = () => {
  const [initialFormData] = useState({
    productName: '',
    productId: null,
    heightPx: null,
    widthPx: null,
    height: null,
    width: null,
    quantity: 1,
    shelf: null,
    section: null,
  });

  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
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

    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:2000/api/data');
        setLocations(response.data.locations);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
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

  const handleSubmit = async (e) => {
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

    const productData = {
      productId: formData.productId,
      name: formData.productName,
      height: formData.height,
      breadth: formData.width,
      quantity: formData.quantity,
      productRow: formData.shelf,
      productSection: formData.section,
    };

    try {
      const response = await axios.post(
        'http://localhost:2000/api/place',
        {
          ...productData,
        },
        {
          params: {
            productRow: parseInt(formData.shelf),
            productSection: parseInt(formData.section),
            quantity: formData.quantity,
          },
        }
      );

      if (response.status === 200) {
        setProducts([
          ...products,
          {
            ...productData,
            quantity: formData.quantity,
            productRow: formData.shelf,
            productSection: formData.section,
            heightPx: productHeightPx,
            widthPx: productWidthPx,
            productImage: formData.productImage,
          },
        ]);
        alert('Product placed successfully');
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    } finally {
      window.location.reload(); 
    }
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
        <h2 className="text-center text-2xl font-bold">New Product</h2>
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
                  autoComplete="off"
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
                  autoComplete="off"
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
                autoComplete="off"
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
                autoComplete="off"
                required
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="block text-gray-700">Quantity:</label>
            <button
              type="button"
              onClick={handleDecrement}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md focus:outline-none"
            >
              -
            </button>
            <span>{formData.quantity}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className="px-2 py-1 bg-gray-200 text-gray-700 rounded-md focus:outline-none"
            >
              +
            </button>
          </div>
          <div>
            <label className="block text-gray-700">Shelf:</label>
            <select 
              type="number" 
              name="shelf" 
              value={formData.shelf || ''} 
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              autoComplete="off"
              required
              >
              <option value="" disabled hidden>Select a shelf</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            
          </div>
          <div>
            <label className="block text-gray-700">Section:</label>
            <select 
              type="number" 
              name="section" 
              value={formData.section || ''} 
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              autoComplete="off"
              required
              >
              <option value="" disabled hidden>Select a section</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </select>
            
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:border-blue-300"
          >
            Place Product
          </button>
        </form>
      </div>
    <div className="w-3/5 bg-white shadow-md rounded p-6 border border-gray-300 overflow-auto">
      <Planogram
          products={products}
          locations={locations}
          scalingFactorHeight={scalingFactorHeight}
          scalingFactorWidth={scalingFactorWidth}
        />
      </div>
    </div>
  );
};

export default Home;
