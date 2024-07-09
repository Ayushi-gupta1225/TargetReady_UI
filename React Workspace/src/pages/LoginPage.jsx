import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import styles from './LoginPage.module.css';
import SubmitButton from '../components/SubmitButton';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      if (response.status === 200) {
        const token = response.data.jwtToken;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', response.data.refreshToken); // If you are using refresh tokens
        const decodedToken = JSON.parse(atob(token.split('.')[1].replace(/_/g, '/').replace(/-/g, '+')));
        const role = decodedToken.role; 
        if (role === 'ROLE_ADMIN') {
          navigate('/admin');
        } else {
          navigate('/home');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Invalid credentials!');
    }
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
      </div>
      <div className={styles['form-wrapper']}>
        <div className={styles['form-container']}>
          <div className={styles['form-card']}>
            <div className={styles['form-fields']}>
              <h1 className={styles['form-title']}>Sign In</h1>
              <div className={styles['form-field']}>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter Username' />
              </div>
              <div className={styles['form-field']}>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' />
              </div>
              <SubmitButton
                text="Login"
                icon='./src/assets/arrow-right.svg'
                animate
                onClick={handleLogin}
              />
              <div className={styles['sign-up-link']}>
                <span>Don't have an account? </span>
                <Link to="/signup">Sign Up</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
