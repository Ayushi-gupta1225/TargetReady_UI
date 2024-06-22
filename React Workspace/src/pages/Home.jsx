import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import styles from './Home.module.css';
import Form from '../components/Form';
import Planogram from '../components/Planogram';
import Swal from 'sweetalert2';

function Home() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [formData, setFormData] = useState({
    productName: '',
    productId: null,
    height: null,
    width: null,
    quantity: 1,
    shelf: null,
    section: null,
  });
  const realLifeHeightCm = 45;
  const realLifeWidthCm = 90;
  const [scalingFactorHeight, setScalingFactorHeight] = useState(1);
  const [scalingFactorWidth, setScalingFactorWidth] = useState(1);
  const [adminSettings, setAdminSettings] = useState({
    shelfHeight: 100,
    shelfBreadth: 100,
    numShelves: 3,
    numSections: 3,
  });

  useEffect(() => {
    const firstSlot = document.querySelector(`.${styles.slot}`);
    if (firstSlot) {
      const slotStyles = window.getComputedStyle(firstSlot);
      const slotHeightPx = parseFloat(slotStyles.height);
      const slotWidthPx = parseFloat(slotStyles.width);
      setScalingFactorHeight(slotHeightPx / realLifeHeightCm);
      setScalingFactorWidth(slotWidthPx / realLifeWidthCm);
    }

    const fetchData = async () => {
      try {
        const response = await axiosInstance.get('/api/data');
        setLocations(response.data.locations);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productHeightPx = formData.height * scalingFactorHeight;
    const productWidthPx = formData.width * scalingFactorWidth;
    const updatedFormData = {
      ...formData,
      heightPx: productHeightPx,
      widthPx: productWidthPx,
    };
    setProducts([...products, updatedFormData]);
    setFormData({
      productName: '',
      productId: null,
      height: null,
      width: null,
      quantity: 1,
      shelf: null,
      section: null,
    });
    const productData = {
      productId: formData.productId,
      name: formData.productName,
      height: formData.height,
      breadth: formData.width,
      quantity: formData.quantity,
      productRow: formData.shelf,
      productSection: formData.section,
    };

    try {
      const response = await axiosInstance.post('/api/place', productData, {
        params: {
          productRow: parseInt(formData.shelf),
          productSection: parseInt(formData.section),
          quantity: formData.quantity,
        },
      });
      if (response.status === 200) {
        setProducts([
          ...products,
          {
            ...productData,
            quantity: formData.quantity,
            productRow: formData.shelf,
            productSection: formData.section,
            heightPx: productHeightPx,
            widthPx: productWidthPx,
          },
        ]);
        Swal.fire({
          title: "Placed successfully",
          icon: "success",
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          window.location.reload();
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Placement unsuccessful',
        icon: 'error',
        timer: 2500,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const handleIncrement = () => {
    setFormData({ ...formData, quantity: formData.quantity + 1 });
  };

  const handleDecrement = () => {
    setFormData({ ...formData, quantity: Math.max(1, formData.quantity - 1) });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

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
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          handleIncrement={handleIncrement}
          handleDecrement={handleDecrement}
        />
        <Planogram
          products={products}
          locations={locations}
          scalingFactorHeight={scalingFactorHeight}
          scalingFactorWidth={scalingFactorWidth}
          adminSettings={adminSettings}
        />
      </div>
    </div>
  );
}

export default Home;
