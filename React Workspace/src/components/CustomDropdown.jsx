import { useState, useEffect, useRef } from 'react';
import styles from './CustomDropdown.module.css';

const CustomDropdown = ({ options, selectedOption, onOptionSelect, disabled, width }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleOptionClick = (option) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  const handleOutsideClick = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  const isPlaceholder = !selectedOption || selectedOption === 'Select a Planogram';

  return (
    <div className={styles['dropdown-container']} ref={dropdownRef} style={{ width: width }}>
      <div
        className={`${styles['dropdown-header']} ${!isPlaceholder ? styles['filled'] : ''}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <div className={styles['field-placeholder']}>
          {selectedOption || 'Select a Planogram'}
        </div>
        <img
          src="./src/assets/arrow_up.svg"
          alt="Arrow"
          className={`${styles['dropdown-arrow']} ${isOpen ? styles['rotate'] : ''}`}
        />
      </div>
      {isOpen && (
        <ul className={styles['dropdown-list']}>
          {options.map((option, index) => (
            <li
              key={index}
              className={`${styles['dropdown-list-item']} ${option === selectedOption ? styles['selected'] : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
              {option === selectedOption && <img src="./src/assets/tick.svg" alt="Tick" className={styles['tick-icon']} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;