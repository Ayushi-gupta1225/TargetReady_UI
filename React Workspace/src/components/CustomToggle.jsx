import PropTypes from 'prop-types';
import styles from './CustomToggle.module.css';

const CustomToggle = ({ isVendorView, onToggle }) => {
  return (
    <div className={styles['toggle-container']} onClick={onToggle}>
      <div className={`${styles['toggle']} ${isVendorView ? styles['vendor'] : styles['all']}`}>
        <div className={styles['toggle-button']}>
          {isVendorView ? 'Vendor' : 'All'}
        </div>
      </div>
    </div>
  );
};

CustomToggle.propTypes = {
  isVendorView: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default CustomToggle;