import React from 'react';
import styles from './Form.module.css';

function Form({ formData, handleChange, handleSubmit, handleIncrement, handleDecrement }) {
  return (
    <div className={styles['form-wrapper']}>
      <button className={styles['product-wrapper']}>
          <div  className={styles['place-product-button']}>
          <div className={styles['button-text']}>Products</div>
            <div className={styles['box-arrow']}>
              <img src='./src/assets/plus.svg' alt='Icon' className={styles['icon']} />
            </div>
          </div>
      </button>
      <div className={styles['form-card']}>
        <form onSubmit={handleSubmit} className={styles['form-fields']}>
          <div className={styles['form-field-id']}>
            <label>Product Name</label>
            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required />
          </div>
          <div className={styles['form-field-id']}>
            <label>Product ID</label>
            <input type="text" name="productId" value={formData.productId} onChange={handleChange} required />
          </div>
          <div className={styles['form-field-dim-container']}>
            <div className={styles['form-field-dim']}>
              <label>Product Height</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} required />
            </div>
            <div className={styles['form-field-dim']}>
              <label>Product Width</label>
              <input type="number" name="width" value={formData.width} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles['form-field-row']}>
            <div className={styles['quantity-selector']}>
              <button type="button" onClick={handleDecrement} className={styles['quantity-button']}>-</button>
              <span className={styles['quantity-number']}>{formData.quantity}</span>
              <button type="button" onClick={handleIncrement} className={styles['quantity-button']}>+</button>
            </div>
          </div>
          <div className={styles['form-field-location']}>
            <label>Shelf</label>
            <input type="text" name="shelf" value={formData.shelf || ''} onChange={handleChange} required />
          </div>
          <div className={styles['form-field-location']}>
            <label>Section</label>
            <input type="text" name="section" value={formData.section || ''} onChange={handleChange} required />
          </div>
          <button type="submit" className={styles['place-product-button']}>
            <div className={styles['button-text']}>Place Product</div>
            <div className={styles['box-arrow']}>
              <img src='./src/assets/arrow-right.svg' alt='Icon' className={styles['icon']} />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
