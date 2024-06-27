import React, { useState, useEffect } from "react";
import styles from "./Form.module.css";
import SubmitButton from "../components/SubmitButton";
import CustomDropdown from "../components/CustomDropdown";
import axiosInstance from "../utils/axiosConfig";

function Form({
  formData,
  handleChange,
  handleSubmit,
  handleIncrement,
  handleDecrement,
  planogramId,
}) {
  const [planograms, setPlanograms] = useState([]);
  const [selectedPlanogram, setSelectedPlanogram] = useState(planogramId);

  useEffect(() => {
    const fetchPlanograms = async () => {
      try {
        const response = await axiosInstance.get("/api/planograms");
        setPlanograms(response.data);
      } catch (error) {
        console.error("Error fetching planograms:", error);
      }
    };
    fetchPlanograms();
  }, []);

  const handleDropdownSelect = (option) => {
    const selectedPlanogram = planograms.find(
      (planogram) => planogram.name === option
    );
    setSelectedPlanogram(
      selectedPlanogram ? selectedPlanogram.planogramId : ""
    );
    handleChange({
      target: {
        name: "planogramId",
        value: selectedPlanogram ? selectedPlanogram.planogramId : "",
      },
    });
  };

  return (
    <div className={styles["form-wrapper"]}>
      <div className={styles["form-options"]}>
        <div className={styles["button-container-top"]}>
          <SubmitButton text="Add" icon="./src/assets/plus.svg" animate />
        </div>
        <div className={styles["product-wrapper"]}>
          <SubmitButton text="Products" icon="./src/assets/plus.svg" animate />
        </div>
      </div>
      <div className={styles["form-card"]}>
        <div className={styles["button-container"]}>
          <button type="button" className={styles["edit-button"]}>
            Edit
          </button>
          <button type="button" className={styles["delete-button"]}>
            Delete
          </button>
        </div>

        {/* <div className={styles['upload-photo-box']}>
          <div className={styles['upload-photo-content']}>
            <img src='./src/assets/plus.svg' alt='Plus Icon' className={styles['upload-photo-icon']} />
            <p className={styles['upload-photo-text']}>Upload Photo</p>
          </div>
          <input type="file" className={styles['upload-photo-input']} onChange={handleChange} />
        </div> */}

        <form
          onSubmit={handleSubmit}
          className={styles["form-fields"]}
          autoComplete="off"
        >
           <div className={styles['form-field-horizontal']}>
            <div className={styles['upload-photo-box']}>
              <div className={styles['upload-photo-content']}>
                <img src='./src/assets/plus.svg' alt='Plus Icon' className={styles['upload-photo-icon']} />
                <p className={styles['upload-photo-text']}>Upload Photo</p>
              </div>
              <input type="file" className={styles['upload-photo-input']} onChange={handleChange} />
            </div>
            <div className={styles['form-field-id']}>
              <label>Product Name</label>
              <input type="text" name="productName" value={formData.productName} onChange={handleChange} placeholder='Enter Product Name' required />
            </div>
          </div>
          
          <div className={styles["form-field-dim-container"]}>
            <div className={styles["form-field-dim"]}>
              <label>Height</label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="Enter Height"
                required
              />
            </div>
            <div className={styles["form-field-dim"]}>
              <label>Width</label>
              <input
                type="number"
                name="width"
                value={formData.width}
                onChange={handleChange}
                placeholder="Enter Width"
                required
              />
            </div>
          </div>
          <div className={styles["form-field-row"]}>
            <label>Quantity</label>
            <div className={styles["quantity-selector"]}>
              <button
                type="button"
                onClick={handleDecrement}
                className={styles["quantity-minus"]}
              >
                <img
                  src="./src/assets/minus.svg"
                  alt="Icon"
                  className={styles["icon"]}
                />
              </button>
              <span className={styles["quantity-number"]}>
                {formData.quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className={styles["quantity-plus"]}
              >
                <img
                  src="./src/assets/plus.svg"
                  alt="Icon"
                  className={styles["icon"]}
                />
              </button>
            </div>
          </div>
          <div className={styles["form-field-location"]}>
            <label>Planogram</label>
            <CustomDropdown
              options={planograms.map((planogram) => planogram.name)}
              selectedOption={
                planograms.find(
                  (planogram) => planogram.planogramId === selectedPlanogram
                )?.name || "Select a Planogram"
              }
              onOptionSelect={handleDropdownSelect}
              width="100%"
            />
          </div>
          <div className={styles["form-field-location-container"]}>
            <div className={styles["form-field-location"]}>
              <label>Shelf</label>
              <CustomDropdown
                options={Array.from(
                  {
                    length: selectedPlanogram
                      ? planograms.find(
                          (planogram) =>
                            planogram.planogramId === selectedPlanogram
                        ).numShelves
                      : 0,
                  },
                  (_, i) => (i + 1).toString()
                )}
                selectedOption={
                  formData.shelf ? formData.shelf.toString() : "Select a Shelf"
                }
                onOptionSelect={(option) =>
                  handleChange({ target: { name: "shelf", value: option } })
                }
                disabled={!selectedPlanogram}
                width="136px"
              />
            </div>
            <div className={styles["form-field-location"]}>
              <label>Section</label>
              <CustomDropdown
                options={Array.from(
                  {
                    length: selectedPlanogram
                      ? planograms.find(
                          (planogram) =>
                            planogram.planogramId === selectedPlanogram
                        ).numSections
                      : 0,
                  },
                  (_, i) => (i + 1).toString()
                )}
                selectedOption={
                  formData.section
                    ? formData.section.toString()
                    : "Select a Section"
                }
                onOptionSelect={(option) =>
                  handleChange({ target: { name: "section", value: option } })
                }
                disabled={!selectedPlanogram}
                width="136px"
              />
            </div>
          </div>
          <SubmitButton
            text="Place Product"
            icon="./src/assets/arrow-right.svg"
            animate
          />
        </form>
      </div>
    </div>
  );
}

export default Form;
