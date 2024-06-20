import './Planogram.css';
import React, { useState} from 'react';
import PropTypes from 'prop-types';

function Planogram({ products, locations, scalingFactorHeight, scalingFactorWidth }) {
  const gridTemplate = Array(9).fill(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setEditMode(false);
  };

  return (
    <div className="shelf">
      <div className="shelf-grid">
        {gridTemplate.map((_, index) => {
          const rowIndex = Math.floor(index / 3) + 1;
          const colIndex = (index % 3) + 1;
          const locationProducts = locations
            .filter(l => l.productRow === rowIndex && l.productSection === colIndex)
            .map(location => {
              const product = products.find(p => p.productId === location.product.productId);
              return {
                ...product,
                heightPx: product.height * scalingFactorHeight,
                widthPx: product.breadth * scalingFactorWidth,
                quantity: location.quantity || 1
              };
            });

          return (
            <div  data-testid="shelf-item" key={index} className="shelf-item">
              {locationProducts.length > 0 ? (
                locationProducts.map((product, i) => {
                  return (
                    Array.from({ length: product.quantity }).map((_, j) => (
                      <div
                        data-testid="product-rectangle"
                        key={`${i}-${j}`}
                        className="product-rectangle"
                        style={{
                          width: `${product.widthPx}px`,
                          height: `${product.heightPx}px`,
                          // borderColor: 'green',
                          backgroundColor: 'grey',
                          borderRadius: '4px',
                          // borderWidth: '4px',
                          alignSelf: 'flex-end' // Align to the bottom of the slot
                        }}
                        onClick={() => handleProductClick(product)}
                      />
                    ))
                  );
                })
              ) : (
                <p className="empty-slot">Empty Slot</p>
              )}
            </div>
          );
        })}
      </div>
      {/* {selectedProduct && (
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
      )} */}
      <div className="slot-dimensions" style={{ color: 'red' }}>
        <p>Slot height: 44cm</p>
        <p>Slot width: 90cm</p>
      </div>
    </div>
  );
}

Planogram.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      breadth: PropTypes.number.isRequired,
      heightPx: PropTypes.number,
      widthPx: PropTypes.number,
      quantity: PropTypes.number.isRequired
    })
  ).isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      locationId: PropTypes.number.isRequired,
      product: PropTypes.shape({
        productId: PropTypes.number.isRequired
      }).isRequired,
      productRow: PropTypes.number.isRequired,
      productSection: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired
    })
  ).isRequired,
  scalingFactorHeight: PropTypes.number.isRequired,
  scalingFactorWidth: PropTypes.number.isRequired
};

export default Planogram;
