import styles from './SubmitButton.module.css';

const SubmitButton = ({ text, icon, animate, onClick, height, width, variant, buttonColor, arrowColor }) => {
  const iconClass = (icon === './src/assets/arrow-right.svg' || icon === './src/assets/arrow-left.svg') ? 'animate-arrow' : 'animate-plus';
  const buttonClass = variant === 'light' ? styles['submit-button-light'] : styles['submit-button'];
  const iconPositionClass = variant === 'previous' ? styles['icon-left'] : '';

  const buttonStyle = {
    height,
    width,
    backgroundColor: buttonColor || '',
  };

  const arrowStyle = {
    backgroundColor: arrowColor || '',
  };

  return (
    <button
      className={`${buttonClass} ${animate ? styles['animate'] : ''}`}
      onClick={onClick}
      style={buttonStyle}
    >
      {variant === 'previous' && (
        <div className={styles['box-arrow']} style={arrowStyle}>
          <img src='src/assets/arrow_left.svg' alt='Icon' className={`${styles['icon']} ${styles[iconClass]} ${iconPositionClass}`} />
        </div>
      )}
      <div className={styles['button-text']}>{text}</div>
      {variant !== 'previous' && (
        <div className={styles['box-arrow']} style={arrowStyle}>
          <img src={icon} alt='Icon' className={`${styles['icon']} ${styles[iconClass]}`} />
        </div>
      )}
    </button>
  );
};

export default SubmitButton;
