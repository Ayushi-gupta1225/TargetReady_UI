import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminPage.module.css';
import SubmitButton from '../components/SubmitButton';

const AdminPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    shelfHeight: '',
    shelfBreadth: '',
    numShelves: '',
    numSections: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSettings({ ...settings, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('adminSettings', JSON.stringify(settings));
    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className={styles['admin-wrapper']}>
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
      <div className={styles['form-wrapper']}>
        <div className={styles['form-card']}>
          <form onSubmit={handleSubmit} className={styles['form-fields']}>
            <div className={styles['form-field-location']}>
              <label>Slot Height</label>
              <input type="number" name="shelfHeight" value={settings.shelfHeight} onChange={handleChange} required />
            </div>
            <div className={styles['form-field-location']}>
              <label>Slot Breadth</label>
              <input type="number" name="shelfBreadth" value={settings.shelfBreadth} onChange={handleChange} required />
            </div>
            <div className={styles['form-field-location']}>
              <label>No. of Shelves</label>
              <input type="number" name="numShelves" value={settings.numShelves} onChange={handleChange} required />
            </div>
            <div className={styles['form-field-location']}>
              <label>No. of Sections</label>
              <input type="number" name="numSections" value={settings.numSections} onChange={handleChange} required />
            </div>
            <SubmitButton
              text="Set Dimensions"
              icon='./src/assets/arrow-right.svg'
              animate
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
