import styles from './SubmitButton.module.css';

const SubmitButton = ({ text, icon, animate, onClick, height }) => {
  const iconClass = icon === './src/assets/arrow-right.svg' ? 'animate-arrow' : 'animate-plus';

  return (
    <button
      className={`${styles['submit-button']} ${animate ? styles['animate'] : ''}`}
      onClick={onClick}
      style={{ height }}
    >
      <div className={styles['button-text']}>{text}</div>
      <div className={styles['box-arrow']}>
        <img src={icon} alt='Icon' className={`${styles['icon']} ${styles[iconClass]}`} />
      </div>
    </button>
  );
};

export default SubmitButton;
