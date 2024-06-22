import styles from './Form.module.css';
import SubmitButton from '../components/SubmitButton';

function Form({ formData, handleChange, handleSubmit, handleIncrement, handleDecrement }) {
  return (
    <div className={styles['form-wrapper']}>
      <div className={styles['product-wrapper']}>
        <SubmitButton
          text="Products"
          icon='./src/assets/plus.svg'
          animate
        />
      </div>
      <div className={styles['form-card']}>
        <form onSubmit={handleSubmit} className={styles['form-fields']} autoComplete="off">
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
              <label>Height</label>
              <input type="number" name="height" value={formData.height} onChange={handleChange} required />
            </div>
            <div className={styles['form-field-dim']}>
              <label>Width</label>
              <input type="number" name="width" value={formData.width} onChange={handleChange} required />
            </div>
          </div>
          <div className={styles['form-field-row']}>
            <div className={styles['quantity-selector']}>
              <button type="button" onClick={handleDecrement} className={styles['quantity-minus']}>
                <img src='./src/assets/minus.svg' alt='Icon' className={styles['icon']} />
              </button>
              <span className={styles['quantity-number']}>{formData.quantity}</span>
              <button type="button" onClick={handleIncrement} className={styles['quantity-plus']}>
                <img src='./src/assets/plus.svg' alt='Icon' className={styles['icon']} />
              </button>
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
          <SubmitButton
            text="Place Product"
            icon='./src/assets/arrow-right.svg'
            animate
          />
        </form>
      </div>
    </div>
  );
}

export default Form;
