import { useState } from 'react';
import styles from './SignUp.module.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SubmitButton from '../components/SubmitButton';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:2000/auth/create-user', {
        userName: username,
        password: password
      });
      if (response.status === 200) {
        alert('Registration successful!');
        navigate('/'); // Redirect to Login page after successful registration
      }
    } catch (error) {
      console.error('Error registering user:', error.response?.data);
      alert('Error registering user: ' + (error.response?.data || 'Unknown error'));
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
              <h1 className={styles['form-title']}>Sign Up</h1>
              <div className={styles['form-field']}>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Enter Username'/>
              </div>
              <div className={styles['form-field']}>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' minlength='8'/>
              </div>
              <SubmitButton
                text="Register"
                icon='./src/assets/arrow-right.svg'
                animate
                onClick={handleRegister}
              />
              <div className={styles['sign-up-link']}>
                <span>Already have an account? </span>
                <Link to="/">Sign In</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
