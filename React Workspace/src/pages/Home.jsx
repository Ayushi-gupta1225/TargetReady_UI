import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import styles from './Home.module.css';
import Form from '../components/Form';
import Planogram from '../components/Planogram';
import SubmitButton from '../components/SubmitButton';
import Swal from 'sweetalert2';
import ProductPopup from '../components/ProductPopup';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    height: '',
    width: '',
    quantity: 1,
    shelf: '',
    section: '',
    planogramId: ''
  });
  const [planograms, setPlanograms] = useState([]);
  const [currentPlanogram, setCurrentPlanogram] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const realLifeHeightCm = 45;
  const realLifeWidthCm = 90;
  const [scalingFactorHeight, setScalingFactorHeight] = useState(1);
  const [scalingFactorWidth, setScalingFactorWidth] = useState(1);

  useEffect(() => {
    const fetchPlanograms = async () => {
      try {
        const response = await axiosInstance.get('/api/planograms');
        setPlanograms(response.data);

        if (response.data.length > 0) {
          const initialPlanogramId = response.data[0].planogramId;
          fetchData(initialPlanogramId);
        }
      } catch (error) {
        console.error('Error fetching planograms:', error);
      }
    };
    fetchPlanograms();
  }, []);

  const fetchData = async (planogramId) => {
    try {
      const response = await axiosInstance.get(`/api/planogram/${planogramId}/data`);
      setLocations(response.data.locations);
      setProducts(response.data.products);
    } catch (error) {
      console.error(`Error fetching data for planogram ${planogramId}:`, error);
    }
  };

  useEffect(() => {
    const firstSlot = document.querySelector(`.${styles.slot}`);
    if (firstSlot) {
      const slotStyles = window.getComputedStyle(firstSlot);
      const slotHeightPx = parseFloat(slotStyles.height);
      const slotWidthPx = parseFloat(slotStyles.width);
      setScalingFactorHeight(slotHeightPx / realLifeHeightCm);
      setScalingFactorWidth(slotWidthPx / realLifeWidthCm);
    }
  }, [planograms]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productHeightPx = formData.height * scalingFactorHeight;
    const productWidthPx = formData.width * scalingFactorWidth;
    const updatedFormData = {
      ...formData,
      heightPx: productHeightPx,
      widthPx: productWidthPx
    };

    const productData = {
      name: formData.productName,
      height: formData.height,
      breadth: formData.width,
      quantity: formData.quantity,
      productRow: formData.shelf,
      productSection: formData.section,
      planogramId: formData.planogramId
    };

    try {
      const response = await axiosInstance.post(
        `/api/planogram/${formData.planogramId}/place`,
        productData,
        {
          params: {
            productRow: parseInt(formData.shelf),
            productSection: parseInt(formData.section),
            quantity: formData.quantity
          }
        }
      );

      if (response.status === 200) {
        setProducts([
          ...products,
          {
            ...productData,
            quantity: formData.quantity,
            productRow: formData.shelf,
            productSection: formData.section,
            heightPx: productHeightPx,
            widthPx: productWidthPx
          }
        ]);
        Swal.fire({
          title: "Placed successfully",
          icon: "success",
          timer: 2500,
          showConfirmButton: false
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      console.error('Placement error:', error.response ? error.response.data : error.message);
      Swal.fire({
        title: 'Placement unsuccessful',
        icon: 'error',
        timer: 2500,
        showConfirmButton: false
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const handleIncrement = () => {
    setFormData({
      ...formData,
      quantity: formData.quantity + 1
    });
  };

  const handleDecrement = () => {
    setFormData({
      ...formData,
      quantity: Math.max(1, formData.quantity - 1)
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const handlePlanogramChange = (newPlanogramIndex) => {
    setCurrentPlanogram(newPlanogramIndex);
    const newPlanogramId = planograms[newPlanogramIndex].planogramId;
    fetchData(newPlanogramId);
  };

  const handleProductSelect = (product) => {
    setFormData({
      ...formData,
      productName: product.name,
      height: product.height,
      width: product.breadth
    });
    setShowPopup(false);
  };

  const currentPlanogramData = planograms.length > 0 ? planograms[currentPlanogram] : null;
  const filteredLocations = locations.filter(location => location.planogram.planogramId === currentPlanogramData?.planogramId);
  const filteredProducts = products.filter(product => filteredLocations.some(location => location.product.productId === product.productId));

  return (
    <div>
      <div className={styles['navbar-container']}>
        <div className={styles['left-container']}>
          <span className={styles['icon-name']}>
            <img src='./src/assets/Planogram-icon.svg' alt='Icon' className={styles['icon']} />
            <span className={styles['name']}>Planogram Manager</span>
          </span>
        </div>
        <div className={styles['right-container']}>
          <button className={styles['logout-button']} onClick={handleLogout}>Logout</button>
        </div>
      </div>
      <div className={styles['main-body']}>
        <Form
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
          openPopup={() => setShowPopup(true)}
        />
        {planograms.length > 0 && (
          <div>
            <div className={styles['planogram-title']}>{currentPlanogramData?.name}</div>
            <Planogram
              products={filteredProducts}
              locations={filteredLocations}
              planogram={currentPlanogramData}
            />
            <div className={styles['planogram-navigation']}>
              <SubmitButton
                text="Previous"
                icon='./src/assets/arrow-left.svg'
                onClick={() => handlePlanogramChange(Math.max(currentPlanogram - 1, 0))}
                disabled={currentPlanogram === 0}
                variant="previous"
                width="150px"
                buttonColor='#000000'
                arrowColor='#7B7979'
              />
              <SubmitButton
                text="Next"
                icon='./src/assets/arrow-right.svg'
                onClick={() => handlePlanogramChange(Math.min(currentPlanogram + 1, planograms.length - 1))}
                disabled={currentPlanogram === planograms.length - 1}
                width="150px"
                buttonColor='#000000'
                arrowColor='#7B7979'
              />
            </div>
          </div>
        )}
        <ProductPopup 
          show={showPopup} 
          onClose={() => setShowPopup(false)} 
          onSelect={handleProductSelect}
          planograms={planograms}
        />
      </div>
    </div>
  );
}

export default Home;
