// ProductDisplayComponent.jsx
import React from 'react';
import Planogram from './Planogram';

const ProductDisplayComponent = ({ products, scalingFactorHeight, scalingFactorWidth }) => {
  return (
    <div className="w-3/5 bg-white shadow-md rounded p-6 border border-gray-300 overflow-auto">
      <Planogram products={products} scalingFactorHeight={scalingFactorHeight} scalingFactorWidth={scalingFactorWidth} />
    </div>
  );
};

export default ProductDisplayComponent;
