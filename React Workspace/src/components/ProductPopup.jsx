import { useState, useEffect, useRef } from 'react';
import styles from './ProductPopup.module.css';
import axiosInstance from '../utils/axiosConfig';
import SubmitButton from './SubmitButton';

const ProductPopup = ({ show, onClose, onSelect, planograms, userId }) => {
  const [products, setProducts] = useState([]);
  const [currentPlanogramIndex, setCurrentPlanogramIndex] = useState(0);
  const popupRef = useRef(null);

  useEffect(() => {
    if (show) {
      const fetchProductsByPlanogram = async (planogramId) => {
        try {
          const response = await axiosInstance.get(`/api/planogram/${planogramId}/products`);
          // Filter products by userId
          const userProducts = response.data.filter(product => product.user.userId === userId);
          setProducts(userProducts);
        } catch (error) {
          console.error('Error fetching products by planogram:', error);
        }
      };

      fetchProductsByPlanogram(planograms[currentPlanogramIndex].planogramId);
    }
  }, [show, currentPlanogramIndex, planograms, userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [show, onClose]);

  if (!show || planograms.length === 0) {
    return null;
  }

  const currentPlanogram = planograms[currentPlanogramIndex];

  const handleNext = () => {
    setCurrentPlanogramIndex((prevIndex) => Math.min(prevIndex + 1, planograms.length - 1));
  };

  const handlePrevious = () => {
    setCurrentPlanogramIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  return (
    <div className={styles['overlay']}>
      <div className={styles['popup']} ref={popupRef}>
        <div className={styles['header']}>
          <h2>{currentPlanogram.name}</h2>
        </div>
        <div className={`${styles['content']} ${styles['custom-scrollbar']}`}>
          {products.length === 0 ? (
            <div className={styles['noProductsMessage']}>No products in planogram</div>
          ) : (
            products.map((product, index) => (
              <div key={index} className={styles['product']} onClick={() => onSelect(product)}>
                <div className={styles['productImage']}></div>
                <div className={styles['productInfo']}>
                  <span>{product.name}</span>
                  <span>{product.height} × {product.breadth}</span>
                </div>
              </div>
            ))
          )}
        </div>
        <div className={styles['footer']}>
          <SubmitButton
            text="Previous"
            icon='./src/assets/arrow-left.svg'
            onClick={handlePrevious}
            disabled={currentPlanogramIndex === 0}
            variant="previous"
            buttonColor = '#000000'
            arrowColor = '#7B7979'
          />
          <SubmitButton
            text="Next"
            icon='./src/assets/arrow-right.svg'
            onClick={handleNext}
            disabled={currentPlanogramIndex === planograms.length - 1}
            buttonColor = '#000000'
            arrowColor = '#7B7979'
          />
        </div>
      </div>
    </div>
  );
};

export default ProductPopup;
