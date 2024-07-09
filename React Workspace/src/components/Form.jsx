import React, { useState, useEffect } from 'react';
import styles from './Form.module.css';
import SubmitButton from './SubmitButton';
import CustomDropdown from './CustomDropdown';
import axiosInstance from '../utils/axiosConfig';

function Form({
  formData,
  setFormData,
  handleSubmit,
  handleIncrement,
  handleDecrement,
  openPopup,
  isEdit,
  resetForm,
}) {
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
            planogramId: planogramData[0].planogramId,
          }));
        }
      } catch (error) {
        console.error('Error fetching planograms:', error);
      }
    };
    fetchPlanograms();
  }, [setFormData]);

  const handleDropdownSelect = (option) => {
    const selectedPlanogram = planograms.find((planogram) => planogram.name === option);
    if (selectedPlanogram) {
      setFormData((prevData) => ({
        ...prevData,
        planogramId: selectedPlanogram.planogramId,
      }));
    }
  };

  const handleAddClick = (event) => {
    event.preventDefault();
    resetForm();
  };

  return (
    <div className={styles['form-wrapper']}>
      <div className={styles['button-container-top']}>
        <SubmitButton
          text="New"
          icon="./src/assets/plus.svg"
          animate
          onClick={handleAddClick}
          width="136px"
        />
        <SubmitButton
          text="Products"
          icon="./src/assets/plus.svg"
          animate
          onClick={openPopup}
          width="136px"
        />
      </div>
      <div className={styles['form-card']}>
        <form
          onSubmit={handleSubmit}
          className={styles['form-fields']}
          autoComplete="off"
        >
          <div className={styles['form-field-horizontal']}>
            <div className={styles['form-field-id']}>
              <label>Product Name</label>
              <input
                type="text"
                name="productName"
                value={formData.productName}
                onChange={(e) =>
                  setFormData({ ...formData, productName: e.target.value })
                }
                placeholder="Enter Product Name"
                required
              />
            </div>
            <div className={styles['upload-photo-box']}>
              <div className={styles['upload-photo-content']}>
                <img
                  src="./src/assets/plus.svg"
                  alt="Plus Icon"
                  className={styles['upload-photo-icon']}
                />
                <p className={styles['upload-photo-text']}>Photo</p>
              </div>
              <input
                type="file"
                className={styles['upload-photo-input']}
              />
            </div>
          </div>
          <div className={styles['form-field-dim-container']}>
            <div className={styles['form-field-dim']}>
              <label>Height</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                placeholder="Enter Height"
                required
              />
            </div>
            <div className={styles['form-field-dim']}>
              <label>Width</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                placeholder="Enter Width"
                required
              />
            </div>
          </div>
          {!isEdit && (
            <div className={styles['form-field-row']}>
              <label>Quantity</label>
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
          )}
          {!isEdit && (
            <>
              <div className={styles['form-field-location']}>
                <label>Planogram</label>
                <CustomDropdown
                  options={planograms.map((planogram) => planogram.name)}
                  selectedOption={
                    planograms.find((planogram) => planogram.planogramId === formData.planogramId)
                      ?.name || 'Select a Planogram'
                  }
                  onOptionSelect={handleDropdownSelect}
                  width="100%"
                />
              </div>
              <div className={styles['form-field-location-container']}>
                <div className={styles['form-field-location']}>
                  <label>Shelf</label>
                  <CustomDropdown
                    options={Array.from(
                      {
                        length: formData.planogramId
                          ? planograms.find((planogram) => planogram.planogramId === formData.planogramId)
                              .numShelves
                          : 0,
                      },
                      (_, i) => (i + 1).toString()
                    )}
                    selectedOption={formData.shelf ? formData.shelf.toString() : 'Select a Shelf'}
                    onOptionSelect={(option) => setFormData({ ...formData, shelf: option })}
                    disabled={!formData.planogramId}
                    width="136px"
                  />
                </div>
                <div className={styles['form-field-location']}>
                  <label>Section</label>
                  <CustomDropdown
                    options={Array.from(
                      {
                        length: formData.planogramId
                          ? planograms.find((planogram) => planogram.planogramId === formData.planogramId)
                              .numSections
                          : 0,
                      },
                      (_, i) => (i + 1).toString()
                    )}
                    selectedOption={formData.section ? formData.section.toString() : 'Select a Section'}
                    onOptionSelect={(option) => setFormData({ ...formData, section: option })}
                    disabled={!formData.planogramId}
                    width="136px"
                  />
                </div>
              </div>
            </>
          )}
          <SubmitButton
            text={isEdit ? 'Edit Product' : 'Place Product'}
            icon='./src/assets/arrow-right.svg'
            animate
          />
        </form>
      </div>
    </div>
  );
}

export default Form;
