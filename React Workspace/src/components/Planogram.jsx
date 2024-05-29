import React from 'react';
import './Planogram.css';

function Planogram({ products }) {
  const gridTemplate = Array(9).fill(null);

  return (
    <div className="shelf">
      <h2>Planogram Shelf</h2>
      <div className="shelf-grid">
        {gridTemplate.map((_, index) => {
          const product = products[index];
          return (
            <div key={index} className="shelf-item">
              {product ? (
                <>
                  <p><strong>ID:</strong> {product.id}</p>
                  <p><strong>Name:</strong> {product.name}</p>
                  <p><strong>Dimensions:</strong> {product.length}cm x {product.breadth}cm</p>
                  <p><strong>Quantity:</strong> {product.quantity}</p>
                  <p><strong>Position:</strong> {product.position}</p>
                </>
              ) : (
                <p>Empty Slot</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Planogram;