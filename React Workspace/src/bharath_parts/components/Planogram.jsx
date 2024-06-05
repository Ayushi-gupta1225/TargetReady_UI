import React, { useState } from 'react';
import './Planogram.css';

function Planogram({ products, scalingFactorHeight, scalingFactorWidth }) {
  const gridTemplate = Array(9).fill(null);
  const realLifeHeightCm = 44;
  const realLifeWidthCm = 90;

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setEditMode(false);
  };

  const closePopup = () => {
    setSelectedProduct(null);
    setEditMode(false);
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  return (
    <div className="shelf">
      <h2 className="text-center">Planogram Display</h2>
      <div className="shelf-grid">
        {gridTemplate.map((_, index) => {
          const rowIndex = Math.floor(index / 3) + 1;
          const colIndex = (index % 3) + 1;
          const product = products.find(p => p.shelf === `shelf${rowIndex}` && p.section === `section${colIndex}`);
          return (
            <div key={index} className="shelf-item">
              {product ? (
                <div
                  className="product-rectangle"
                  style={{
                    width: `${product.widthPx}px`,
                    height: `${product.heightPx}px`,
                    borderColor: (product.widthPx <= realLifeWidthCm * scalingFactorWidth && product.heightPx <= realLifeHeightCm * scalingFactorHeight) ? 'green' : 'red',
                    backgroundColor: 'grey',
                    borderWidth: '4px', // Thicker border for better visibility
                  }}
                  onClick={() => handleProductClick(product)}
                >
                  {product.productImage && (
                    <img
                      src={product.productImage}
                      alt="Product"
                      className="product-image"
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  )}
                </div>
              ) : (
                <p>Empty Slot</p>
              )}
            </div>
          );
        })}
      </div>
      {selectedProduct && (
        <div className="product-popup">
          <div className="popup-content">
            <button className="close-popup" onClick={closePopup}>×</button>
            <h3>{editMode ? 'Edit Product Details' : 'Product Details'}</h3>
            <div className="flex space-x-4">
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-gray-700">Product Name:</label>
                  <input
                    type="text"
                    value={selectedProduct.productName}
                    className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    readOnly={!editMode}
                  />
                </div>
                <div>
                  <label className="block text-gray-700">Product ID:</label>
                  <input
                    type="text"
                    value={selectedProduct.productId}
                    className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    readOnly={!editMode}
                  />
                </div>
              </div>
              <div style={{ width: '150px', height: '140px' }} className="border border-gray-300 rounded-md flex items-center justify-center overflow-hidden">
                {selectedProduct.productImage ? (
                  <img src={selectedProduct.productImage} alt="Product" className="object-cover w-full h-full" />
                ) : (
                  <span className="text-gray-500">No Image</span>
                )}
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700">Product Height(cm):</label>
                <input
                  type="text"
                  value={selectedProduct.height}
                  className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  readOnly={!editMode}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Product Width(cm):</label>
                <input
                  type="text"
                  value={selectedProduct.width}
                  className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  readOnly={!editMode}
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-gray-700">Shelf:</label>
                <input
                  type="text"
                  value={selectedProduct.shelf}
                  className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  readOnly={!editMode}
                />
              </div>
              <div className="flex-1">
                <label className="block text-gray-700">Section:</label>
                <input
                  type="text"
                  value={selectedProduct.section}
                  className="mt-1 block w-full px-2 py-1 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                  readOnly={!editMode}
                />
              </div>
            </div>
            {!editMode && (
              <button className="edit-button" onClick={handleEdit}>Edit</button>
            )}
            {editMode && (
              <button className="edit-button" onClick={closePopup}>Cancel</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Planogram;
