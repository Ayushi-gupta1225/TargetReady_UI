import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import SubmitButton from '../components/SubmitButton';
import styles from './AdminPage.module.css';

const AdminPage = () => {
    const navigate = useNavigate();
    const [settings, setSettings] = useState({
        name: '',
        slotHeight: '',
        slotWidth: '',
        numShelves: '',
        numSections: '',
    });
    const [planograms, setPlanograms] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchPlanograms = async () => {
            try {
                const response = await axiosInstance.get('/api/planograms');
                setPlanograms(response.data);
            } catch (error) {
                console.error('Error fetching planograms:', error);
            }
        };
        fetchPlanograms();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Submitting planogram with data: ", settings);
        try {
            const response = await axiosInstance.post('/api/admin/planogram', settings);
            setPlanograms([...planograms, response.data]);
            setSettings({ name: '', slotHeight: '', slotWidth: '', numShelves: '', numSections: '' });
        } catch (error) {
            console.error('Error creating planogram:', error);
        }
    };

    const handleDelete = async () => {
        const planogramId = planograms[currentIndex].planogramId;
        try {
            await axiosInstance.delete(`/api/admin/planogram/${planogramId}`);
            setPlanograms(planograms.filter((_, index) => index !== currentIndex));
            setCurrentIndex(0);
        } catch (error) {
            console.error('Error deleting planogram:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const nextPlanogram = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % planograms.length);
    };

    const prevPlanogram = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + planograms.length) % planograms.length);
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
                        <div className={styles['form-field']}>
                            <label>Name</label>
                            <input type="text" name="name" value={settings.name} onChange={handleChange} required />
                        </div>
                        <div className={styles['form-field']}>
                            <label>Slot Height</label>
                            <input type="number" name="slotHeight" value={settings.slotHeight} onChange={handleChange} required />
                        </div>
                        <div className={styles['form-field']}>
                            <label>Slot Width</label>
                            <input type="number" name="slotWidth" value={settings.slotWidth} onChange={handleChange} required />
                        </div>
                        <div className={styles['form-field']}>
                            <label>No. of Shelves</label>
                            <input type="number" name="numShelves" value={settings.numShelves} onChange={handleChange} required />
                        </div>
                        <div className={styles['form-field']}>
                            <label>No. of Sections</label>
                            <input type="number" name="numSections" value={settings.numSections} onChange={handleChange} required />
                        </div>
                        <SubmitButton
                            text="Create Planogram"
                            icon='./src/assets/arrow-right.svg'
                            animate
                        />
                    </form>
                </div>
                <div className={styles['planogram-display']}>
                    {planograms.length > 0 && (
                        <div>
                            <div className={styles['planogram-info']}>
                                <h3>{planograms[currentIndex].name}</h3>
                                <p>Shelves: {planograms[currentIndex].numShelves}</p>
                                <p>Sections: {planograms[currentIndex].numSections}</p>
                                <p>Slot Height: {planograms[currentIndex].slotHeight}</p>
                                <p>Slot Width: {planograms[currentIndex].slotWidth}</p>
                            </div>
                            <div className={styles['navigation-buttons']}>
                                <button onClick={prevPlanogram}>Previous</button>
                                <button onClick={nextPlanogram}>Next</button>
                            </div>
                            <button onClick={handleDelete} className={styles['delete-button']}>Delete Planogram</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
