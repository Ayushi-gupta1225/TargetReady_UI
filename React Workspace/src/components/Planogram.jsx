import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './Planogram.module.css';
import PlanogramPopup from './PlanogramPopup';

const Planogram = ({ products, locations, planogram, handleEdit, handleDelete, onProductClick, disablePopup }) => {
  const [maxDimensions, setMaxDimensions] = useState({
    width: 0,
    height: 0,
  });
  const [showPopup, setShowPopup] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedColIndex, setSelectedColIndex] = useState(null);
  const [selectedProductIndex, setSelectedProductIndex] = useState(null);
  const parentRef = useRef(null);

  useEffect(() => {
    const calculateMaxDimensions = () => {
      if (parentRef.current) {
        const parentRect = parentRef.current.getBoundingClientRect();
        setMaxDimensions({
          width: parentRect.width,
          height: parentRect.height,
        });
      }
    };

    calculateMaxDimensions();
    window.addEventListener('resize', calculateMaxDimensions);
    return () => window.removeEventListener('resize', calculateMaxDimensions);
  }, []);

  const calculateSlotDimensions = () => {
    const aspectRatio = planogram.slotWidth / planogram.slotHeight;
    const marginVertical = 40;
    const availableWidth = maxDimensions.width - (planogram.numSections - 1) * 5 - 20;
    const availableHeight = maxDimensions.height - (planogram.numShelves - 1) * 5 - marginVertical - 20;
    let slotWidthPx = availableWidth / planogram.numSections;
    let slotHeightPx = slotWidthPx / aspectRatio;

    if (slotHeightPx * planogram.numShelves > availableHeight) {
      slotHeightPx = availableHeight / planogram.numShelves;
      slotWidthPx = slotHeightPx * aspectRatio;
    }
    return { slotWidthPx, slotHeightPx };
  };

  const { slotWidthPx, slotHeightPx } = calculateSlotDimensions();
  const gridTemplate = Array(planogram.numShelves * planogram.numSections).fill(null);

  const handleOpenPopup = (product, rowIndex, colIndex, productIndex, e) => {
    if (disablePopup) return; // Do not open the popup if disablePopup is true

    setSelectedProduct(product);
    setSelectedRowIndex(rowIndex);
    setSelectedColIndex(colIndex);
    setSelectedProductIndex(productIndex);
    setShowPopup(true);
    handleProductClick(product, e);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedProduct(null);
    setSelectedRowIndex(null);
    setSelectedColIndex(null);
    setSelectedProductIndex(null);
  };

  const handleProductClick = (product, event) => {
    const rect = event.target.getBoundingClientRect();
    onProductClick({
      ...product,
      position: {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
      },
    });
  };

  return (
    <div ref={parentRef} style={{ height: 'calc(100vh - 250px)', width: 'calc(100vw - 600px)', padding: '20px', boxSizing: 'border-box', overflow: 'hidden' }}>
      <div className={styles['planogram-wrapper']} style={{ padding: '10px' }}>
        <div
          className={styles['grid']}
          style={{
            gridTemplateColumns: `repeat(${planogram.numSections}, ${slotWidthPx}px)`,
            gridTemplateRows: `repeat(${planogram.numShelves}, ${slotHeightPx}px)`,
            gap: '5px',
            margin: '20px 0',
          }}
        >
          {gridTemplate.map((_, index) => {
            const rowIndex = Math.floor(index / planogram.numSections) + 1;
            const colIndex = (index % planogram.numSections) + 1;
            const locationProducts = locations
              .filter(l => l.productRow === rowIndex && l.productSection === colIndex && l.planogram.planogramId === planogram.planogramId)
              .map(location => {
                const product = products.find(p => p.productId === location.product.productId);
                return {
                  ...product,
                  heightPx: (product.height / planogram.slotHeight) * slotHeightPx,
                  widthPx: (product.breadth / planogram.slotWidth) * slotWidthPx,
                  quantity: location.quantity || 1,
                  index: location.index,
                  productRow: location.productRow,
                  productSection: location.productSection,
                };
              });

            return (
              <div key={index} className={styles['slot']} style={{ height: `${slotHeightPx}px`, width: `${slotWidthPx}px` }}>
                {locationProducts.length > 0 ? (
                  locationProducts.map((product, i) =>
                    Array.from({ length: product.quantity }).map((_, j) => (
                      <div
                        key={`${i}-${j}`}
                        className={styles['product-rectangle']}
                        style={{
                          width: `${product.widthPx}px`,
                          height: `${product.heightPx}px`,
                          borderRadius: '4px',
                          alignSelf: 'flex-end',
                          cursor: 'pointer',
                        }}
                        onClick={(e) => handleOpenPopup(product, rowIndex, colIndex, product.index, e)}
                      />
                    ))
                  )
                ) : (
                  <p className={styles['empty-slot']}>Empty Slot</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {showPopup && selectedProduct && (
        <PlanogramPopup
          product={selectedProduct}
          onClose={handleClosePopup}
          onDelete={() => {
            handleDelete(selectedProduct, selectedRowIndex, selectedColIndex, selectedProductIndex);
            handleClosePopup();
          }}
          onEdit={() => {
            handleEdit();
            setShowPopup(false);
          }}
        />
      )}
    </div>
  );
};

Planogram.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      productId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      height: PropTypes.number.isRequired,
      breadth: PropTypes.number.isRequired,
      heightPx: PropTypes.number,
      widthPx: PropTypes.number,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  locations: PropTypes.arrayOf(
    PropTypes.shape({
      locationId: PropTypes.number.isRequired,
      product: PropTypes.shape({
        productId: PropTypes.number.isRequired,
      }).isRequired,
      productRow: PropTypes.number.isRequired,
      productSection: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
      planogram: PropTypes.shape({
        planogramId: PropTypes.number.isRequired,
      }).isRequired,
      index: PropTypes.number.isRequired,
    })
  ).isRequired,
  planogram: PropTypes.shape({
    planogramId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    slotHeight: PropTypes.number.isRequired,
    slotWidth: PropTypes.number.isRequired,
    numShelves: PropTypes.number.isRequired,
    numSections: PropTypes.number.isRequired,
  }).isRequired,
  handleDelete: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  onProductClick: PropTypes.func.isRequired,
  disablePopup: PropTypes.bool, // Add the prop type for disablePopup
};

Planogram.defaultProps = {
  disablePopup: false, // Default value for disablePopup
};

export default Planogram;
