import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiTruck } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import './Vehicles.css';

const Vehicles = () => {
    const { t } = useLanguage();
    const [vehicles, setVehicles] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({
        make: '',
        model: '',
        year: '',
        plate: '',
        vin: '',
        color: '',
        odometer: '',
        isDefault: false
    });

    // Load data from localStorage
    useEffect(() => {
        const savedVehicles = localStorage.getItem('vehicles');
        if (savedVehicles) {
            setVehicles(JSON.parse(savedVehicles));
        }
    }, []);

    // Save data to localStorage
    useEffect(() => {
        localStorage.setItem('vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingId) {
            // Update existing
            const updatedVehicles = vehicles.map(v => {
                if (v.id === editingId) {
                    return { ...v, ...formData };
                }
                // If setting as default, unset others
                if (formData.isDefault) {
                    return { ...v, isDefault: false };
                }
                return v;
            });
            setVehicles(updatedVehicles);
            setEditingId(null);
        } else {
            // Add new
            const newVehicle = {
                id: Date.now(),
                ...formData
            };

            let updatedVehicles = [...vehicles];

            // If this is the first vehicle or set as default, update others
            if (vehicles.length === 0 || formData.isDefault) {
                newVehicle.isDefault = true;
                updatedVehicles = vehicles.map(v => ({ ...v, isDefault: false }));
            }

            setVehicles([...updatedVehicles, newVehicle]);
        }

        setShowForm(false);
        resetForm();
    };

    const handleEdit = (vehicle) => {
        setFormData(vehicle);
        setEditingId(vehicle.id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = (id) => {
        if (window.confirm(t('confirmDelete'))) {
            setVehicles(vehicles.filter(v => v.id !== id));
        }
    };

    const handleSetDefault = (id) => {
        const updatedVehicles = vehicles.map(v => ({
            ...v,
            isDefault: v.id === id
        }));
        setVehicles(updatedVehicles);
    };

    const resetForm = () => {
        setFormData({
            make: '',
            model: '',
            year: '',
            plate: '',
            vin: '',
            color: '',
            odometer: '',
            isDefault: false
        });
        setEditingId(null);
    };

    const cancelForm = () => {
        setShowForm(false);
        resetForm();
    };

    return (
        <div className="vehicles-page fade-in">
            <div className="vehicles-header">
                <div>
                    <h1>{t('vehicles')}</h1>
                    <p className="text-muted">{t('manageGarage')}</p>
                </div>
                <button
                    className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => showForm ? cancelForm() : setShowForm(true)}
                >
                    <FiPlus /> {showForm ? t('cancel') : t('addVehicle')}
                </button>
            </div>

            {/* Add/Edit Form */}
            {showForm && (
                <div className="vehicle-form-container">
                    <h2 className="mb-lg">{editingId ? t('editVehicle') : t('addNewVehicle')}</h2>
                    <form onSubmit={handleSubmit} className="vehicle-form">
                        <div className="form-group">
                            <label>{t('make')}</label>
                            <input type="text" name="make" placeholder="e.g. Toyota" value={formData.make} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('model')}</label>
                            <input type="text" name="model" placeholder="e.g. Camry" value={formData.model} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('year')}</label>
                            <input type="number" name="year" placeholder="e.g. 2022" value={formData.year} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('licensePlate')}</label>
                            <input type="text" name="plate" placeholder="ABC-1234" value={formData.plate} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('color')}</label>
                            <input type="text" name="color" placeholder="e.g. Silver" value={formData.color} onChange={handleInputChange} />
                        </div>
                        <div className="form-group">
                            <label>{t('currentOdometer')}</label>
                            <input type="number" name="odometer" placeholder="0" value={formData.odometer} onChange={handleInputChange} required />
                        </div>
                        <div className="form-group">
                            <label>{t('vin')}</label>
                            <input type="text" name="vin" placeholder="Vehicle Identification Number" value={formData.vin} onChange={handleInputChange} />
                        </div>
                        <div className="form-group full-width checkbox-group">
                            <input
                                type="checkbox"
                                id="isDefault"
                                name="isDefault"
                                checked={formData.isDefault}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="isDefault">{t('setAsDefault')}</label>
                        </div>
                        <div className="form-actions">
                            <button type="button" className="btn btn-ghost" onClick={cancelForm}>{t('cancel')}</button>
                            <button type="submit" className="btn btn-primary">{editingId ? t('updateVehicle') : t('saveVehicle')}</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Vehicles Grid */}
            <div className="vehicles-grid">
                {vehicles.length === 0 && !showForm ? (
                    <div className="empty-state">
                        <FiTruck size={48} className="mb-md" />
                        <h3>{t('noVehicles')}</h3>
                        <p>{t('addFirstCar')}</p>
                        <button className="btn btn-primary mt-md" onClick={() => setShowForm(true)}>{t('addVehicle')}</button>
                    </div>
                ) : (
                    vehicles.map(vehicle => (
                        <div key={vehicle.id} className={`vehicle-card ${vehicle.isDefault ? 'is-default' : ''}`}>
                            <div className="vehicle-header-bg">
                                <FiTruck className="vehicle-icon" />
                                {vehicle.isDefault && (
                                    <div className="default-badge">
                                        <FiCheck size={12} /> {t('default')}
                                    </div>
                                )}
                            </div>
                            <div className="vehicle-content">
                                <div className="vehicle-title">
                                    <div>
                                        <h3>{vehicle.make} {vehicle.model}</h3>
                                        <span className="vehicle-year">{vehicle.year}</span>
                                    </div>
                                </div>
                                <div className="vehicle-details">
                                    <div className="detail-item">
                                        <label>{t('plate')}</label>
                                        <span>{vehicle.plate}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>{t('odometer')}</label>
                                        <span>{parseInt(vehicle.odometer).toLocaleString()} km</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>{t('color')}</label>
                                        <span>{vehicle.color || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="vehicle-actions">
                                    {!vehicle.isDefault && (
                                        <button
                                            className="btn btn-ghost"
                                            onClick={() => handleSetDefault(vehicle.id)}
                                        >
                                            {t('setAsDefault')}
                                        </button>
                                    )}
                                    <button
                                        className="btn btn-secondary"
                                        onClick={() => handleEdit(vehicle)}
                                    >
                                        <FiEdit2 /> {t('edit')}
                                    </button>
                                    <button
                                        className="btn btn-ghost text-danger"
                                        onClick={() => handleDelete(vehicle.id)}
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Vehicles;
