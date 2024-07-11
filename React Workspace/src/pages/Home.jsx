import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import styles from "./Home.module.css";
import Form from "../components/Form";
import Planogram from "../components/Planogram";
import SubmitButton from "../components/SubmitButton";
import Swal from "sweetalert2";
import ProductPopup from "../components/ProductPopup";
import CustomToggle from "../components/CustomToggle"; 

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    height: "",
    width: "",
    quantity: 1,
    shelf: "",
    section: "",
    planogramId: "",
  });
  const [planograms, setPlanograms] = useState([]);
  const [currentPlanogram, setCurrentPlanogram] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [clickedProduct, setClickedProduct] = useState(null);
  const [isVendorView, setIsVendorView] = useState(false);
  const [userId, setUserId] = useState(null); 

  useEffect(() => {
    const fetchPlanograms = async () => {
      try {
        const response = await axiosInstance.get("/api/planograms");
        setPlanograms(response.data);

        if (response.data.length > 0) {
          const initialPlanogramId = response.data[0].planogramId;
          fetchData(initialPlanogramId);
        }
      } catch (error) {
        console.error("Error fetching planograms:", error);
      }
    };

    const fetchUserId = async () => {
      try {
        const response = await axiosInstance.get("/auth/user");
        setUserId(response.data.userId);
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    };

    fetchPlanograms();
    fetchUserId();
  }, []);

  const fetchData = async (planogramId) => {
    try {
      const response = await axiosInstance.get(
        `/api/planogram/${planogramId}/data`
      );
      setLocations(response.data.locations);
      setProducts(response.data.products);
    } catch (error) {
      console.error(`Error fetching data from planogram ${planogramId}:`, error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productHeightPx = formData.height * 1;
    const productWidthPx = formData.width * 1;

    const productData = {
      productId: formData.productId,
      name: formData.productName,
      height: parseInt(formData.height, 10),
      breadth: parseInt(formData.width, 10),
      quantity: formData.quantity,
      productRow: formData.shelf,
      productSection: formData.section,
      planogramId: formData.planogramId,
    };

    try {
      let response = null;
      if (isEdit) {
        response = await axiosInstance.put(
          `/api/products/${formData.productId}`,
          productData
        );
      } else {
        response = await axiosInstance.post(
          `/api/planogram/${formData.planogramId}/place`,
          productData,
          {
            params: {
              productRow: parseInt(formData.shelf),
              productSection: parseInt(formData.section),
              quantity: formData.quantity,
              userId: userId,
            },
          }
        );
      }
      if (response.status === 200) {
        const updatedProducts = products.map((product) =>
          product.productId === formData.productId
            ? {
                ...productData,
                heightPx: productHeightPx,
                widthPx: productWidthPx,
              }
            : product
        );
        setProducts(updatedProducts);
        Swal.fire({
          title: isEdit ? "Updated successfully" : "Placed successfully",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error(
        "Placement error:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        title: isEdit ? "Update unsuccessful" : "Placement unsuccessful",
        icon: "error",
        timer: 2500,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } finally {
      setIsEdit(false);
    }
  };

  const handleIncrement = () => {
    setFormData({
      ...formData,
      quantity: formData.quantity + 1,
    });
  };

  const handleDecrement = () => {
    setFormData({
      ...formData,
      quantity: Math.max(1, formData.quantity - 1),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePlanogramChange = (newPlanogramIndex) => {
    setCurrentPlanogram(newPlanogramIndex);
    const newPlanogramId = planograms[newPlanogramIndex].planogramId;
    setFormData((prevData) => ({
      ...prevData,
      planogramId: newPlanogramId,
    }));
    fetchData(newPlanogramId);
  };

  const handleProductSelect = (product) => {
    setFormData({
      ...formData,
      productName: product.name,
      height: product.height,
      width: product.breadth,
    });
    setIsEdit(false); 
    setShowPopup(false);
  };

  const handleEditProduct = () => {
    const product = clickedProduct;

    setFormData({
      productId: product.productId,
      productName: product.name,
      height: product.height,
      width: product.breadth,
      quantity: product.quantity,
      planogramId: locations[0].planogram.planogramId,
      shelf: locations[0].productRow,
      section: locations[0].productSection,
    });
    setIsEdit(true);
    setClickedProduct(null);
  };

  const handleDelete = async (product, productRow, productSection, index) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, keep it",
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(
          `/api/planogram/${planograms[currentPlanogram].planogramId}/product/${product.productId}/slot`,
          {
            params: {
              productRow,
              productSection,
              index,
            },
          }
        );
        if (response.status === 200) {
          setClickedProduct(null);
          setIsEdit(false);
          Swal.fire({
            title: "Deleted successfully",
            icon: "success",
            timer: 2500,
            showConfirmButton: false,
          }).then(() => {
            window.location.reload();
          });
        }
      } catch (error) {
        console.error("Failed to delete product:", error);
        Swal.fire({
          title: "Deletion unsuccessful",
          icon: "error",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    }
  };

  const handleNewButton = () => {
    setFormData({
      productId: "",
      productName: "",
      height: "",
      width: "",
      quantity: 1,
      shelf: "",
      section: "",
      planogramId: "",
    });
    setIsEdit(false); 
  };

  const handleToggleChange = () => {
    setIsVendorView(!isVendorView);
  };

  const currentPlanogramData =
    planograms.length > 0 ? planograms[currentPlanogram] : null;

  return (
    <div>
      <div className={styles["navbar-container"]}>
        <div className={styles["left-container"]}>
          <span className={styles["icon-name"]}>
            <img
              src="./src/assets/Planogram-icon.svg"
              alt="Icon"
              className={styles["icon"]}
            />
            <span className={styles["name"]}>Planogram Manager</span>
          </span>
        </div>
        <div className={styles["right-container"]}>
          <button className={styles["logout-button"]} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <div className={styles["main-body"]}>
        <Form
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          openPopup={() => setShowPopup(true)}
          isEdit={isEdit} 
          resetForm={handleNewButton} 
        />
        {planograms.length > 0 && (
          <div>
            <div className={styles["planogram-title"]}>
              <div className={styles["toggle-wrapper"]}>
                <CustomToggle
                    isVendorView={isVendorView}
                    onToggle={handleToggleChange}
                />
              </div>
              {currentPlanogramData?.name}
            </div>
            
            <Planogram
              products={products}
              locations={locations}
              planogram={currentPlanogramData}
              onProductClick={setClickedProduct}
              handleEdit={handleEditProduct}
              handleDelete={handleDelete}
              userId={userId} 
              showUserProductsOnly={isVendorView}
            />
            <div className={styles["planogram-navigation"]}>
              <SubmitButton
                text="Previous"
                icon="./src/assets/arrow-left.svg"
                onClick={() =>
                  handlePlanogramChange(Math.max(currentPlanogram - 1, 0))
                }
                disabled={currentPlanogram === 0}
                variant="previous"
                width="150px"
                buttonColor="#000000"
                arrowColor="#7B7979"
              />
              <SubmitButton
                text="Next"
                icon="./src/assets/arrow-right.svg"
                onClick={() =>
                  handlePlanogramChange(
                    Math.min(currentPlanogram + 1, planograms.length - 1)
                  )
                }
                disabled={currentPlanogram === planograms.length - 1}
                width="150px"
                buttonColor="#000000"
                arrowColor="#7B7979"
              />
            </div>
          </div>
        )}
        <ProductPopup
          show={showPopup}
          onClose={() => setShowPopup(false)}
          onSelect={handleProductSelect}
          planograms={planograms}
          userId={userId} 
        />
      </div>
    </div>
  );
}

export default Home;
