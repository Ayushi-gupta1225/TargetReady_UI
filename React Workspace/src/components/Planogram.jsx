import { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './Planogram.module.css';

const Planogram = ({ products, locations, planogram }) => {
  const [maxDimensions, setMaxDimensions] = useState({
     width: 0, 
     height: 0 
    });
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

  return (
    <div ref={parentRef} style={{ 
      height: 'calc(100vh - 150px)', 
      width: 'calc(100vw - 600px)', 
      padding: '20px', 
      boxSizing: 'border-box', 
      overflow: 'hidden' }}>
      <div className={styles['planogram-wrapper']} style={{ padding: '10px' }}>
        <div
          className={styles['grid']}
          style={{
            gridTemplateColumns: `repeat(${planogram.numSections}, ${slotWidthPx}px)`,
            gridTemplateRows: `repeat(${planogram.numShelves}, ${slotHeightPx}px)`,
            gap: '5px',
            margin: '20px 0',
          }}>
          {gridTemplate.map((_, index) => {
            const rowIndex = Math.floor(index / planogram.numSections) + 1;
            const colIndex = (index % planogram.numSections) + 1;
            const locationProducts = locations
              .filter(l => l.productRow === rowIndex && l.productSection === colIndex && l.planogram.planogramId === planogram.planogramId)
              .map(location => {
                const product = products.find(p => p.productId === location.product.productId);
                console.log('Matching Product:', product); // Debugging: Log matching product
                return {
                  ...product,
                  heightPx: (product.height / planogram.slotHeight) * slotHeightPx,
                  widthPx: (product.breadth / planogram.slotWidth) * slotWidthPx,
                  quantity: location.quantity || 1,
                };
              });

            return (
              <div
                key={index}
                className={styles['slot']}
                style={{ height: `${slotHeightPx}px`, width: `${slotWidthPx}px` }}>
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
                        }}
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
    </div>
  );
};

Planogram.propTypes = {
  products: PropTypes.arrayOf(PropTypes.shape({
    productId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    breadth: PropTypes.number.isRequired,
    heightPx: PropTypes.number,
    widthPx: PropTypes.number,
    quantity: PropTypes.number.isRequired,
  })).isRequired,
  locations: PropTypes.arrayOf(PropTypes.shape({
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
  })).isRequired,
  planogram: PropTypes.shape({
    planogramId: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    slotHeight: PropTypes.number.isRequired,
    slotWidth: PropTypes.number.isRequired,
    numShelves: PropTypes.number.isRequired,
    numSections: PropTypes.number.isRequired,
  }).isRequired,
};

export default Planogram;
