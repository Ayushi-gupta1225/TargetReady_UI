import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosConfig';
import SubmitButton from '../components/SubmitButton';
import Planogram from '../components/Planogram';
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
    const [locations, setLocations] = useState([]);
    const [viewMode, setViewMode] = useState('info'); // New state to switch between views

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

    useEffect(() => {
        if (planograms.length > 0) {
            const fetchPlanogramData = async () => {
                try {
                    const response = await axiosInstance.get(`/api/planogram/${planograms[currentIndex].planogramId}/data`);
                    setLocations(response.data.locations);
                } catch (error) {
                    console.error('Error fetching planogram data:', error);
                }
            };
            fetchPlanogramData();
        }
    }, [planograms, currentIndex]);

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

    const calculateTotalProducts = () => {
        return locations.reduce((total, location) => total + location.quantity, 0);
    };

    const calculatePercentageOccupied = () => {
        const slotWidth = planograms[currentIndex].slotWidth;
        const slotCount = planograms[currentIndex].numShelves * planograms[currentIndex].numSections;
        let totalOccupancy = 0;

        locations.forEach(location => {
            totalOccupancy += location.product.breadth * location.quantity / slotWidth;
        });

        return ((totalOccupancy / slotCount) * 100).toFixed(2);
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
                            <input type="text" name="name" value={settings.name} onChange={handleChange} placeholder='Enter Planogram Name' required />
                        </div>
                        <div className={styles['horizontal-field-container']}>
                            <div className={styles['form-field']}>
                                <label>Slot Height</label>
                                <input type="number" name="slotHeight" value={settings.slotHeight} onChange={handleChange} placeholder='Enter Slot Height' required />
                            </div>
                            <div className={styles['form-field']}>
                                <label>Slot Width</label>
                                <input type="number" name="slotWidth" value={settings.slotWidth} onChange={handleChange} placeholder='Enter Slot Width' required />
                            </div>
                        </div>
                        <div className={styles['horizontal-field-container']}>
                            <div className={styles['form-field']}>
                                <label>No. of Shelves</label>
                                <input type="number" name="numShelves" value={settings.numShelves} onChange={handleChange} placeholder='Enter No. of Shelves' required />
                            </div>
                            <div className={styles['form-field']}>
                                <label>No. of Sections</label>
                                <input type="number" name="numSections" value={settings.numSections} onChange={handleChange} placeholder='Enter No. of Sections' required />
                            </div>
                        </div>
                        <SubmitButton
                            text="Create Planogram"
                            icon='./src/assets/arrow-right.svg'
                            animate
                        />
                    </form>
                </div>
                <div className={styles['planogram-display']}>
                    {planograms.length > 0 && viewMode === 'info' && (
                        <div>
                            <div className={styles['planogram-info']}>
                                <div className={styles['admin-card-title']}>{planograms[currentIndex].name}</div>
                                <div className={styles['horizontal-aligning']}>
                                    <div className={styles['admin-card-content']}>Shelves: {planograms[currentIndex].numShelves}</div>
                                    <div className={styles['admin-card-content']}>Sections: {planograms[currentIndex].numSections}</div>
                                </div>
                                <div className={styles['horizontal-aligning']}>
                                    <div className={styles['admin-card-content']}>Slot Height: {planograms[currentIndex].slotHeight}</div>
                                    <div className={styles['admin-card-content']}>Slot Width: {planograms[currentIndex].slotWidth}</div>
                                </div>
                                <div className={styles['horizontal-aligning']}>
                                    <div className={styles['admin-card-content']}>Total Products: {calculateTotalProducts()}</div>
                                    <div className={styles['admin-card-content']}>% Occupied: {calculatePercentageOccupied()}%</div>
                                </div>
                                <div className={styles['navigation-buttons']}>
                                    <SubmitButton
                                        text="Previous"
                                        icon='./src/assets/arrow-left.svg'
                                        onClick={prevPlanogram}
                                        width="130px"
                                        variant="previous"
                                        buttonColor='#000000'
                                        arrowColor='#7B7979'
                                    />
                                    <SubmitButton
                                        // text="Table"
                                        icon='./src/assets/table.svg'
                                        onClick={() => setViewMode('table')}
                                        width="26px"
                                        buttonColor='#000000'
                                        arrowColor='#7B7979'
                                    />
                                    <SubmitButton
                                        text="Next"
                                        icon='./src/assets/arrow-right.svg'
                                        onClick={nextPlanogram}
                                        width="130px"
                                        buttonColor='#000000'
                                        arrowColor='#7B7979'
                                    />
                                </div>
                                <div className={styles['delete-button-wrapper']}>
                                    <SubmitButton
                                        text="Delete Planogram"
                                        icon='src/assets/trash.svg'
                                        onClick={handleDelete}
                                        buttonColor='#FF0303'
                                        arrowColor='#FF5A5A'
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    {planograms.length > 0 && viewMode === 'table' && (
                        <div className={styles['table-container']}>
                            <Planogram
                                products={locations.map(location => location.product)}
                                locations={locations}
                                planogram={planograms[currentIndex]}
                            />
                            <SubmitButton
                                text="Info"
                                icon='./src/assets/info.svg'
                                onClick={() => setViewMode('info')}
                                width="130px"
                                buttonColor='#000000'
                                arrowColor='#7B7979'
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
