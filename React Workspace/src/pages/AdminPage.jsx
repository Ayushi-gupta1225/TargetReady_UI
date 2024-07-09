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
    const [viewMode, setViewMode] = useState('info');
    const [locationsByPlanogram, setLocationsByPlanogram] = useState({});
    const [currentPlanogram, setCurrentPlanogram] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchPlanograms = async () => {
            try {
                const response = await axiosInstance.get('/api/planograms');
                setPlanograms(response.data);
                response.data.forEach(planogram => {
                    fetchLocations(planogram.planogramId);
                });
            } catch (error) {
                console.error('Error fetching planograms:', error);
            }
        };
        fetchPlanograms();
    }, []);

    const fetchLocations = async (planogramId) => {
        try {
            const response = await axiosInstance.get(`/api/planogram/${planogramId}/data`);
            setLocationsByPlanogram(prevState => ({
                ...prevState,
                [planogramId]: response.data.locations
            }));
        } catch (error) {
            console.error(`Error fetching data for planogram ${planogramId}:`, error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSettings({ ...settings, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/admin/planogram', settings);
            setPlanograms([...planograms, response.data]);
            setSettings({ name: '', slotHeight: '', slotWidth: '', numShelves: '', numSections: '' });
        } catch (error) {
            console.error('Error creating planogram:', error);
        }
    };

    const handleDelete = async (planogramId) => {
        try {
            await axiosInstance.delete(`/api/admin/planogram/${planogramId}`);
            setPlanograms(planograms.filter(planogram => planogram.planogramId !== planogramId));
            setLocationsByPlanogram(prevState => {
                const updatedState = { ...prevState };
                delete updatedState[planogramId];
                return updatedState;
            });
        } catch (error) {
            console.error('Error deleting planogram:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    const calculateTotalProducts = (planogramId) => {
        const locations = locationsByPlanogram[planogramId] || [];
        return locations.reduce((total, location) => total + location.quantity, 0);
    };

    const calculatePercentageOccupied = (planogramId) => {
        const planogram = planograms.find(p => p.planogramId === planogramId);
        if (!planogram) return 0;

        const slotWidth = planogram.slotWidth;
        const slotCount = planogram.numShelves * planogram.numSections;
        const locations = locationsByPlanogram[planogramId] || [];
        let totalOccupancy = 0;

        locations.forEach(location => {
            totalOccupancy += (location.product.breadth * location.quantity) / slotWidth;
        });

        return ((totalOccupancy / slotCount) * 100).toFixed(2);
    };

    const filteredPlanograms = planograms.filter(planogram =>
        planogram.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles['admin-wrapper']}>
            <div className={styles['navbar-container']}>
                <div className={styles['left-container']}>
                    <span className={styles['icon-name']}>
                        <img src='./src/assets/Planogram-icon.svg' alt='Icon' className={styles['icon']} />
                        <span className={styles['name']}>Planogram Manager</span>
                    </span>
                </div>
                <div className={styles['left-wrapper']}>
                    <div className={styles['center-container']}>
                        <input
                            type="text"
                            className={styles['search-bar']}
                            placeholder="Search Planograms"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <div className={styles['right-container']}>
                        <button className={styles['logout-button']} onClick={handleLogout}>Logout</button>
                    </div>
                </div>
            </div>
            <div className={styles['main-container']}>
                <div className={styles['form-card']}>
                    <form onSubmit={handleSubmit} className={styles['form-fields']} autoComplete="off">
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
                {viewMode === 'info' && (
                    <div className={styles['planogram-grid']}>
                        {filteredPlanograms.map((planogram) => (
                            <div key={planogram.planogramId} className={styles['planogram-card']}>
                                <div className={styles['admin-card-title']}>{planogram.name}</div>
                                <div className={styles['horizontal-aligning']}>
                                    <div className={styles['admin-card-content']}>Shelves: {planogram.numShelves}</div>
                                    <div className={styles['admin-card-content']}>Sections: {planogram.numSections}</div>
                                </div>
                                <div className={styles['horizontal-aligning']}>
                                    <div className={styles['admin-card-content']}>Slot Height: {planogram.slotHeight}</div>
                                    <div className={styles['admin-card-content']}>Slot Width: {planogram.slotWidth}</div>
                                </div>
                                <div className={styles['horizontal-aligning']}>
                                    <div className={styles['admin-card-content']}>Total Products: {calculateTotalProducts(planogram.planogramId)}</div>
                                    <div className={styles['admin-card-content']}>% Occupied: {calculatePercentageOccupied(planogram.planogramId)}%</div>
                                </div>
                                <div className={styles['button-container']}>
                                    <div className={styles['left-button-wrapper']}>
                                        <SubmitButton
                                            text="View"
                                            icon='./src/assets/table.svg'
                                            onClick={() => {
                                                setCurrentPlanogram(planogram);
                                                setViewMode('table');
                                            }}
                                            width="220px"
                                            buttonColor='#000000'
                                            arrowColor='#7B7979'
                                        />
                                    </div>
                                    <SubmitButton
                                        icon='src/assets/trash.svg'
                                        onClick={() => handleDelete(planogram.planogramId)}
                                        width="26px"
                                        buttonColor='#FF0303'
                                        arrowColor='#FF0303'
                                    />
                                </div>

                            </div>
                        ))}
                    </div>
                )}
                {currentPlanogram && viewMode === 'table' && (
                    <div className={styles['table-container']}>
                        <Planogram
                            products={locationsByPlanogram[currentPlanogram.planogramId]?.map(location => location.product) || []}
                            locations={locationsByPlanogram[currentPlanogram.planogramId] || []}
                            planogram={currentPlanogram}
                            disablePopup 
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
    );
};

export default AdminPage;
