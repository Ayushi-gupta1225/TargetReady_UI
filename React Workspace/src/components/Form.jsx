import React, { useState, useEffect } from 'react';
import styles from './Form.module.css';
import SubmitButton from './SubmitButton';
import CustomDropdown from './CustomDropdown';
import axiosInstance from '../utils/axiosConfig';

function Form({ formData, setFormData, handleSubmit, handleIncrement, handleDecrement, openPopup }) {
  const [planograms, setPlanograms] = useState([]);

  useEffect(() => {
    const fetchPlanograms = async () => {
      try {
        const response = await axiosInstance.get('/api/planograms');
        const planogramData = response.data;
        setPlanograms(planogramData);
        if (planogramData.length > 0) {
          setFormData((prevData) => ({
            ...prevData,
            planogramId: planogramData[0].planogramId
          }));
        }
      } catch (error) {
        console.error('Error fetching planograms:', error);
      }
    };
    fetchPlanograms();
  }, [setFormData]);

  const handleDropdownSelect = (option) => {
    const selectedPlanogram = planograms.find(planogram => planogram.name === option);
    if (selectedPlanogram) {
      setFormData((prevData) => ({
        ...prevData,
        planogramId: selectedPlanogram.planogramId
      }));
    }
  };

  return (
    <div className={styles['form-wrapper']}>
      <div className={styles['product-wrapper']}>
        <SubmitButton
          text="Products"
          icon='./src/assets/plus.svg'
          animate
          onClick={openPopup}
        />
      </div>
      <div className={styles['form-card']}>
        <form onSubmit={handleSubmit} className={styles['form-fields']} autoComplete="off">
          <div className={styles['form-field-id']}>
            <label htmlFor="productName">Product Name</label>
            <input
              id="productName"
              type="text"
              name="productName"
              value={formData.productName}
              onChange={(e) => {
                // Debugging
                console.log('Product Name Input change event:', e.target.value);
                setFormData({ ...formData, productName: e.target.value });
              }}
              placeholder='Enter Product Name'
              required
            />
          </div>
          <div className={styles['form-field-dim-container']}>
            <div className={styles['form-field-dim']}>
              <label htmlFor="height">Height</label>
              <input
                id="height"
                type="number"
                name="height"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder='Enter Height'
                required
              />
            </div>
            <div className={styles['form-field-dim']}>
              <label htmlFor="width">Width</label>
              <input
                id="width"
                type="number"
                name="width"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                placeholder='Enter Width'
                required
              />
            </div>
          </div>
          <div className={styles['form-field-row']}>
            <label htmlFor="quantity">Quantity</label>
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
            <label id="planogram-label" >Planogram</label>
            <CustomDropdown
              options={planograms.map(planogram => planogram.name)}
              selectedOption={planograms.find(planogram => planogram.planogramId === formData.planogramId)?.name || 'Select a Planogram'}
              onOptionSelect={handleDropdownSelect}
              width="100%"
              ariaLabelledBy="planogram-label"
            />
          </div>
          <div className={styles['form-field-location-container']}>
            <div className={styles['form-field-location']}>
              <label id="shelf-label">Shelf</label>
              <CustomDropdown
                options={Array.from({ length: formData.planogramId ? planograms.find(planogram => planogram.planogramId === formData.planogramId).numShelves : 0 }, (_, i) => (i + 1).toString())}
                selectedOption={formData.shelf ? formData.shelf.toString() : 'Select a Shelf'}
                onOptionSelect={(option) => setFormData({ ...formData, shelf: option })}
                disabled={!formData.planogramId}
                width="136px"
                ariaLabelledBy="shelf-label"
              />
            </div>
            <div className={styles['form-field-location']}>
              <label id="section-label">Section</label>
              <CustomDropdown
                options={Array.from({ length: formData.planogramId ? planograms.find(planogram => planogram.planogramId === formData.planogramId).numSections : 0 }, (_, i) => (i + 1).toString())}
                selectedOption={formData.section ? formData.section.toString() : 'Select a Section'}
                onOptionSelect={(option) => setFormData({ ...formData, section: option })}
                disabled={!formData.planogramId}
                width="136px"
                ariaLabelledBy="section-label"
              />
            </div>
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
